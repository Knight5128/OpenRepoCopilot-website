import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PageHeroBackdrop from "../components/PageHeroBackdrop.jsx";
import { useReveal } from "../hooks/useReveal.js";

const STEPS = [
  { num: "01 / 07", title: "Scan · 扫描文件", desc: "确定性枚举仓库中的每个源文件，识别语言与类别，建立文件清单。", src: "scan-project.mjs" },
  { num: "02 / 07", title: "Batch · 语义分批", desc: "把文件按语义相似度与导入邻近度分组成批，便于多 Agent 并发分析。", src: "compute-batches.mjs" },
  { num: "03 / 07", title: "Analyze · 拆分成节点", desc: "通过 AST / 解析器从每个文件提取函数、类、模块、端点、文档等结构化节点。", src: "extract-structure.mjs · analysis-worker.ts" },
  { num: "04 / 07", title: "Connect · 连接成边", desc: "在节点间连边：contains（文件→函数）、imports（导入图）、calls（调用图）、depends_on 等。", src: "extract-import-map.mjs · graph-builder.ts" },
  { num: "05 / 07", title: "Merge · 去重与规范化", desc: "跨批合并：规范 id、按 (source,target,type) 去重、删除指向不存在节点的悬挂边。", src: "merge-batch-graphs.py · normalize-graph.ts" },
  { num: "06 / 07", title: "Cluster · 社区聚类", desc: "用 Louvain 模块度优化把强关联节点聚成社区，仪表盘据此着色分簇。", src: "dashboard/src/utils/louvain.ts" },
  { num: "07 / 07", title: "Layers + Tour · 分层与导览", desc: "识别 3–7 个架构层并归属节点；生成由浅入深的 Guided Tour 学习路径。", src: "layer-detector.ts · tour-generator.ts" },
];
const TOTAL = STEPS.length;

const PIPELINE = [
  ["Scan", "扫描"], ["Batch", "分批"], ["Analyze", "拆节点"], ["Connect", "连边"],
  ["Merge", "去重"], ["Cluster", "聚类"], ["Layers+Tour", "分层导览"],
];

