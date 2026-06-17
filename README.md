# OpenRepoCopilot Website

OpenRepoCopilot 的**官方介绍与下载站**。这是一个零依赖的静态多页网站，向用户展示 OpenRepoCopilot 的下载入口、使用流程、系统架构与 SKILL 解析。可直接部署到任意静态托管平台（GitHub Pages、Vercel、Netlify、对象存储等）。

> OpenRepoCopilot 本体仓库：<https://github.com/Knight5128/OpenRepoCopilot>

## 关于 OpenRepoCopilot

OpenRepoCopilot 是一个**本地优先（Local-First）的 AI 仓库知识工作台**，将 GitHub 仓库、文档集合与项目图谱转化为可探索、可搜索、可复用的交互式知识图谱。

## 站点结构（1 主页 + 3 子页面）

不同部分拆成独立页面，共用顶部导航与样式，层次更清晰：

| 页面 | 小节 | 内容 |
| --- | --- | --- |
| `index.html` | **快速开始** | 门户首页：logo、品牌名、客户端下载按钮（Windows 可下载，macOS/Linux「即将推出」）、全套 skill 一键安装命令，以及通往三个子页的导航卡 |
| `usage.html` | **使用流程** | 端到端使用旅程：安装 → `/openrepo` 工作台 → 建项目 → `/openrepo-analyze` 队列分析 → 生成图谱 → 仪表盘探索 |
| `architecture.html` | **系统架构** | A. 知识图谱构建的 7 步动画（扫描 → 分批 → 拆节点 → 连边 → 去重 → 聚类 → 分层/导览）+ 节点/边/schema 图例；B. 内置 Agent：类 Claude Code 核心循环（最终形态） |
| `skills.html` | **SKILL解析** | 11 个 skill 命令逐个拆解；每张卡片开头有「命令提示符打字 → 退格 → 重打」的循环动画 |

顶部导航在四页之间互跳，并高亮当前页（由 `<body data-page>` 驱动）。

## 文件说明

| 文件 | 用途 |
| --- | --- |
| `index.html` / `usage.html` / `architecture.html` / `skills.html` | 四个页面的结构与文案 |
| `styles.css` | 共用样式，含明/暗/跟随系统三套主题与全部页式 |
| `script.js` | 共用站点脚本：主题切换、滚动进度、滚动揭示、命令复制、当前页高亮、移动端导航 |
| `architecture.js` | 架构页专用：知识图谱构建步进动画 + Agent 循环高亮 |
| `skills.js` | SKILL 页专用：每个 skill 的命令打字机循环动画 |
| `assets/openrepo-copilot-logo.png` | 品牌 logo |
| `assets/hero-knowledge-graph.png` | 页面背景点缀 |
| `downloads/OpenRepoCopilot-Setup-20260617.exe` | Windows 客户端安装包 |

## 本地预览

在目录内启动任意静态服务器：

```bash
python -m http.server 8080
```

然后访问 <http://localhost:8080>（默认进入 `index.html`）。

### 调试参数

各页支持通过 URL 查询参数控制行为，便于截图与调试：

- `?theme=light|dark|system` —— 指定配色模式（默认 `dark`，用户选择会记忆到 `localStorage`）。
- `?reveal=all` —— 关闭滚动揭示与分步动画，立即显示所有内容（架构动画直接定格到末态、SKILL 命令直接显示全名）。

例如：<http://localhost:8080/architecture.html?theme=light&reveal=all>

## 部署

本站为纯静态资源，上传以下内容到托管平台即可（无构建步骤、无运行时依赖）：

- `index.html` / `usage.html` / `architecture.html` / `skills.html`
- `styles.css` / `script.js` / `architecture.js` / `skills.js`
- `assets/`（logo 与背景图）
- `downloads/`（Windows 安装包，约 28 MB）

> 注意：`downloads/` 中的 `.exe` 体积较大且会进入 git。若不希望大二进制入库，可改为外部发布渠道（如 GitHub Releases）并相应更新 `index.html` 中的下载链接。

## 维护说明

- 下载链接与一键安装命令集中在 `index.html` 的「快速开始」小节，更新版本号或命令时直接编辑。
- 各页指向本体仓库的链接当前为 <https://github.com/Knight5128/OpenRepoCopilot>，如仓库地址变更需同步更新（多处出现）。
- 新增安装包后，更新 `index.html` 中 Windows 下载按钮的 `href` 与文件名。
