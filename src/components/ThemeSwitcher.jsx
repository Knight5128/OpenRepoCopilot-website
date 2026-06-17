import { useTheme } from "../context/ThemeContext.jsx";

const OPTIONS = [
  { value: "light", glyph: "☀", label: "Light mode" },
  { value: "dark", glyph: "☾", label: "Dark mode" },
  { value: "system", glyph: "⚙", label: "System" },
];

export default function ThemeSwitcher() {
  const { choice, select } = useTheme();
  return (
    <div className="theme-switcher" aria-label="配色模式">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          aria-label={opt.label}
          aria-pressed={choice === opt.value}
          onClick={() => select(opt.value)}
        >
          {opt.glyph}
        </button>
      ))}
    </div>
  );
}
