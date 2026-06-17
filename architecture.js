// ── Architecture page: KG build stepper + Agent loop highlight ──
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealAll =
  new URLSearchParams(window.location.search).get("reveal") === "all";

// --- Knowledge graph build stepper ---
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

const stage = document.querySelector(".kg-stage");
const kgEls = document.querySelectorAll(".kg-el");
const dots = document.querySelectorAll(".kg-dot");
const plSteps = document.querySelectorAll(".pl-step");
const numEl = document.querySelector(".kg-step-num");
const titleEl = document.querySelector(".kg-step-title");
const descEl = document.querySelector(".kg-step-desc");
const srcEl = document.querySelector(".kg-step-src");
const playBtn = document.querySelector(".kg-play");
const prevBtn = document.querySelector(".kg-prev");
const nextBtn = document.querySelector(".kg-next");

let current = 1;
let playing = !(reduce || revealAll);
let timer = null;

const renderStep = (step) => {
  current = ((step - 1 + TOTAL) % TOTAL) + 1;
  stage.dataset.step = String(current);
  kgEls.forEach((el) => {
    const from = Number(el.dataset.from || 1);
    const until = el.dataset.until ? Number(el.dataset.until) : TOTAL;
    el.classList.toggle("on", current >= from && current <= until);
  });
  dots.forEach((d) => d.classList.toggle("active", Number(d.dataset.step) === current));
  plSteps.forEach((p) => p.classList.toggle("active", Number(p.dataset.pl) <= current));
  const info = STEPS[current - 1];
  if (numEl) numEl.textContent = info.num;
  if (titleEl) titleEl.textContent = info.title;
  if (descEl) descEl.textContent = info.desc;
  if (srcEl) srcEl.textContent = info.src;
};

const setPlaying = (state) => {
  playing = state;
  if (playBtn) {
    playBtn.textContent = playing ? "⏸" : "▶";
    playBtn.setAttribute("aria-pressed", String(playing));
  }
  clearInterval(timer);
  if (playing) {
    timer = setInterval(() => renderStep(current + 1), 2600);
  }
};

if (stage) {
  renderStep(revealAll ? TOTAL : 1);
  prevBtn?.addEventListener("click", () => { renderStep(current - 1); setPlaying(false); });
  nextBtn?.addEventListener("click", () => { renderStep(current + 1); setPlaying(false); });
  dots.forEach((d) =>
    d.addEventListener("click", () => { renderStep(Number(d.dataset.step)); setPlaying(false); }),
  );
  playBtn?.addEventListener("click", () => setPlaying(!playing));
  if (playing) setPlaying(true);
}

// --- Agent loop highlight cycler ---
const agentStages = document.querySelectorAll(".agent-stage");
if (agentStages.length && !reduce) {
  let ai = 0;
  const tick = () => {
    agentStages.forEach((s, i) => s.classList.toggle("active", i === ai));
    ai = (ai + 1) % agentStages.length;
  };
  tick();
  setInterval(tick, 1400);
} else {
  agentStages.forEach((s) => s.classList.add("active"));
}
