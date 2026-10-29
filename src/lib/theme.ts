export type Theme = 'light' | 'dark' | 'system';

const KEY = 'kyr-theme';

export const THEME_ORDER: Theme[] = ['light', 'dark', 'system'];

export function getTheme(): Theme {
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'light' || v === 'dark' || v === 'system') return v;
  } catch { /* storage unavailable */ }
  return 'system';
}

export function setTheme(t: Theme) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem(KEY, t); } catch { /* storage unavailable */ }
}

/** Cycles light -> dark -> system, exactly like the prototype script. */
export function nextTheme(t: Theme): Theme {
  return THEME_ORDER[(THEME_ORDER.indexOf(t) + 1) % THEME_ORDER.length];
}
