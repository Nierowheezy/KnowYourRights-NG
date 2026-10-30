import { useState } from "react";

interface UsePaginationOptions {
  /** Total number of rows/items after filtering. */
  totalItems: number;
  /** Items per page. Must be greater than zero. */
  pageSize: number;
  /**
   * Changes whenever the underlying collection changes (query, filter, scope).
   * A string or number keeps the reset deterministic and avoids effect-driven
   * state updates.
   */
  resetKey?: string | number;
}

export interface PaginationState {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  /** Zero-based index of the first visible item. */
  startIndex: number;
  /** Exclusive zero-based index after the last visible item. */
  endIndex: number;
  pageSize: number;
}

/**
 * Pagination state that stays valid when the collection shrinks.
 *
 * The page resets during render when `resetKey` changes (React's documented
 * "adjust state when props change" pattern) instead of in an effect, so a new
 * search never briefly renders the old page number.
 */
export function usePagination({
  totalItems,
  pageSize,
  resetKey,
}: UsePaginationOptions): PaginationState {
  if (pageSize <= 0) throw new RangeError("pageSize must be greater than zero");

  const [page, setPage] = useState(1);
  const [lastResetKey, setLastResetKey] = useState(resetKey);

  if (resetKey !== lastResetKey) {
    setLastResetKey(resetKey);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  return {
    page: currentPage,
    setPage,
    totalPages,
    startIndex,
    endIndex,
    pageSize,
  };
}
