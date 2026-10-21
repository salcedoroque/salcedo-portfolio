
const body = document.body;
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const themeToggle = document.getElementById('themeToggle');
const backTop = document.getElementById('backTop');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
  });
});

// Theme toggle. Remembers the choice; falls back to the system preference.
function applyTheme(light) {
  body.classList.toggle('light', light);
  themeToggle.textContent = light ? '☾' : '☼';
  themeToggle.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
}
let savedTheme = null;
try { savedTheme = localStorage.getItem('theme'); } catch (e) {}
applyTheme(savedTheme ? savedTheme === 'light' : window.matchMedia('(prefers-color-scheme: light)').matches);
themeToggle.addEventListener('click', () => {
  const light = !body.classList.contains('light');
  applyTheme(light);
  try { localStorage.setItem('theme', light ? 'light' : 'dark'); } catch (e) {}
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.focus();
  }
});

// Typing animation
const roleEl = document.getElementById('typedRole');
const roles = ['IT Support Professional', 'Aspiring Web Developer', 'Technical Problem Solver'];
if (!reduceMotion) {
  let roleIndex = 0, charIndex = roles[0].length, deleting = true;
  function typeRole() {
    const current = roles[roleIndex];
    if (deleting) {
      charIndex--;
      roleEl.textContent = current.slice(0, Math.max(0, charIndex));
      if (charIndex <= 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
      setTimeout(typeRole, 45);
    } else {
      const next = roles[roleIndex];
      charIndex++;
      roleEl.textContent = next.slice(0, charIndex);
      if (charIndex >= next.length) { deleting = true; setTimeout(typeRole, 1500); }
      else setTimeout(typeRole, 75);
    }
  }
  setTimeout(typeRole, 1800);
}

// Reveal animations and skill meters
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const meter = entry.target.querySelector('.skill-meter');
        if (meter) meter.querySelector('.meter-track span').style.width = `${meter.dataset.level}%`;
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
  document.querySelectorAll('.skill-meter').forEach(meter => {
    meter.querySelector('.meter-track span').style.width = `${meter.dataset.level}%`;
  });
}

// Active navigation section + back-to-top button
const sections = document.querySelectorAll('main section[id]');
function updateScrollUI() {
  backTop.classList.toggle('visible', window.scrollY > 450);
  let current = 'home';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 150) current = section.id;
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    const active = link.getAttribute('href') === `#${current}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

// Project filters
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(item => item.classList.toggle('active', item === button));
    const filter = button.dataset.filter;
    projectCards.forEach(card => {
      const categories = card.dataset.category.split(' ');
      card.hidden = filter !== 'all' && !categories.includes(filter);
    });
  });
});

// Current copyright year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();  