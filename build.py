#!/usr/bin/env python3
"""Bundle the site into one self-contained HTML file.

index.html links its CSS, JS and fonts as separate files, which is the right
way to serve it. But a single file opens correctly from anywhere — a phone's
downloads folder, a chat attachment, a USB stick — because there are no
relative paths left to break.

    python3 build.py   ->  portfolio-standalone.html
"""
import base64
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).parent
OUT = ROOT / "portfolio-standalone.html"

LINKS = """<link rel="preload" href="assets/fonts/Outfit-latin.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="assets/fonts/JetBrainsMono-latin.woff2" as="font" type="font/woff2" crossorigin />
<link rel="stylesheet" href="assets/css/fonts.css" />
<link rel="stylesheet" href="assets/css/style.css" />"""

SCRIPT = '<script src="assets/js/main.js"></script>'


MISSING = []


def data_uri(match):
    """Inline a font file, or leave the reference alone if it isn't here yet.

    Ribes ships as an optional drop-in: until someone adds the file, the
    browser simply skips that src entry and falls through to the next face
    in the stack, exactly as it does in the unbundled version."""
    font = ROOT / "assets/fonts" / pathlib.Path(match.group(1)).name
    if not font.exists():
        MISSING.append(font.name)
        return match.group(0)
    return f"url(data:font/woff2;base64,{base64.b64encode(font.read_bytes()).decode()})"


def main():
    html = (ROOT / "index.html").read_text()
    fonts = re.sub(r"url\(\.\./fonts/([^)]+)\)", data_uri,
                   (ROOT / "assets/css/fonts.css").read_text())
    style = (ROOT / "assets/css/style.css").read_text()
    js = (ROOT / "assets/js/main.js").read_text()

    if LINKS not in html or SCRIPT not in html:
        sys.exit("index.html no longer matches the expected <head>/<script> — update build.py")

    html = html.replace(
        LINKS,
        "<!-- SELF-CONTAINED BUILD — css, js and fonts inlined. regenerate with build.py -->\n"
        f"<style>\n{fonts}\n{style}\n</style>",
    ).replace(SCRIPT, f"<script>\n{js}\n</script>")

    stray = [l for l in html.splitlines() if "assets/" in l and "fonts/" not in l]
    if stray:
        sys.exit(f"an external reference survived the bundle: {stray[0][:80]}")

    OUT.write_text(html)
    print(f"{OUT.name}: {len(html) // 1024} KB, 0 external requests")
    if MISSING:
        print("  not bundled (absent, falls back gracefully): " + ", ".join(sorted(set(MISSING))))


if __name__ == "__main__":
    main()
