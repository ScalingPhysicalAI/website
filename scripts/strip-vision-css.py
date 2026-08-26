"""One-off: strip dead vision-page CSS from src/routes/layout.css.

The /vision route was removed, so every `body.page-vision`, `.vision-*` and
`#vision` rule in the global stylesheet is unreachable. Deck's `.vision-body`
and `.vision-text` live in that component's own scoped <style>, so they are
unaffected.

Operates on text markers rather than line numbers so edits cannot shift
under each other.
"""

import re
import sys

PATH = "src/routes/layout.css"

with open(PATH) as f:
    css = f.read()

original_len = len(css)


def cut_between(text, start_marker, end_marker):
    """Remove start_marker up to (not including) end_marker."""
    start = text.index(start_marker)
    end = text.index(end_marker, start)
    return text[:start] + text[end:]


# 1. The whole "VISION SECTION" block, up to the closing CTA block.
css = cut_between(css, "/* ── VISION SECTION ── */", "/* ── CLOSING CTA ── */")

# 2. The "VISION PAGE HERO" banner section, up to the Robo Dev Kit banner.
css = cut_between(
    css,
    "/* ═══════════════════════════════════════════════════════════════════════════\n   VISION PAGE HERO",
    "/* ═══════════════════════════════════════════════════════════════════════════\n   ROBO DEV KIT PAGE",
)

# 3. Vision rules interleaved inside the max-width:900px media query.
blocks = [
    "\tbody.page-vision #vision {\n\t\tpadding: 80px 24px;\n\t}\n",
    "\tbody.page-vision .vision-split-launch,\n"
    "\tbody.page-vision .vision-split-manufacturing,\n"
    "\tbody.page-vision .vision-split-future {\n"
    "\t\tmargin-top: 48px;\n\t}\n",
    "\tbody.page-vision .vision-split-launch .vision-image-block,\n"
    "\tbody.page-vision .vision-split-manufacturing .vision-image-block,\n"
    "\tbody.page-vision .vision-split-future .vision-image-block,\n"
    "\tbody.page-vision .vision-split-launch .vision-split-text,\n"
    "\tbody.page-vision .vision-split-manufacturing .vision-split-text,\n"
    "\tbody.page-vision .vision-split-future .vision-split-text {\n"
    "\t\tmargin-top: 0;\n\t\tmargin-left: 0;\n\t\tpadding-top: 0;\n\t}\n",
    "\t.vision-split.reverse {\n\t\tdirection: ltr;\n\t}\n",
    "\t.vision-page-hero {\n\t\tpadding: 140px 24px 80px;\n\t}\n",
]
for block in blocks:
    if block not in css:
        sys.exit(f"ABORT: expected block not found:\n{block!r}")
    css = css.replace(block, "", 1)

# 4. Drop the two vision selectors from the shared grid-collapse rule.
shared_old = "\t.closing-layout,\n\t.vision-two-col,\n\t.vision-split {\n"
shared_new = "\t.closing-layout {\n"
if shared_old not in css:
    sys.exit("ABORT: shared grid-collapse selector list not found")
css = css.replace(shared_old, shared_new, 1)

# Collapse any 3+ blank line runs left behind.
css = re.sub(r"\n{3,}", "\n\n", css)

with open(PATH, "w") as f:
    f.write(css)

leftover = [ln for ln in css.splitlines() if "vision" in ln.lower()]
print(f"removed {original_len - len(css)} chars")
print(f"leftover 'vision' lines in {PATH}: {len(leftover)}")
for ln in leftover:
    print("   ", ln)
