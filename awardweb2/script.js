
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  CustomEase.create("hero", "0.33, 1, 0.68, 1");
  
  // Loader
  let loadPercent = 0;
  const fillEl = document.getElementById('preloaderFill');
  const percentEl = document.getElementById('preloaderPercent');
  const preloaderDiv = document.getElementById('preloader');
  const preloaderTextSpan = document.getElementById('preloaderText');
  const interval = setInterval(() => {
    loadPercent += Math.floor(Math.random() * 12) + 3;
    if (loadPercent >= 100) { loadPercent = 100; clearInterval(interval); }
    fillEl.style.width = loadPercent + '%';
    percentEl.innerText = loadPercent + '%';
    if (loadPercent === 100) {
      gsap.to(preloaderTextSpan, { y: -50, opacity: 0, duration: 0.5 });
      gsap.to(preloaderDiv, { yPercent: -100, duration: 1.4, ease: "power4.inOut", onComplete: () => { preloaderDiv.style.display = 'none'; initSite(); } });
    }
  }, 50);
  
  function initSite() {
    // Cursor
    const dot = document.getElementById('cursorDot'), ring = document.getElementById('cursorRing');
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`; });
    function smoothRing() { ringX += (mouseX - ringX) * 0.12; ringY += (mouseY - ringY) * 0.12; ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`; requestAnimationFrame(smoothRing); }
    smoothRing();
    const interactiveElements = document.querySelectorAll('a, button, .work-card, .pricing-card, .btn');
    interactiveElements.forEach(el => { el.addEventListener('mouseenter', () => document.body.classList.add('hover-active')); el.addEventListener('mouseleave', () => document.body.classList.remove('hover-active')); });
    
    // Progress bar
    window.addEventListener('scroll', () => { const winScroll = document.documentElement.scrollTop, height = document.documentElement.scrollHeight - window.innerHeight, scrolled = (winScroll / height) * 100; document.getElementById('progressBar').style.width = scrolled + '%'; });
    
    // Hero text reveal
    gsap.fromTo(".hero-title .word", { y: "110%", opacity: 0 }, { y: "0%", opacity: 1, duration: 1.2, stagger: 0.08, ease: "hero", delay: 0.5 });
    gsap.fromTo(".hero-badge", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.8 });
    gsap.fromTo(".hero-desc span", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, delay: 1.2 });
    
    // Nav scroll
    ScrollTrigger.create({ start: "top -80", onUpdate: (self) => { document.getElementById('navbar').classList.toggle('scrolled', self.progress > 0); } });
    
    // Counter animation
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => { const target = parseInt(counter.dataset.count); ScrollTrigger.create({ trigger: counter, start: "top 85%", once: true, onEnter: () => { let current = 0; const update = setInterval(() => { current += Math.ceil(target / 45); if (current >= target) { counter.innerText = target + (counter.dataset.suffix || ''); clearInterval(update); } else counter.innerText = current + (counter.dataset.suffix || ''); }, 30); } }); });
    
    // Horizontal scroll work
    const track = document.getElementById('horizontalTrack');
    let scrollWidth = track.scrollWidth - window.innerWidth;
    gsap.to(track, { x: -scrollWidth, ease: "none", scrollTrigger: { trigger: "#work", start: "top top", end: () => "+=" + scrollWidth, scrub: 1.5, pin: true, anticipatePin: 1 } });
    
    // Interactive Canvas (particle system)
    const expCanvas = document.getElementById('interactiveCanvas');
    if (expCanvas) {
      const ctxExp = expCanvas.getContext('2d');
      let width, height, particlesExp = [];
      function resizeExp() { width = expCanvas.clientWidth; height = expCanvas.clientHeight; expCanvas.width = width; expCanvas.height = height; initParticles(); }
      function initParticles() { particlesExp = []; for (let i = 0; i < 180; i++) { particlesExp.push({ x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - 0.5) * 0.7, vy: (Math.random() - 0.5) * 0.7, radius: Math.random() * 2 + 1.2 }); } }
      let mouseXExp = width/2, mouseYExp = height/2;
      expCanvas.addEventListener('mousemove', (e) => { const rect = expCanvas.getBoundingClientRect(); mouseXExp = e.clientX - rect.left; mouseYExp = e.clientY - rect.top; });
      function drawExp() { if (!ctxExp) return; ctxExp.clearRect(0, 0, width, height); ctxExp.fillStyle = '#030304'; ctxExp.fillRect(0, 0, width, height); particlesExp.forEach(p => { const dx = p.x - mouseXExp, dy = p.y - mouseYExp, dist = Math.hypot(dx, dy); if (dist < 110) { p.vx += dx * 0.008; p.vy += dy * 0.008; } p.vx *= 0.99; p.vy *= 0.99; p.x += p.vx; p.y += p.vy; if (p.x < 0) p.x = width; if (p.x > width) p.x = 0; if (p.y < 0) p.y = height; if (p.y > height) p.y = 0; ctxExp.beginPath(); ctxExp.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctxExp.fillStyle = `rgba(204, 255, 0, ${0.5 + Math.sin(Date.now() * 0.002) * 0.1})`; ctxExp.fill(); }); requestAnimationFrame(drawExp); }
      window.addEventListener('resize', () => { resizeExp(); });
      resizeExp(); drawExp();
    }
    
    // Parallax and Stagger Animations
    gsap.utils.toArray('.pricing-card').forEach((card, i) => { gsap.fromTo(card, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, delay: i * 0.1, scrollTrigger: { trigger: card, start: "top 85%", once: true } }); });
    gsap.fromTo('.work-card', { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 1, stagger: 0.12, scrollTrigger: { trigger: "#work", start: "top 70%", once: true } });
    
    // Smooth link
    document.querySelectorAll('a[href^="#"]').forEach(anchor => { anchor.addEventListener('click', function(e) { const href = this.getAttribute('href'); if (href !== "#" && href !== "") { const target = document.querySelector(href); if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); } } }); });
  }
