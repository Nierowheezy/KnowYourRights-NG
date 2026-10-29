import type { CSSProperties, ReactNode } from "react";
import { Reveal } from "./Reveal";

type CalloutVariant = "default" | "danger" | "tint" | "dark";

interface CalloutProps {
  variant?: CalloutVariant;
  className?: string;
  style?: CSSProperties;
  reveal?: boolean;
  delay?: number;
  children: ReactNode;
}

/** Full-width notice strip: `.callout` with its `--danger`, `--tint`, `--dark` variants. */
export function Callout({ variant = "default", className = "", style, reveal, delay, children }: CalloutProps) {
  const variantClass = variant !== "default" ? ` callout--${variant}` : "";
  const content = (
    <div className={`callout${variantClass}${className ? ` ${className}` : ""}`} style={style}>
      {children}
    </div>
  );
  if (!reveal) return content;
  return (
    <Reveal delay={delay}>{content}</Reveal>
  );
}
