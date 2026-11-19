"""Render Mandarin narration MP3s. See README for setup."""

import argparse
import json
from pathlib import Path
import re
import shutil
import subprocess
import tempfile

import numpy as np
import soundfile as sf


ROOT = Path(__file__).resolve().parents[1]
RATE = 24_000
MODEL = "hexgrad/Kokoro-82M-v1.1-zh"
VOICE = "zf_001"


def import_native(directory, word, source):
    """Encode the whole studio take at its original speed and pitch."""
    if word["py"] != source["py"]:
        raise ValueError(f"Recording pinyin disagrees with the lesson: {word['text']}")
    with sf.SoundFile(directory / source["file"]) as original:
        if original.title != source.get("recordedAs", word["text"]) or original.copyright != "(c) 2009 Yue Tan":
            raise ValueError(f"Unexpected recording for {word['text']}: {source['file']}")
        samples, rate = original.read(dtype="float32"), original.samplerate
    peak = np.max(np.abs(samples))
    if samples.ndim != 1 or not np.isfinite(peak) or peak <= 0:
        raise ValueError(f"Invalid source audio: {source['file']}")
    path = ROOT / "dist" / word["track"].lstrip("/")
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=path.parent) as directory_name:
        encoded = Path(directory_name) / path.name
        with sf.SoundFile(encoded, "w", samplerate=rate, channels=1, format="MP3",
                          bitrate_mode="VARIABLE", compression_level=0.45) as output:
            output.title = word["text"]
            output.artist = "Yue Tan"
            output.comment = f"{source['file']} | (c) 2009 Yue Tan | https://creativecommons.org/licenses/by-sa/3.0/us/"
            output.write(samples * (0.82 / peak))
        encoded.replace(path)
    print(f"{word['text']} ({word['py']}) <- {source['file']}", flush=True)


def trim_sentence(audio, rate=RATE):
    """Keep a little room before and after the audible speech."""
    audible = np.flatnonzero(np.abs(audio) > 0.007)
    if not len(audible):
        raise ValueError("The model produced a silent sentence")
    start = max(0, audible[0] - int(rate * 0.10))
    end = min(len(audio), audible[-1] + int(rate * 0.14))
    return audio[start:end]