function KGStepper() {
  const [current, setCurrent] = useState(1);
  const [playing, setPlaying] = useState(true);
  const timer = useRef(null);

  // `on(from, until)` mirrors the data-from/data-until visibility logic.
  const on = (from, until = TOTAL) => current >= from && current <= until;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) setPlaying(false);
  }, []);

  useEffect(() => {
    clearInterval(timer.current);
    if (playing) {
      timer.current = setInterval(
        () => setCurrent((c) => (c % TOTAL) + 1),
        2600,
      );
    }
    return () => clearInterval(timer.current);
  }, [playing]);

  const go = (step) => {
    setCurrent(((step - 1 + TOTAL) % TOTAL) + 1);
    setPlaying(false);
  };

  const info = STEPS[current - 1];

  return (
    <>
      <div className="kg-player reveal">
        <div className="kg-stage" data-step={current}>
          <svg viewBox="0 0 720 400" className="kg-diagram" role="img" aria-label="知识图谱构建动画">
            <defs>
              <marker id="ah-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10" fill="var(--teal)" /></marker>
              <marker id="ah-coral" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10" fill="var(--coral)" /></marker>
              <marker id="ah-soft" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10" fill="var(--muted)" /></marker>
            </defs>

            <g className={`kg-el${on(7) ? " on" : ""}`}>
              <rect x="20" y="56" width="680" height="62" rx="8" fill="rgba(130,221,255,0.07)" stroke="rgba(130,221,255,0.25)" strokeWidth="1" />
              <text x="32" y="74" fill="var(--cyan)" fontSize="10" fontWeight="700" letterSpacing="0.1em">LAYER · 入口 / UI</text>
              <rect x="20" y="166" width="680" height="62" rx="8" fill="rgba(53,208,186,0.07)" stroke="rgba(53,208,186,0.25)" strokeWidth="1" />
              <text x="32" y="184" fill="var(--teal)" fontSize="10" fontWeight="700" letterSpacing="0.1em">LAYER · 业务 / Service</text>
              <rect x="20" y="276" width="680" height="62" rx="8" fill="rgba(185,231,105,0.07)" stroke="rgba(185,231,105,0.25)" strokeWidth="1" />
              <text x="32" y="294" fill="var(--lime)" fontSize="10" fontWeight="700" letterSpacing="0.1em">LAYER · 数据 / Data</text>
            </g>

            <g className={`kg-el${on(6, 6) ? " on" : ""}`}>
              <ellipse cx="165" cy="150" rx="155" ry="115" fill="rgba(53,208,186,0.08)" stroke="rgba(53,208,186,0.3)" strokeWidth="1" strokeDasharray="5 4" />
              <text x="60" y="44" fill="var(--teal)" fontSize="10" fontWeight="700">community A</text>
              <ellipse cx="330" cy="300" rx="180" ry="100" fill="rgba(130,221,255,0.08)" stroke="rgba(130,221,255,0.3)" strokeWidth="1" strokeDasharray="5 4" />
              <text x="470" y="378" fill="var(--cyan)" fontSize="10" fontWeight="700">community B</text>
            </g>

            <g className={`kg-el${on(2, 3) ? " on" : ""}`}>
              <rect x="26" y="52" width="120" height="296" rx="10" fill="none" stroke="var(--muted)" strokeWidth="1.2" strokeDasharray="6 4" opacity="0.7" />
              <text x="34" y="46" fill="var(--muted)" fontSize="10" fontWeight="700" letterSpacing="0.08em">BATCH #1</text>
            </g>

            <g className={`kg-el kg-edges${on(4) ? " on" : ""}`}>
              <path d="M132 88 L218 88" stroke="var(--muted)" strokeWidth="1.3" markerEnd="url(#ah-soft)" opacity="0.7" />
              <path d="M132 198 L218 198" stroke="var(--muted)" strokeWidth="1.3" markerEnd="url(#ah-soft)" opacity="0.7" />
              <path d="M132 308 L218 308" stroke="var(--muted)" strokeWidth="1.3" markerEnd="url(#ah-soft)" opacity="0.7" />
              <path d="M86 106 L86 178" stroke="var(--teal)" strokeWidth="1.5" markerEnd="url(#ah-teal)" />
              <path d="M86 216 L86 288" stroke="var(--teal)" strokeWidth="1.5" markerEnd="url(#ah-teal)" />
              <path d="M240 106 L240 180" stroke="var(--coral)" strokeWidth="1.5" strokeDasharray="5 3" markerEnd="url(#ah-coral)" />
              <path d="M258 84 L382 136" stroke="var(--lime)" strokeWidth="1.3" strokeDasharray="4 3" opacity="0.8" />
              <path d="M360 272 L258 302" stroke="var(--muted)" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
            </g>

            <g className={`kg-el${on(4, 5) ? " on" : ""}`}>
              <text x="150" y="84" fill="var(--muted)" fontSize="8">contains</text>
              <text x="92" y="148" fill="var(--teal)" fontSize="8">imports</text>
              <text x="246" y="150" fill="var(--coral)" fontSize="8">calls</text>
              <text x="300" y="104" fill="var(--lime)" fontSize="8">depends_on</text>
            </g>

            <g className={`kg-el${on(5, 5) ? " on" : ""}`}>
              <circle cx="300" cy="198" r="18" fill="rgba(255,125,107,0.08)" stroke="var(--coral)" strokeWidth="1.2" strokeDasharray="3 3" />
              <line x1="286" y1="184" x2="314" y2="212" stroke="var(--coral)" strokeWidth="2" />
              <text x="300" y="240" textAnchor="middle" fill="var(--coral)" fontSize="9" fontWeight="700">去重 / 删悬挂边</text>
            </g>

            <g className={`kg-el${on(1) ? " on" : ""}`}>
              <rect x="42" y="70" width="90" height="36" rx="7" fill="rgba(53,208,186,0.1)" stroke="var(--teal)" strokeWidth="1.6" />
              <text x="87" y="92" textAnchor="middle" fill="var(--ink)" fontSize="11" fontWeight="700">app.ts</text>
              <rect x="42" y="180" width="90" height="36" rx="7" fill="rgba(53,208,186,0.1)" stroke="var(--teal)" strokeWidth="1.6" />
              <text x="87" y="202" textAnchor="middle" fill="var(--ink)" fontSize="11" fontWeight="700">auth.ts</text>
              <rect x="42" y="290" width="90" height="36" rx="7" fill="rgba(53,208,186,0.1)" stroke="var(--teal)" strokeWidth="1.6" />
              <text x="87" y="312" textAnchor="middle" fill="var(--ink)" fontSize="11" fontWeight="700">db.ts</text>
            </g>

            <g className={`kg-el${on(3) ? " on" : ""}`}>
              <circle cx="240" cy="88" r="18" fill="rgba(255,125,107,0.12)" stroke="var(--coral)" strokeWidth="1.6" />
              <text x="240" y="91" textAnchor="middle" fill="var(--ink)" fontSize="8.5" fontWeight="700">render</text>
              <circle cx="240" cy="198" r="18" fill="rgba(255,125,107,0.12)" stroke="var(--coral)" strokeWidth="1.6" />
              <text x="240" y="201" textAnchor="middle" fill="var(--ink)" fontSize="8.5" fontWeight="700">login</text>
              <circle cx="240" cy="308" r="18" fill="rgba(130,221,255,0.12)" stroke="var(--cyan)" strokeWidth="1.6" />
              <text x="240" y="311" textAnchor="middle" fill="var(--ink)" fontSize="8.5" fontWeight="700">User</text>
              <circle cx="400" cy="140" r="18" fill="rgba(185,231,105,0.12)" stroke="var(--lime)" strokeWidth="1.6" />
              <text x="400" y="143" textAnchor="middle" fill="var(--ink)" fontSize="8.5" fontWeight="700">utils</text>
              <rect x="360" y="255" width="80" height="34" rx="6" fill="rgba(130,221,255,0.08)" stroke="var(--cyan)" strokeWidth="1.4" />
              <text x="400" y="276" textAnchor="middle" fill="var(--ink)" fontSize="10" fontWeight="700">README</text>
            </g>

            <g className={`kg-el${on(7) ? " on" : ""}`}>
              <path d="M87 106 Q40 152 87 178" stroke="var(--cyan)" strokeWidth="1.4" strokeDasharray="4 3" fill="none" />
              <path d="M87 216 Q40 252 87 288" stroke="var(--cyan)" strokeWidth="1.4" strokeDasharray="4 3" fill="none" />
              <circle cx="150" cy="70" r="9" fill="var(--cyan)" /><text x="150" y="73.5" textAnchor="middle" fill="var(--primary-text)" fontSize="9" fontWeight="800">1</text>
              <circle cx="150" cy="180" r="9" fill="var(--teal)" /><text x="150" y="183.5" textAnchor="middle" fill="var(--primary-text)" fontSize="9" fontWeight="800">2</text>
              <circle cx="150" cy="290" r="9" fill="var(--lime)" /><text x="150" y="293.5" textAnchor="middle" fill="var(--primary-text)" fontSize="9" fontWeight="800">3</text>
              <text x="600" y="40" textAnchor="middle" fill="var(--muted)" fontSize="9" letterSpacing="0.08em">GUIDED TOUR 学习路径</text>
            </g>
          </svg>
        </div>

        <div className="kg-info">
          <div className="kg-step-head">
            <span className="kg-step-num">{info.num}</span>
            <h3 className="kg-step-title">{info.title}</h3>
          </div>
          <p className="kg-step-desc">{info.desc}</p>
          <code className="kg-step-src">{info.src}</code>
        </div>

        <div className="kg-nav">
          <button className="kg-prev" type="button" aria-label="上一步" onClick={() => go(current - 1)}>←</button>
          <button
            className="kg-play"
            type="button"
            aria-label="播放/暂停"
            aria-pressed={playing}
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? "⏸" : "▶"}
          </button>
          <div className="kg-dots" role="tablist">
            {STEPS.map((_, i) => (
              <button
                key={i}
                className={`kg-dot${current === i + 1 ? " active" : ""}`}
                data-step={i + 1}
                aria-label={`第${i + 1}步`}
                onClick={() => go(i + 1)}
              ></button>
            ))}
          </div>
          <button className="kg-next" type="button" aria-label="下一步" onClick={() => go(current + 1)}>→</button>
        </div>
      </div>

      <div className="pipeline-strip reveal" aria-label="七阶段流水线">
        {PIPELINE.map(([en, zh], i) => (
          <span key={en} className={`pl-step${current >= i + 1 ? " active" : ""}`}>
            <b>{en}</b>
            {zh}
          </span>
        ))}
      </div>
    </>
  );
}

