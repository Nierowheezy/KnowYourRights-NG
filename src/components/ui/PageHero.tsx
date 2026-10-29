import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";

interface PageHeroProps {
  /** Optional breadcrumb row rendered above the title. */
  breadcrumb?: ReactNode;
  title: ReactNode;
  /** Optional lede paragraph under the title. */
  lede?: ReactNode;
  titleStyle?: CSSProperties;
  ledeStyle?: CSSProperties;
  /** Extra content inside the hero container (chips, actions, …). */
  children?: ReactNode;
}

/** Shared `.page-hero` block used by Browse, Agencies, Search, Help, About and Scenario pages. */
export function PageHero({ breadcrumb, title, lede, titleStyle, ledeStyle, children }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="container">
        {breadcrumb}
        <h1
          className="display display--section anim"
          style={titleStyle ?? (breadcrumb ? { marginTop: 14, animationDelay: ".06s" } : undefined)}
        >
          {title}
        </h1>
        {lede && (
          <p className="lede anim" style={ledeStyle ?? { maxWidth: 560, marginTop: 14, animationDelay: ".12s" }}>
            {lede}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

/** Breadcrumb row exactly as in the prototype: Home / … / Current */
export function Breadcrumb({ trail }: { trail: Array<{ label: string; href?: string }> }) {
  return (
    <nav className="breadcrumb anim" style={{ fontSize: "0.83rem", color: "var(--text-faint)" }} aria-label="Breadcrumb">
      {trail.map((item, i) => (
        <span key={i}>
          {i > 0 && <>&nbsp;/&nbsp;</>}
          {item.href ? (
            <Link to={item.href} style={{ textDecoration: "none", color: "inherit" }}>{item.label}</Link>
          ) : (
            <span style={{ color: "var(--text)", fontWeight: 600 }}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
