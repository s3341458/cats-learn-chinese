"""Check every lesson recording. Optional ASR results are review clues."""

import argparse
import json
from pathlib import Path
import re
import subprocess
import sys

import numpy as np
import soundfile as sf


ROOT = Path(__file__).resolve().parents[1]


def recordings():
    data = subprocess.check_output([
        "node", "--input-type=module", "-e",
        "import {activityPrompts, lessons, introTrack, storyTrack, wordTrack} from './dist/lessons.js';"
        "console.log(JSON.stringify(["
        "...Object.values(activityPrompts).map(p=>({kind:'instruction',text:p.text,path:p.track})),"
        "...lessons.flatMap((l,index)=>["
        "{kind:'intro',text:l.intro,path:introTrack(l),lesson:index+1},"
        "{kind:'story',text:l.story,path:storyTrack(l),lesson:index+1},"
        "...l.words.map(w=>({kind:'character',text:w.han,path:wordTrack(w),lesson:index+1})),"
        "...l.phrases.map(w=>({kind:'word',text:w.han,path:wordTrack(w),lesson:index+1}))"
        "])"
        "]));",
    ], cwd=ROOT)
    return json.loads(data)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--transcribe", action="store_true")
    parser.add_argument("--model", default="small")
    parser.add_argument("--model-cache", default="/tmp/cats-asr-model")
    parser.add_argument("--lesson", action="append", type=int,
                        help="audit only this 1-based lesson number; repeat for several lessons")
    args = parser.parse_args()
    entries = recordings()
    if args.lesson:
        available = {entry.get("lesson") for entry in entries} - {None}
        if not set(args.lesson) <= available:
            parser.error(f"--lesson must be between 1 and {max(available)}")
        entries = [entry for entry in entries if entry.get("lesson") in args.lesson]
    model = None
    if args.transcribe:
        import parselmouth
        from faster_whisper import WhisperModel
        from opencc import OpenCC
        converter = OpenCC("t2s")
        model = WhisperModel(args.model, device="cpu", compute_type="int8",
                             cpu_threads=4, download_root=args.model_cache)

    results = []
    for entry in {entry["path"]: entry for entry in entries}.values():
        path = ROOT / "dist" / entry["path"].lstrip("/")
        samples, rate = sf.read(path, dtype="float32")
        peak = float(np.max(np.abs(samples)))
        if samples.ndim != 1 or not np.isfinite(samples).all():
            raise ValueError(f"Invalid mono audio: {entry['path']}")
        if not 0.1 < peak < 0.99:
            raise ValueError(f"Silent or clipped audio: {entry['path']}")
        result = {**entry, "duration": round(len(samples) / rate, 3),
                  "peak": round(peak, 4)}
        if model is not None:
            # Decode with soundfile, avoiding PyAV version-specific MP3 behavior.
            audio = parselmouth.Sound(samples, sampling_frequency=rate)
            audio = audio.resample(16000).values[0].astype("float32")
            # Do not pass the expected lesson text as a prompt to the recognizer.
            segments, _ = model.transcribe(
                audio, language="zh", beam_size=5, temperature=0,
                condition_on_previous_text=False,
            )
            result["recognized"] = "".join(segment.text for segment in segments)
            expected = re.sub(r"[^\u4e00-\u9fff0-9]", "", converter.convert(entry["text"]))
            actual = re.sub(r"[^\u4e00-\u9fff0-9]", "", converter.convert(result["recognized"]))
            result["text_matches"] = expected == actual
        results.append(result)
        print(f"{len(results)} {entry['path']}", file=sys.stderr, flush=True)

    print(json.dumps({
        "count": len(results),
        "review_note": "Transcription differences require review. ASR does not establish naturalness.",
        "recordings": results,
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