const AGENT_STAGES = [
  { n: "1", label: "收集上下文", x: "50%", y: "6%" },
  { n: "2", label: "调用 LLM", x: "90%", y: "34%" },
  { n: "3", label: "产出工具调用", x: "79%", y: "80%" },
  { n: "4", label: "执行工具", x: "21%", y: "80%" },
  { n: "5", label: "结果回灌对话", x: "10%", y: "34%" },
];

// Points on the SVG ring (r=150, centre 210,210) for each stage, so the orbit
// dot can travel to the currently-active stage.
const ORBIT_POINTS = AGENT_STAGES.map((_, i) => {
  const a = (-90 + i * 72) * (Math.PI / 180);
  return { cx: 210 + 150 * Math.cos(a), cy: 210 + 150 * Math.sin(a) };
});

function AgentLoop() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => setActive((a) => (a + 1) % AGENT_STAGES.length), 1400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="agent-loop" aria-label="Agent 核心循环">
      <svg viewBox="0 0 420 420" className="agent-ring">
        <circle cx="210" cy="210" r="150" fill="none" stroke="var(--soft-border)" strokeWidth="1.5" strokeDasharray="4 5" />
        <circle
          className="agent-orbit"
          cx={ORBIT_POINTS[active].cx}
          cy={ORBIT_POINTS[active].cy}
          r="6"
          fill="var(--teal)"
        />
      </svg>
      {AGENT_STAGES.map((s, i) => (
        <div
          key={s.n}
          className={`agent-stage${active === i ? " active" : ""}`}
          style={{ "--x": s.x, "--y": s.y }}
        >
          <b>{s.n}</b>
          <span>{s.label}</span>
        </div>
      ))}
      <div className="agent-core">
        <span className="agent-core-label">是否完成？</span>
        <small>
          否 → 继续循环
          <br />
          是 → 输出结果
        </small>
      </div>
    </div>
  );
}

