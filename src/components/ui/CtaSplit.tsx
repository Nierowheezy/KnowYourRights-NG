import type { ReactNode } from "react";

interface CtaSplitProps {
  /** Left column: display heading, lede, check list. */
  copy: ReactNode;
  /** Right column: stacked `.action-card` links. */
  actions: ReactNode;
}

/** Closing split CTA section: copy on the left, stacked action cards on the right. */
export function CtaSplit({ copy, actions }: CtaSplitProps) {
  return (
    <div className="cta-split">
      <div className="cta-split__copy reveal">{copy}</div>
      <div className="cta-actions">{actions}</div>
    </div>
  );
}
