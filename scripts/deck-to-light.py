"""One-off: migrate the pitch deck to the light theme.

The deck carries its own self-contained palette (it references none of the
global custom properties), so it needs the same family mapping applied
separately. Same ordering caveat as the site migration: white panel fills are
tokenised before dark scrims are turned white, otherwise the new white scrims
get matched and flipped.
"""

import re

PATH = "src/routes/deck/+page.svelte"

SOLIDS = {
    "#050505": "#f1efeb",  # viewport surround, kept slightly off-white so the
    "#080808": "#ffffff",  # slide itself reads as a raised white sheet
    "#e8e2d6": "#141210",  # primary text
    "#c8c0b4": "#3a3630",  # secondary text
    "#6b6155": "#5f584e",  # muted text
    "#2a2520": "#e6e1d8",  # dim rule
    "#b89c72": "#9c2b13",  # accent -> ember
    "#c4a96b": "#b3341a",  # bright accent
    "#8a6040": "#8a2612",  # deep accent
}

with open(PATH) as f:
    text = f.read()
before = text


def sub_rgba(t, src, dst, alpha_fn=lambda a: a):
    r, g, b = src
    pat = re.compile(rf"rgba\(\s*{r}\s*,\s*{g}\s*,\s*{b}\s*,\s*([0-9.]+)\s*\)")
    return pat.sub(
        lambda m: "rgba({}, {}, {}, {})".format(
            dst[0], dst[1], dst[2], round(min(alpha_fn(float(m.group(1))), 1.0), 3)
        ),
        t,
    )


# Faint white panel fills -> faint ink fills (tokenised first, see docstring).
text = sub_rgba(text, (255, 255, 255), (901, 901, 901), lambda a: a * 2.2)
# Dark scrims -> light scrims.
text = sub_rgba(text, (8, 8, 8), (255, 255, 255))
text = sub_rgba(text, (901, 901, 901), (20, 18, 16))
# Accent washes -> neutral ink structure, matching the main site.
text = sub_rgba(text, (184, 156, 114), (20, 18, 16), lambda a: a * 0.5)
# A near-opaque black drop shadow is far too heavy on a white sheet.
text = sub_rgba(text, (0, 0, 0), (20, 18, 16), lambda a: a * 0.2)

for old, new in SOLIDS.items():
    text = re.sub(re.escape(old), new, text, flags=re.IGNORECASE)

# The cream logo disappears on a white nav.
text = text.replace("/assets/logo-wordmark.png", "/assets/logo-wordmark-dark.png")

with open(PATH, "w") as f:
    f.write(text)

print("changed:", text != before)
stale = [p for p in ("#e8e2d6", "#b89c72", "#050505", "rgba(184, 156, 114") if p in text]
print("leftover dark values:", stale or "none")
