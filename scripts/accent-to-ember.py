"""One-off: swap the sand/gold accent for a higher-contrast ember accent.

Sand reads as washed out on white (5.6:1, and visually much weaker than that
number suggests at small sizes). Ember #9c2b13 clears 7.6:1 while keeping the
warm "forge" association.

Structural chrome (borders, card fills, faint gradients) is moved to neutral
ink rather than tinted ember, because ember at low alpha turns pink. Keeping
structure neutral lets the accent carry actual emphasis.
"""

import re

TARGETS = [
    "src/routes/layout.css",
    "src/routes/buildo/+page.svelte",
    "src/routes/buildo-prebook/+page.svelte",
]

SOLIDS = {
    "#7d6440": "#9c2b13",  # --sand        accent text, buttons
    "#5c4726": "#7a1f0a",  # --sand-light  hover / emphasis
    "#6d5636": "#8a2612",  # --sand-dark   deeper accent
}

SAND_RGB = (125, 100, 64)
INK_RGB = (20, 18, 16)


def migrate(text):
    for old, new in SOLIDS.items():
        text = re.sub(re.escape(old), new, text, flags=re.IGNORECASE)

    # Decorative sand washes -> neutral ink at roughly half weight.
    r, g, b = SAND_RGB
    pattern = re.compile(rf"rgba\(\s*{r}\s*,\s*{g}\s*,\s*{b}\s*,\s*([0-9.]+)\s*\)")

    def repl(m):
        a = round(min(float(m.group(1)) * 0.5, 1.0), 3)
        return f"rgba({INK_RGB[0]}, {INK_RGB[1]}, {INK_RGB[2]}, {a})"

    return pattern.sub(repl, text)


for path in TARGETS:
    with open(path) as f:
        before = f.read()
    after = migrate(before)
    if after != before:
        with open(path, "w") as f:
            f.write(after)
        print("  migrated", path)

leftover = []
for path in TARGETS:
    with open(path) as f:
        body = f.read()
    if "125, 100, 64" in body or "#7d6440" in body:
        leftover.append(path)
print("leftover sand:", leftover or "none")
