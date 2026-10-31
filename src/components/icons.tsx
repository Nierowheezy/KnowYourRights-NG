/**
 * Shared inline SVG icons, ported verbatim from the prototype markup.
 * Each component accepts standard SVG props so pages can size/tint them.
 */
import type { SVGProps } from "react";

export function IconSearch(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" {...props}>
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12.5 12.5 15.5 15.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconShield(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M10 2.5 16.5 5v4.5c0 4.2-2.8 7-6.5 8-3.7-1-6.5-3.8-6.5-8V5L10 2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M7.8 9.8l1.6 1.6 3-3.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCloudOff(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M4 14.5A3.5 3.5 0 0 1 5 7.6a5 5 0 0 1 9.7-1.1 4 4 0 0 1 1.3 7.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="m3 17 14-14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconDocument(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M4 3.5h9l3 3v10H4v-13Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M7 9h6M7 12h6M7 15h3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconBuilding(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M3 16.5V7l7-4 7 4v9.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M7.5 16.5v-4h5v4M3 16.5h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconPin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M10 2.8c3.6 0 6.5 2.7 6.5 6 0 4.2-6.5 8.7-6.5 8.7S3.5 13 3.5 8.8c0-3.3 2.9-6 6.5-6Z" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="10" cy="9" r="2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function IconLock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <rect x="4" y="8.5" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 8.5V6.5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="10" cy="12.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function IconArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconChevronLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconChevronRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconMic(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M19 10a7 7 0 0 1-14 0M12 19v3M8 22h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconMicOff(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/>
    </svg>
  );
}

export function IconCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M5 12l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconX(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}
