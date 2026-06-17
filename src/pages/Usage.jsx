import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeroBackdrop from "../components/PageHeroBackdrop.jsx";
import { useReveal } from "../hooks/useReveal.js";

// Two distinct end-to-end paths from install → insight.
const FLOWS = {
  app: {
    id: "app",
    glyph: "▣",
    label: "Workbench App 全流程",
    sub: "桌面客户端 + 本地工作台，多项目集中管理",
    color: "var(--teal)",
    title: "OpenRepoCopilot Workbench",
    env: [
      ["运行方式", "桌面客户端 + 本地 Workbench"],
      ["入口命令", "/openrepo · /openrepo-analyze"],
      ["数据源", "GitHub 公共仓库 / 文档集合"],
      ["适合", "多项目集中管理、队列化分析"],
    ],
    steps: [
      {
        h: "安装桌面客户端",
        body: <>下载 Windows <code>.exe</code> 安装包，安装 OpenRepoCopilot 桌面客户端。</>,
      },
      {
        h: "启动本地工作台",
        body: (
          <>
            <code>/openrepo</code> 启动 Workbench，浏览器打开 <code>http://127.0.0.1:5173/</code>
            ，集中管理多个项目。
          </>
        ),
      },
      {
        h: "创建项目",
        body: (
          <>
            在工作台填入 GitHub 公共仓库地址，或导入 <code>.md / .txt / .pdf / .docx</code> 文档知识库。
          </>
        ),
      },
      {
        h: "队列分析",
        body: (
          <>
            <code>/openrepo-analyze &lt;project-id&gt;</code> 领取队列任务，多 Agent 自动执行（
            <code>github_repo</code> / <code>document_kb</code> 两种流程）。
          </>
        ),
      },
      {
        h: "生成知识图谱",
        body: (
          <>
            输出 <code>knowledge-graph.json</code>：文件 / 模块 / 函数 / 依赖等节点与关联边、分层与导览。
          </>
        ),
      },
      {
        h: "工作台探索",
        body: (
          <>
            在 Workbench 内置仪表盘搜索节点、过滤类型、查看 Guided Tour 与 Domain View。
          </>
        ),
      },
    ],
  },
  skill: {
    id: "skill",
    glyph: "❯",
    label: "Skill 全流程",
    sub: "装进 Agent 直接跑，单仓库即开即用",
    color: "var(--cyan)",
    title: "Agent · Claude Code / Codex",
    env: [
      ["运行方式", "skill 装入 Agent，直接运行"],
      ["入口命令", "/understand 家族"],
      ["数据源", "本地仓库 / wiki 知识库"],
      ["适合", "单仓库即开即用、终端 / CI 工作流"],
    ],
    steps: [
      {
        h: "一键安装 skill",
        body: (
          <>
            运行一键脚本把全套 skill 装入你的 Agent（<code>Claude Code</code> / <code>Codex</code>），无需桌面客户端。
          </>
        ),
      },
      {
        h: "直接分析仓库",
        body: (
          <>
            在目标仓库目录运行 <code>/understand [path]</code>，Phase 0–7 全自动：扫描 → 分批 → 并发分析 → 装配 → 分层 → 导览。
          </>
        ),
      },
      {
        h: "生成知识图谱",
        body: (
          <>
            输出 <code>knowledge-graph.json</code> 与 <code>meta.json</code>，支持只对变更文件的增量更新。
          </>
        ),
      },
      {
        h: "启动仪表盘",
        body: (
          <>
            <code>/understand-dashboard</code> 启动交互式 Web 仪表盘，绑定 <code>127.0.0.1</code> 本地可视化探索。
          </>
        ),
      },
      {
        h: "深入理解",
        body: (
          <>
            配合 <code>/understand-chat</code> 问答、<code>/understand-explain</code> 讲解、
            <code>/understand-diff</code> 看改动影响、<code>/understand-onboard</code> 生成上手文档。
          </>
        ),
      },
      {
        h: "领域 / 知识库",
        body: (
          <>
            <code>/understand-domain</code> 提炼业务领域流程图；<code>/understand-knowledge</code> 分析 wiki 知识库生成知识图谱。
          </>
        ),
      },
    ],
  },
};

const DEMO_STEPS = [
  { glyph: "＋", h: "创建项目", p: "输入 GitHub 仓库地址或上传文档集合。" },
  { glyph: "⚙", h: "Agent 分析", p: "多 Agent 流水线自动解析代码结构与文档内容。" },
  { glyph: "◈", h: "图谱生成", p: "输出结构化知识图谱，支持社区聚类与层级钻取。" },
  { glyph: "⊕", h: "交互探索", p: "在 Dashboard 中搜索、过滤、导览，深入理解仓库。" },
];

