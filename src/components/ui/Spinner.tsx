interface SpinnerProps {
  /** Diameter in pixels. */
  size?: number;
  /** Announced to assistive technology. */
  label?: string;
  className?: string;
}

/** Small inline activity indicator for deferred or in-flight work. */
export function Spinner({ size = 16, label = "Loading", className = "" }: SpinnerProps) {
  return (
    <span
      className={`spinner ${className}`.trim()}
      style={{ width: size, height: size }}
      role="status"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
    </span>
  );
}
