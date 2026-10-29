import type { CSSProperties, ReactNode } from "react";
import { Reveal } from "./Reveal";

interface SectionHeadProps {
  title: ReactNode;
  meta?: ReactNode;
  /** Right-hand side of the head row (links, pager buttons, …). */
  aside?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Two-column section heading row: display title + meta on the left, aside on the right. */
export function SectionHead({ title, meta, aside, className, style }: SectionHeadProps) {
  return (
    <Reveal className={className ? `section-head ${className}` : "section-head"} style={style}>
      <div>
        <h2 className="display display--section">{title}</h2>
        {meta && <p className="section-head__meta">{meta}</p>}
      </div>
      {aside}
    </Reveal>
  );
}
