/* ============================================================
   main.js — portfolio runtime
   No framework. No build step. Just the DOM.
   ============================================================ */
(() => {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 01 · data ─────────────────────────────────────────── */

  const PROJECTS = [
    {
      slug: 'SITE_SCOUT',
      name: 'Site Scout',
      kicker: 'FULL-STACK · PYTHON · REACT',
      tagline: 'Website abandonment detection platform',
      desc: 'A deployed platform that reads a website the way an investigator would — DNS, HTTP, TLS, server fingerprints and content metadata — and decides whether anyone is still maintaining it.',
      points: [
        'Analyses websites across DNS, HTTP, TLS, server fingerprints and content metadata to identify signs of abandonment or ongoing maintenance.',
        'Explainable 0–100 abandonment score built from stale Last-Modified and copyright dates, outdated dependencies, legacy HTML, placeholder content and missing security headers.',
        'Asynchronous scanning, technology fingerprinting, historical scan storage, trend analysis and CSV/JSON reporting.',
        'Shipped with both a CLI and a web interface over the same engine.'
      ],
      stack: ['Python', 'FastAPI', 'React', 'SQLite', 'REST'],
      meta: { TYPE: 'Full-stack platform', STATE: 'Deployed / live', SCOPE: 'Solo build' }
    },
    {
      slug: 'NEURAL_ENHANCE',
      name: 'NeuralEnhance',
      kicker: 'DEEP LEARNING · PYTORCH · VISION',
      tagline: 'AI image super-resolution, 4×',
      desc: 'An end-to-end 4× super-resolution system that trains and infers entirely on local hardware — no external AI APIs anywhere in the loop.',
      points: [
        'Residual convolutional architecture with PixelShuffle upsampling to reconstruct high-frequency detail from low-resolution input.',
        'Combined pixel-wise and Sobel-gradient loss to keep edges sharp instead of smoothed.',
        'Reconstruction quality evaluated with PSNR and SSIM across the validation set.',
        'Gradio interface for upload, before/after comparison, quality analysis and high-resolution export.'
      ],
      stack: ['PyTorch', 'Python', 'Gradio', 'NumPy', 'CV'],
      meta: { TYPE: 'ML system', STATE: 'Trained locally', SCOPE: 'Model + interface' }
    },
    {
      slug: 'GOBLIN_HQ',
      name: 'Fullstack Goblin HQ',
      kicker: 'WEB APP · UX · PRODUCT',
      tagline: 'ADHD-friendly developer learning platform',
      desc: 'A learning environment designed around how attention actually behaves: short tasks, visible progress and hard stops instead of an endless syllabus.',
      points: [
        'Organises full-stack development into progressive phases, prerequisite-gated quests, projects and milestones.',
        'Persistent progress tracking with XP, level progression, achievements and randomised missions.',
        'Focus timers, keyboard shortcuts, distraction controls and progress import/export.',
        'Interface built around progressive unlocking and visual feedback to reduce cognitive overload.'
      ],
      stack: ['JavaScript', 'React', 'HTML5', 'CSS3', 'LocalState'],
      meta: { TYPE: 'Web application', STATE: 'Built', SCOPE: 'Design + build' }
    },
    {
      slug: 'ECOM_CLIENT',
      name: 'E-Commerce Website',
      kicker: 'CLIENT WORK · FRONTEND',
      tagline: 'Responsive storefront for a real company',
      desc: 'A commissioned build: turning a company\'s product catalogue and requirements into a storefront that works on every screen they sell on.',
      points: [
        'Designed and developed a responsive e-commerce website to present a real client\'s products online.',
        'Worked directly with the client to translate requirements into product browsing and structured product information.',
        'Responsive layouts, navigation and interactive frontend functionality throughout.'
      ],
      stack: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
      meta: { TYPE: 'Client project', STATE: 'Delivered', SCOPE: 'Frontend' }
    },
    {
      slug: 'GODOT_GAME',
      name: 'Game Development',
      kicker: 'GODOT ENGINE · GAMEPLAY',
      tagline: 'A playable game, built from scratch',
      desc: 'Gameplay systems written and iterated the hard way — build, play, break, fix, repeat.',
      points: [
        'Designed and developed a playable game in Godot Engine with mechanics, player interaction and scene management.',
        'Programmed gameplay systems and interactive elements end to end.',
        'Iterated on mechanics, debugged issues and tuned the overall player experience.'
      ],
      stack: ['Godot', 'GDScript', 'Game Logic'],
      meta: { TYPE: 'Game', STATE: 'Playable', SCOPE: 'Solo build' }
    },
    {
      slug: 'CABLE_FAULT',
      name: 'Underground Cable Fault Detection',
      kicker: 'EMBEDDED · ARDUINO · POWER',
      tagline: 'Finding the break without digging the trench',
      desc: 'A hardware system that locates faults in buried cable by reading voltage drop — measurement, embedded logic and fault simulation in one bench setup.',
      points: [
        'Arduino-based system for detecting and locating underground cable faults through voltage-drop analysis.',
        'Relay-based fault simulation to reproduce different fault conditions and evaluate system response.',
        'Integrated electrical measurement, embedded programming and fault-detection logic for automated identification.'
      ],
      stack: ['Arduino', 'C/C++', 'Relays', 'ADC', 'Sensors'],
      meta: { TYPE: 'Embedded hardware', STATE: 'Working prototype', SCOPE: 'Hardware + firmware' }
    },
    {
      slug: 'LINE_ROBOT',
      name: 'Line Following Robot',
      kicker: 'ROBOTICS · CONTROL',
      tagline: 'Autonomous navigation on infrared',
      desc: 'A closed control loop in physical form: sense the line, correct the drive, do it again a few hundred times a second.',
      points: [
        'Autonomous line-following robot built on Arduino and infrared sensors.',
        'Real-time sensor processing and motor control logic for autonomous navigation.',
        'Sensors, microcontroller firmware, motor drivers and control logic integrated into one embedded system.'
      ],
      stack: ['Arduino', 'IR Sensors', 'Motor Drivers', 'C'],
      meta: { TYPE: 'Robotics', STATE: 'Working prototype', SCOPE: 'Hardware + firmware' }
    }
  ];

  const STACK = [
    { no: 'ST_01', title: 'Languages',        items: ['Java', 'C++', 'C', 'Python', 'JavaScript', 'TypeScript', 'SQL'] },
    { no: 'ST_02', title: 'Computer Science',  items: ['Data Structures', 'Algorithms', 'OOP', 'Problem Solving', 'Debugging', 'SDLC'] },
    { no: 'ST_03', title: 'Web Development',   items: ['React', 'HTML5', 'CSS3', 'FastAPI', 'REST APIs', 'Responsive Design'] },
    { no: 'ST_04', title: 'AI / ML',           items: ['PyTorch', 'Deep Learning', 'Computer Vision', 'Super-Resolution', 'PSNR / SSIM'] },
    { no: 'ST_05', title: 'Data & Databases',  items: ['SQL', 'SQLite', 'Relational Modelling', 'Trend Analysis', 'Reporting'] },
    { no: 'ST_06', title: 'Embedded Systems',  items: ['Arduino', 'Raspberry Pi Pico', 'Microcontrollers', 'Sensors', 'Relays', 'ADC', 'Serial Comms'] },
    { no: 'ST_07', title: 'Electrical',        items: ['Electrical Machines', 'Power Systems', 'Circuit Analysis', 'Power Electronics', 'Control Systems', 'Instrumentation'] },
    { no: 'ST_08', title: 'Tooling',           items: ['Git', 'GitHub', 'VS Code', 'Linux', 'MATLAB', 'Simulink', 'KiCad', 'Godot'] }
  ];

  const TICKER = [
    'JAVA', 'C++', 'PYTHON', 'TYPESCRIPT', 'REACT', 'FASTAPI', 'PYTORCH', 'SQL',
    'ARDUINO', 'MATLAB', 'GIT', 'LINUX', 'GODOT', 'DEEP LEARNING', 'POWER SYSTEMS',
    'KINEMATICS', 'IEEE PUBLISHED', 'BANGALORE, IN'
  ];

  /* ── 02 · header, clock, theme ─────────────────────────── */

  const clockEl = $('#clock');
  const tick = () => {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    clockEl.textContent = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())} IST`;
  };
  tick(); setInterval(tick, 1000);
  $('#year').textContent = new Date().getFullYear();

  const html = document.documentElement;
  const themeBtn = $('#themeToggle');
  const themeLabel = $('#themeLabel');
  const stored = (() => { try { return localStorage.getItem('sj-theme'); } catch { return null; } })();
  const setTheme = t => {
    html.dataset.theme = t;
    themeLabel.textContent = t === 'dark' ? 'LIGHT' : 'DARK';
    themeBtn.setAttribute('aria-pressed', String(t === 'dark'));
    try { localStorage.setItem('sj-theme', t); } catch { /* private mode */ }
  };
  setTheme(stored || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  themeBtn.addEventListener('click', () => setTheme(html.dataset.theme === 'dark' ? 'light' : 'dark'));


  /* ── 03 · scroll progress + active nav ─────────────────── */

  const bar = $('#progressBar');
  const tabs = $$('.tab');
  const sections = tabs
    .map(a => ({ link: a, el: $(a.getAttribute('href')), file: a.dataset.file }))
    .filter(s => s.el);

  /* line-number gutter — numbers advance with the scroll position, the way
     they would if this page were one very long file open in an editor. */
  const gutter = $('#gutter');
  const LINE = 22;
  let gutterRows = [];
  const buildGutter = () => {
    const rows = Math.ceil((innerHeight - 64) / LINE) + 1;
    gutter.innerHTML = Array.from({ length: rows }, () => '<span></span>').join('');
    gutterRows = $$('span', gutter);
    const caret = Math.round(rows * 0.34);
    gutterRows.forEach((r, i) => r.classList.toggle('is-caret', i === caret));
  };
  const paintGutter = first => gutterRows.forEach((r, i) => { r.textContent = first + i; });

  /* minimap — an abstract of the document, with a viewport box that tracks scroll */
  const minimap = $('#minimap'), mmCode = $('#minimapCode'), mmView = $('#minimapView');
  const buildMinimap = () => {
    let seed = 7;
    const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
    mmCode.innerHTML = sections.map(s => {
      const lines = Math.max(6, Math.round(s.el.offsetHeight / 90));
      return '<i class="h" style="width:70%"></i>' +
        Array.from({ length: lines }, () => `<i style="width:${20 + rnd() * 70}%"></i>`).join('') +
        '<hr />';
    }).join('');
  };
  minimap.addEventListener('click', e => {
    const ratio = (e.clientY - minimap.getBoundingClientRect().top) / minimap.clientHeight;
    scrollTo({ top: ratio * (document.body.scrollHeight - innerHeight), behavior: REDUCED ? 'auto' : 'smooth' });
  });

  const sbSection = $('#sbSection'), sbLn = $('#sbLn');

  let ticking = false;
  const onScroll = () => {
    const max = document.body.scrollHeight - innerHeight;
    const pct = max > 0 ? scrollY / max : 0;
    bar.style.width = `${pct * 100}%`;

    let current = null;
    for (const s of sections) if (s.el.getBoundingClientRect().top <= innerHeight * 0.34) current = s;
    tabs.forEach(l => l.classList.toggle('is-active', current && l === current.link));

    const line = Math.floor(scrollY / LINE) + 1;
    paintGutter(line);
    sbLn.textContent = `Ln ${line}, Col ${(Math.floor(scrollY / 7) % 60) + 1}`;
    sbSection.textContent = current ? current.file : 'index.html';

    const h = minimap.clientHeight;
    const boxH = Math.max(28, (innerHeight / document.body.scrollHeight) * h);
    mmView.style.height = `${boxH}px`;
    mmView.style.top = `${pct * (h - boxH)}px`;
    ticking = false;
  };
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  buildGutter(); buildMinimap(); onScroll();
  addEventListener('resize', () => { buildGutter(); buildMinimap(); onScroll(); }, { passive: true });

  /* ── 04 · ticker ───────────────────────────────────────── */

  const track = $('#tickerTrack');
  const strip = TICKER.map(t => `<span>${t}</span>`).join('');
  track.innerHTML = strip + strip;

  /* ── 05 · boot terminal ────────────────────────────────── */

  const LINES = [
    '<span class="p">$</span> whoami',
    'soorya_s_joshi',
    '',
    '<span class="p">$</span> cat ./role',
    '<b>Software Development · AI/ML · Data</b>',
    '',
    '<span class="p">$</span> ./locate --self',
    'Bangalore, Karnataka, IN',
    '',
    '<span class="p">$</span> systemctl status build',
    '● portfolio.service — <b>active (running)</b>',
    '  uptime .... since 2023',
    '  stack ..... java, c++, python, ts, pytorch',
    '  hardware .. arduino, pico, kicad',
    '',
    '<span class="p">$</span> _'
  ];

  const body = $('#termBody');
  const startBoot = () => {
    if (REDUCED) {
      body.innerHTML = LINES.join('\n') + '<span class="cursor"></span>';
      return;
    }
    let i = 0;
    const next = () => {
      if (i >= LINES.length) { body.insertAdjacentHTML('beforeend', '<span class="cursor"></span>'); return; }
      body.insertAdjacentHTML('beforeend', (i ? '\n' : '') + LINES[i]);
      i += 1;
      setTimeout(next, LINES[i - 1] === '' ? 70 : 150);
    };
    next();
  };

  /* ── 06 · text scramble on reveal ──────────────────────── */

  const GLYPHS = '#%&$@*+=/\\<>[]{}01';
  const scramble = el => {
    if (REDUCED) return;
    const nodes = [...el.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim());
    nodes.forEach(node => {
      const target = node.textContent;
      let frame = 0;
      const steps = target.split('').map((_, idx) => ({ start: idx * 1.1, end: idx * 1.1 + 9 }));
      const run = () => {
        let out = '', done = 0;
        for (let i = 0; i < target.length; i++) {
          const { start, end } = steps[i];
          if (frame >= end) { out += target[i]; done++; }
          else if (frame >= start) out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
          else out += ' ';
        }
        node.textContent = out;
        frame++;
        if (done < target.length) requestAnimationFrame(run);
        else node.textContent = target;
      };
      run();
    });
  };

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      if (e.target.hasAttribute('data-scramble')) scramble(e.target);
      if (e.target.id === 'term') startBoot();
      obs.unobserve(e.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });

  $$('[data-scramble], [data-reveal], #term').forEach(el => io.observe(el));

  /* ── 07 · project browser ──────────────────────────────── */

  const bodyEl = $('#prjBody'), slugEl = $('#prjSlug'), numEl = $('#prjNum'), pagerList = $('#pagerList');
  let active = 0;

  const pad = n => String(n + 1).padStart(2, '0');

  pagerList.innerHTML = PROJECTS.map((p, i) =>
    `<button class="pager__btn" role="tab" aria-selected="${i === 0}" data-i="${i}">PRJ_${pad(i)}</button>`
  ).join('');

  const render = i => {
    const p = PROJECTS[i];
    active = i;
    slugEl.textContent = `PRJ_${pad(i)} / ${p.slug}`;
    numEl.textContent = pad(i);
    bodyEl.innerHTML = `
      <article class="prj">
        <div class="prj__main">
          <p class="prj__kicker">${p.kicker}</p>
          <h3>${p.name}</h3>
          <p class="prj__desc">${p.desc}</p>
          <ul class="prj__points">
            ${p.points.map((t, n) => `<li><b>${String(n + 1).padStart(2, '0')}</b><span>${t}</span></li>`).join('')}
          </ul>
          <a class="link-pending" href="#" data-pending>VIEW PROJECT <span>[LINK_PENDING]</span></a>
        </div>
        <aside class="prj__side">
          <h4 class="minihead">Summary</h4>
          <p style="font-size:13px;color:var(--fg-soft)">${p.tagline}</p>
          <h4 class="minihead" style="margin-top:26px">Stack</h4>
          <p class="chips">${p.stack.map(s => `<span class="chip">${s.toUpperCase()}</span>`).join('')}</p>
          <ul class="prj__meta">
            ${Object.entries(p.meta).map(([k, v]) => `<li><span>${k}</span><b>${v}</b></li>`).join('')}
            <li><span>INDEX</span><b>${pad(i)} / ${String(PROJECTS.length).padStart(2, '0')}</b></li>
          </ul>
        </aside>
      </article>`;
    $$('.pager__btn', pagerList).forEach(b => b.setAttribute('aria-selected', String(+b.dataset.i === i)));
  };

  pagerList.addEventListener('click', e => {
    const b = e.target.closest('.pager__btn');
    if (b) render(+b.dataset.i);
  });
  $$('.pager').forEach(b => b.addEventListener('click', () => {
    render((active + +b.dataset.step + PROJECTS.length) % PROJECTS.length);
  }));
  render(0);

  /* ── 08 · stack grid ───────────────────────────────────── */

  $('#stackGrid').innerHTML = STACK.map(g => `
    <div class="stack__cell">
      <span class="stack__no">${g.no}</span>
      <h4>${g.title}</h4>
      <ul>${g.items.map(i => `<li>${i}</li>`).join('')}</ul>
    </div>`).join('');

  /* ── 09 · copy + pending links + toast ─────────────────── */

  const toast = $('#toast');
  let toastTimer;
  const say = msg => {
    toast.textContent = msg;
    toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-on'), 1900);
  };

  document.addEventListener('click', async e => {
    const c = e.target.closest('.copy');
    if (c) {
      try { await navigator.clipboard.writeText(c.dataset.copy); say('copied → ' + c.dataset.copy); }
      catch { say('copy blocked — select manually'); }
      return;
    }
    const pending = e.target.closest('[data-pending]');
    if (pending) { e.preventDefault(); say('link not wired yet'); }
  });

  /* ── 10 · command palette ──────────────────────────────── */

  const palette = $('#palette'), pInput = $('#paletteInput'), pList = $('#paletteList');

  const COMMANDS = [
    ...sections.map(s => ({ label: `Go to ${s.file}`, hint: 'SECTION', run: () => location.hash = s.el.id })),
    { label: 'Toggle theme', hint: 'VIEW', run: () => themeBtn.click() },
    { label: 'Copy email address', hint: 'CONTACT', run: () => $('.copy').click() },
    { label: 'Next project', hint: 'PROJECTS', run: () => { location.hash = 'projects'; render((active + 1) % PROJECTS.length); } },
    { label: 'Jump to top', hint: 'NAV', run: () => scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' }) }
  ];

  let pShown = [], pSel = 0;

  const drawPalette = () => {
    const q = pInput.value.trim().toLowerCase();
    pShown = COMMANDS.filter(c => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q));
    pSel = Math.min(pSel, Math.max(0, pShown.length - 1));
    pList.innerHTML = pShown.length
      ? pShown.map((c, i) => `<li role="option" aria-selected="${i === pSel}" class="${i === pSel ? 'is-sel' : ''}" data-i="${i}">${c.label}<em>${c.hint}</em></li>`).join('')
      : '<li><span style="opacity:.5">no matching command</span></li>';
  };

  const openPalette = () => {
    palette.hidden = false;
    pInput.value = ''; pSel = 0; drawPalette(); pInput.focus();
  };
  const closePalette = () => { palette.hidden = true; };
  const runPalette = i => {
    const cmd = pShown[i];
    if (!cmd) return;
    closePalette();
    cmd.run();
  };

  $('#paletteBtn').addEventListener('click', openPalette);
  pInput.addEventListener('input', () => { pSel = 0; drawPalette(); });
  pList.addEventListener('click', e => {
    const li = e.target.closest('li[data-i]');
    if (li) runPalette(+li.dataset.i);
  });
  palette.addEventListener('click', e => { if (e.target === palette) closePalette(); });

  addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); palette.hidden ? openPalette() : closePalette(); return; }
    if (palette.hidden) return;
    if (e.key === 'Escape') { closePalette(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); pSel = (pSel + 1) % pShown.length; drawPalette(); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); pSel = (pSel - 1 + pShown.length) % pShown.length; drawPalette(); }
    if (e.key === 'Enter')     { e.preventDefault(); runPalette(pSel); }
  });

  /* ── 11 · keyboard shortcuts ───────────────────────────── */

  addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey || !palette.hidden) return;
    const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);
    if (typing) return;
    // arrows only page the browser while the projects section is on screen
    const box = $('#projects').getBoundingClientRect();
    const inView = box.top < innerHeight * 0.75 && box.bottom > innerHeight * 0.25;
    if (inView && e.key === 'ArrowRight') render((active + 1) % PROJECTS.length);
    if (inView && e.key === 'ArrowLeft')  render((active - 1 + PROJECTS.length) % PROJECTS.length);
    if (e.key.toLowerCase() === 't') themeBtn.click();
  });

  console.log('%c SOORYA S JOSHI ', 'background:#14140F;color:#EFEBE2;font-weight:700;padding:4px 8px');
  console.log('%c hand-built. no framework. say hi → sooryasjoshi@gmail.com', 'color:#C2341D');
})();
