import { useEffect } from "react";

/**
 * Scroll-reveal: adds `is-visible` to any `.reveal*` element once it scrolls
 * into view. Re-scans on each route change. Honors prefers-reduced-motion.
 */
export function useReveal(deps = []) {
  useEffect(() => {
    const selector = ".reveal, .reveal-step, .reveal-left, .reveal-right, .stage-screen";
    const items = Array.from(document.querySelectorAll(selector));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.18 },
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
