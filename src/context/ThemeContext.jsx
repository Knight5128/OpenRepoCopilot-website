import { createContext, useContext, useEffect, useState, useCallback } from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "openrepo-theme";
const CHOICES = ["light", "dark", "system"];

function readStoredChoice() {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return CHOICES.includes(stored) ? stored : "dark";
}

export function ThemeProvider({ children }) {
  const [choice, setChoice] = useState(readStoredChoice);
  const [systemDark, setSystemDark] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  // Track the OS preference so "system" mode stays in sync.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => setSystemDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const resolved = choice === "system" ? (systemDark ? "dark" : "light") : choice;

  // Reflect the resolved theme onto <html> so the existing CSS variables apply.
  useEffect(() => {
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themeChoice = choice;
  }, [resolved, choice]);

  const select = useCallback((next) => {
    if (!CHOICES.includes(next)) return;
    setChoice(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return (
    <ThemeContext.Provider value={{ choice, resolved, select }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
