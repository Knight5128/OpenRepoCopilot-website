import { Link } from "react-router-dom";

export default function Footer({ tagline = "基于 Agent 的本地优先的项目知识图谱分析工作台" }) {
  return (
    <footer className="site-footer">
      <span className="footer-logo">OpenRepoCopilot</span>
      <div className="footer-links">
        <Link to="/usage">使用流程</Link>
        <Link to="/architecture">系统架构</Link>
        <Link to="/skills">SKILL解析</Link>
        <a
          href="https://github.com/Knight5128/OpenRepoCopilot"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </div>
      <p>{tagline}</p>
      <span className="footer-course">© OpenRepoCopilot</span>
    </footer>
  );
}
