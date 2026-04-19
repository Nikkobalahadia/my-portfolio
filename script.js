/* ============================================================
   NIKKO BALAHADIA — PORTFOLIO SCRIPT
   Features: Custom Cursor, Navbar, Typing Animation,
             Scroll Reveal, Carousel, Skill Bars,
             Project Filter, Dark Mode, Contact Form
   ============================================================ */

'use strict';

/* ---- UTILS ---- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

(function initCursor() {
  const cursor = $('#cursor');
  const follower = $('#cursorFollower');
  if (!cursor || !follower) return;

  window.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    follower.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
  });

  $$('a, button, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('active'));
    el.addEventListener('mouseleave', () => follower.classList.remove('active'));
  });
})();

window.addEventListener('scroll', () => {
  const filled = Math.min(100, window.scrollY / 5);
  document.querySelector('.accent-line').style.setProperty('--fill', `${filled}%`);
});


/* ============================================================
   2. NAVBAR — Scroll Effect & Active Links
   ============================================================ */
(function initNavbar() {
  const navbar   = $('#navbar');
  const links    = $$('.nav-link');
  const hamburger = $('#hamburger');
  const navLinks  = $('#navLinks');

  // Scrolled state
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveLink();
  }, { passive: true });

  // Hamburger toggle
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      navLinks?.classList.remove('open');
    });
  });

  // Active link on scroll
  function updateActiveLink() {
    const sections = $$('section[id]');
    const scrollY  = window.scrollY + 100;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = $(`.nav-link[href="#${id}"]`);

      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < top + height);
      }
    });
  }

  updateActiveLink();
})();

/* ============================================================
   3. TYPING ANIMATION
   ============================================================ */
(function initTyping() {
  const el = $('#typingText');
  if (!el) return;

  const phrases = [
    'Aspiring Developer & System Builder',
    'PHP & MySQL Backend',
    'Windows Forms App Developer',
    'Web UI Enthusiast',
    'Problem Solver with Code',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let deleting    = false;
  let paused      = false;

  function type() {
    if (paused) return;

    const current = phrases[phraseIndex];

    if (!deleting) {
      el.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        paused = true;
        setTimeout(() => { deleting = true; paused = false; type(); }, 2200);
        return;
      }
      setTimeout(type, 60);
    } else {
      el.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
      setTimeout(type, 35);
    }
  }

  type();
})();

/* ============================================================
   4. SCROLL REVEAL
   ============================================================ */
(function initScrollReveal() {
  const reveals = $$('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children in the same parent
        const siblings = $$('.reveal', entry.target.parentElement);
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = (idx * 0.07) + 's';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => observer.observe(el));
})();

/* ============================================================
   5. TECH STACK CAROUSEL
   ============================================================ */


/* ============================================================
   6. SKILL BARS — Animate when in view
   ============================================================ */
(function initSkillBars() {
  const fills = $$('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill  = entry.target;
        const width = fill.dataset.width || '0';
        fill.style.width = width + '%';
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.4 });

  fills.forEach(f => observer.observe(f));
})();

/* ============================================================
   7. PROJECT FILTER
   ============================================================ */
(function initFilter() {
  const buttons = $$('.filter-btn');
  const cards   = $$('.project-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const cats = card.dataset.category || '';
        const show = filter === 'all' || cats.includes(filter);

        if (show) {
          card.classList.remove('hidden');
          // Tiny stagger re-reveal
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity    = '1';
            card.style.transform  = 'none';
          }, 30);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ============================================================
   8. DARK / LIGHT THEME TOGGLE
   ============================================================ */
(function initTheme() {
  const toggle  = $('#themeToggle');
  const iconEl  = toggle?.querySelector('.theme-icon');
  const html    = document.documentElement;

  // Load saved preference
  const saved = localStorage.getItem('theme') || 'dark';
  setTheme(saved);

  toggle?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (iconEl) iconEl.textContent = theme === 'dark' ? '☀' : '🌙';
  }
})();

/* ============================================================
   9. CONTACT FORM (Updated for Auto-Reply)
   ============================================================ */
(function initContactForm() {
  const form    = $('#contactForm');
  const success = $('#formSuccess');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const btnSpan = submitBtn.querySelector('span');
    
    submitBtn.disabled = true;
    btnSpan.textContent = 'Sending...';

    const serviceID = 'service_h0ak2sj';
    const myTemplate = 'template_vthm26p'; 
    // REPLACE THIS with your 2nd Template ID from the dashboard
    const replyTemplate = 'template_4ugxzts'; 

    // Send notification to YOU
    const sendToMe = emailjs.sendForm(serviceID, myTemplate, this);
    
    // Send auto-reply to SENDER
    const sendToUser = emailjs.sendForm(serviceID, replyTemplate, this);

    Promise.all([sendToMe, sendToUser])
      .then(() => {
        form.reset();
        success?.classList.add('visible');
        setTimeout(() => success?.classList.remove('visible'), 5000);
      })
      .catch((error) => {
        alert("Error sending message: " + JSON.stringify(error));
        console.error("EmailJS Error:", error);
      })
      .finally(() => {
        submitBtn.disabled = false;
        btnSpan.textContent = 'Send Message';
      });
  });
})();

/* ============================================================
   10. SMOOTH SCROLL FOR ALL ANCHOR LINKS
   ============================================================ */
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = $(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 68; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ============================================================
   11. HERO STATS COUNT-UP ANIMATION
   ============================================================ */
(function initCountUp() {
  const stats = $$('.stat-num');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el   = entry.target;
      const text = el.textContent.trim();
      const num  = parseInt(text);
      if (isNaN(num)) return;

      let start = 0;
      const end      = num;
      const suffix   = text.replace(/[0-9]/g, '');
      const duration = 1000;
      const step     = 16;
      const steps    = duration / step;
      const inc      = end / steps;

      const timer = setInterval(() => {
        start = Math.min(start + inc, end);
        el.textContent = Math.floor(start) + suffix;
        if (start >= end) clearInterval(timer);
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.8 });

  stats.forEach(s => observer.observe(s));
})();