export default function Architecture() {
  useReveal();
  return (
    <>
      <section className="page-hero">
        <PageHeroBackdrop />
        <div className="page-hero-inner reveal">
          <span className="page-kicker">SYSTEM ARCHITECTURE · 系统架构</span>
          <h1>把项目拆成节点，把节点连成图</h1>
          <p>
            OpenRepo Copilot 用一条「确定性提取 + LLM
            语义增强」的流水线引导 Agent 解析仓库：先把代码拆成结构化节点，再把它们连成边，最终聚合为可探索的知识图谱。
          </p>
        </div>
      </section>

      <section className="section kg-section">
        <div className="section-heading compact reveal">
          <h2>A · 知识图谱是如何被构建的</h2>
        </div>

        <KGStepper />

        <div className="kg-legend">
          <article className="legend-card reveal-step">
            <h3>节点类型 <em>21 种</em></h3>
            <div className="legend-group">
              <span className="lg-label" style={{ "--c": "var(--teal)" }}>代码</span>
              <span className="chip">file</span><span className="chip">function</span><span className="chip">class</span><span className="chip">module</span><span className="chip">concept</span>
            </div>
            <div className="legend-group">
              <span className="lg-label" style={{ "--c": "var(--cyan)" }}>非代码</span>
              <span className="chip">config</span><span className="chip">document</span><span className="chip">service</span><span className="chip">table</span><span className="chip">endpoint</span><span className="chip">pipeline</span><span className="chip">schema</span><span className="chip">resource</span>
            </div>
            <div className="legend-group">
              <span className="lg-label" style={{ "--c": "var(--coral)" }}>领域</span>
              <span className="chip">domain</span><span className="chip">flow</span><span className="chip">step</span>
            </div>
            <div className="legend-group">
              <span className="lg-label" style={{ "--c": "var(--lime)" }}>知识</span>
              <span className="chip">article</span><span className="chip">entity</span><span className="chip">topic</span><span className="chip">claim</span><span className="chip">source</span>
            </div>
            <p className="legend-foot">节点 id 形如 <code>file:src/app.ts</code>、<code>function:src/app.ts:render</code>。</p>
          </article>

          <article className="legend-card reveal-step">
            <h3>边类型 <em>35 种 · 8 组</em></h3>
            <div className="legend-group"><span className="lg-label" style={{ "--c": "var(--teal)" }}>结构</span><span className="chip">imports</span><span className="chip">exports</span><span className="chip">contains</span><span className="chip">inherits</span><span className="chip">implements</span></div>
            <div className="legend-group"><span className="lg-label" style={{ "--c": "var(--coral)" }}>行为</span><span className="chip">calls</span><span className="chip">subscribes</span><span className="chip">publishes</span><span className="chip">middleware</span></div>
            <div className="legend-group"><span className="lg-label" style={{ "--c": "var(--cyan)" }}>数据流</span><span className="chip">reads_from</span><span className="chip">writes_to</span><span className="chip">transforms</span><span className="chip">validates</span></div>
            <div className="legend-group"><span className="lg-label" style={{ "--c": "var(--lime)" }}>依赖</span><span className="chip">depends_on</span><span className="chip">tested_by</span><span className="chip">configures</span></div>
            <div className="legend-group"><span className="lg-label" style={{ "--c": "var(--muted)" }}>语义 / 基础设施 / 数据 / 领域·知识</span><span className="chip">related</span><span className="chip">similar_to</span><span className="chip">deploys</span><span className="chip">routes</span><span className="chip">documents</span><span className="chip">cites</span><span className="chip">builds_on</span><span className="chip">…</span></div>
          </article>

          <article className="legend-card schema-card reveal-step">
            <h3>knowledge-graph.json</h3>
            <pre><code>{`{
  "version": "1.0.0",
  "kind": "codebase",
  "project": { name, languages,
    frameworks, description,
    analyzedAt, gitCommitHash },
  "nodes": [{ id, type, name,
    filePath, lineRange, summary,
    tags, complexity }],
  "edges": [{ source, target,
    type, direction, weight }],
  "layers": [{ id, name, nodeIds }],
  "tour":  [{ order, title, nodeIds }]
}`}</code></pre>
            <p className="legend-foot">Schema 定义：<code>packages/core/src/schema.ts</code>（Zod 校验）。</p>
          </article>
        </div>
      </section>

      <section className="section agent-section">
        <div className="section-heading compact reveal">
          <h2>B · 内置 Agent —— 类 Claude Code 核心循环</h2>
        </div>
        <div className="agent-note reveal">
          <span className="agent-note-dot"></span>
          <p>
            当前 app 内嵌的是一套<strong>确定性多阶段流水线</strong>（<code>analysis-worker.ts</code>）。这里展示的是后续将直接嵌入 Workbench 版本的<strong>最终形态</strong>：一个完整的、类 Claude Code 的核心 Agent 循环。
          </p>
        </div>

        <div className="agent-board reveal">
          <AgentLoop />

          <div className="agent-side">
            <article className="agent-card reveal-step">
              <h3>工具注册表</h3>
              <ul className="tool-list">
                <li><code>Read</code><span>读取文件内容</span></li>
                <li><code>Write</code><span>写入 / 新建文件</span></li>
                <li><code>Edit</code><span>精确替换式修改</span></li>
                <li><code>Grep</code><span>正则全仓检索</span></li>
                <li><code>Glob</code><span>文件名模式匹配</span></li>
                <li><code>Bash</code><span>执行命令 / 脚本</span></li>
                <li><code>Task</code><span>派发子 Agent 分解任务</span></li>
              </ul>
            </article>
            <article className="agent-card reveal-step">
              <h3>上下文管理</h3>
              <p>系统提示设定角色与规范；超长对话自动压缩摘要；复杂任务派发子 Agent 并行探索，结果回主线，避免污染主上下文。</p>
            </article>
            <article className="agent-card reveal-step">
              <h3>Provider 接入</h3>
              <p>OpenAI 兼容 <code>/chat/completions</code>，预设多家可切换：</p>
              <div className="provider-chips">
                <span className="chip">DashScope · glm-5.1</span>
                <span className="chip">Zhipu</span>
                <span className="chip">OpenAI</span>
                <span className="chip">DeepSeek</span>
                <span className="chip">OpenRouter</span>
                <span className="chip">Custom</span>
              </div>
              <p className="legend-foot"><code>packages/openrepo/src/providers.ts · agent-client.ts</code></p>
            </article>
          </div>
        </div>
      </section>

      <section className="section next-cta-section">
        <div className="next-cta reveal">
          <p>每条 skill 命令具体怎么用、有哪些规范？</p>
          <Link className="button primary" to="/skills">前往「SKILL解析」</Link>
        </div>
      </section>
    </>
  );
}
