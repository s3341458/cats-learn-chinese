"""Render the lesson openers as static Mandarin MP3s. See README for setup."""

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


def main():
    intros = json.loads(subprocess.check_output([
        "node", "--input-type=module", "-e",
        "import { lessons } from './dist/lessons.js'; "
        "console.log(JSON.stringify(lessons.map(({cat, intro}) => ({cat, intro}))));",
    ], cwd=ROOT))
    output = ROOT / "dist" / "audio" / "intro"
    output.mkdir(parents=True, exist_ok=True)
    torch.set_num_threads(2)
    pipeline = KPipeline(lang_code="z", repo_id=MODEL, device="cpu")

    for lesson in intros:
        sentences = re.findall(r"[^。！？]+[。！？]?", lesson["intro"])
        pieces = []
        for sentence in sentences:
            spoken = sentence.replace("「", "").replace("」", "")
            clips = [
                result.audio.numpy() for result in pipeline(spoken, voice=VOICE, speed=0.88)
                if result.audio is not None
            ]
            if not clips:
                raise ValueError(f"No audio generated for {spoken!r}")
            pieces.append(trim_sentence(np.concatenate(clips)))
            # Sentence breaks give a young listener a moment to follow the story.
            pieces.append(np.zeros(int(RATE * 0.23), dtype=np.float32))

        audio = np.concatenate(pieces)
        audio *= 0.86 / np.max(np.abs(audio))
        path = output / f"{lesson['cat']}.mp3"
        sf.write(path, audio, RATE, format="MP3", subtype="MPEG_LAYER_III",
                 bitrate_mode="VARIABLE", compression_level=0.45)
        print(f"{path.name}: {len(audio) / RATE:.1f}s", flush=True)


if __name__ == "__main__":
    main()
