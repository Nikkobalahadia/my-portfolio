/* ============================================================
   NIKKO BALAHADIA — PORTFOLIO SCRIPT
   GSAP-powered animations + clean, modular architecture
   ============================================================ */

'use strict';

/* ============================================================
   UTILS
   ============================================================ */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   1. GSAP SETUP — Register plugins once GSAP loads
   ============================================================ */
window.addEventListener('load', () => {
  // Check if GSAP is loaded
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, TextPlugin);
    initHeroAnimation();
    initScrollReveal();
    initParallaxOrbs();
    initNavbarAnimation();
    initCountUp();
  } else {
    console.error("GSAP not loaded.");
  }

  // Functional logic should run even if GSAP fails
  initContactForm();
  initSmoothScroll();
});

/* ============================================================
   2. HERO ENTRANCE ANIMATION (GSAP Timeline)
   ============================================================ */
function initHeroAnimation() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl
    .to('#heroBadge', { opacity: 1, y: 0, duration: 0.7, delay: 0.2 })
    .to('#heroLine1', { opacity: 1, y: 0, duration: 0.9 }, '-=0.3')
    .to('#heroLine2', { opacity: 1, y: 0, duration: 0.9 }, '-=0.65')
    .to('.hero-tagline', { opacity: 1, duration: 0.7 }, '-=0.4')
    .to('#heroDesc',    { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .to('#heroActions', { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
    .to('#heroStats',   { opacity: 1, y: 0, duration: 0.6 }, '-=0.35')
    .to('#scrollIndicator', { opacity: 1, duration: 0.5 }, '-=0.2');
}

/* ============================================================
   3. SCROLL REVEAL — All .gsap-reveal elements
   ============================================================ */
function initScrollReveal() {
  qsa('.gsap-reveal').forEach((el, i) => {
    // Stagger siblings in the same parent
    const siblings = qsa('.gsap-reveal', el.parentElement);
    const sibIdx   = siblings.indexOf(el);

    gsap.to(el, {
      scrollTrigger: {
        trigger:  el,
        start:    'top 88%',
        once:     true,
      },
      opacity:  1,
      y:        0,
      duration: 0.75,
      delay:    sibIdx * 0.08,
      ease:     'power2.out',
    });
  });
}

/* ============================================================
   4. PARALLAX ORBS — Subtle depth on scroll
   ============================================================ */
function initParallaxOrbs() {
  gsap.to('.orb-1', {
    scrollTrigger: { trigger: '.hero', scrub: 1.5 },
    y: -80,
    x:  30,
  });
  gsap.to('.orb-2', {
    scrollTrigger: { trigger: '.hero', scrub: 1.5 },
    y: -50,
    x: -20,
  });
}

/* ============================================================
   5. NAVBAR — Scroll state + active link tracking
   ============================================================ */
function initNavbarAnimation() {
  // Animate navbar in after hero
  gsap.from('#navbar', { y: -20, opacity: 0, duration: 0.8, delay: 1.2, ease: 'power2.out' });
}

/* ============================================================
   6. STAT COUNT-UP (GSAP)
   ============================================================ */
function initCountUp() {
  qsa('.stat-num').forEach(el => {
    const fullText = el.innerText; // e.g., "4+"
    const numMatch = fullText.match(/\d+/); // Finds the digits
    const suffix = fullText.replace(/\d+/, ''); // Keeps the "+" or other symbols
    
    if (!numMatch) return; // Skips "∞" or non-numeric stats

    const targetVal = parseInt(numMatch[0]);

    // 1. Set the initial display to 0 + suffix immediately
    el.innerText = `0${suffix}`;

    // 2. Animate the number
    gsap.to(el, {
      innerText: targetVal,
      duration: 1.5,
      snap: { innerText: 1 }, // Ensures it increments by whole numbers
      scrollTrigger: {
        trigger: el,
        start: 'top 90%', // Starts when 90% from the top of the viewport
      },
      onUpdate: function() {
        // 3. Append the suffix back during every frame of the animation
        el.innerText = Math.floor(el.innerText) + suffix;
      }
    });
  });
}

/* ============================================================
   7. CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  const cursor   = qs('#cursor');
  const follower = qs('#cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top  = `${mouseY}px`;
  });

  // Smooth follower with rAF
  (function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = `${followerX}px`;
    follower.style.top  = `${followerY}px`;
    requestAnimationFrame(animateFollower);
  })();

  // Hover state on interactive elements
  qsa('a, button, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('active'));
    el.addEventListener('mouseleave', () => follower.classList.remove('active'));
  });
})();

/* ============================================================
   8. NAVBAR — Scroll + hamburger
   ============================================================ */
(function initNavbar() {
  const navbar    = qs('#navbar');
  const hamburger = qs('#hamburger');
  const navLinks  = qs('#navLinks');
  const links     = qsa('.nav-link');

  // Scrolled class
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveLink();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Hamburger toggle
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  links.forEach(link => link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    navLinks?.classList.remove('open');
  }));

  function updateActiveLink() {
    const scrollY = window.scrollY + 100;
    qsa('section[id]').forEach(section => {
      const { offsetTop: top, offsetHeight: height, id } = section;
      const link = qs(`.nav-link[href="#${id}"]`);
      link?.classList.toggle('active', scrollY >= top && scrollY < top + height);
    });
  }

  updateActiveLink();
  onScroll();
})();

/* ============================================================
   THEME TOGGLE (Dark/Light Mode)
   ============================================================ */
(function initTheme() {
  const themeToggle = qs('#themeToggle');
  const themeIcon   = qs('.theme-icon', themeToggle);
  const html        = document.documentElement;
  
  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateIcon(savedTheme);

  themeToggle?.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme     = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    updateIcon(newTheme);
  });

  function updateIcon(theme) {
    if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☀' : '🌙';
  }
})();

