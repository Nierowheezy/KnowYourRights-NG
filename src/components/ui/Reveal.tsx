import type { CSSProperties, ElementType, ReactNode } from "react";

interface RevealProps {
  /** Element/tag to render. Defaults to a div. */
  as?: ElementType;
  className?: string;
  /** Scroll-reveal stagger in seconds (prototype inline transition-delay). */
  delay?: number;
  style?: CSSProperties;
  children?: ReactNode;
  [key: string]: unknown;
}

/**
 * Element that fades/slides in when scrolled into view.
 * The IntersectionObserver in Layout adds `.is-in`; this component only
 * supplies the exact `reveal` class + optional stagger delay.
 */
export function Reveal({ as: Tag = "div", className = "", delay, style, children, ...rest }: RevealProps) {
  const mergedStyle: CSSProperties | undefined =
    delay !== undefined ? { transitionDelay: `${delay}s`, ...style } : style;
  return (
    <Tag className={className ? `reveal ${className}` : "reveal"} style={mergedStyle} {...rest}>
      {children}
    </Tag>
  );
}
