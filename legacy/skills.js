// ── SKILL page: per-card command typewriter (type → backspace → retype, loop) ──
const reduceTypewriter = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const showAll =
  new URLSearchParams(window.location.search).get("reveal") === "all";

const targets = document.querySelectorAll(".type-target");

const typeLoop = (el, delayStart) => {
  const cmd = el.dataset.cmd || "";
  let i = 0;
  let mode = "typing"; // typing → holding → deleting → waiting

  const tick = () => {
    if (mode === "typing") {
      el.textContent = cmd.slice(0, i + 1);
      i += 1;
      if (i >= cmd.length) {
        mode = "holding";
        return schedule(1600);
      }
      return schedule(75 + Math.random() * 60);
    }
    if (mode === "holding") {
      mode = "deleting";
      return schedule(40);
    }
    if (mode === "deleting") {
      el.textContent = cmd.slice(0, i - 1);
      i -= 1;
      if (i <= 0) {
        mode = "waiting";
        return schedule(700);
      }
      return schedule(45);
    }
    // waiting → restart
    mode = "typing";
    return schedule(120);
  };

  const schedule = (ms) => setTimeout(tick, ms);
  setTimeout(tick, delayStart);
};

targets.forEach((el, idx) => {
  if (reduceTypewriter || showAll) {
    el.textContent = el.dataset.cmd || "";
    return;
  }
  // Stagger card starts so they don't type in lockstep
  typeLoop(el, 200 + idx * 260);
});
