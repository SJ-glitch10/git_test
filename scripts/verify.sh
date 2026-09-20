#!/usr/bin/env bash
# Function-wise verification gate for this repository.
#
# Run by the debugging-agent before every handoff, and again by the
# general-manager before approving a change for pull request.
# Exit 0 = PASS, non-zero = FAIL. No dependencies beyond node and python3.

set -uo pipefail
cd "$(dirname "$0")/.."

fails=0
pass() { printf '  ok    %s\n' "$1"; }
fail() { printf '  FAIL  %s\n' "$1"; fails=$((fails + 1)); }

echo "== files =="
for f in index.html assets/js/main.js assets/css/style.css assets/css/fonts.css; do
  [ -f "$f" ] && pass "$f present" || fail "$f missing"
done

echo "== javascript syntax =="
if command -v node >/dev/null 2>&1; then
  while IFS= read -r f; do
    if out=$(node --check "$f" 2>&1); then pass "$f parses"; else fail "$f: $out"; fi
  done < <(find assets/js -name '*.js' 2>/dev/null)
else
  fail "node not available — cannot syntax-check javascript"
fi

echo "== inline script syntax =="
python3 - <<'PY' || fails=$((fails + 1))
import re, subprocess, sys, tempfile, pathlib
html = pathlib.Path("index.html").read_text(encoding="utf-8")
blocks = re.findall(r"<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>", html, re.S | re.I)
bad = 0
for i, body in enumerate(blocks, 1):
    if not body.strip():
        continue
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as t:
        t.write(body)
        p = t.name
    r = subprocess.run(["node", "--check", p], capture_output=True, text=True)
    if r.returncode:
        print(f"  FAIL  inline script #{i}: {r.stderr.strip().splitlines()[0] if r.stderr.strip() else 'parse error'}")
        bad += 1
    else:
        print(f"  ok    inline script #{i} parses")
if not blocks:
    print("  ok    no inline scripts")
sys.exit(1 if bad else 0)
PY

echo "== css brace balance =="
python3 - <<'PY' || fails=$((fails + 1))
import pathlib, re, sys
bad = 0
for f in sorted(pathlib.Path("assets/css").glob("*.css")):
    src = re.sub(r"/\*.*?\*/", "", f.read_text(encoding="utf-8"), flags=re.S)
    depth = 0
    for ch in src:
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth < 0:
                break
    if depth == 0:
        print(f"  ok    {f} braces balanced")
    else:
        print(f"  FAIL  {f} braces unbalanced (net {depth})")
        bad += 1
sys.exit(1 if bad else 0)
PY

echo "== referenced local assets exist =="
python3 - <<'PY' || fails=$((fails + 1))
import pathlib, re, sys
html = pathlib.Path("index.html").read_text(encoding="utf-8")
refs = set(re.findall(r'(?:href|src)="([^"#][^"]*)"', html))
missing = [r for r in sorted(refs)
           if not re.match(r"^(https?:|mailto:|tel:|data:|//)", r)
           and not pathlib.Path(r.split("?")[0]).exists()]
for r in missing:
    print(f"  FAIL  index.html references missing {r}")
if not missing:
    print(f"  ok    all {len(refs)} referenced local assets resolve")
sys.exit(1 if missing else 0)
PY

echo "== function inventory (check each of these by hand) =="
python3 - <<'PY'
import pathlib, re
pat = re.compile(
    r"^\s*(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)"
    r"|^\s*(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?"
    r"(?:function\b|\([^)]*\)\s*=>|[A-Za-z_$][\w$]*\s*=>)"
)
total = 0
for f in sorted(pathlib.Path("assets/js").rglob("*.js")):
    for n, line in enumerate(f.read_text(encoding="utf-8").splitlines(), 1):
        m = pat.match(line)
        if m:
            print(f"  {f}:{n}  {m.group(1) or m.group(2)}")
            total += 1
print(f"  -- {total} functions found")
PY

echo
if [ "$fails" -eq 0 ]; then
  echo "VERIFY: PASS"
  exit 0
fi
echo "VERIFY: FAIL ($fails check(s) failed)"
exit 1
