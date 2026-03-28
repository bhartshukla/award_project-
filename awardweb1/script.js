gsap.registerPlugin(ScrollTrigger);

/* ── CURSOR ── */
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
const cursorText = document.getElementById('cursor-text');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
gsap.ticker.add(() => {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  gsap.set(dot, { x: mx, y: my });
  gsap.set(ring, { x: rx, y: ry });
  gsap.set(cursorText, { x: mx, y: my });
});

document.querySelectorAll('a, button, .service-card, .process-item, .testimonial-card').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ── PROGRESS BAR ── */
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = pct + '%';
});

/* ── HERO CANVAS DOT GRID ── */
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let dots = [], W, H, mouseX = -1000, mouseY = -1000;

function resizeCanvas() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
  initDots();
}

function initDots() {
  dots = [];
  const spacing = 44;
  for (let x = 0; x < W; x += spacing) {
    for (let y = 0; y < H; y += spacing) {
      dots.push({ x, y, ox: x, oy: y, vx: 0, vy: 0 });
    }
  }
}

function animDots() {
  ctx.clearRect(0, 0, W, H);
  for (const d of dots) {
    const dx = d.x - mouseX, dy = d.y - mouseY;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const force = Math.max(0, 80 - dist) / 80;
    const tx = d.ox + (dx / (dist || 1)) * force * 28;
    const ty = d.oy + (dy / (dist || 1)) * force * 28;
    d.x += (tx - d.x) * 0.15;
    d.y += (ty - d.y) * 0.15;
    const alpha = 0.08 + force * 0.35;
    const size = 1.2 + force * 2.5;
    ctx.beginPath();
    ctx.arc(d.x, d.y, size, 0, Math.PI * 2);
    ctx.fillStyle = force > 0.1 ? `rgba(200,255,0,${alpha})` : `rgba(245,242,238,${alpha})`;
    ctx.fill();
  }
  requestAnimationFrame(animDots);
}

document.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
animDots();

/* ── LOADER ── */
const bar = document.getElementById('loaderBar');
const count = document.getElementById('loaderCount');
const status = document.getElementById('loaderStatus');
const letters = ['l1','l2','l3','l4','l5'].map(id => document.getElementById(id));
const statuses = ['Initializing…', 'Loading assets…', 'Brewing creativity…', 'Ready!'];

const tl = gsap.timeline();
tl.to(letters, { y: '0%', duration: 0.9, stagger: 0.08, ease: 'power4.out' })
  .to({ val: 0 }, {
    val: 100, duration: 1.8, ease: 'power2.inOut',
    onUpdate: function() {
      const v = Math.round(this.targets()[0].val);
      count.textContent = String(v).padStart(3, '0');
      gsap.set(bar, { width: v + '%' });
      const si = Math.floor(v / 33);
      if (statuses[si]) status.textContent = statuses[si];
    }
  }, '<0.4')
  .to(letters, { y: '-110%', stagger: 0.06, duration: 0.6, ease: 'power3.in', delay: 0.3 })
  .to('#loader', { yPercent: -100, duration: 0.9, ease: 'power3.inOut' }, '<0.1')
  .to('nav', { opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.4')
  .to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
  .to('.hero-h1 .line span', { y: '0%', duration: 1, stagger: 0.1, ease: 'power4.out' }, '-=0.4')
  .to('.hero-bottom', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
  .to('.scroll-hint', { opacity: 1, duration: 0.5 }, '-=0.2');

/* ── NAV SCROLL ── */
const nav = document.getElementById('mainNav');
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > 80) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
  lastY = y;
});

/* ── REVEAL ON SCROLL ── */
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); }
  });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

/* ── WORK HOVER IMAGE ── */
const gradients = [
  'linear-gradient(135deg, #C8FF00 0%, #1a1a1a 100%)',
  'linear-gradient(135deg, #FF4D1C 0%, #050505 100%)',
  'linear-gradient(135deg, #C8FF00 10%, #050505 100%)',
  'linear-gradient(135deg, #FF4D1C 0%, #1a1a1a 100%)',
  'linear-gradient(135deg, #C8FF00 0%, #FF4D1C 100%)',
];
const hoverEl = document.getElementById('workHoverImg');
const hoverIn = document.getElementById('workHoverImgInner');

document.querySelectorAll('.work-item').forEach((item, i) => {
  item.addEventListener('mouseenter', () => {
    hoverIn.style.background = gradients[i];
    hoverEl.classList.add('active');
  });
  item.addEventListener('mouseleave', () => hoverEl.classList.remove('active'));
  item.addEventListener('mousemove', e => {
    gsap.to(hoverEl, { x: e.clientX + 24, y: e.clientY - 120, duration: 0.45, ease: 'power3.out' });
  });
});

/* ── COUNTER ANIMATION (numbers strip) ── */
const numberItems = document.querySelectorAll('.number-val[data-target]');
const numObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.target);
    const suffix = el.textContent.replace(/[0-9]/g, '').trim();
    gsap.to({ val: 0 }, {
      val: target, duration: 1.8, ease: 'power3.out',
      onUpdate: function() {
        el.innerHTML = Math.round(this.targets()[0].val) + suffix;
      }
    });
    numObserver.unobserve(el);
  });
}, { threshold: 0.5 });
numberItems.forEach(el => numObserver.observe(el));

/* ── HERO STAT COUNTER ── */
document.querySelectorAll('.hero-stat-num').forEach(el => {
  const target = parseInt(el.dataset.target);
  const plus = el.querySelector('.plus');
  const pct = el.querySelector('.pct');
  const suffix = plus ? '+' : pct ? '%' : '';
  setTimeout(() => {
    gsap.to({ val: 0 }, {
      val: target, duration: 1.8, ease: 'power3.out', delay: 2.4,
      onUpdate: function() {
        el.innerHTML = Math.round(this.targets()[0].val) + `<span class="${plus ? 'plus' : 'pct'}">${suffix}</span>`;
      }
    });
  }, 0);
});

/* ── TESTIMONIAL DRAG ── */
const wrap = document.getElementById('testiWrap');
let isDragging = false, startX = 0, scrollLeft = 0;
wrap.addEventListener('mousedown', e => { isDragging = true; startX = e.pageX; scrollLeft = wrap.scrollLeft; wrap.style.cursor = 'grabbing'; });
document.addEventListener('mouseup', () => { isDragging = false; wrap.style.cursor = 'grab'; });
wrap.addEventListener('mousemove', e => {
  if (!isDragging) return;
  e.preventDefault();
  wrap.scrollLeft = scrollLeft - (e.pageX - startX) * 1.4;
});

/* ── HERO ORB PARALLAX ── */
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth - 0.5);
  const y = (e.clientY / window.innerHeight - 0.5);
  gsap.to('.hero-orb-1', { x: x * 30, y: y * 30, duration: 1.8, ease: 'power1.out' });
  gsap.to('.hero-orb-2', { x: -x * 20, y: -y * 20, duration: 1.8, ease: 'power1.out' });
  gsap.to('.hero-orb-3', { x: x * 15, y: y * 15, duration: 2, ease: 'power1.out' });
});

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ── PROCESS ITEM HOVER ── */
document.querySelectorAll('.process-item').forEach(item => {
  item.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  item.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});
