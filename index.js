/* ── CURSOR ── */
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let cx = 0, cy = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; });
(function loop() {
    rx += (cx - rx) * .14;
    ry += (cy - ry) * .14;
    cur.style.left = cx + 'px';
    cur.style.top = cy + 'px';
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
})();

/* ── NAVBAR SHRINK ── */
/* ── SIZNING MAVJUD JS — O'ZGARISHSIZ ── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => nav.classList.toggle('shrink', scrollY > 50));
 
  /* ── YANGI: Burger / Drawer toggle ── */
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('drawer');
  let isOpen   = false;
 
  function toggleMenu(force) {
    isOpen = force !== undefined ? force : !isOpen;
 
    burger.classList.toggle('open', isOpen);
    drawer.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    drawer.setAttribute('aria-hidden', !isOpen);
 
    /* body scroll lock when drawer is open */
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
 
  burger.addEventListener('click', () => toggleMenu());
 
  /* Close on drawer link click */
  drawer.querySelectorAll('.drawer-link, .drawer-cta').forEach(el => {
    el.addEventListener('click', () => toggleMenu(false));
  });
 
  /* Close on Escape key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) toggleMenu(false);
  });
 
  /* Close on outside click */
  document.addEventListener('click', e => {
    if (isOpen && !nav.contains(e.target) && !drawer.contains(e.target)) {
      toggleMenu(false);
    }
  });

/* ── PARTICLE CANVAS ── */
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
let W, H, pts = [];
const COLS = 18, ROWS = 10;

function resize() {
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;
    pts = [];
    for (let i = 0; i < COLS; i++) {
        for (let j = 0; j < ROWS; j++) {
            pts.push({
                ox: (i / (COLS - 1)) * W,
                oy: (j / (ROWS - 1)) * H,
                x: (i / (COLS - 1)) * W,
                y: (j / (ROWS - 1)) * H,
                vx: 0, vy: 0,
                a: Math.random() * .3 + .08
            });
        }
    }
}

let mx = -9999, my = -9999;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
        const dx = p.x - mx, dy = p.y - my;
        const d = Math.sqrt(dx * dx + dy * dy);
        const f = Math.max(0, 110 - d) / 110;
        p.vx += (dx / (d || 1)) * f * 2 - (p.x - p.ox) * .05;
        p.vy += (dy / (d || 1)) * f * 2 - (p.y - p.oy) * .05;
        p.vx *= .85; p.vy *= .85;
        p.x += p.vx; p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(77,132,255,${p.a})`;
        ctx.fill();
    });

    /* connections */
    for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
            const a = pts[i], b = pts[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 100) {
                ctx.beginPath();
                ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = `rgba(77,132,255,${(1 - d / 100) * .055})`;
                ctx.lineWidth = .7;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(draw);
}

resize();
draw();
addEventListener('resize', resize);

/* ── COUNTERS ── */
const cObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target, to = +el.dataset.to;
        let n = 0;
        const t = setInterval(() => {
            n = Math.min(n + to / 55, to);
            el.textContent = Math.floor(n);
            if (n >= to) clearInterval(t);
        }, 16);
        cObs.unobserve(el);
    });
}, { threshold: .5 });
document.querySelectorAll('.ctr').forEach(el => cObs.observe(el));

/* ── SCROLL REVEAL ── */
const rObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => rObs.observe(el));

/* ── MAGNETIC BUTTONS ── */
document.querySelectorAll('.btn-hero-primary, .btn-nav, .btn-hero-ghost').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * .22;
        const y = (e.clientY - r.top - r.height / 2) * .22;
        btn.style.transform = `translate(${x}px,${y}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
});

