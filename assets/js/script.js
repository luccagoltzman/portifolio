'use strict';

const header = document.querySelector('[data-header]');
const navToggle = document.querySelector('[data-nav-toggle]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const navLinks = document.querySelectorAll('.nav a, .mobile-menu a');
const sections = document.querySelectorAll('main section[id]');
const filterButtons = document.querySelectorAll('[data-filter]');
const projectCards = document.querySelectorAll('.project-card');
const form = document.querySelector('[data-form]');
const yearEl = document.querySelector('[data-year]');

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const closeMobileMenu = () => {
  if (!mobileMenu || !navToggle) return;
  mobileMenu.hidden = true;
  navToggle.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Abrir menu');
};

navToggle?.addEventListener('click', () => {
  const isOpen = mobileMenu.hidden;
  mobileMenu.hidden = !isOpen;
  navToggle.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => closeMobileMenu());
});

window.addEventListener('scroll', () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 8);
}, { passive: true });

const setActiveLink = (id) => {
  document.querySelectorAll('.nav a').forEach((link) => {
    link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
  });
};

const spy = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) setActiveLink(entry.target.id);
  });
}, {
  rootMargin: '-40% 0px -50% 0px',
  threshold: 0
});

sections.forEach((section) => spy.observe(section));

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');

    projectCards.forEach((card) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !show);
    });
  });
});

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get('fullname') || '').trim();
  const email = String(data.get('email') || '').trim();
  const message = String(data.get('message') || '').trim();
  const text = `Olá, meu nome é ${name}. Meu e-mail é ${email}. ${message}`;
  window.open(`https://wa.me/55098981358595?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
});
