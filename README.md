# SOORYA S JOSHI — Portfolio

A single-page portfolio built around a terminal / engineering-drawing aesthetic:
bone paper, ink hairlines, one signal colour, heavy condensed display type over
monospace body text.

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

## Editing content

All copy lives in `index.html` except projects and the stack grid, which are
data arrays at the top of `assets/js/main.js` (`PROJECTS`, `STACK`, `TICKER`).

## Local preview

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```
