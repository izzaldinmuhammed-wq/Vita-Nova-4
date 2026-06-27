// Vita Nova — interactions

(function () {
  'use strict';

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const fill = document.getElementById('scrollProgressFill');
  function updateProgress() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    if (fill) fill.style.width = pct + '%';
  }

  const floating = document.getElementById('floatingCta');
  function updateFloating() {
    if (!floating) return;
    if (window.scrollY > 600) floating.classList.add('visible');
    else floating.classList.remove('visible');
  }

  window.addEventListener('scroll', () => {
    updateProgress();
    updateFloating();
  }, { passive: true });
  updateProgress();
  updateFloating();

  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  const themeBtn = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('vn-theme');
  if (savedTheme === 'dark') root.setAttribute('data-theme', 'dark');

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      if (isDark) {
        root.removeAttribute('data-theme');
        localStorage.setItem('vn-theme', 'light');
      } else {
        root.setAttribute('data-theme', 'dark');
        localStorage.setItem('vn-theme', 'dark');
      }
    });
  }

  const langBtn = document.querySelector('[data-lang-toggle]');
  const langLabel = document.querySelector('[data-lang-label]');
  let lang = 'en';
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      lang = lang === 'en' ? 'ar' : 'en';
      if (lang === 'ar') {
        root.setAttribute('dir', 'rtl');
        root.setAttribute('lang', 'ar');
        if (langLabel) langLabel.textContent = 'English';
      } else {
        root.setAttribute('dir', 'ltr');
        root.setAttribute('lang', 'en');
        if (langLabel) langLabel.textContent = 'العربية';
      }
    });
  }

  const form = document.querySelector('.contact-form');
  const note = form ? form.querySelector('.form-note') : null;
  if (form && note) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const school = data.get('school');
      const name = data.get('name');
      const email = data.get('email');
      if (!school || !name || !email) {
        note.textContent = 'Please fill in school, name, and email.';
        note.style.color = '#ff8a8a';
        return;
      }
      note.textContent = "Thanks — we'll be in touch within one working day.";
      note.style.color = '#b6e3a8';
      form.reset();
    });
  }

  const canvas = document.getElementById('heroParticles');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let raf;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function spawn() {
      const rect = canvas.getBoundingClientRect();
      const count = Math.min(40, Math.floor(rect.width / 20));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          r: Math.random() * 1.6 + 0.4,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          a: Math.random() * 0.5 + 0.2
        });
      }
    }

    function tick() {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      const isDark = root.getAttribute('data-theme') === 'dark';
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > rect.width) p.vx *= -1;
        if (p.y < 0 || p.y > rect.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(216, 178, 105, ${p.a})`
          : `rgba(184, 137, 61, ${p.a})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    }

        ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    }

    function init() {
      resize();
      spawn();
      cancelAnimationFrame(raf);
      tick();
    }
    init();
    window.addEventListener('resize', init);
  }
})();
