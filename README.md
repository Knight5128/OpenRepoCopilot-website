# OpenRepoCopilot Website

OpenRepoCopilot 的**官方介绍与下载页**。这是一个零依赖的静态单页网站，用于向用户展示 OpenRepoCopilot 的核心能力、系统架构与工作流程，并提供安装与下载入口。可直接部署到任意静态托管平台（GitHub Pages、Vercel、Netlify、对象存储等）。

> OpenRepoCopilot 本体仓库：<https://github.com/Knight5128/OpenRepoCopilot>

## 关于 OpenRepoCopilot

OpenRepoCopilot 是一个**本地优先（Local-First）的 AI 仓库知识工作台**，将 GitHub 仓库、文档集合与项目图谱转化为可探索、可搜索、可复用的交互式知识图谱。本网站即是它的对外门户，向访客介绍以下要点：

- **Multi-Agent 分析流水线** —— 多 Agent 自动拆解仓库结构、提取实体关系，通过队列调度逐步生成知识图谱。
- **Knowledge Graph 生成** —— 输出结构化 `knowledge-graph.json`，涵盖文件、模块、函数、类、依赖等节点及关联边，支持社区聚类与层级钻取。
- **多格式文档导入** —— 支持 `.md` / `.txt` / `.pdf` / `.docx`，与代码图谱统一建模。
- **Interactive Dashboard** —— 提供搜索、类型过滤、节点详情、Guided Tours 与 Domain Views，支持 PNG / SVG / JSON 导出。
- **Local-First 存储** —— 数据存于本地 `~/.openrepo-copilot`，无云端依赖，图谱产物可提交至 Git 供团队复用。

## 页面结构

单页网站，包含以下锚点小节：

| 锚点 | 小节 | 内容 |
| --- | --- | --- |
| `#top` | Hero | 项目标题、一句话介绍与核心能力标签 |
| `#workflow` | 端到端工作流 | 创建项目 → 队列分析 → 生成图谱 → 交互探索 |
| `#architecture` | 系统架构 | 5 张可翻页幻灯片，介绍技术栈与原理 |
| `#demo` | 演示 | 从仓库到知识图谱的完整旅程演示 |
| `#install` | 快速启动 / 下载 | 安装与构建命令，附一键复制 |

## 文件说明

| 文件 | 用途 |
| --- | --- |
| `index.html` | 页面结构与全部文案 |
| `styles.css` | 样式，含明/暗/跟随系统三套主题 |
| `script.js` | 主题切换、滚动进度、滚动揭示动画、架构幻灯片、命令复制 |
| `assets/hero-knowledge-graph.png` | Hero 背景图 |

## 本地预览

直接双击 `index.html`，或在目录内启动任意静态服务器：

```bash
python3 -m http.server 8080
```

然后访问 <http://localhost:8080>。

### 调试参数

页面支持通过 URL 查询参数控制行为，便于截图与调试：

- `?theme=light|dark|system` —— 指定配色模式（默认 `dark`，用户选择会记忆到 `localStorage`）。
- `?reveal=all` —— 关闭滚动揭示动画，立即显示所有内容。

例如：<http://localhost:8080/?theme=light&reveal=all>

## 部署

本站为纯静态资源，上传以下文件到托管平台即可：

- `index.html`
- `styles.css`
- `script.js`
- `assets/hero-knowledge-graph.png`

无需构建步骤，无运行时依赖。

## 维护说明

- 文案与下载/安装命令集中在 `index.html`，更新版本号或命令时直接编辑对应小节。
- 指向本体仓库的链接当前为 <https://github.com/Knight5128/OpenRepoCopilot>，如仓库地址变更需同步更新（`index.html` 中多处出现）。
</content>
</invoke>