export default function Usage() {
  const [flowId, setFlowId] = useState("app");
  useReveal();
  const flow = FLOWS[flowId];

  return (
    <>
      <section className="page-hero">
        <PageHeroBackdrop />
        <div className="page-hero-inner reveal">
          <span className="page-kicker">USAGE FLOW · 使用流程</span>
          <h1>从安装到洞察的端到端旅程</h1>
          <p>
            OpenRepo Copilot 有两条通往知识图谱的路径：装好桌面客户端走 Workbench
            队列分析，或把 skill 装进 Agent 直接开跑。选一条，看完整流程。
          </p>
        </div>
      </section>

      <section className="section product-section">
        <div className="section-heading compact reveal">
          <h2>两种使用方式，同一套知识图谱</h2>
        </div>

        <div className="flow-switch reveal" role="tablist" aria-label="选择使用方式">
          {Object.values(FLOWS).map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={flowId === f.id}
              className={`flow-switch-btn${flowId === f.id ? " is-active" : ""}`}
              style={{ "--c": f.color }}
              onClick={() => setFlowId(f.id)}
            >
              <span className="fs-label">
                <span className="fs-glyph">{f.glyph}</span>
                {f.label}
              </span>
              <span className="fs-sub">{f.sub}</span>
            </button>
          ))}
        </div>

        <div className="product-shell flow-anim" key={flow.id}>
          <aside className="tool-panel" aria-label="环境信息" style={{ "--c": flow.color }}>
            {flow.env.map(([k, v]) => (
              <div className="panel-row" key={k}>
                <span>{k}</span>
                <strong>{v}</strong>
              </div>
            ))}
          </aside>
          <div className="workspace">
            <div className="workspace-topbar">
              <span></span><span></span><span></span>
              <p>{flow.title}</p>
            </div>
            <div className="workflow-list">
              {flow.steps.map((s, i) => (
                <div className="workflow-item" key={s.h} style={{ "--c": flow.color }}>
                  <span className="node"></span>
                  <div>
                    <h3>
                      <em className="step-index">{String(i + 1).padStart(2, "0")}</em>
                      {s.h}
                    </h3>
                    <p>{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section demo-section-wrapper">
        <div className="section-heading compact reveal">
          <h2>一次完整分析长这样</h2>
        </div>
        <div className="demo-intro reveal">
          <p>
            无论走哪条路径，最终都汇聚到同一份交互式知识图谱：系统自动创建项目、执行多 Agent
            分析、生成图谱，全程本地完成。
          </p>
          <div className="demo-intro-row">
            <div className="demo-status" aria-label="演示状态">
              <span className="status-dot"></span>
              <strong>演示场景</strong>
              <span>分析 GitHub 开源仓库并生成知识图谱</span>
            </div>
          </div>
        </div>
        <div className="demo-stage reveal" aria-label="OpenRepoCopilot 演示流程">
          <div className="stage-screen">
            <div className="stage-topbar">
              <span></span><span></span><span></span>
              <p>OpenRepoCopilot / Dashboard</p>
            </div>
            <div className="stage-body">
              <div className="stage-sidebar">
                <span className="stage-label">项目</span>
                <strong>openrepo-copilot</strong>
                <span className="stage-label">分析进度</span>
                <div className="score-bar"><span style={{ width: "100%" }}></span></div>
                <span className="stage-label">节点数量</span>
                <div className="score-bar"><span style={{ width: "72%" }}></span></div>
              </div>
              <div className="stage-output">
                <div className="output-line">
                  <span>01</span>
                  <p>克隆仓库并导入 .md / .txt / .pdf 文档，创建本地项目。</p>
                </div>
                <div className="output-line">
                  <span>02</span>
                  <p>提交分析任务到队列，多 Agent 自动执行代码与文档解析。</p>
                </div>
                <div className="output-line">
                  <span>03</span>
                  <p>生成 knowledge-graph.json，包含文件、模块、函数与依赖关系。</p>
                </div>
                <div className="output-line">
                  <span>04</span>
                  <p>在 Dashboard 中搜索节点、过滤类型、查看 Guided Tours 与 Domain Views。</p>
                </div>
              </div>
            </div>
          </div>
          <div className="demo-steps" aria-label="演示步骤">
            {DEMO_STEPS.map((d) => (
              <article className="demo-step reveal-step" key={d.h}>
                <span>{d.glyph}</span>
                <div>
                  <h3>{d.h}</h3>
                  <p>{d.p}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section next-cta-section">
        <div className="next-cta reveal">
          <p>节点与边如何被 Agent 拆出来、连起来的？Agent 核心循环长什么样？</p>
          <Link className="button primary" to="/architecture">
            前往「系统架构」
          </Link>
        </div>
      </section>
    </>
  );
}
