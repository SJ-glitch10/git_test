/* ══════════════════════════════════════════════════════════════════
   paper.js — the press room
   Ticker, markets, the funny pages, and the print button.
   ══════════════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 01 · the date line ────────────────────────────────────── */

  const now = new Date();
  const DAYS = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
  const MONTHS = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
  $('#todayLine').textContent =
    `BANGALORE · ${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  $('#year').textContent = now.getFullYear();

  /* ── 02 · breaking news crawl ──────────────────────────────── */

  const HEADLINES = [
    'LOCAL ENGINEER BUILDS SOFTWARE AND HARDWARE, REFUSES TO PICK A SIDE',
    'SITE SCOUT SCORES THE ABANDONED WEB FROM 0 TO 100, SHOWS ITS WORKING',
    'NEURALENHANCE RECONSTRUCTS 4× DETAIL ENTIRELY ON LOCAL HARDWARE',
    'IEEE PUBLICATION: 20-DOF HUMANOID KINEMATICS, CO-AUTHORED',
    'CGPA HOLDS FIRM AT 8.10 AMID VOLATILE SEMESTER CONDITIONS',
    'CABLE FAULTS LOCATED WITHOUT DIGGING UP THE ROAD',
    'TRANSFORMER TESTED AT BEL; ALL EYEBROWS ACCOUNTED FOR',
    'PROCESS DATA ANALYSED AT CEPHEID (DANAHER), BANGALORE',
    'STUDENT STILL AVAILABLE FOR GOOD ROLES — ENQUIRE PAGE G2'
  ];
  const strip = HEADLINES.map(h => `<span>${h}</span>`).join('');
  $('#breakingTrack').innerHTML = strip + strip;

  /* ── 03 · night edition ────────────────────────────────────── */

  const html = document.documentElement;
  const edBtn = $('#editionToggle');
  const stored = (() => { try { return localStorage.getItem('herald-edition'); } catch { return null; } })();
  const setEdition = e => {
    html.dataset.edition = e;
    edBtn.textContent = e === 'night' ? 'DAY EDITION' : 'NIGHT EDITION';
    try { localStorage.setItem('herald-edition', e); } catch { /* newsagent declined */ }
  };
  setEdition(stored || (matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day'));
  edBtn.addEventListener('click', () => setEdition(html.dataset.edition === 'night' ? 'day' : 'night'));

  $('#printBtn').addEventListener('click', () => print());

  /* ── 04 · section nav highlighting ─────────────────────────── */

  const links = $$('.sections a');
  const pages = links.map(a => ({ link: a, el: $(a.getAttribute('href')) })).filter(p => p.el);
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      let cur = null;
      for (const p of pages) if (p.el.getBoundingClientRect().top <= innerHeight * 0.3) cur = p.link;
      links.forEach(l => l.classList.toggle('is-active', l === cur));
      ticking = false;
    });
  }, { passive: true });

  /* ── 05 · markets: the stack, quoted ───────────────────────── */

  const GROUPS = [
    { name: 'Languages',  items: ['Java', 'C++', 'C', 'Python', 'JavaScript', 'TypeScript', 'SQL'] },
    { name: 'Web',        items: ['React', 'HTML5', 'CSS3', 'FastAPI', 'REST APIs', 'Responsive'] },
    { name: 'AI / ML',    items: ['PyTorch', 'Deep Learning', 'Computer Vision', 'PSNR / SSIM'] },
    { name: 'Data',       items: ['SQL', 'SQLite', 'Relational Modelling', 'Trend Analysis'] },
    { name: 'CS Core',    items: ['Data Structures', 'Algorithms', 'OOP', 'Debugging', 'SDLC'] },
    { name: 'Embedded',   items: ['Arduino', 'Pi Pico', 'Sensors', 'Relays', 'ADC', 'Serial'] },
    { name: 'Electrical', items: ['Machines', 'Power Systems', 'Circuit Analysis', 'Control'] },
    { name: 'Tools',      items: ['Git', 'GitHub', 'VS Code', 'Linux', 'MATLAB', 'Simulink', 'KiCad', 'Godot'] }
  ];

  /* deterministic "movements" — a newspaper prints the same figures all day */
  let seed = 20260918;
  const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;

  $('#markets').innerHTML = GROUPS.map(g => `
    <div class="market-group">
      <h3>${g.name}</h3>
      <div class="quotes">
        ${g.items.map(i => {
          const up = rnd() > 0.28;
          const mv = (rnd() * (up ? 4.2 : 1.9) + 0.2).toFixed(2);
          return `<span class="quote"><b>${i}</b><i class="${up ? 'up' : 'dn'}">${up ? '▲' : '▼'} ${mv}%</i></span>`;
        }).join('')}
      </div>
    </div>`).join('');

  /* ── 06 · the funny pages ──────────────────────────────────── */

  const JOKES = [
    'There are only 10 kinds of people in the world: those who understand binary, and those who don’t.',
    'A SQL query walks into a bar, approaches two tables, and asks: “may I join you?”',
    'Why do programmers prefer dark mode? Because light attracts bugs.',
    'There are two hard problems in computer science: cache invalidation, naming things, and off-by-one errors.',
    'I would tell you a UDP joke, but you might not get it.',
    '!false — it’s funny because it’s true.',
    'A programmer is told: “buy a loaf of bread, and if they have eggs, get a dozen.” He returned with twelve loaves.',
    'Why did the developer go broke? He’d used up all his cache.',
    '99 little bugs in the code. Take one down, patch it around — 127 little bugs in the code.',
    'Debugging is being the detective in a crime film where you are also the murderer.',
    '“It works on my machine.” — “Then we’ll ship your machine.”',
    'Why do electrical engineers never get lost? They always find the shortest path to ground.',
    'I tried to resist the current. It was futile. Ohm my.',
    'A neural network walks into a bar. The bartender asks what it wants. It says: “whatever everyone else ordered, approximately.”',
    'My code doesn’t have bugs. It develops random unplanned features.',
    'The transformer worked on the first try, so I tested it again to find out what I’d done wrong.'
  ];

  const jokeText = $('#jokeText'), jokeCount = $('#jokeCount');
  let order = JOKES.map((_, i) => i), cursor = 0;
  for (let i = order.length - 1; i > 0; i--) {         /* shuffle once per edition */
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const tellJoke = () => {
    jokeText.textContent = JOKES[order[cursor]];
    jokeCount.textContent = `No. ${order[cursor] + 1} of ${JOKES.length}`;
    cursor = (cursor + 1) % order.length;
  };
  tellJoke();
  $('#jokeBtn').addEventListener('click', tellJoke);

  /* mini crossword — a symmetric word square, so across and down read alike */
  const SQUARE = ['HEART', 'EMBER', 'ABUSE', 'RESIN', 'TREND'];
  const grid = $('#xgrid');
  grid.innerHTML = SQUARE.map((row, r) => `<tr>${
    [...row].map((ch, c) => `<td>${(c === 0 || r === 0) ? `<i>${c === 0 ? r + 1 : c + 1}</i>` : ''}<span>${ch}</span></td>`).join('')
  }</tr>`).join('');
  $('#xBtn').addEventListener('click', e => {
    const on = grid.classList.toggle('is-revealed');
    e.target.textContent = on ? 'HIDE ANSWERS' : 'REVEAL ANSWERS';
  });

  /* ── 07 · copy + pending notices ───────────────────────────── */

  const toast = $('#toast');
  let timer;
  const say = msg => {
    toast.textContent = msg;
    toast.classList.add('is-on');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('is-on'), 1900);
  };

  document.addEventListener('click', async e => {
    const c = e.target.closest('.copy');
    if (c) {
      try { await navigator.clipboard.writeText(c.dataset.copy); say(`copied — ${c.dataset.copy}`); }
      catch { say('copy blocked — select it manually'); }
      return;
    }
    if (e.target.closest('[data-pending]')) { e.preventDefault(); say('that link goes to press shortly'); }
  });

  addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) return;
    if (e.key.toLowerCase() === 'j') tellJoke();
    if (e.key.toLowerCase() === 'n') edBtn.click();
  });

  console.log('%c THE JOSHI HERALD ', 'background:#16130F;color:#F2EDE0;font-weight:700;padding:4px 10px');
  console.log('%c all the commits fit to push — press J for another joke', 'color:#9E1B1B');
})();
