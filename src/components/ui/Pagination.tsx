import { useCallback } from "react";

const ELLIPSIS = "ellipsis" as const;

/** Compact page list: always shows first/last and a window around the current page. */
export function pageWindow(current: number, total: number): Array<number | typeof ELLIPSIS> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const windowStart = Math.max(2, Math.min(current - 1, total - 4));
  const windowEnd = Math.min(total - 1, Math.max(current + 1, 5));
  const pages: Array<number | typeof ELLIPSIS> = [1];

  if (windowStart > 2) pages.push(ELLIPSIS);
  for (let page = windowStart; page <= windowEnd; page += 1) pages.push(page);
  if (windowEnd < total - 1) pages.push(ELLIPSIS);
  pages.push(total);

  return pages;
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  /** Total rows before slicing, used for the summary line. */
  totalItems?: number;
  startIndex?: number;
  endIndex?: number;
  /** Noun shown in the summary, e.g. "guides". */
  itemLabel?: string;
  ariaLabel?: string;
}

/**
 * Accessible pagination for long result sets. Renders nothing when everything
 * fits on one page, so small lists stay visually quiet.
 */
export function Pagination({
  page,
  totalPages,
  onChange,
  totalItems,
  startIndex = 0,
  endIndex = 0,
  itemLabel = "results",
  ariaLabel = "Pagination",
}: PaginationProps) {
  const goTo = useCallback(
    (next: number) => {
      if (next < 1 || next > totalPages || next === page) return;
      onChange(next);
    },
    [onChange, page, totalPages]
  );

  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label={ariaLabel}>
      {typeof totalItems === "number" && (
        <p className="pagination__summary" aria-live="polite">
          Showing <strong>{totalItems === 0 ? 0 : startIndex + 1}–{endIndex}</strong> of{" "}
          <strong>{totalItems}</strong> {itemLabel}
        </p>
      )}

      <div className="pagination__controls">
        <button
          type="button"
          className="pagination__btn pagination__btn--step"
          onClick={() => goTo(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3.5 5.5 8l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Prev</span>
        </button>

        {pageWindow(page, totalPages).map((item, index) =>
          item === ELLIPSIS ? (
            <span key={`gap-${index}`} className="pagination__gap" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={`pagination__btn${item === page ? " is-active" : ""}`}
              onClick={() => goTo(item)}
              aria-label={`Page ${item}`}
              aria-current={item === page ? "page" : undefined}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          className="pagination__btn pagination__btn--step"
          onClick={() => goTo(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <span>Next</span>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
