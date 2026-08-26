"""Compose the homepage hero backdrop for the light theme.

Inverts the generated network-graph render to black-on-white.

    python3 scripts/build-hero-bg.py [graph_strength]

Writes static/assets/network-graph.webp
"""

import os
import sys

import numpy as np
from PIL import Image

GRAPH_SRC = "/tmp/network-graph-src.png"
OUT = "static/assets/network-graph.webp"
PREVIEW = "/tmp/hero-bg-preview.png"

# Higher = darker, more present network. 1.0 keeps the full inverted contrast.
GRAPH_STRENGTH = float(sys.argv[1]) if len(sys.argv) > 1 else 1.0

graph = Image.open(GRAPH_SRC).convert("RGB")
arr = np.asarray(graph).astype(np.float32)

# The source is bright nodes on a near-black ground. Taking luminance and
# inverting flips that to dark nodes on white, which is what the light theme
# needs; going through luminance also drops the original cluster colours so
# the result is neutral black rather than muddy inverted hues.
lum = arr[..., 0] * 0.2126 + arr[..., 1] * 0.7152 + arr[..., 2] * 0.0722
inverted = 255.0 - lum

graph_arr = 255.0 - (255.0 - inverted) * GRAPH_STRENGTH
out = Image.fromarray(
    np.clip(np.dstack([graph_arr] * 3), 0, 255).astype(np.uint8), "RGB"
)
out.save(OUT, "WEBP", quality=90, method=6)
out.save(PREVIEW)

print(f"graph strength : {GRAPH_STRENGTH}")
print(f"output         : {out.size}  {os.path.getsize(OUT) // 1024}KB -> {OUT}")
