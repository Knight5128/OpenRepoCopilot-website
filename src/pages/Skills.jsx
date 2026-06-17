import { useState } from "react";
import { Link } from "react-router-dom";
import SkillGraph from "../components/SkillGraph.jsx";
import { GROUPS, SKILLS, skillById, groupById } from "../data/skills.js";
import { formatText } from "../utils/formatText.jsx";
import { useReveal } from "../hooks/useReveal.js";

function DetailPanel({ skill }) {
  const group = groupById[skill.group];
  return (
    <article
      className={`skill-detail${skill.feature ? " feature-card" : ""}`}
      style={{ "--c": group?.color }}
      key={skill.id}
    >
      <div className="skill-detail-head">
        <span className="skill-detail-group">{group?.label}</span>
        <div className="skill-type">
          <span className="skill-prompt">❯</span>
          <span className="type-target">{skill.cmd}</span>
          <span className="skill-caret"></span>
        </div>
      </div>
      <p className="skill-purpose">{skill.purpose}</p>
      <div className="skill-meta">
        <div className="skill-field">
          <span>参数</span>
          <code>{formatText(skill.params)}</code>
        </div>
        <div className="skill-field">
          <span>定义</span>
          <code>{skill.def}</code>
        </div>
      </div>
      <div className="skill-section">
        <h4>{skill.flowTitle || "核心规范 / 工作流"}</h4>
        <ol className="skill-flow">
          {skill.flow.map((item, i) => (
            <li key={i}>{formatText(item)}</li>
          ))}
        </ol>
      </div>
      <div className="skill-section">
        <h4>关键功能 / 产物</h4>
        <ul className="skill-funcs">
          {skill.funcs.map((item, i) => (
            <li key={i}>{formatText(item)}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function Skills() {
  const [selectedId, setSelectedId] = useState("understand");
  useReveal();
  const skill = skillById[selectedId];

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner reveal">
          <span className="page-kicker">SKILL BREAKDOWN · SKILL解析</span>
          <h1>10 个 skill，连成一张能点的图</h1>
          <p>
            OpenRepo Copilot 把能力封装成可被 Agent 调用的 skill 命令。下面这张图按职责分簇 —— 点任意节点，下方展开它的用途、参数、核心规范工作流与产物。
          </p>
        </div>
      </section>

      <section className="section skill-explorer-section">
        <div className="skill-legend reveal" aria-label="skill 分组图例">
          {GROUPS.map((g) => (
            <span className="skill-legend-item" key={g.id} style={{ "--c": g.color }}>
              <i />
              {g.label}
            </span>
          ))}
          <span className="skill-legend-hint">点击 / 拖拽节点 · 可缩放平移</span>
        </div>

        <div className="skill-explorer reveal">
          <div className="skill-explorer-graph">
            <SkillGraph selectedId={selectedId} onSelect={setSelectedId} />
          </div>
          <div className="skill-explorer-detail">
            <DetailPanel skill={skill} />
          </div>
        </div>

        <div className="skill-chip-rail" aria-label="全部 skill 快速选择">
          {SKILLS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`skill-chip${selectedId === s.id ? " is-active" : ""}`}
              style={{ "--c": groupById[s.group]?.color }}
              onClick={() => setSelectedId(s.id)}
            >
              {s.cmd}
            </button>
          ))}
        </div>
      </section>

      <section className="section next-cta-section">
        <div className="next-cta reveal">
          <p>准备好把仓库变成知识图谱了吗？</p>
          <Link className="button primary" to="/#top">
            下载客户端 / 一键安装
          </Link>
        </div>
      </section>
    </>
  );
}
