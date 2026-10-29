/* Theme toggle — light / dark / system, persisted in localStorage */
(function () {
  const html = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  const STORAGE_KEY = 'kyr-theme';

  const ICONS = {
    light: '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>',
    dark: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 1 21 12.79z"/>',
    system: '<rect x="2" y="3" width="20" height="18" rx="2" ry="2"/><path d="M22 11H2M7 7h10M7 17h10"/>'
  };

  function resolveEffectiveTheme(stored) {
    if (stored === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return stored;
  }

  function applyTheme(theme) {
    if (theme === 'system') {
      html.removeAttribute('data-theme');
      html.setAttribute('data-theme', 'system');
    } else {
      html.removeAttribute('data-theme');
      html.setAttribute('data-theme', theme);
    }
    const effective = resolveEffectiveTheme(theme);
    icon.innerHTML = ICONS[effective];
    toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }

  function cycleTheme() {
    const current = html.getAttribute('data-theme') || 'system';
    const order = ['system', 'light', 'dark'];
    const next = order[(order.indexOf(current) + 1) % order.length];
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  const stored = localStorage.getItem(STORAGE_KEY) || 'system';
  applyTheme(stored);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (html.getAttribute('data-theme') === 'system' || !html.getAttribute('data-theme')) {
      const effective = resolveEffectiveTheme('system');
      icon.innerHTML = ICONS[effective];
    }
  });

  toggle.addEventListener('click', cycleTheme);
})();

/* Mobile nav toggle */
(function () {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.querySelector('.site-nav');
  const drawer = document.querySelector('.nav-drawer');
  if (!toggle || !nav) return;

  // Clone nav for drawer
  if (drawer && nav) {
    const navClone = nav.cloneNode(true);
    navClone.querySelectorAll('.nav-link').forEach(link => {
      link.style.display = 'block';
      link.style.padding = 'var(--space-3) 0';
    });
    drawer.appendChild(navClone);
  }

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    if (drawer) {
      drawer.style.display = expanded ? 'none' : 'flex';
    }
  });

  // Close drawer on link click
  if (drawer) {
    drawer.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-link')) {
        toggle.setAttribute('aria-expanded', 'false');
        drawer.style.display = 'none';
      }
    });
  }
})();