/* ── TILT on stat cells ── */
document.querySelectorAll('.stat-cell').forEach(el => {
    el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - .5) * 10;
        const y = ((e.clientY - r.top) / r.height - .5) * 10;
        el.style.transform = `perspective(400px) rotateX(${-y}deg) rotateY(${x}deg)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = '');
});

// Result counter effect
const counters = document.querySelectorAll('.counter');
  let started = false;

  function runCounter() {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let count = 0;

      const speed = target / 80;

      const updateCount = () => {
        count += speed;

        if (count < target) {
          counter.innerText = Math.floor(count);
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = target + (target === 100 ? '%' : '+');
        }
      };

      updateCount();
    });
  }

  function isInViewport() {
    const section = document.querySelector('.stats-section');
    const rect = section.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  window.addEventListener('scroll', () => {
    if (isInViewport() && !started) {
      runCounter();
      started = true;
    }
  });

// Process effect
/* Click any card → becomes active */
  document.querySelectorAll('.process-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.process-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  /* ═══════════════════════════════════════════════════════════
   RYSOFT — UNIVERSAL SCROLL ANIMATION
   Barcha card, col, row, section elementlariga qo'llanadi.
   </body> dan oldin ulang. Mavjud hech narsa o'zgarmaydi.
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────
     YORDAMCHI: elementni "yashirin" holatga o'tkazish
     va observer orqali "ko'rinadigan" qilish
  ───────────────────────────────────────────────────────── */
  function hide(el, tx, ty, delay) {
    el.style.opacity        = '0';
    el.style.transform      = `translate(${tx}px, ${ty}px)`;
    el.style.transition     = `opacity .62s ${delay}s ease, transform .62s ${delay}s ease`;
    el.style.willChange     = 'opacity, transform';
  }

  function show(el) {
    el.style.opacity    = '1';
    el.style.transform  = 'translate(0,0)';
  }

  /* bitta kuzatuvchi — unobserve qiladi (bir martada) */
  function makeObserver(threshold) {
    return new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          show(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: threshold || 0.1 }
    );
  }

  /* hero ichida emasligini tekshir */
  function notInHero(el) {
    return !el.closest('#hero');
  }

  /* ─────────────────────────────────────────────────────────
     0. Hero ichidagi CSS animatsiyalari qo'lda ishlatiladi —
        bu script ularga tegmaydi.
  ───────────────────────────────────────────────────────── */

  /* ─────────────────────────────────────────────────────────
     1. SECTION SARLAVHALARI
        .section-title  .services-title  .project-title
        .result-title   .process-title   .s-title
        .s-label        .s-sub
  ───────────────────────────────────────────────────────── */
  const titleObs = makeObserver(0.15);

  document.querySelectorAll(
    '.section-title, .services-title, .project-title, ' +
    '.result-title, .process-title, .s-title, ' +
    '.s-label, .s-sub, .now-start-title, .now-start-sub'
  ).forEach((el) => {
    if (!notInHero(el)) return;
    hide(el, 0, 22, 0);
    titleObs.observe(el);
  });

  /* ─────────────────────────────────────────────────────────
     2. BARCHA [class*="col-"] ELEMENTLAR
        Bootstrap col larni stagger bilan chiqaradi
  ───────────────────────────────────────────────────────── */
  const colObs = makeObserver(0.08);

  /* Bir xil parent ichidagi collarni stagger bilan yo'lga qo'yish */
  document.querySelectorAll(
    '.services .row, .project .row, .stats-section .row, ' +
    '.result .row, .footer-body .row, footer .row'
  ).forEach((row) => {
    /* row o'zi ham hero ichida bo'lmasin */
    if (!notInHero(row)) return;

    const cols = row.querySelectorAll('[class*="col-"], [class^="col"]');
    cols.forEach((col, i) => {
      /* y pastdan, har biri 90ms kech */
      hide(col, 0, 28, i * 0.09);
      colObs.observe(col);
    });
  });

  /* ─────────────────────────────────────────────────────────
     3. SERVICE CARDS
  ───────────────────────────────────────────────────────── */
  const serviceObs = makeObserver(0.08);

  document.querySelectorAll('.service-card').forEach((card, i) => {
    hide(card, 0, 26, i * 0.1);
    serviceObs.observe(card);
  });

  /* ─────────────────────────────────────────────────────────
     4. PROJECT CARDS
  ───────────────────────────────────────────────────────── */
  const projectObs = makeObserver(0.08);

  document.querySelectorAll('.project-card').forEach((card, i) => {
    hide(card, 0, 26, i * 0.1);
    projectObs.observe(card);
  });

  /* ─────────────────────────────────────────────────────────
     5. STATS CARDS  (.stats-card)
  ───────────────────────────────────────────────────────── */
  const statsCardObs = makeObserver(0.1);

  document.querySelectorAll('.stats-card').forEach((card, i) => {
    hide(card, 0, 24, i * 0.1);
    statsCardObs.observe(card);
  });

  /* ─────────────────────────────────────────────────────────
     6. TEAM CARDS  — CSS animatsiyasi bor, lekin
        scroll triggerga ham bog'laymiz
  ───────────────────────────────────────────────────────── */
  const teamObs = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.team-card').forEach((card) => {
          card.style.animationPlayState = 'running';
        });
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.06 }
  );

  const teamGrid = document.querySelector('.team-grid');
  if (teamGrid) {
    teamGrid.querySelectorAll('.team-card').forEach((c) => {
      c.style.animationPlayState = 'paused';
    });
    teamObs.observe(teamGrid);
  }

  /* ─────────────────────────────────────────────────────────
     7. PROCESS ITEMS + ARROWS — CSS animatsiyasi bor,
        scroll triggerga bog'laymiz
  ───────────────────────────────────────────────────────── */
  const processObs = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.process-item, .arrow').forEach((el) => {
          el.style.animationPlayState = 'running';
        });
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.08 }
  );

  const processTrack = document.querySelector('.process-track');
  if (processTrack) {
    processTrack.querySelectorAll('.process-item, .arrow').forEach((el) => {
      el.style.animationPlayState = 'paused';
    });
    processObs.observe(processTrack);
  }

  /* ─────────────────────────────────────────────────────────
     8. RESULT .col-11 + NOW-START .container
  ───────────────────────────────────────────────────────── */
  const resultObs = makeObserver(0.1);

  document.querySelectorAll('.result .col-11').forEach((el) => {
    hide(el, 0, 30, 0);
    resultObs.observe(el);
  });

  document.querySelectorAll('.now-start .container > *').forEach((el, i) => {
    hide(el, 0, 24, i * 0.12);
    resultObs.observe(el);
  });

  /* ─────────────────────────────────────────────────────────
     9. FOOTER — har bir col chapdan/o'ngdan
  ───────────────────────────────────────────────────────── */
  const footerObs = makeObserver(0.05);

  document.querySelectorAll('footer [class*="col-"]').forEach((col, i) => {
    /* juft indexlar chapdan, toq indexlar o'ngdan */
    const tx = i % 2 === 0 ? -20 : 20;
    hide(col, tx, 16, i * 0.1);
    footerObs.observe(col);
  });

  /* footer bottom bar */
  const fBottom = document.querySelector('.f-bottom');
  if (fBottom) {
    hide(fBottom, 0, 16, 0.2);
    footerObs.observe(fBottom);
  }

  /* ─────────────────────────────────────────────────────────
     10. PARTNER SCROLL — section o'zi fade in
  ───────────────────────────────────────────────────────── */
  const partnerObs = makeObserver(0.1);

  const partners = document.querySelector('.partners');
  if (partners) {
    const title = partners.querySelector('.section-title');
    if (title) { hide(title, 0, 20, 0); partnerObs.observe(title); }

    const scroll = partners.querySelector('.partner-scroll');
    if (scroll) { hide(scroll, 0, 16, 0.15); partnerObs.observe(scroll); }
  }

  /* ─────────────────────────────────────────────────────────
     11. MAVJUD .reveal CLASS (sizning kodingizda bor)
  ───────────────────────────────────────────────────────── */
  const revealObs = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.reveal').forEach((el) => {
    revealObs.observe(el);
  });

  /* ─────────────────────────────────────────────────────────
     12. .sr  .sr-left  .sr-right — utility classlar
  ───────────────────────────────────────────────────────── */
  const srObs = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('sr--in');
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.sr, .sr-left, .sr-right').forEach((el) => {
    srObs.observe(el);
  });

  /* ─────────────────────────────────────────────────────────
     13. STATS COUNTER — scroll da boshlanadi
         HTML: <span class="stats-number" data-target="50">0</span>
  ───────────────────────────────────────────────────────── */
  const counterObs = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.querySelectorAll(
          '.stats-number[data-target], .ctr[data-to], .stat-val [data-to]'
        ).forEach((el) => {
          const to = +(el.dataset.target || el.dataset.to || 0);
          if (!to) return;
          let n = 0;
          const step = to / 60;
          const t = setInterval(() => {
            n = Math.min(n + step, to);
            el.textContent = Math.floor(n);
            if (n >= to) clearInterval(t);
          }, 16);
        });

        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.35 }
  );

  document.querySelectorAll('.stats-section, .hero-stats').forEach((s) => {
    counterObs.observe(s);
  });

})();