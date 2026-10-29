import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { getAnnounce } from "../data/announce";
import { getTheme, nextTheme, setTheme, type Theme } from "../lib/theme";

const NAV = [
  { to: "/encounter", label: "Encounter mode" },
  { to: "/browse", label: "Browse" },
  { to: "/agencies", label: "Agencies" },
  { to: "/search", label: "Search" },
  { to: "/help", label: "Help" },
  { to: "/about", label: "About" },
];

export default function Layout() {
  const location = useLocation();
  const [theme, setThemeState] = useState<Theme>(getTheme);
  const [menuOpen, setMenuOpen] = useState(false);

  const announce = getAnnounce(location.pathname);

  /* Theme: cycles light -> dark -> system, persisted (same as prototype script) */
  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  /* Scroll to top + rebuild the scroll-reveal observer on every route change */
  useEffect(() => {
    window.scrollTo(0, 0);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [location.pathname]);

  return (
    <>
      {announce && (
        <div className="announce">
          <div className="container announce__inner">
            <span className="pulse-dot"></span>
            <span className="announce__label">{announce.label}</span>
            <span className="announce__title">{announce.title}</span>
            {announce.meta && <span className="announce__meta">{announce.meta}</span>}
            {announce.href.startsWith("#") ? (
              <a href={announce.href} className="announce__link">{announce.link}</a>
            ) : (
              <Link to={announce.href} className="announce__link">{announce.link}</Link>
            )}
          </div>
        </div>
      )}

      <header className="header">
        <div className="header__pill">
          <Link className="brand" to="/">
            <svg width="28" height="28" viewBox="0 0 30 30" aria-hidden="true">
              <rect width="30" height="30" rx="8" fill="#15300a"/>
              <rect x="13.4" y="6.5" width="3.2" height="10.5" rx="1.6" fill="#c1ff72"/>
              <circle cx="15" cy="21.4" r="1.9" fill="#c1ff72"/>
            </svg>
            <span className="brand__text">KnowYourRights NG</span>
          </Link>
          <nav className="nav" aria-label="Main">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} className="nav__link">{item.label}</NavLink>
            ))}
          </nav>
          <div className="header__actions">
            <button
              className="theme-toggle"
              type="button"
              aria-label={`Theme: ${theme}`}
              title="Light / dark / system"
              onClick={() => setThemeState((cur) => nextTheme(cur))}
            >
              <svg className="ticon icon-sun" width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M8 1.5v1.4M8 13.1v1.4M14.5 8h-1.4M2.9 8H1.5M12.4 3.6l-1 1M4.6 11.4l-1 1M12.4 12.4l-1-1M4.6 4.6l-1-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              <svg className="ticon icon-moon" width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M13.5 9A5.6 5.6 0 0 1 7 2.6 5.7 5.7 0 1 0 8.9 14 5.7 5.7 0 0 1 13.5 9Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
              <svg className="ticon icon-sys" width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1.8" y="2.8" width="12.4" height="8.4" rx="1.4" stroke="currentColor" strokeWidth="1.3"/><path d="M5.5 13.7h5M8 11.2v2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            </button>
            <Link to="/help" className="btn btn--primary btn--sm">Get help now</Link>
            <button
              className="nav-toggle"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
        <div className={`mobile-menu${menuOpen ? " is-open" : ""}`}>
          <Link to="/encounter" className="is-cta" onClick={() => setMenuOpen(false)}>Encounter mode — I need help now</Link>
          <Link to="/browse" onClick={() => setMenuOpen(false)}>Browse by situation</Link>
          <Link to="/agencies" onClick={() => setMenuOpen(false)}>Browse by agency</Link>
          <Link to="/search" onClick={() => setMenuOpen(false)}>Search</Link>
          <Link to="/help" onClick={() => setMenuOpen(false)}>Help directory</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer__grid">
            <div>
              <Link className="brand brand--footer" to="/">
                <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
                  <rect width="30" height="30" rx="8" fill="#2c3a1c"/>
                  <rect x="13.4" y="6.5" width="3.2" height="10.5" rx="1.6" fill="#c1ff72"/>
                  <circle cx="15" cy="21.4" r="1.9" fill="#c1ff72"/>
                </svg>
                <span className="brand__text">KnowYourRights NG</span>
              </Link>
              <p className="footer__desc">Free, source-linked guidance for roadside and related enforcement encounters in Nigeria. Every entry shows its review status. Safety-first, always free.</p>
              <p className="footer__quote">"Not legal advice — sources shown, review status labelled."</p>
            </div>
            <div className="footer__cols">
              <div className="footer__col">
                <h4>Guide</h4>
                <ul>
                  <li><Link to="/encounter">Encounter mode</Link></li>
                  <li><Link to="/browse">Browse situations</Link></li>
                  <li><Link to="/agencies">By agency</Link></li>
                  <li><Link to="/search">Search</Link></li>
                </ul>
              </div>
              <div className="footer__col">
                <h4>Support</h4>
                <ul>
                  <li><Link to="/help">Help directory</Link></li>
                  <li><Link to="/scenario/police-stop-search-car#feedback">Flag an issue</Link></li>
                  <li><Link to="/about">How we review</Link></li>
                  <li><a href="#">Corrections<span className="footer__soon">SOON</span></a></li>
                </ul>
              </div>
              <div className="footer__col">
                <h4>Trust</h4>
                <ul>
                  <li><Link to="/about">Scope &amp; limitations</Link></li>
                  <li><Link to="/about">Privacy</Link></li>
                  <li><Link to="/about#disclaimer">Legal disclaimer</Link></li>
                  <li><a href="#">Pidgin version<span className="footer__soon">SOON</span></a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer__bottom">
            <div className="footer__socials">
              <a href="#" className="social-dot" aria-label="X">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><path d="M9.5 6.9 15 .5h-1.6L8.7 5.9 5 .5H.7l5.8 8.2L.7 15.5h1.6l5.1-5.8 4 5.8h4.3L9.5 6.9Z"/></svg>
              </a>
              <a href="#" className="social-dot" aria-label="GitHub">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 .5a7.5 7.5 0 0 0-2.37 14.62c.37.07.5-.16.5-.36v-1.27c-2.08.45-2.52-.9-2.52-.9-.34-.87-.83-1.1-.83-1.1-.68-.46.05-.45.05-.45.75.05 1.14.77 1.14.77.67 1.15 1.75.82 2.18.63.07-.49.26-.82.48-1.01-1.67-.19-3.42-.83-3.42-3.71 0-.82.29-1.49.77-2.01-.08-.19-.34-.96.07-2 0 0 .63-.2 2.06.77a7.2 7.2 0 0 1 3.76 0c1.43-.97 2.06-.77 2.06-.77.41 1.04.15 1.81.07 2 .48.52.77 1.19.77 2.01 0 2.89-1.76 3.52-3.43 3.7.27.23.5.69.5 1.39V14.8c0 .2.14.44.51.36A7.5 7.5 0 0 0 8 .5Z"/></svg>
              </a>
              <a href="#" className="social-dot" aria-label="Instagram">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="13" height="13" rx="4" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.3"/><circle cx="12" cy="4" r="0.9" fill="currentColor"/></svg>
              </a>
            </div>
            <div className="footer__legal">
              © 2026 KnowYourRights NG. All rights reserved.&nbsp;&nbsp;·&nbsp;&nbsp;Free &amp; anonymous — no accounts, no tracking.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
