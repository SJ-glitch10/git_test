# SOORYA S JOSHI — Portfolio

Two editions of the same portfolio, same facts, different worlds:

| Edition | Where | What it is |
| --- | --- | --- |
| **Editor** | `index.html` | The page as a code editor — gutter, tabs, minimap, ⌘K |
| **Newspaper** | `newspaper/index.html` | *The Joshi Herald* — a broadsheet, ads and all |

Each links to the other in its header. Everything below describes the editor
edition; the newspaper has its own section at the end.

---

## The editor edition

A single-page portfolio that presents itself as a code editor: line-number
gutter, file tabs, minimap, status bar and a `Ctrl/⌘ K` command palette, over a
bone-paper / ink-hairline palette with one signal colour.

No framework, no build step, no dependencies. Open `index.html` and it runs.

```
index.html              markup + all copy
assets/css/fonts.css    self-hosted @font-face (Archivo var, JetBrains Mono var)
assets/css/style.css    design tokens, layout, light + dark themes, responsive
assets/js/main.js       data (projects, stack), browser, boot terminal, interactions
assets/fonts/*.woff2    self-hosted webfonts — no external requests at runtime
```

## Sections

`HERO → ABOUT → EXPERIENCE → PROJECTS → STACK → RESEARCH → EDUCATION → OVERVIEW → CONTACT`

The **OVERVIEW** band near the bottom is the whole profile compressed into one
screen: headline metrics, a jump-table index of every section, and a
`profile.json` dump.

## IDE chrome

- **Tabs** instead of a nav — each section is a file (`about.md`,
  `projects.json`, `stack.yaml`, …) and the active one is marked
- **Gutter** with line numbers that advance with scroll, plus a caret line
- **Minimap** on the right, generated from the real section heights; click to jump
- **Status bar** with branch, current file, `Ln/Col`, encoding and clock
- **Command palette** — `Ctrl/⌘ K` to jump to a section or run an action
- Background uses vertical indent guides rather than graph paper

Gutter and minimap drop out below 1100/900px; the tab strip scrolls horizontally
on a phone.

## Behaviour

- Light/dark theme, remembered in `localStorage` (button, or press `T`)
- Project browser with `PRJ_01…PRJ_07` selector — `←` / `→` page it while the
  section is on screen
- Boot-sequence terminal, scroll progress bar, active-section nav, skill ticker
- Scramble-in headings and reveal transitions, all disabled under
  `prefers-reduced-motion`
- Click-to-copy email and phone

## Adding links later

Every unwired link is marked with `data-pending` and renders a `[LINK_PENDING]`
badge. To wire one up: set its `href` and drop the `data-pending` attribute and
the inner `<span>[LINK_PENDING]</span>`.

- Social / résumé links — `#contact` in `index.html`
- Publication link — `#research` in `index.html`
- Per-project links — the `VIEW PROJECT` anchor in `render()` in `assets/js/main.js`
  (give each entry in `PROJECTS` a `url` and use it there)

## Fonts

Body and UI are JetBrains Mono. Headlines are **Ribes**, which isn't on any CDN —
it's a free download from [fontesk.com](https://fontesk.com/ribes-font/) (check
its licence covers your use).

The face is already declared in `assets/css/fonts.css`. To install it:

1. Download the archive and convert the `.otf` to `.woff2`
   (e.g. <https://cloudconvert.com/otf-to-woff2>, or `fonttools` locally).
2. Drop it in as `assets/fonts/Ribes.woff2` — the `.otf`/`.ttf` also work, they
   are just heavier.
3. Run `python3 build.py` to refresh the standalone file.

No code change needed: the `@font-face` already lists those filenames, and the
display stack is `Ribes → Outfit → system`. Until the file exists the browser
skips it silently and headlines render in Outfit, the closest free geometric
stand-in.

## Editing content

All copy lives in `index.html` except projects and the stack grid, which are
data arrays at the top of `assets/js/main.js` (`PROJECTS`, `STACK`, `TICKER`).

## Viewing it

The page loads its CSS, JS and fonts as separate files, so it needs a real
directory — a server, or the folder opened as a folder. Opening `index.html`
alone (emailed to yourself, or tapped from a phone's downloads) strips those
paths and you get unstyled HTML.

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

Or publish it: Settings -> Pages -> deploy from this branch, root folder.

### Single-file build

`portfolio-standalone.html` and `newspaper/herald-standalone.html` are each the
whole edition in one file — CSS, JS and fonts inlined as data URIs, zero
external requests. Open either from anywhere, including a phone. Regenerate
both after any change to the source files:

```bash
python3 build.py
```
