/** Scrolls an element into view without fighting the reduced-motion preference. */
export function scrollToElement(element: HTMLElement | null) {
  if (!element) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  element.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
}
