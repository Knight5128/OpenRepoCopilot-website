import { useEffect, useRef } from "react";

// Self-contained force-directed knowledge graph rendered on a canvas — no
// third-party graph lib, so it stays light and predictable. Nodes drift on a
// tiny velocity-Verlet simulation; data particles flow along the edges.

const NODE_DEFS = [
  { id: "repo", label: "GitHub 仓库", group: "hub", val: 9 },
  { id: "docs", label: "文档知识库", group: "hub", val: 8 },
  { id: "agent", label: "Agent", group: "agent", val: 8 },
  { id: "kg", label: "知识图谱", group: "kg", val: 11 },
  { id: "dash", label: "仪表盘", group: "kg", val: 7 },
  { id: "file", label: "file", group: "code", val: 5 },
  { id: "func", label: "function", group: "code", val: 5 },
  { id: "class", label: "class", group: "code", val: 4 },
  { id: "module", label: "module", group: "code", val: 4 },
  { id: "imports", label: "imports", group: "edge", val: 3 },
  { id: "calls", label: "calls", group: "edge", val: 3 },
  { id: "depends", label: "depends_on", group: "edge", val: 3 },
  { id: "layer", label: "layers", group: "meta", val: 4 },
  { id: "cluster", label: "community", group: "meta", val: 4 },
  { id: "tour", label: "guided tour", group: "meta", val: 4 },
  { id: "understand", label: "/understand", group: "skill", val: 6 },
  { id: "chat", label: "/chat", group: "skill", val: 4 },
  { id: "diff", label: "/diff", group: "skill", val: 4 },
  { id: "domain", label: "/domain", group: "skill", val: 4 },
];

const LINK_DEFS = [
  ["repo", "agent"], ["docs", "agent"], ["agent", "file"], ["agent", "understand"],
  ["file", "func"], ["file", "class"], ["func", "module"], ["file", "imports"],
  ["func", "calls"], ["module", "depends"], ["imports", "kg"], ["calls", "kg"],
  ["depends", "kg"], ["class", "kg"], ["understand", "kg"], ["kg", "layer"],
  ["kg", "cluster"], ["kg", "tour"], ["kg", "dash"], ["understand", "chat"],
  ["understand", "diff"], ["understand", "domain"], ["dash", "tour"],
];

function readPalette() {
  const cs = getComputedStyle(document.documentElement);
  const v = (n, f) => cs.getPropertyValue(n).trim() || f;
  return {
    hub: v("--teal", "#35d0ba"),
    agent: v("--coral", "#ff7d6b"),
    kg: v("--lime", "#b9e769"),
    code: v("--teal", "#35d0ba"),
    edge: v("--coral", "#ff7d6b"),
    meta: v("--cyan", "#82ddff"),
    skill: v("--cyan", "#82ddff"),
    ink: v("--ink", "#f3f7f4"),
    muted: v("--muted", "#9fb2ae"),
  };
}

// Convert a hex color to "r,g,b" so we can apply per-draw alpha.
function rgb(hex) {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const i = parseInt(n, 16);
  return `${(i >> 16) & 255},${(i >> 8) & 255},${i & 255}`;
}

