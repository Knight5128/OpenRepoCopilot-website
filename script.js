// ── Shared site script: theme, scroll progress, reveal, copy, nav ──
const header = document.querySelector(".site-header");
const themeButtons = document.querySelectorAll("[data-theme-choice]");
const revealItems = document.querySelectorAll(
  ".reveal, .reveal-step, .reveal-left, .reveal-right, .stage-screen",
);
const systemScheme = window.matchMedia("(prefers-color-scheme: dark)");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const themeFromUrl = new URLSearchParams(window.location.search).get("theme");
const revealMode = new URLSearchParams(window.location.search).get("reveal");
const storedTheme = localStorage.getItem("openrepo-theme");
let themeChoice = ["light", "dark", "system"].includes(themeFromUrl)
  ? themeFromUrl
  : storedTheme || "dark";

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

const updateScrollProgress = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll <= 0 ? 0 : window.scrollY / maxScroll;
  document.documentElement.style.setProperty(
    "--scroll-progress",
    String(Math.min(1, Math.max(0, progress))),
  );
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

// Scroll-reveal animation
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

// Copy-to-clipboard for install / skill commands
document.querySelectorAll(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const text = btn.dataset.copy;
    navigator.clipboard.writeText(text).then(() => {
      const original = btn.dataset.label || "Copy";
      btn.textContent = "Copied!";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove("copied");
      }, 1800);
    });
  });
});

// OS selector tabs (one-click skill install)
const osTabs = document.querySelectorAll(".qs-os-tab");
const osPanels = document.querySelectorAll(".qs-os-panel");
if (osTabs.length && osPanels.length) {
  const selectOs = (os) => {
    osTabs.forEach((tab) => {
      const active = tab.dataset.os === os;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    osPanels.forEach((panel) => {
      const active = panel.dataset.os === os;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
  };
  osTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectOs(tab.dataset.os));
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const dir = event.key === "ArrowRight" ? 1 : -1;
      const next = osTabs[(index + dir + osTabs.length) % osTabs.length];
      selectOs(next.dataset.os);
      next.focus();
    });
  });
}

// Highlight active nav item by <body data-page>
const currentPage = document.body.dataset.page;
if (currentPage) {
  document.querySelectorAll(".nav-links a[data-nav]").forEach((link) => {
    if (link.dataset.nav === currentPage) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });
}

// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.querySelector(".nav-links");
if (navToggle && primaryNav) {
  navToggle.addEventListener("click", () => {
    const open = primaryNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      primaryNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

applyTheme();
window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateHeader();
updateScrollProgress();
