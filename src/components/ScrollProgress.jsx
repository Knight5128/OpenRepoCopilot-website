import { useEffect } from "react";

export default function ScrollProgress() {
  useEffect(() => {
    const update = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll <= 0 ? 0 : window.scrollY / maxScroll;
      document.documentElement.style.setProperty(
        "--scroll-progress",
        String(Math.min(1, Math.max(0, progress))),
      );
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span></span>
    </div>
  );
}
