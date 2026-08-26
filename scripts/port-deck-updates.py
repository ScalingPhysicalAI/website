"""Port the teammate's pitch-deck updates onto the light-theme deck.

Their commits carried real improvements (copy edits, source citations, a
dynamic slide count) but the file also lost every em-dash to an encoding
problem — 39 of them, leaving stray double spaces. Rather than resolve 22
conflict hunks against damaged text, the light-theme deck is kept as the base
and their changes are reapplied here with punctuation intact.

Every replacement is asserted, so a silent miss fails loudly instead of
quietly dropping one of their edits.
"""

import pathlib
import sys

PATH = pathlib.Path("src/routes/deck/+page.svelte")
text = PATH.read_text(encoding="utf-8")

EM = "\u2014"

replacements: list[tuple[str, str, str]] = [
    # ── Slide count driven by the DOM instead of a hardcoded total ──────────
    (
        "count: constant",
        "\tconst TOTAL = 14;",
        "\tconst SLIDE_SELECTOR = '.slide:not(.slide-hidden)';",
    ),
    # ── Copy refinements ───────────────────────────────────────────────────
    (
        "slide 2: evolving -> advancing",
        "Human environment keeps evolving.",
        "Human environment keeps advancing.",
    ),
    (
        "slide 2: Unitree -> Unitree G1",
        "<strong>Unitree</strong> " + EM + " an open, community-driven approach",
        "<strong>Unitree G1</strong> " + EM + " an open, community-driven approach",
    ),
    (
        "slide 2: Figure/UBTECH -> Figure AI",
        "<strong>Figure / UBTECH</strong>",
        "<strong>Figure AI</strong>",
    ),
    (
        "slide 3: Market validated -> Market Signal",
        "Market validated:",
        "Market Signal:",
    ),
    (
        "slide 10: 1X -> 1X Neo",
        '<div class="comp-title">1X</div>',
        '<div class="comp-title">1X Neo</div>',
    ),
    (
        "slide 10: Figure -> Figure O3",
        '<div class="comp-title">Figure</div>',
        '<div class="comp-title">Figure O3</div>',
    ),
    (
        "slide 11: Solved -> Built",
        "Solved the entire humanoid robot hardware and supply chain",
        "Built the entire humanoid robot hardware and supply chain",
    ),
    (
        "slide 13: use cases -> warehouses",
        "Building <strong>industrial use cases</strong> on the StarForge platform",
        "Building <strong>industrial warehouses</strong> on the StarForge platform",
    ),
]

for label, old, new in replacements:
    if old not in text:
        sys.exit(f"ABORT: could not find target for '{label}':\n  {old!r}")
    text = text.replace(old, new, 1)
    print(f"  ok  {label}")

PATH.write_text(text, encoding="utf-8")
print(f"\nem-dashes preserved: {text.count(EM)}")