export default function HeroGraph() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let palette = readPalette();
    let W = wrap.clientWidth || 800;
    let H = wrap.clientHeight || 520;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const adj = new Map(NODE_DEFS.map((n) => [n.id, new Set([n.id])]));
    LINK_DEFS.forEach(([a, b]) => { adj.get(a).add(b); adj.get(b).add(a); });

    // Init node positions in a loose ring around the centre.
    const nodes = NODE_DEFS.map((n, i) => {
      const a = (i / NODE_DEFS.length) * Math.PI * 2;
      const r = Math.min(W, H) * 0.3;
      return {
        ...n,
        x: W / 2 + Math.cos(a) * r + (Math.random() - 0.5) * 40,
        y: H / 2 + Math.sin(a) * r + (Math.random() - 0.5) * 40,
        vx: 0, vy: 0, fixed: false,
      };
    });
    const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
    const links = LINK_DEFS.map(([s, t]) => ({ s: byId[s], t: byId[t], p: Math.random() }));

    let hover = null;
    let drag = null;
    const mouse = { x: -1, y: -1 };

    const resize = () => {
      W = wrap.clientWidth || 800;
      H = wrap.clientHeight || 520;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // Pause the loop while the hero is scrolled out of view (saves CPU and
    // lets the rest of the page reach an idle state).
    let visible = true;
    const io = new IntersectionObserver(
      ([e]) => { visible = e.isIntersecting; },
      { threshold: 0 },
    );
    io.observe(wrap);

    const mo = new MutationObserver(() => { palette = readPalette(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const radius = (n) => Math.sqrt(n.val) * 1.7 + 1.5;

    const nodeAt = (mx, my) => {
      for (const n of nodes) {
        const r = radius(n) + 6;
        if ((n.x - mx) ** 2 + (n.y - my) ** 2 <= r * r) return n;
      }
      return null;
    };

    const toLocal = (e) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMove = (e) => {
      const { x, y } = toLocal(e);
      mouse.x = x; mouse.y = y;
      if (drag) { drag.x = x; drag.y = y; drag.vx = 0; drag.vy = 0; }
      else hover = nodeAt(x, y);
      canvas.style.cursor = hover || drag ? "grab" : "default";
    };
    const onDown = (e) => {
      const { x, y } = toLocal(e);
      const n = nodeAt(x, y);
      if (n) { drag = n; n.fixed = true; canvas.style.cursor = "grabbing"; }
    };
    const onUp = () => { if (drag) { drag.fixed = false; drag = null; } };
    const onLeave = () => { hover = null; mouse.x = -1; mouse.y = -1; };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    canvas.addEventListener("mouseleave", onLeave);

    const step = () => {
      const cx = W / 2, cy = H / 2;
      // Repulsion (all pairs — n is small).
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          let dx = a.x - b.x, dy = a.y - b.y;
          let d2 = dx * dx + dy * dy || 0.01;
          const f = 2600 / d2;
          const d = Math.sqrt(d2);
          const ux = dx / d, uy = dy / d;
          a.vx += ux * f; a.vy += uy * f;
          b.vx -= ux * f; b.vy -= uy * f;
        }
      }
      // Springs.
      for (const l of links) {
        let dx = l.t.x - l.s.x, dy = l.t.y - l.s.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
        const f = (d - 84) * 0.018;
        const ux = dx / d, uy = dy / d;
        l.s.vx += ux * f; l.s.vy += uy * f;
        l.t.vx -= ux * f; l.t.vy -= uy * f;
      }
      // Centering + integrate.
      for (const n of nodes) {
        n.vx += (cx - n.x) * 0.0016;
        n.vy += (cy - n.y) * 0.0016;
        if (n.fixed) { n.vx = 0; n.vy = 0; continue; }
        n.vx *= 0.86; n.vy *= 0.86;
        n.x += Math.max(-6, Math.min(6, n.vx));
        n.y += Math.max(-6, Math.min(6, n.vy));
        n.x = Math.max(20, Math.min(W - 20, n.x));
        n.y = Math.max(20, Math.min(H - 20, n.y));
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const hoveredSet = hover ? adj.get(hover.id) : null;

      // Links.
      for (const l of links) {
        const on = hoveredSet ? hoveredSet.has(l.s.id) && hoveredSet.has(l.t.id) : false;
        const base = hover ? (on ? 0.85 : 0.06) : 0.2;
        ctx.strokeStyle = `rgba(${rgb(on ? palette.hub : palette.muted)},${base})`;
        ctx.lineWidth = on ? 1.6 : 0.7;
        ctx.beginPath();
        ctx.moveTo(l.s.x, l.s.y);
        ctx.lineTo(l.t.x, l.t.y);
        ctx.stroke();

        // Flowing particle.
        if (!reduceMotion && (!hover || on)) {
          l.p += 0.006;
          if (l.p > 1) l.p -= 1;
          const px = l.s.x + (l.t.x - l.s.x) * l.p;
          const py = l.s.y + (l.t.y - l.s.y) * l.p;
          ctx.fillStyle = `rgba(${rgb(palette.hub)},${on ? 0.95 : 0.55})`;
          ctx.beginPath();
          ctx.arc(px, py, on ? 2.1 : 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Nodes.
      for (const n of nodes) {
        const color = palette[n.group] || palette.hub;
        const r = radius(n);
        const active = hoveredSet ? hoveredSet.has(n.id) : false;
        const dim = hover && !active;
        const alpha = dim ? 0.22 : 1;

        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 2.6);
        glow.addColorStop(0, `rgba(${rgb(color)},${0.85 * alpha})`);
        glow.addColorStop(1, `rgba(${rgb(color)},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 2.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${rgb(color)},${alpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();

        if (n.val >= 6 || active) {
          ctx.font = "600 11px Inter, system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillStyle = `rgba(${rgb(palette.ink)},${dim ? 0.3 : 0.92})`;
          ctx.fillText(n.label, n.x, n.y + r + 3);
        }
      }
    };

    let raf;
    let settle = 0;
    const loop = () => {
      // Safety net: if the backing store no longer matches the container
      // (e.g. it was sized during an unsettled layout pass), re-sync.
      if (Math.abs(canvas.width / dpr - wrap.clientWidth) > 2 ||
          Math.abs(canvas.height / dpr - wrap.clientHeight) > 2) {
        resize();
      }
      if (visible) {
        // Always simulate a bit so layout settles; afterwards keep a gentle drift.
        if (!reduceMotion || settle < 180) { step(); settle++; }
        draw();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="hero-graph" ref={wrapRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