def render(pipeline, text, track, speed, pause):
    plain = re.sub(r"[「」“”]", "", text)
    sentences = re.findall(r"[^。！？]+[。！？]?", plain)
    pieces = [np.zeros(int(RATE * 0.12), dtype=np.float32)]
    for sentence in sentences:
        if pipeline is None:
            # Tingting otherwise keeps 一 almost level in 一本书. 易 supplies
            # the spoken yì before běn without changing the lesson text.
            spoken = sentence.replace("一本书", "易本书")
            with tempfile.TemporaryDirectory(prefix="cats-narration-") as directory:
                recording = Path(directory) / "sentence.aiff"
                subprocess.run([
                    "say", "-v", "Tingting", "-r", str(round(190 * speed)),
                    "-o", str(recording), spoken,
                ], check=True)
                clip, rate = sf.read(recording, dtype="float32")
            if len(pieces) == 1:
                pieces[0] = np.zeros(int(rate * 0.16), dtype=np.float32)
        else:
            clips = [
                result.audio.numpy() for result in pipeline(sentence, voice=VOICE, speed=speed)
                if result.audio is not None
            ]
            if not clips:
                raise ValueError(f"No audio generated for {sentence!r}")
            clip, rate = np.concatenate(clips), RATE
        pieces.append(trim_sentence(clip, rate))
        pieces.append(np.zeros(int(rate * pause), dtype=np.float32))

    audio = np.concatenate(pieces)
    audio *= 0.86 / np.max(np.abs(audio))
    path = ROOT / "dist" / track.lstrip("/")
    path.parent.mkdir(parents=True, exist_ok=True)
    sf.write(path, audio, rate, format="MP3", subtype="MPEG_LAYER_III",
             bitrate_mode="VARIABLE", compression_level=0.45)
    print(f"{path.name}: {len(audio) / rate:.1f}s", flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--engine", choices=("system", "kokoro"), default="system",
                        help="system uses the installed macOS Tingting Mandarin voice")
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--trace-only", action="store_true", help="render only the writing prompt")
    mode.add_argument("--characters-only", action="store_true", help="render only the character recordings")
    mode.add_argument("--practice-only", action="store_true", help="render words and activity instructions")
    mode.add_argument("--narration-only", action="store_true", help="render only story intros and story pages")
    mode.add_argument("--import-native", type=Path, metavar="FLAC_DIR",
                      help="import the selected lessons' human recordings from the Caen FLAC collection")
    parser.add_argument("--lesson", action="append", type=int,
                        help="render only this 1-based lesson number; repeat for several lessons")
    args = parser.parse_args()
    if args.lesson and args.trace_only:
        parser.error("--trace-only is a shared prompt; do not combine it with --lesson")
    data = json.loads(subprocess.check_output([
        "node", "--input-type=module", "-e",
        "import { activityPrompts, introTrack, lessons, storyTrack, traceGuide, wordTrack } from './dist/lessons.js'; "
        "console.log(JSON.stringify({traceGuide, intros: lessons.map(lesson => "
        "({text: lesson.intro, track: introTrack(lesson), lesson: lessons.indexOf(lesson) + 1})), "
        "stories: lessons.map(lesson => ({text: lesson.story, track: storyTrack(lesson), lesson: lessons.indexOf(lesson) + 1})), "
        "phrases: lessons.flatMap(lesson => lesson.phrases.map(phrase => "
        "({text: phrase.han, py: phrase.py, track: wordTrack(phrase), lesson: lessons.indexOf(lesson) + 1}))), "
        "instructions: Object.entries(activityPrompts).filter(([key]) => key !== 'trace').map(([, prompt]) => prompt), "
        "characters: lessons.flatMap(lesson => lesson.words.map(word => "
        "({text: word.han, py: word.py, track: wordTrack(word), lesson: lessons.indexOf(lesson) + 1})))}));",
    ], cwd=ROOT))
    if args.lesson:
        if any(number < 1 or number > len(data["intros"]) for number in args.lesson):
            parser.error(f"--lesson must be between 1 and {len(data['intros'])}")
        for group in ("intros", "stories", "phrases", "characters"):
            data[group] = [item for item in data[group] if item["lesson"] in args.lesson]
        data["instructions"] = []
    native = json.loads((ROOT / "scripts/native-recordings.json").read_text())
    if args.import_native:
        for word in data["characters"] + data["phrases"]:
            if word["text"] in native:
                import_native(args.import_native, word, native[word["text"]])
        return
    pipeline = None
    if args.engine == "system":
        if not shutil.which("say"):
            parser.error("The system engine requires macOS say. Use --engine kokoro on other systems.")
    else:
        from kokoro import KPipeline
        from pypinyin import load_phrases_dict
        import torch
        torch.set_num_threads(2)
        pipeline = KPipeline(lang_code="z", repo_id=MODEL, device="cpu")
        load_phrases_dict({
            phrase["text"]: [[syllable] for syllable in phrase["py"].split()]
            for phrase in data["phrases"]
        })
    for group in ("characters", "phrases"):
        data[group] = [word for word in data[group] if word["text"] not in native]
    if not args.trace_only and not args.characters_only:
        if not args.practice_only:
            for intro in data["intros"]:
                render(pipeline, intro["text"], intro["track"], speed=0.88, pause=0.23)
            for story in data["stories"]:
                render(pipeline, story["text"], story["track"], speed=0.85, pause=0.28)
        if not args.narration_only:
            for phrase in data["phrases"]:
                print(f'{phrase["text"]} ({phrase["py"]})', flush=True)
                render(pipeline, phrase["text"], phrase["track"], speed=0.76, pause=0.25)
            for prompt in data["instructions"]:
                render(pipeline, prompt["text"], prompt["track"], speed=0.80, pause=0.30)
    if not (args.trace_only or args.practice_only or args.narration_only):
        for word in data["characters"]:
            render(pipeline, word["text"], word["track"], speed=0.77, pause=0.20)
    if not (args.characters_only or args.practice_only or args.narration_only or args.lesson):
        guide = data["traceGuide"]
        render(pipeline, guide["text"], guide["track"], speed=0.79, pause=0.36)


if __name__ == "__main__":
    main()
