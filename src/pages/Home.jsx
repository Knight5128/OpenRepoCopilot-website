import { useState } from "react";
import { Link } from "react-router-dom";
import HeroGraph from "../components/HeroGraph.jsx";
import CopyButton from "../components/CopyButton.jsx";
import { HERO_KNOWLEDGE_GRAPH_URL, LOGO_URL, WINDOWS_INSTALLER_URL } from "../utils/assets.js";
import { useReveal } from "../hooks/useReveal.js";

const WinIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M3 5.5 10.5 4.4v7.1H3V5.5zm0 13 7.5 1.1v-7H3v5.9zM11.5 4.2 21 3v8.5h-9.5V4.2zm0 8.3H21V21l-9.5-1.3v-7.2z" />
  </svg>
);
const MacIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M16.4 12.9c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.8-3.5.8-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.2 0 2-1.1 2.8-2.2.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.5-1-2.5-3.8zM14.2 5.8c.6-.8 1-1.9.9-3-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-.9 2.9 1 .1 2-.5 2.7-1.3z" />
  </svg>
);
const LinuxIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M12 2c-1.7 0-3 1.6-3 3.6 0 1 .1 1.9-.4 2.9-.5.9-1.6 1.7-2.2 3.3-.5 1.5-.2 2.8.1 3.9.2.8.3 1.5 0 2.1-.5 1-.4 1.8 0 2.3.5.5 1.4.6 2.3.3.7-.2 1.2-.1 1.7.1.6.3 1.1.7 2 .7s1.4-.4 2-.7c.5-.2 1-.3 1.7-.1.9.3 1.8.2 2.3-.3.4-.5.5-1.3 0-2.3-.3-.6-.2-1.3 0-2.1.3-1.1.6-2.4.1-3.9-.6-1.6-1.7-2.4-2.2-3.3-.5-1-.4-1.9-.4-2.9C15 3.6 13.7 2 12 2z" />
  </svg>
);

const OS = [
  {
    id: "windows",
    label: "Windows",
    Icon: WinIcon,
    note: "在 PowerShell 中运行",
    cmd: "iwr -useb https://raw.githubusercontent.com/Knight5128/OpenRepoCopilot/main/install.ps1 | iex",
  },
  {
    id: "macos",
    label: "macOS",
    Icon: MacIcon,
    note: "在终端中运行",
    cmd: "curl -fsSL https://raw.githubusercontent.com/Knight5128/OpenRepoCopilot/main/install.sh | bash",
  },
  {
    id: "linux",
    label: "Linux",
    Icon: LinuxIcon,
    note: "在终端中运行",
    cmd: "curl -fsSL https://raw.githubusercontent.com/Knight5128/OpenRepoCopilot/main/install.sh | bash",
  },
];

const PORTALS = [
  {
    to: "/usage",
    icon: "◷",
    title: "使用流程",
    desc: "从安装、启动工作台到生成知识图谱、在仪表盘中探索的端到端旅程。",
  },
  {
    to: "/architecture",
    icon: "◈",
    title: "系统架构",
    desc: "动画演示 Agent 如何把项目拆成节点、连成边，以及内置类 Claude Code Agent 循环。",
  },
  {
    to: "/skills",
    icon: "⌘",
    title: "SKILL解析",
    desc: "逐个拆解 10 个 skill 命令的核心规范、工作流与产物。",
  },
];

export default function Home() {
  const [os, setOs] = useState("windows");
  useReveal();
  const active = OS.find((o) => o.id === os);

  return (
    <>
      <section className="quickstart" id="top">
        <img
          className="quickstart-bg"
          src={HERO_KNOWLEDGE_GRAPH_URL}
          alt=""
          aria-hidden="true"
          decoding="async"
        />
        <div className="quickstart-graph">
          <HeroGraph />
        </div>
        <div className="quickstart-overlay"></div>

        <div className="quickstart-inner reveal reveal-hero">
          <img
            className="quickstart-logo"
            src={LOGO_URL}
            alt="OpenRepoCopilot logo"
          />
          <h1 className="quickstart-name">OpenRepo Copilot</h1>
          <p className="quickstart-tagline">
            基于 Agent 的本地优先的项目知识图谱分析工作台 —— 将代码仓库或知识库文档转化为
            <strong>可探索 · 可搜索 · 可共享</strong>的交互式知识图谱
          </p>

          <div className="download-row" aria-label="客户端下载">
            <a
              className="download-btn primary"
              href={WINDOWS_INSTALLER_URL}
              download
            >
              <WinIcon />
              <span className="download-label">
                <strong>Windows 版本</strong>
                <small>.exe 安装包 · 64-bit</small>
              </span>
            </a>
            <button className="download-btn disabled" type="button" disabled>
              <MacIcon />
              <span className="download-label">
                <strong>macOS 版本</strong>
                <small>即将推出</small>
              </span>
              <span className="soon-badge">即将推出</span>
            </button>
            <button className="download-btn disabled" type="button" disabled>
              <LinuxIcon />
              <span className="download-label">
                <strong>Linux 版本</strong>
                <small>即将推出</small>
              </span>
              <span className="soon-badge">即将推出</span>
            </button>
          </div>
          <p className="download-note">
            macOS / Linux 客户端暂未发布，当前可使用下方脚本一键安装全套 skill。
          </p>

          <div className="qs-install reveal">
            <div className="qs-install-head">
              <span className="qs-install-kicker">SKILL 一键安装</span>
              <h2>把全套 OpenRepo Copilot skill 装进你的 Agent</h2>
            </div>
            <div className="qs-os-tabs" role="tablist" aria-label="选择操作系统">
              {OS.map((o) => (
                <button
                  key={o.id}
                  className={`qs-os-tab${os === o.id ? " is-active" : ""}`}
                  type="button"
                  role="tab"
                  aria-selected={os === o.id}
                  onClick={() => setOs(o.id)}
                >
                  <o.Icon />
                  <span>{o.label}</span>
                </button>
              ))}
            </div>
            <div className="qs-os-panels">
              <div className="qs-os-panel is-active" role="tabpanel">
                <span className="qs-os-note">{active.note}</span>
                <div className="cmd-line">
                  <code>{active.cmd}</code>
                  <CopyButton text={active.cmd} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section portal-section">
        <div className="section-heading compact reveal">
          <h2>了解 OpenRepo Copilot</h2>
        </div>
        <div className="portal-grid">
          {PORTALS.map((p) => (
            <Link key={p.to} className="portal-card reveal-step" to={p.to}>
              <span className="portal-icon">{p.icon}</span>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <span className="portal-go">进入 →</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