/* ============================================================
   9. TYPING ANIMATION
   ============================================================ */
(function initTyping() {
  const el = qs('#typingText');
  if (!el) return;

  const phrases = [
    'Aspiring Developer & System Builder',
    'PHP & MySQL Backend',
    'Windows Forms App Developer',
    'Web UI Enthusiast',
    'Problem Solver with Code',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let paused    = false;

  function type() {
    if (paused) return;
    const current = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        paused = true;
        setTimeout(() => { deleting = true; paused = false; type(); }, 2200);
        return;
      }
      setTimeout(type, 60);
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
      setTimeout(type, 35);
    }
  }

  // Slight delay so GSAP hero reveal plays first
  setTimeout(type, 1600);
})();

/* ============================================================
   10. PROJECT FILTER — Tab pill + featured + rows
        + PROMOTE-TO-FEATURED swap on arrow click
   ============================================================ */
(function initFilter() {
  const tabs     = qsa('.proj-tab');
  const pill     = qs('#projTabPill');
  const featured = qs('#featuredProject');

  /* ── helpers ── */
  function rows() { return qsa('.proj-row'); }

  // Position the pill under the active tab
  function movePill(activeTab) {
    if (!pill || !activeTab) return;
    const tabsEl  = qs('#projTabs');
    const tabRect = activeTab.getBoundingClientRect();
    const boxRect = tabsEl.getBoundingClientRect();
    pill.style.width  = tabRect.width  + 'px';
    pill.style.height = tabRect.height + 'px';
    pill.style.transform = `translateX(${tabRect.left - boxRect.left - 4}px)`;
  }

  // Apply current filter visibility
  function applyFilter(filter) {
    const featCat  = featured?.dataset.category || '';
    const showFeat = filter === 'all' || featCat.split(' ').includes(filter);
    if (featured) {
      if (showFeat) {
        featured.classList.remove('hidden');
        gsap.fromTo(featured, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' });
      } else {
        featured.classList.add('hidden');
      }
    }
    rows().forEach((row, i) => {
      const cats = row.dataset.category || '';
      const show = filter === 'all' || cats.split(' ').includes(filter);
      if (show) {
        row.classList.remove('hidden');
        gsap.fromTo(row,
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, duration: 0.35, delay: i * 0.04, ease: 'power2.out' }
        );
      } else {
        row.classList.add('hidden');
      }
    });
  }

  function activeFilter() {
    return (qs('.proj-tab.active')?.dataset.filter) || 'all';
  }

  // Init pill position
  window.addEventListener('load',   () => movePill(qs('.proj-tab.active')));
  window.addEventListener('resize', () => movePill(qs('.proj-tab.active')));

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      movePill(tab);
      applyFilter(tab.dataset.filter);
    });
  });

  // Init pill on DOM ready
  requestAnimationFrame(() => movePill(qs('.proj-tab.active')));

  /* ── PROMOTE TO FEATURED ── */
  /*
   * When the arrow (proj-promote-btn) on any row is clicked:
   * 1. Read the clicked row's data-* attributes
   * 2. Snapshot the current featured project's data-* attributes
   * 3. Rebuild the featured card with the row's data
   * 4. Rebuild the row with the old featured data
   * 5. Animate both in/out with GSAP
   * 6. Re-apply the current filter so visibility stays consistent
   */

  function buildStatusBadge(status) {
    if (status === 'live') {
      return `<em class="status-live">Live</em>`;
    }
    return `<em style="color:var(--text-2);font-style:normal;">In Progress</em>`;
  }

  function buildFeaturedLinks(github, live) {
    let html = '';
    if (github) {
      html += `
        <a href="${github}" class="proj-feat-link" target="_blank" rel="noopener" title="Source">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          GitHub
        </a>`;
    }
    if (live) {
      html += `
        <a href="${live}" class="proj-feat-link proj-feat-link--primary" target="_blank" rel="noopener" title="Live">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Live Demo
        </a>`;
    }
    return html;
  }

  function buildRowLinks(github, live) {
    let html = '';
    if (github) {
      html += `
        <a href="${github}" class="proj-row-link" target="_blank" rel="noopener" aria-label="Source">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>`;
    }
    if (live) {
      html += `
        <a href="${live}" class="proj-row-link" target="_blank" rel="noopener" aria-label="Live">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>`;
    }
    return html;
  }

  function buildTechTags(tagsStr) {
    return tagsStr.split(',').map(t => `<span class="tech-tag">${t.trim()}</span>`).join('');
  }

  function promoteProjToFeatured(rowEl) {
    if (!featured) return;

    // ── Snapshot ROW data (incoming) — plain copy so it won't change ──
    const d = { ...rowEl.dataset };

    // ── Snapshot FEATURED data (outgoing → goes back to list) — plain copy BEFORE we mutate featured ──
    const f = { ...featured.dataset };

    /* -- Animate featured card OUT -- */
    gsap.to(featured, {
      opacity: 0, y: -20, duration: 0.3, ease: 'power2.in',
      onComplete: () => {

        /* ── Update featured card DOM ── */
        // data-* attributes
        featured.dataset.category    = d.category || '';
        featured.dataset.projId      = d.projId;
        featured.dataset.projImg     = d.projImg;
        featured.dataset.projAlt     = d.projAlt;
        featured.dataset.projIndex   = d.projIndex;
        featured.dataset.projTitle   = d.projTitle;
        featured.dataset.projDesc    = d.projDesc;
        featured.dataset.projTags    = d.projTags;
        featured.dataset.projRole    = d.projRole;
        featured.dataset.projType    = d.projType;
        featured.dataset.projStatus  = d.projStatus;
        featured.dataset.projGithub  = d.projGithub;
        featured.dataset.projLive    = d.projLive;

        // image
        const featImg = qs('.proj-feat-image img', featured);
        if (featImg) { featImg.src = d.projImg; featImg.alt = d.projAlt; }

        // links
        const featLinks = qs('.proj-feat-links', featured);
        if (featLinks) featLinks.innerHTML = buildFeaturedLinks(d.projGithub, d.projLive);

        // body
        const featIndex  = qs('.proj-feat-index',  featured);
        const featTitle  = qs('.proj-feat-title',  featured);
        const featDesc   = qs('.proj-feat-desc',   featured);
        const featTech   = qs('.project-tech',     featured);
        const detailsLis = qs('.proj-feat-details', featured);

        if (featIndex) featIndex.textContent = d.projIndex;
        if (featTitle) featTitle.innerHTML   = d.projTitle;
        if (featDesc)  featDesc.textContent  = d.projDesc;
        if (featTech)  featTech.innerHTML    = buildTechTags(d.projTags);
        if (detailsLis) {
          detailsLis.innerHTML = `
            <li><span>Role</span>${d.projRole}</li>
            <li><span>Type</span>${d.projType}</li>
            <li><span>Status</span>${buildStatusBadge(d.projStatus)}</li>
          `;
        }

        /* ── Update ROW with old featured data ── */
        rowEl.dataset.category   = f.category || '';
        rowEl.dataset.projId     = f.projId;
        rowEl.dataset.projImg    = f.projImg;
        rowEl.dataset.projAlt    = f.projAlt;
        rowEl.dataset.projIndex  = f.projIndex;
        rowEl.dataset.projTitle  = f.projTitle;
        rowEl.dataset.projDesc   = f.projDesc;
        rowEl.dataset.projTags   = f.projTags;
        rowEl.dataset.projRole   = f.projRole;
        rowEl.dataset.projType   = f.projType;
        rowEl.dataset.projStatus = f.projStatus;
        rowEl.dataset.projGithub = f.projGithub;
        rowEl.dataset.projLive   = f.projLive;

        qs('.proj-row-num', rowEl).textContent = f.projIndex;

        const rowThumbImg = qs('.proj-row-thumb img', rowEl);
        if (rowThumbImg) { rowThumbImg.src = f.projImg; rowThumbImg.alt = f.projAlt; }

        qs('.proj-row-title', rowEl).textContent = f.projTitle;
        qs('.proj-row-desc',  rowEl).textContent = f.projDesc;
        qs('.project-tech',   rowEl).innerHTML   = buildTechTags(f.projTags);

        const rowLinks = qs('.proj-row-links', rowEl);
        if (rowLinks) rowLinks.innerHTML = buildRowLinks(f.projGithub, f.projLive);

        /* ── Animate featured card IN ── */
        gsap.fromTo(featured,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
        );

        /* ── Animate row ── */
        gsap.fromTo(rowEl,
          { opacity: 0, x: -16 },
          { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }
        );

        /* ── Re-apply filter so visibility stays correct ── */
        applyFilter(activeFilter());
      }
    });

    /* Flash the row out slightly while featured swaps */
    gsap.to(rowEl, { opacity: 0, x: 16, duration: 0.25, ease: 'power2.in' });
  }

  /* Delegate arrow clicks (works even after DOM rebuilds) */
  /* Delegate clicks on the entire row (or arrow button) to promote */
  const projList = qs('#projList');
  if (projList) {
    projList.addEventListener('click', e => {
      /* Ignore clicks on external links so they still navigate */
      if (e.target.closest('a')) return;
      const row = e.target.closest('.proj-row');
      if (row) promoteProjToFeatured(row);
    });
  }
})();

