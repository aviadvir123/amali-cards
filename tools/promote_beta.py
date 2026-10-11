#!/usr/bin/env python3
"""Copy the approved beta (docs/beta/) to production (docs/).

Run from the repo root:  python3 tools/promote_beta.py
- Restores asset paths ("../logo.png" -> "logo.png").
- Removes the red "בטא" badge (everything between <!--BETA--> and <!--/BETA-->).
Review `git diff docs/` before committing.
"""
import re, pathlib

FILES = ["index.html", "app.js", "style.css", "staff.html"]
root = pathlib.Path(__file__).resolve().parent.parent / "docs"

for name in FILES:
    src = root / "beta" / name
    s = src.read_text(encoding="utf-8")
    s = re.sub(r'\n?<!--BETA-->.*?<!--/BETA-->', "", s, flags=re.S)
    s = re.sub(r'((?:href|src)=")\.\./', r"\1", s)
    (root / name).write_text(s, encoding="utf-8")
    print("promoted", name)
