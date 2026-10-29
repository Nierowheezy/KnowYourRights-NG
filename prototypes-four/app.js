// Theme management
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const themeLabel = themeToggle?.querySelector('.theme-toggle__label');

const themes = ['system', 'light', 'dark'];
let currentTheme = localStorage.getItem('theme') || 'system';

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  if (themeLabel) {
    themeLabel.textContent = theme === 'system' ? 'System' : theme === 'light' ? 'Light' : 'Dark';
  }
}

applyTheme(currentTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    currentTheme = themes[nextIndex];
    applyTheme(currentTheme);
  });
}

// Mobile navigation
const navToggle = document.getElementById('navToggle');
const mobileNavModal = document.getElementById('mobileNavModal');
const navBackdrop = document.getElementById('navBackdrop');
const navClose = document.getElementById('navClose');

function openNav() {
  mobileNavModal?.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeNav() {
  mobileNavModal?.classList.remove('is-open');
  document.body.style.overflow = '';
}

if (navToggle) {
  navToggle.addEventListener('click', openNav);
}

if (navBackdrop) {
  navBackdrop.addEventListener('click', closeNav);
}

if (navClose) {
  navClose.addEventListener('click', closeNav);
}

// Close nav when clicking a link
const modalNavLinks = document.querySelectorAll('.modal__nav-link');
modalNavLinks.forEach(link => {
  link.addEventListener('click', closeNav);
});

// Close modal on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeNav();
  }
});
