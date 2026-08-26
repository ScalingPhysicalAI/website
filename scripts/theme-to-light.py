"""One-off: migrate the site stylesheet from the dark theme to the light theme.

Every colour literal in the dark theme falls into one of a few families, so
this maps each family rather than hand-editing ~80 scattered declarations:

  rgba(232,226,214,a)  light text on dark   -> dark ink on light
  rgba(5,5,5,a)        dark scrim           -> light scrim
  rgba(255,255,255,a)  faint light panel    -> faint dark panel
  rgba(184,156,114,a)  sand accent          -> deeper sand (alpha raised, since
                                               a light accent on black needs
                                               less weight than a dark accent
                                               on white to read equally)
  #0x0y0z              near-black surfaces  -> warm near-white surfaces

Two variables are also renamed because their names become actively misleading:
--black (now white) -> --bg, and --off-white (now near-black) -> --ink.
"""

import re
import sys

TARGETS = [
    "src/routes/layout.css",
    "src/routes/buildo/+page.svelte",
    "src/routes/buildo-prebook/+page.svelte",
    "src/lib/components/SiteNav.svelte",
    "src/lib/components/SiteFooter.svelte",
]

INK = (20, 18, 16)
SAND = (125, 100, 64)

# Near-black surfaces -> warm near-whites, preserving their relative ordering.
SURFACES = {
    "#050505": "#ffffff",
    "#070605": "#fcfaf7",
    "#080605": "#fbf9f6",
    "#0a0805": "#faf8f4",
    "#0d0906": "#f7f4ef",
    "#0d0b09": "#f7f5f1",
    "#0e0b07": "#f6f3ee",
    "#0f0c07": "#f5f2ec",
    "#120e08": "#f2eee7",
    "#17110a": "#efe9df",
    "#1a120a": "#ede7dc",
    "#2a2520": "#e6e1d8",
    # Text colours
    "#e8e2d6": "#141210",
    "#ccc": "#3a3630",
    "#6b6155": "#5f584e",
    # Accents
    "#b89c72": "#7d6440",
    "#d4b98a": "#5c4726",
    "#8a6f4a": "#6d5636",
}


def sub_rgba(text, match_rgb, new_rgb, alpha_fn=lambda a: a):
    r, g, b = match_rgb
    pattern = re.compile(
        rf"rgba\(\s*{r}\s*,\s*{g}\s*,\s*{b}\s*,\s*([0-9.]+)\s*\)"
    )

    def repl(m):
        a = alpha_fn(float(m.group(1)))
        a = round(min(a, 1.0), 3)
        return f"rgba({new_rgb[0]}, {new_rgb[1]}, {new_rgb[2]}, {a})"

    return pattern.sub(repl, text)


def migrate(text):
    # Light text -> dark ink. Nudge alpha up: dark-on-light needs slightly more
    # weight than light-on-dark to feel equally present.
    text = sub_rgba(text, (232, 226, 214), INK, lambda a: a + 0.08)

    # Existing faint white panel fills must be tokenised BEFORE dark scrims are
    # turned white, otherwise the freshly-written white scrims get matched by
    # this same rule and flipped to ink.
    text = sub_rgba(text, (255, 255, 255), (901, 901, 901), lambda a: a * 2.2)

    # Dark scrims -> light scrims.
    text = sub_rgba(text, (5, 5, 5), (255, 255, 255))
    text = sub_rgba(text, (10, 8, 5), (250, 248, 244))

    # Untokenise the panel fills.
    text = sub_rgba(text, (901, 901, 901), INK)

    # Sand accent, with alpha raised for equal presence on white.
    text = sub_rgba(text, (184, 156, 114), SAND, lambda a: a * 1.45)
    # Scan lines read much heavier on white.
    text = sub_rgba(text, (0, 0, 0), (0, 0, 0), lambda a: a * 0.45)

    for old, new in SURFACES.items():
        text = re.sub(rf"{re.escape(old)}\b", new, text, flags=re.IGNORECASE)

    text = text.replace("var(--black)", "var(--bg)")
    text = text.replace("var(--off-white)", "var(--ink)")
    return text


changed = []
for path in TARGETS:
    with open(path) as f:
        before = f.read()
    after = migrate(before)
    if after != before:
        with open(path, "w") as f:
            f.write(after)
        changed.append(path)

print("migrated:")
for c in changed:
    print("  ", c)

leftovers = []
for path in TARGETS:
    with open(path) as f:
        body = f.read()
    for pat in ("rgba(232, 226, 214", "rgba(5, 5, 5", "rgba(184, 156, 114",
                "var(--black)", "var(--off-white)", "#e8e2d6", "#050505"):
        if pat in body:
            leftovers.append(f"{path}: {pat}")

print("leftover dark-theme values:", leftovers or "none")
sys.exit(1 if leftovers else 0)
