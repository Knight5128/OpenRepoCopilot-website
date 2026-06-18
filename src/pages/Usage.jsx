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
      ["运行方式", "桌面 Workbench App"],
      ["入口命令", "点击桌面图标 · /openrepo"],
      ["数据源", "GitHub 公共仓库 / 上传文档集合"],
      ["适合", "多项目集中管理、队列化分析"],
    ],
    steps: [
      {
        h: "安装桌面客户端",
        body: <>前往官网下载 Windows <code>.exe</code> 安装包，安装 OpenRepoCopilot 桌面客户端。</>,
      },
      {
        h: "启动本地工作台",
        body: (
          <>
            直接点击可执行文件 <code>.exe</code> 快捷方式，或者通过命令 <code>/openrepo</code> 启动 Electron 桌面 Workbench，离开始分析只差一步。
          </>
        ),
      },
      {
        h: "配置 LLM API / Endpoint",
        body: (
          <>
            在工作台设置中填入 LLM 的 API Key 与 <code>Endpoint</code>，为内置 Agent 循环配置驱动分析的模型。
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
            进入项目界面，一键点击开始分析，由 Workbench 内置 Agent 循环自动对项目进行分析。
          </>
        ),
      },
      {
        h: "等待分析完成",
        body: (
          <>
            Agent 循环逐阶段推进，完成后自动产出 <code>knowledge-graph.json</code>：文件 / 模块 / 函数 / 依赖等节点与关联边、分层与导览。
          </>
        ),
      },
      {
        h: "进入可交互知识图谱探索",
        body: (
          <>
            打开项目专属 Graph View，通过搜索节点、过滤类型、查看 Guided Tour 与 Domain View 等交互方式，深入洞察项目。
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
      ["运行方式", "skill 命令 · 支持多种 Agent"],
      ["入口命令", "/understand 家族"],
      ["数据源", "本地项目仓库 / 本地知识库"],
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
            <code>/understand-dashboard</code> 启动交互式 Web 仪表盘，直接打开 <code>127.0.0.1</code> 即可本地可视化探索。
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
          <h1>从安装到项目洞察的全旅程</h1>
          <p>
            两种访问 OpenRepo Copilot 的方式任你选择：官网一键下载桌面客户端，导入想要深入了解的项目/文档，一键分析即可；或者，你也可以把由 Copilot 的核心能力所精炼成的 skill 装进你常用的 Agent ，一键调用。任你所选。
          </p>
        </div>
      </section>

      <section className="section product-section">
        <div className="section-heading compact reveal">
          <h2>两种方式，交付同一套知识洞察图谱</h2>
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
