"""Render Mandarin narration MP3s. See README for setup."""

import argparse
import json
from pathlib import Path
import re
import subprocess

from kokoro import KPipeline
import numpy as np
import soundfile as sf
import torch


ROOT = Path(__file__).resolve().parents[1]
RATE = 24_000
MODEL = "hexgrad/Kokoro-82M-v1.1-zh"
VOICE = "zf_001"


def trim_sentence(audio):
    """Keep a little room before and after the audible speech."""
    audible = np.flatnonzero(np.abs(audio) > 0.007)
    if not len(audible):
        raise ValueError("The model produced a silent sentence")
    start = max(0, audible[0] - int(RATE * 0.07))
    end = min(len(audio), audible[-1] + int(RATE * 0.09))
    return audio[start:end]


def render(pipeline, text, track, speed, pause):
    sentences = re.findall(r"[^。！？]+[。！？]?", text)
    pieces = []
    for sentence in sentences:
        spoken = sentence.replace("「", "").replace("」", "")
        clips = [
            result.audio.numpy() for result in pipeline(spoken, voice=VOICE, speed=speed)
            if result.audio is not None
        ]
        if not clips:
            raise ValueError(f"No audio generated for {spoken!r}")
        pieces.append(trim_sentence(np.concatenate(clips)))
        pieces.append(np.zeros(int(RATE * pause), dtype=np.float32))

    audio = np.concatenate(pieces)
    audio *= 0.86 / np.max(np.abs(audio))
    path = ROOT / "dist" / track.lstrip("/")
    path.parent.mkdir(parents=True, exist_ok=True)
    sf.write(path, audio, RATE, format="MP3", subtype="MPEG_LAYER_III",
             bitrate_mode="VARIABLE", compression_level=0.45)
    print(f"{path.name}: {len(audio) / RATE:.1f}s", flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--trace-only", action="store_true", help="render only the writing prompt")
    args = parser.parse_args()
    data = json.loads(subprocess.check_output([
        "node", "--input-type=module", "-e",
        "import { introTrack, lessons, traceGuide } from './dist/lessons.js'; "
        "console.log(JSON.stringify({traceGuide, intros: lessons.map(lesson => "
        "({text: lesson.intro, track: introTrack(lesson)}))}));",
    ], cwd=ROOT))
    torch.set_num_threads(2)
    pipeline = KPipeline(lang_code="z", repo_id=MODEL, device="cpu")
    if not args.trace_only:
        for intro in data["intros"]:
            render(pipeline, intro["text"], intro["track"], speed=0.88, pause=0.23)
    guide = data["traceGuide"]
    render(pipeline, guide["text"], guide["track"], speed=0.79, pause=0.36)


if __name__ == "__main__":
    main()
