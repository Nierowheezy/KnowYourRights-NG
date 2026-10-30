interface LogoMarkProps {
  /** Rendered square size in pixels. */
  size?: number;
  className?: string;
  /** Accessible name. Omit for decorative use next to visible brand text. */
  title?: string;
}

/**
 * The KnowYourRights NG mark: a lime shield with a check on a forest tile.
 * The shield signals protection; the check signals a source-checked answer.
 * Single source of truth for the header, footer and generated app icons.
 */
export function LogoMark({ size = 30, className, title }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <rect width="32" height="32" rx="9" fill="#15300a" />
      <path
        d="M16 5.7 24.3 8.8v6.2c0 5.2-3.4 8.5-8.3 10-4.9-1.5-8.3-4.8-8.3-10V8.8L16 5.7Z"
        fill="#c1ff72"
      />
      <path
        d="m12.1 15.6 2.7 2.7 5.4-5.7"
        stroke="#15300a"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
