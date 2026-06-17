import { useMemo, useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useUpdateNodeInternals,
} from "reactflow";
import { SKILLS, SKILL_EDGES, groupById } from "../data/skills.js";

// Tidy left-to-right layout: infra → analyze → core hub → leaf commands.
const POS = {
  openrepo: { x: 0, y: 280 },
  "openrepo-analyze": { x: 240, y: 280 },
  understand: { x: 480, y: 280 },
  "understand-chat": { x: 760, y: 0 },
  "understand-explain": { x: 760, y: 93 },
  "understand-diff": { x: 760, y: 186 },
  "understand-onboard": { x: 760, y: 279 },
  "understand-dashboard": { x: 760, y: 372 },
  "understand-domain": { x: 760, y: 465 },
  "understand-knowledge": { x: 760, y: 558 },
};

function SkillNode({ data, selected }) {
  const color = groupById[data.group]?.color || "var(--teal)";
  return (
    <div
      className={`skill-node${selected ? " is-selected" : ""}${data.feature ? " is-feature" : ""}`}
      style={{ "--c": color }}
    >
      <Handle type="target" position={Position.Left} />
      <span className="skill-node-dot" />
      <span className="skill-node-cmd">{data.cmd}</span>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

const nodeTypes = { skill: SkillNode };

function Graph({ selectedId, onSelect }) {
  const initialNodes = useMemo(
    () =>
      SKILLS.map((s) => ({
        id: s.id,
        type: "skill",
        position: POS[s.id] || { x: 0, y: 0 },
        data: { cmd: s.cmd, group: s.group, feature: s.feature },
      })),
    [],
  );

  const initialEdges = useMemo(
    () =>
      SKILL_EDGES.map(([source, target]) => ({
        id: `${source}->${target}`,
        source,
        target,
        animated: true,
        style: { stroke: "var(--teal)", strokeWidth: 1.4, opacity: 0.5 },
      })),
    [],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const updateNodeInternals = useUpdateNodeInternals();

  // Custom nodes don't always register their handle bounds on first paint
  // (e.g. if the pane mounts at zero width), which leaves edges unrendered.
  // Force a re-read of every node's handles a few times after mount.
  useEffect(() => {
    const refresh = () => initialNodes.forEach((n) => updateNodeInternals(n.id));
    const timers = [0, 60, 200, 500].map((ms) => setTimeout(refresh, ms));
    return () => timers.forEach(clearTimeout);
  }, [initialNodes, updateNodeInternals]);

  // Reflect selection by mutating node state in place (stable identities for
  // unchanged nodes) so ReactFlow keeps measured handle bounds.
  useEffect(() => {
    setNodes((prev) =>
      prev.map((n) =>
        n.selected === (n.id === selectedId)
          ? n
          : { ...n, selected: n.id === selectedId },
      ),
    );
  }, [selectedId, setNodes]);

  const handleNodeClick = useCallback(
    (_evt, node) => onSelect(node.id),
    [onSelect],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={handleNodeClick}
      fitView
      fitViewOptions={{ padding: 0.18 }}
      minZoom={0.4}
      maxZoom={1.6}
      zoomOnScroll={false}
      panOnScroll={false}
      preventScrolling={false}
      proOptions={{ hideAttribution: true }}
    >
      <Background gap={22} size={1} color="var(--graph-dot)" />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}

export default function SkillGraph(props) {
  return (
    <div className="skill-graph">
      <ReactFlowProvider>
        <Graph {...props} />
      </ReactFlowProvider>
    </div>
  );
}
