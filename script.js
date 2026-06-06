'use strict';

// ──────── LOADER ────────
const loader = document.getElementById('loader');
const body   = document.body;

body.classList.add('loading');

window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
    body.classList.remove('loading');
    // Trigger hero animations after load
    triggerHeroAnimations();
  }, 1200);
});

// ──────── CURSOR PERSONALIZADO ────────
const cursor         = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

if (cursor && cursorFollower) {
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Suave follow para o cursor maior
  const animateCursor = () => {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top  = followerY + 'px';
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  // Hover effect em elementos interativos
  const hoverTargets = document.querySelectorAll('a, button, input, select, textarea, .skill-card, .project-card');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => body.classList.remove('cursor-hover'));
  });
}

// ──────── HEADER SCROLL ────────
const header = document.getElementById('header');

const handleScroll = () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', handleScroll, { passive: true });

// ──────── NAV MOBILE ────────
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  body.style.overflow = isOpen ? 'hidden' : '';
});

// Fechar menu ao clicar em link
navMenu.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
  });
});

// Fechar ao pressionar Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu.classList.contains('open')) {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
    navToggle.focus();
  }
});

// ──────── TYPEWRITER ────────
const typewriterEl = document.querySelector('.typewriter__text');
const roles = [
  'Desenvolvedor Front-End',
  'Entusiasta de Tecnologia',
  'Editor de Vídeo',
  'Em constante evolução',
];

let roleIndex  = 0;
let charIndex  = 0;
let isDeleting = false;
let typingDelay = 120;

const type = () => {
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    charIndex--;
    typingDelay = 60;
  } else {
    charIndex++;
    typingDelay = 120;
  }

  if (typewriterEl) {
    typewriterEl.textContent = currentRole.slice(0, charIndex);
  }

  if (!isDeleting && charIndex === currentRole.length) {
    typingDelay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting  = false;
    roleIndex   = (roleIndex + 1) % roles.length;
    typingDelay = 500;
  }

  setTimeout(type, typingDelay);
};

// Inicia typewriter após o loader
setTimeout(type, 1800);

// ──────── HERO ANIMATIONS ────────
const triggerHeroAnimations = () => {
  const heroReveal = document.querySelectorAll('.hero .reveal-text');
  heroReveal.forEach(el => el.classList.add('visible'));
};

// ──────── INTERSECTION OBSERVER — scroll reveal ────────
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px',
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Skill cards com delay
document.querySelectorAll('.skill-card').forEach((card, i) => {
  card.style.setProperty('--delay', i);
  revealObserver.observe(card);
});

// Sobre
document.querySelectorAll('.sobre__texto, .sobre__detalhes').forEach(el => {
  el.classList.add('reveal-text');
  revealObserver.observe(el);
});

// Project cards
document.querySelectorAll('.project-card').forEach((card, i) => {
  card.classList.add('reveal-text');
  card.style.transitionDelay = `${i * 0.1}s`;
  revealObserver.observe(card);
});

// Section headers
document.querySelectorAll('.section-header').forEach(el => {
  el.classList.add('reveal-text');
  revealObserver.observe(el);
});

// Tech table
document.querySelectorAll('.tech-table-wrapper').forEach(el => {
  el.classList.add('reveal-text');
  revealObserver.observe(el);
});

// Contact grid
document.querySelectorAll('.contato__info, .contato__form-wrapper').forEach((el, i) => {
  el.classList.add('reveal-text');
  el.style.transitionDelay = `${i * 0.15}s`;
  revealObserver.observe(el);
});

// ──────── ACTIVE NAV LINK ────────
const sections  = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link[href^="#"]:not(.nav__link--cta)');

const activeLinkObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('nav__link--active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => activeLinkObserver.observe(section));

// ──────── FORMULÁRIO ────────
const form     = document.getElementById('formulario-contato');
const feedback = document.getElementById('form-feedback');

form.addEventListener('submit', (e) => {

  const nome     = form.querySelector('#nome').value.trim();
  const email    = form.querySelector('#email').value.trim();
  const mensagem = form.querySelector('#mensagem').value.trim();

  // Validação simples
  if (!nome || !email || !mensagem) {
    showFeedback('Por favor, preencha todos os campos obrigatórios.', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showFeedback('Por favor, insira um e-mail válido.', 'error');
    return;
  }

  // Simulação de envio
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  setTimeout(() => {
    showFeedback('Mensagem enviada com sucesso! Entrarei em contato em breve. 🚀', 'success');
    form.reset();
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Enviar Mensagem <span class="btn__icon" aria-hidden="true">→</span>';
  }, 1500);
});

const showFeedback = (message, type) => {
  feedback.textContent = message;
  feedback.className = `form-feedback ${type}`;
  setTimeout(() => {
    feedback.className = 'form-feedback';
    feedback.textContent = '';
  }, 5000);
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ──────── SMOOTH LINK HIGHLIGHT (feedback visual ao clicar) ────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ──────── PARTÍCULAS DE FUNDO (canvas leve) ────────
const createParticleCanvas = () => {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = `
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: -1;
    opacity: 0.35;
  `;
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  const particles = [];
  const PARTICLE_COUNT = 55;

  const resize = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * canvas.width;
      this.y  = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.r  = Math.random() * 1.5 + 0.5;
      this.a  = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width ||
          this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167, 139, 250, ${this.a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  // Conectar partículas próximas
  const connectParticles = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.strokeStyle = `rgba(124, 58, 237, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
  };
  animate();
};

// Somente em desktop
if (window.matchMedia('(min-width: 768px)').matches) {
  createParticleCanvas();
}

// ──────── TILT SUAVE NA FOTO ────────
const photoFrame = document.querySelector('.hero__photo-frame');
if (photoFrame && window.matchMedia('(pointer: fine)').matches) {
  photoFrame.addEventListener('mousemove', (e) => {
    const rect = photoFrame.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    photoFrame.style.transform = `perspective(600px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) scale(1.02)`;
    photoFrame.style.transition = 'transform 0.1s ease';
  });

  photoFrame.addEventListener('mouseleave', () => {
    photoFrame.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)';
    photoFrame.style.transition = 'transform 0.5s ease';
  });
}

// CSS para link ativo na nav
const style = document.createElement('style');
style.textContent = `.nav__link--active { color: var(--clr-accent-2) !important; }`;
document.head.appendChild(style);
