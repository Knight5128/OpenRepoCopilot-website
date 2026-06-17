const header = document.querySelector(".site-header");
const themeButtons = document.querySelectorAll("[data-theme-choice]");
const revealItems = document.querySelectorAll(".reveal, .reveal-step, .reveal-left, .reveal-right, .stage-screen");
const systemScheme = window.matchMedia("(prefers-color-scheme: dark)");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const themeFromUrl = new URLSearchParams(window.location.search).get("theme");
const revealMode = new URLSearchParams(window.location.search).get("reveal");
const storedTheme = localStorage.getItem("openrepo-theme");
let themeChoice = ["light", "dark", "system"].includes(themeFromUrl)
  ? themeFromUrl
  : storedTheme || "dark";

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

const updateScrollProgress = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll <= 0 ? 0 : window.scrollY / maxScroll;
  document.documentElement.style.setProperty("--scroll-progress", String(Math.min(1, Math.max(0, progress))));
};

const resolvedTheme = () => {
  if (themeChoice === "system") {
    return systemScheme.matches ? "dark" : "light";
  }

  return themeChoice;
};

const applyTheme = () => {
  document.documentElement.dataset.theme = resolvedTheme();
  document.documentElement.dataset.themeChoice = themeChoice;
  if (revealMode) {
    document.documentElement.dataset.reveal = revealMode;
  }

  themeButtons.forEach((button) => {
    const isSelected = button.dataset.themeChoice === themeChoice;
    button.setAttribute("aria-pressed", String(isSelected));
  });
};

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    themeChoice = button.dataset.themeChoice;
    localStorage.setItem("openrepo-theme", themeChoice);
    applyTheme();
  });
});

systemScheme.addEventListener("change", () => {
  if (themeChoice === "system") {
    applyTheme();
  }
});

if (reduceMotion.matches || revealMode === "all") {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.18 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

// Copy-to-clipboard for install commands
document.querySelectorAll(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const text = btn.dataset.copy;
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = "Copied!";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = "Copy";
        btn.classList.remove("copied");
      }, 1800);
    });
  });
});

// Architecture carousel
const archTrack = document.querySelector(".arch-track");
const archSlides = document.querySelectorAll(".arch-slide");
const archDots = document.querySelectorAll(".arch-dot");
const archPrev = document.querySelector(".arch-prev");
const archNext = document.querySelector(".arch-next");
let archIndex = 0;

const goToSlide = (i) => {
  archIndex = Math.max(0, Math.min(i, archSlides.length - 1));
  archTrack.style.transform = `translateX(-${archIndex * 100}%)`;
  archDots.forEach((d, idx) => d.classList.toggle("active", idx === archIndex));
};

if (archPrev && archNext) {
  archPrev.addEventListener("click", () => goToSlide(archIndex - 1));
  archNext.addEventListener("click", () => goToSlide(archIndex + 1));
  archDots.forEach((d) => {
    d.addEventListener("click", () => goToSlide(Number(d.dataset.slide)));
  });
}

applyTheme();
window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateHeader();
updateScrollProgress();