/* ============================================================
   11. SKILL TERMINAL — Interactive skill inspector
   ============================================================ */
(function initSkillTerminal() {
  const SKILLS = {
    html:      { name: 'HTML5',      cat: 'Frontend',  icon: '⟨/⟩', lvl: 'Advanced',     pct: 90, desc: 'Proficient in semantic HTML5 markup — building accessible, well-structured documents that form the backbone of every project.', used: ['NAM Builders', 'Study Buddy', 'FitTracker'] },
    css:       { name: 'CSS3',       cat: 'Frontend',  icon: '{ }',  lvl: 'Advanced',     pct: 88, desc: 'Strong command of modern CSS — layouts with Grid & Flexbox, custom properties, transitions, and responsive design without frameworks.', used: ['NAM Builders', 'Study Buddy', 'All Projects'] },
    js:        { name: 'JavaScript', cat: 'Frontend',  icon: 'JS',   lvl: 'Intermediate', pct: 78, desc: 'Comfortable with vanilla JS and ES6+ — DOM manipulation, async/await, REST API integration, and interactive UI logic.', used: ['FitTracker', 'Study Buddy', 'NAM Website'] },
    bootstrap: { name: 'Bootstrap',  cat: 'Frontend',  icon: 'B',    lvl: 'Proficient',   pct: 82, desc: 'Efficient at rapid prototyping and responsive layouts using Bootstrap 5 components, grid system, and utilities.', used: ['POS SAMABACO', 'Study Buddy'] },
    php:       { name: 'PHP',        cat: 'Backend',   icon: '<?php',lvl: 'Intermediate', pct: 80, desc: 'Core backend language for all web projects — building RESTful endpoints, session management, authentication flows, and server-side logic.', used: ['NAM Builders', 'Study Buddy', 'FitTracker', 'POS System'] },
    mysql:     { name: 'MySQL',      cat: 'Backend',   icon: '🗄',   lvl: 'Intermediate', pct: 76, desc: 'Designing normalized database schemas, writing complex JOINs, stored procedures, and optimizing queries for real-world systems.', used: ['NAM Builders', 'POS SAMABACO', 'Study Buddy'] },
    git:       { name: 'Git',        cat: 'Tools',     icon: '⎇',   lvl: 'Proficient',   pct: 74, desc: 'Daily use of Git for version control — branching strategies, pull requests, commit hygiene, and collaboration workflows on GitHub.', used: ['All Projects'] },
    vscode:    { name: 'VS Code',    cat: 'Tools',     icon: '⌨',   lvl: 'Daily Driver', pct: 95, desc: 'Primary development environment — extensions, custom workspace settings, debugging tools, and keyboard-first workflow.', used: ['All Projects'] },
    figma:     { name: 'Figma',      cat: 'Tools',     icon: '◈',   lvl: 'Learning',     pct: 52, desc: 'Using Figma for wireframing and UI mockups before building — components, auto-layout, and design-to-code handoff.', used: ['NAM Website', 'Study Buddy'] },
    csharp:    { name: 'C#',         cat: 'Desktop',   icon: 'C#',   lvl: 'Intermediate', pct: 70, desc: 'Object-oriented programming with C# for desktop application development — classes, LINQ, event-driven patterns, and data binding.', used: ['FitTracker Desktop'] },
    winforms:  { name: 'WinForms',   cat: 'Desktop',   icon: '⊞',   lvl: 'Intermediate', pct: 68, desc: 'Building desktop GUIs with Windows Forms — form design, controls, database connectivity, and data visualization with Chart.js-style charts.', used: ['FitTracker Desktop'] },
  };

  const promptCmd   = qs('#promptCmd');
  const skillIcon   = qs('#skillIcon');
  const skillName   = qs('#skillName');
  const skillCat    = qs('#skillCat');
  const skillLvl    = qs('#skillLvl');
  const skillBarFill = qs('#skillBarFill');
  const skillBarPct  = qs('#skillBarPct');
  const skillDesc    = qs('#skillDesc');
  const skillUsedTags = qs('#skillUsedTags');
  const skillCard    = qs('#skillCard');

  let currentSkill = 'html';

  function loadSkill(key) {
    const s = SKILLS[key];
    if (!s) return;
    currentSkill = key;

    // Update prompt
    if (promptCmd) promptCmd.textContent = `inspect ${key}`;

    // Animate card out, swap, animate in
    gsap.to(skillCard, {
      opacity: 0, y: 8, duration: 0.15,
      onComplete: () => {
        skillIcon.textContent  = s.icon;
        skillName.textContent  = s.name;
        skillCat.textContent   = s.cat;
        skillLvl.textContent   = s.lvl;
        skillDesc.textContent  = s.desc;

        // Render used-in tags
        skillUsedTags.innerHTML = s.used.map(u => `<span class="skill-used-tag">${u}</span>`).join('');

        // Reset bar then animate
        skillBarFill.style.width = '0%';
        skillBarPct.textContent  = '0%';

        gsap.to(skillCard, { opacity: 1, y: 0, duration: 0.25 });

        // Animate bar
        const obj = { val: 0 };
        gsap.to(obj, {
          val: s.pct,
          duration: 0.7,
          delay: 0.1,
          ease: 'power2.out',
          onUpdate() {
            const v = Math.round(obj.val);
            skillBarFill.style.width = v + '%';
            skillBarPct.textContent  = v + '%';
          },
        });
      }
    });
  }

  // Wire up buttons
  qsa('.skill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      qsa('.skill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadSkill(btn.dataset.skill);
    });
  });

  // Load default on init
  loadSkill('html');
})();

/* ============================================================
   12. CONTACT FORM (EmailJS)
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault(); // This stops the page reload!

    const submitBtn = form.querySelector('button[type="submit"]');
    const btnSpan = submitBtn ? submitBtn.querySelector('span') : null;
    
    if (submitBtn) submitBtn.disabled = true;
    if (btnSpan) btnSpan.textContent = 'Sending...';

    const serviceID = 'service_h0ak2sj';
    const myTemplate = 'template_vthm26p'; 
    const replyTemplate = 'template_4ugxzts'; 

    emailjs.sendForm(serviceID, myTemplate, form)
      .then(() => {
        emailjs.sendForm(serviceID, replyTemplate, form);
        form.reset();
        if (success) {
          success.classList.add('visible');
          setTimeout(() => success.classList.remove('visible'), 5000);
        }
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        alert("Message failed to send. Check console.");
      })
      .finally(() => {
        if (submitBtn) submitBtn.disabled = false;
        if (btnSpan) btnSpan.textContent = 'Send Message';
      });
  });
}

/* ============================================================
   13. SMOOTH SCROLL
   ============================================================ */
function initSmoothScroll() {
  qsa('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === "#") return;
      const target = qs(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 68;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}