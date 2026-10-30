import type { CSSProperties } from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  radius?: string | number;
  className?: string;
  style?: CSSProperties;
}

/** Low-level shimmer block. Decorative by default; the parent announces loading. */
export function Skeleton({ width, height = 12, radius, className = "", style }: SkeletonProps) {
  return (
    <span
      className={`skeleton ${className}`.trim()}
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  );
}

/** A few stacked text lines with a short final line. */
export function SkeletonText({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <span className={`skeleton-text ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} height={10} width={i === lines - 1 ? "62%" : `${92 - i * 6}%`} />
      ))}
    </span>
  );
}

/** Placeholder that matches the real scenario/channel card footprint. */
export function SkeletonCard() {
  return (
    <div className="card skeleton-card" aria-hidden="true">
      <div className="skeleton-card__badges">
        <Skeleton width={112} height={24} radius={999} />
        <Skeleton width={64} height={24} radius={999} />
      </div>
      <Skeleton width="78%" height={18} style={{ marginTop: 18 }} />
      <SkeletonText lines={3} className="skeleton-card__body" />
      <div className="skeleton-card__foot">
        <Skeleton width={104} height={22} radius={999} />
        <Skeleton width={72} height={12} />
      </div>
    </div>
  );
}

/** Card-grid placeholder used by Browse, Search and channel lists. */
export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="card-grid card-grid--3" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

/**
 * Route-level fallback while a page chunk loads. Mirrors the shared page hero
 * and card grid so the transition does not jump.
 */
export function PageSkeleton() {
  return (
    <section className="page-skeleton" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading page…</span>
      <div className="container">
        <div className="page-skeleton__hero" aria-hidden="true">
          <Skeleton width={92} height={12} />
          <Skeleton width="min(440px, 72%)" height={34} style={{ marginTop: 18 }} />
          <Skeleton width="min(620px, 94%)" height={14} style={{ marginTop: 20 }} />
          <Skeleton width="min(520px, 82%)" height={14} style={{ marginTop: 10 }} />
        </div>
        <SkeletonGrid count={6} />
      </div>
    </section>
  );
}
