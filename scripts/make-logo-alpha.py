"""Convert the light-on-black Starforge logo into a true transparent PNG.

The source art is effectively premultiplied over black, so luminance can be
lifted straight into the alpha channel and the RGB unpremultiplied from it.
Output is auto-cropped to the artwork bounds so the nav link has no dead space.

The source file carries a 1px non-black border, which is trimmed before the
crop box is measured so it does not defeat the auto-crop.
"""

from PIL import Image
import numpy as np

SRC = "static/assets/logo.png"
OUT = "static/assets/logo-wordmark.png"
BORDER = 3
THRESHOLD = 12

source = Image.open(SRC).convert("RGB")
rgb = np.asarray(source).astype(np.float32)[BORDER:-BORDER, BORDER:-BORDER]

alpha = rgb.max(axis=2)
straight = np.clip(rgb * 255.0 / np.maximum(alpha, 1.0)[..., None], 0, 255)

img = Image.fromarray(np.dstack([straight, alpha]).astype(np.uint8), "RGBA")

bbox = img.getchannel("A").point(lambda v: 255 if v > THRESHOLD else 0).getbbox()
img = img.crop(bbox)
img.save(OUT, optimize=True)

# Dark variant for light backgrounds. The wordmark and the star need opposite
# treatment, and they separate cleanly on saturation: the wordmark is
# near-neutral cream, the star is saturated copper. So the wordmark is driven
# to near-black ink and the star is recoloured to the ember accent, keeping its
# internal gradient so it does not flatten into a solid shape.
import colorsys

OUT_DARK = "static/assets/logo-wordmark-dark.png"
BLACK = np.array([0, 0, 0], dtype=np.float32)
# Bolder than the original #b89c72, which only reached 2.6:1 on white and
# disappeared. This holds ~4.3:1 while still reading as gold.
GOLD = np.array([0x96, 0x76, 0x0A], dtype=np.float32)

rgba = np.asarray(img).astype(np.float32) / 255.0
rgb_to_hsv = np.vectorize(colorsys.rgb_to_hsv)
_, sat, val = rgb_to_hsv(rgba[..., 0], rgba[..., 1], rgba[..., 2])

star = (sat > 0.22)[..., None]

# Star: gold, modulated by the original gradient so the shape survives. The
# range is kept narrow so the tips stay saturated instead of washing out.
grad = np.clip(0.82 + val[..., None] * 0.26, 0.0, 1.08)
star_rgb = np.clip(GOLD * grad, 0, 255)

dark_rgb = np.where(star, star_rgb, BLACK)

# Both halves of the source art feather out at their extremities, which is what
# reads as "faded" against white. Gamma-lifting the alpha makes the mark sit up:
# hard on the lettering so it goes properly solid, gentler on the star so its
# points still taper rather than turning into hard spikes.
alpha = np.clip(rgba[..., 3], 0, 1)
alpha_out = np.where(star[..., 0], alpha**0.55, alpha**0.18) * 255

dark = np.dstack([dark_rgb, alpha_out])
Image.fromarray(np.clip(dark, 0, 255).astype(np.uint8), "RGBA").save(
    OUT_DARK, optimize=True
)

print(f"source     {source.size}")
print(f"crop bbox  {bbox}")
print(f"output     {img.size} -> {OUT}")
print(f"dark       {img.size} -> {OUT_DARK}")
