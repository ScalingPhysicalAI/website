"""One-off: strengthen body text for the light theme.

The type weights and text alphas were inherited from the dark theme, where thin
light glyphs on black read fine. Reversed onto white, the same values look
washed out, so this raises them.

Only `color:` declarations are touched. The very low alphas in this stylesheet
(0.02-0.13) are panel fills and borders, and lifting those would turn every
card into a grey box.
"""

import re

TARGETS = [
    "src/routes/layout.css",
    "src/routes/buildo/+page.svelte",
    "src/routes/buildo-prebook/+page.svelte",
]

MIN_TEXT_ALPHA = 0.82

color_rgba = re.compile(
    r"(color:\s*)rgba\(\s*20\s*,\s*18\s*,\s*16\s*,\s*([0-9.]+)\s*\)"
)


def lift_alpha(m):
    a = max(float(m.group(2)), MIN_TEXT_ALPHA)
    return f"{m.group(1)}rgba(20, 18, 16, {round(a, 3)})"


for path in TARGETS:
    with open(path) as f:
        text = f.read()
    before = text

    text, n_color = color_rgba.subn(lift_alpha, text)

    # Barlow is loaded at 300/400/500/600. 300 was chosen for a dark ground;
    # 500 is the equivalent optical weight on white.
    text, n_w300 = re.subn(r"font-weight:\s*300;", "font-weight: 500;", text)
    # Bare 400s in body copy also gain from a step up.
    text, n_w400 = re.subn(r"font-weight:\s*400;", "font-weight: 500;", text)

    if text != before:
        with open(path, "w") as f:
            f.write(text)
        print(f"  {path}: {n_color} text colours lifted, {n_w300 + n_w400} weights raised")

print(f"minimum text alpha now {MIN_TEXT_ALPHA}")
