import type { CSSProperties, ReactNode } from "react";

export type AdVariant =
  | "billboard"      // 970 × 250
  | "leaderboard"    // 970 × 90 / 728 × 90
  | "inline"         // in-feed
  | "large-mobile"   // 320 × 100
  | "square"         // 300 × 250 MPU
  | "rect-lg"        // 336 × 280
  | "half-page"      // 300 × 600
  | "skyscraper"     // 160 × 600
  | "native";

interface AdSlotProps {
  variant: AdVariant;
  label?: string;
  hint?: string;
  size?: string;
  /** Adds the scroll-reveal class directly on the slot (as in the prototypes). */
  reveal?: boolean;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}

/** Reserved ad space, styled exactly like the prototype `.ad-slot` system. */
export function AdSlot({ variant, label = "Advertisement", hint = "Ad space — supports the free guide", size, reveal, delay, className = "", style }: AdSlotProps) {
  const classes = ["ad-slot", `ad-slot--${variant}`];
  if (reveal) classes.push("reveal");
  if (className) classes.push(className);
  const mergedStyle: CSSProperties | undefined =
    delay !== undefined ? { transitionDelay: `${delay}s`, ...style } : style;
  return (
    <div className={classes.join(" ")} style={mergedStyle}>
      <span className="ad-slot__label">{label}</span>
      <span className="ad-slot__hint">{hint}</span>
      {size && <span className="ad-slot__size">{size}</span>}
    </div>
  );
}

/**
 * Dismissible ad wrapper used on content pages only
 * (Encounter, About and 404 stay ad-free by design).
 */
export function AdAnchor({ children }: { children: ReactNode }) {
  return (
    <div className="ad-anchor" role="complementary" aria-label="Advertisement">
      <button
        className="ad-anchor__close"
        type="button"
        aria-label="Close ad"
        onClick={(e) => e.currentTarget.parentElement?.remove()}
      >
        ×
      </button>
      {children}
    </div>
  );
}
