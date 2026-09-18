#!/usr/bin/env python3
"""Bundle each edition into one self-contained HTML file.

Both editions link their CSS, JS and fonts as separate files, which is the
right way to serve them. But a single file opens correctly from anywhere — a
phone's downloads folder, a chat attachment, a USB stick — because there are
no relative paths left to break.

    python3 build.py   ->  portfolio-standalone.html
                           newspaper/herald-standalone.html
"""
import base64
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).parent

EDITIONS = [
    {
        "name": "editor",
        "src": "index.html",
        "out": "portfolio-standalone.html",
        "fonts": "assets/fonts",
        "styles": ["assets/css/fonts.css", "assets/css/style.css"],
        "script": "assets/js/main.js",
        "links": '''<link rel="preload" href="assets/fonts/Outfit-latin.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="assets/fonts/JetBrainsMono-latin.woff2" as="font" type="font/woff2" crossorigin />
<link rel="stylesheet" href="assets/css/fonts.css" />
<link rel="stylesheet" href="assets/css/style.css" />''',
        "script_tag": '<script src="assets/js/main.js"></script>',
    },
    {
        "name": "newspaper",
        "src": "newspaper/index.html",
        "out": "newspaper/herald-standalone.html",
        "fonts": "newspaper/assets/fonts",
        "styles": ["newspaper/assets/css/fonts.css", "newspaper/assets/css/paper.css"],
        "script": "newspaper/assets/js/paper.js",
        "links": '''<link rel="preload" href="assets/fonts/CrimsonText-400.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="assets/fonts/PlayfairDisplay-400-900.woff2" as="font" type="font/woff2" crossorigin />
<link rel="stylesheet" href="assets/css/fonts.css" />
<link rel="stylesheet" href="assets/css/paper.css" />''',
        "script_tag": '<script src="assets/js/paper.js"></script>',
    },
]


def bundle(ed):
    missing = []

    def data_uri(match):
        """Inline a font file, or leave the reference alone if it isn't here yet.

        Ribes ships as an optional drop-in: until someone adds the file, the
        browser skips that src entry and falls through to the next face in the
        stack, exactly as it does in the unbundled version."""
        font = ROOT / ed["fonts"] / pathlib.Path(match.group(1)).name
        if not font.exists():
            missing.append(font.name)
            return match.group(0)
        return f"url(data:font/woff2;base64,{base64.b64encode(font.read_bytes()).decode()})"

    html = (ROOT / ed["src"]).read_text()
    if ed["links"] not in html or ed["script_tag"] not in html:
        sys.exit(f"{ed['src']} no longer matches the expected <head>/<script> — update build.py")

    css = "\n".join(
        re.sub(r"url\(\.\./fonts/([^)]+)\)", data_uri, (ROOT / s).read_text())
        for s in ed["styles"]
    )
    js = (ROOT / ed["script"]).read_text()

    html = html.replace(
        ed["links"],
        "<!-- SELF-CONTAINED BUILD — css, js and fonts inlined. regenerate with build.py -->\n"
        f"<style>\n{css}\n</style>",
    ).replace(ed["script_tag"], f"<script>\n{js}\n</script>")

    stray = [l for l in html.splitlines() if "assets/" in l and "fonts/" not in l]
    if stray:
        sys.exit(f"an external reference survived the bundle: {stray[0][:80]}")

    out = ROOT / ed["out"]
    out.write_text(html)
    print(f"{ed['out']}: {len(html) // 1024} KB, 0 external requests")
    if missing:
        print("  not bundled (absent, falls back gracefully): " + ", ".join(sorted(set(missing))))


if __name__ == "__main__":
    for edition in EDITIONS:
        bundle(edition)
