import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher.jsx";
import { LOGO_URL } from "../utils/assets.js";

const NAV = [
  { to: "/", label: "快速开始", end: true },
  { to: "/usage", label: "使用流程" },
  { to: "/architecture", label: "系统架构" },
  { to: "/skills", label: "SKILL解析" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <Link className="brand" to="/">
        <img className="brand-logo" src={LOGO_URL} alt="" />
        <span>OpenRepo Copilot</span>
      </Link>
      <nav className={`nav-links${open ? " is-open" : ""}`} aria-label="主导航">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => (isActive ? "is-active" : undefined)}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="header-actions">
        <ThemeSwitcher />
        <button
          className="nav-toggle"
          type="button"
          aria-label="菜单"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  );
}
