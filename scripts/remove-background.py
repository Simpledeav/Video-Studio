#!/usr/bin/env python3
"""Remove image backgrounds with U2Net, producing RGBA PNG cutouts."""
from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image, ImageFilter

MODEL = Path(__file__).resolve().parents[1] / ".models" / "u2net.onnx"


def preprocess(image: Image.Image) -> np.ndarray:
    resized = image.convert("RGB").resize((320, 320), Image.LANCZOS)
    array = np.asarray(resized, dtype=np.float32) / 255.0
    mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
    std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
    array = (array - mean) / std
    return np.transpose(array, (2, 0, 1))[None, ...]


def infer(image: Image.Image) -> Image.Image:
    session = ort.InferenceSession(str(MODEL), providers=["CPUExecutionProvider"])
    input_name = session.get_inputs()[0].name
    output = session.run(None, {input_name: preprocess(image)})[0][0, 0]
    output = (output - output.min()) / (output.max() - output.min() + 1e-8)
    mask = Image.fromarray((output * 255).astype(np.uint8)).resize(image.size, Image.LANCZOS)
    mask = mask.filter(ImageFilter.GaussianBlur(1.1))
    rgba = image.convert("RGBA")
    rgba.putalpha(mask)
    return rgba


def main() -> None:
    for raw in sys.argv[1:]:
        source = Path(raw)
        target = source.with_name(source.stem + "-cutout.png")
        image = Image.open(source)
        cut = infer(image)
        cut.save(target)
        print(target)


if __name__ == "__main__":
    main()
