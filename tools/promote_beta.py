#!/usr/bin/env python3
"""Copy the approved beta (docs/beta/) to production (docs/).

Run from the repo root:  python3 tools/promote_beta.py <version>
  e.g.  python3 tools/promote_beta.py 2

- app.js / style.css are written under NEW names (app-<version>.js, style-<version>.css)
  and index.html points at them. The previous files stay in place, so a phone that
  still has the old page cached keeps loading the old, matching script — never a mix.
- Restores asset paths ("../logo.png" -> "logo.png").
- Removes the red "בטא" badge (everything between <!--BETA--> and <!--/BETA-->).
Review `git diff docs/` before committing.
"""
import re, sys, pathlib

if len(sys.argv) != 2 or not re.fullmatch(r"[0-9A-Za-z_-]+", sys.argv[1]):
    sys.exit("usage: python3 tools/promote_beta.py <version>")
v = sys.argv[1]
root = pathlib.Path(__file__).resolve().parent.parent / "docs"

def clean(s):
    s = re.sub(r'\n?<!--BETA-->.*?<!--/BETA-->', "", s, flags=re.S)
    return re.sub(r'((?:href|src)=")\.\./', r"\1", s)

js, css = f"app-{v}.js", f"style-{v}.css"
for out in (js, css):
    if (root / out).exists():
        sys.exit(f"docs/{out} already exists — pick a new version")

(root / js).write_text((root / "beta" / "app.js").read_text(encoding="utf-8"), encoding="utf-8")
(root / css).write_text((root / "beta" / "style.css").read_text(encoding="utf-8"), encoding="utf-8")

index = clean((root / "beta" / "index.html").read_text(encoding="utf-8"))
# beta references app.js?v=N / style.css?v=N (cache-busting); production uses versioned names
index, n_js = re.subn(r'src="app\.js(\?v=[^"]*)?"', f'src="{js}"', index)
index, n_css = re.subn(r'href="style\.css(\?v=[^"]*)?"', f'href="{css}"', index)
assert n_js == 1 and n_css == 1, "beta index.html must load app.js and style.css once"
(root / "index.html").write_text(index, encoding="utf-8")

(root / "staff.html").write_text(clean((root / "beta" / "staff.html").read_text(encoding="utf-8")), encoding="utf-8")
print(f"promoted: index.html -> {js}, {css}; staff.html")
