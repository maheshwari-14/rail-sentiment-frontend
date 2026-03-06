import { Info, Loader2, Network, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Layout from "../components/layout";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// ── Default OWL XML (professor's ontology) ──────────────────────────
const DEFAULT_OWL = `<?xml version="1.0"?>
<Ontology xmlns="http://www.w3.org/2002/07/owl#"
     xml:base="http://www.semanticweb.org/sankalpa7/ontologies/2018/11/untitled-ontology-15"
     xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
     xmlns:xml="http://www.w3.org/XML/1998/namespace"
     xmlns:xsd="http://www.w3.org/2001/XMLSchema#"
     xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
     ontologyIRI="http://www.semanticweb.org/sankalpa7/ontologies/2018/11/untitled-ontology-15">
    <Prefix name="owl" IRI="http://www.w3.org/2002/07/owl#"/>
    <Prefix name="rdf" IRI="http://www.w3.org/1999/02/22-rdf-syntax-ns#"/>
    <Prefix name="xml" IRI="http://www.w3.org/XML/1998/namespace"/>
    <Prefix name="xsd" IRI="http://www.w3.org/2001/XMLSchema#"/>
    <Prefix name="rdfs" IRI="http://www.w3.org/2000/01/rdf-schema#"/>
    <Declaration><Class IRI="#Attributes"/></Declaration>
    <Declaration><Class IRI="#Bad"/></Declaration>
    <Declaration><Class IRI="#Cleanliness"/></Declaration>
    <Declaration><Class IRI="#Destination"/></Declaration>
    <Declaration><Class IRI="#Foodquality"/></Declaration>
    <Declaration><Class IRI="#Freequency"/></Declaration>
    <Declaration><Class IRI="#Good"/></Declaration>
    <Declaration><Class IRI="#High"/></Declaration>
    <Declaration><Class IRI="#Low"/></Declaration>
    <Declaration><Class IRI="#Nottasty"/></Declaration>
    <Declaration><Class IRI="#Punctuality"/></Declaration>
    <Declaration><Class IRI="#Security"/></Declaration>
    <Declaration><Class IRI="#Sentiment"/></Declaration>
    <Declaration><Class IRI="#Source"/></Declaration>
    <Declaration><Class IRI="#StaffBehavior"/></Declaration>
    <Declaration><Class IRI="#Tasty"/></Declaration>
    <Declaration><Class IRI="#Time"/></Declaration>
    <Declaration><Class IRI="#Train"/></Declaration>
    <Declaration><Class IRI="#Trainno"/></Declaration>
    <Declaration><Class IRI="#Verybad"/></Declaration>
    <Declaration><Class IRI="#Verygood"/></Declaration>
    <Declaration><ObjectProperty IRI="#Having"/></Declaration>
    <Declaration><ObjectProperty IRI="#contains"/></Declaration>
    <Declaration><DataProperty IRI="#Destination"/></Declaration>
    <Declaration><DataProperty IRI="#Punctuality"/></Declaration>
    <Declaration><DataProperty IRI="#Source"/></Declaration>
    <Declaration><DataProperty IRI="#Train"/></Declaration>
    <Declaration><DataProperty IRI="#TrainNo"/></Declaration>
    <Declaration><DataProperty IRI="#Trainno"/></Declaration>
    <Declaration><NamedIndividual IRI="#Train1"/></Declaration>
    <Declaration><NamedIndividual IRI="#Train2"/></Declaration>
    <SubClassOf><Class IRI="#Bad"/><Class IRI="#StaffBehavior"/></SubClassOf>
    <SubClassOf><Class IRI="#Cleanliness"/><Class IRI="#Attributes"/></SubClassOf>
    <SubClassOf><Class IRI="#Destination"/><Class IRI="#Train"/></SubClassOf>
    <SubClassOf><Class IRI="#Foodquality"/><Class IRI="#Attributes"/></SubClassOf>
    <SubClassOf><Class IRI="#Freequency"/><Class IRI="#Punctuality"/></SubClassOf>
    <SubClassOf><Class IRI="#Good"/><Class IRI="#StaffBehavior"/></SubClassOf>
    <SubClassOf><Class IRI="#High"/><Class IRI="#Security"/></SubClassOf>
    <SubClassOf><Class IRI="#Low"/><Class IRI="#Security"/></SubClassOf>
    <SubClassOf><Class IRI="#Nottasty"/><Class IRI="#Foodquality"/></SubClassOf>
    <SubClassOf><Class IRI="#Punctuality"/><Class IRI="#Attributes"/></SubClassOf>
    <SubClassOf><Class IRI="#Security"/><Class IRI="#Attributes"/></SubClassOf>
    <SubClassOf><Class IRI="#Sentiment"/><Class IRI="#Nottasty"/></SubClassOf>
    <SubClassOf><Class IRI="#Source"/><Class IRI="#Train"/></SubClassOf>
    <SubClassOf><Class IRI="#StaffBehavior"/><Class IRI="#Attributes"/></SubClassOf>
    <SubClassOf><Class IRI="#Tasty"/><Class IRI="#Foodquality"/></SubClassOf>
    <SubClassOf><Class IRI="#Time"/><Class IRI="#Punctuality"/></SubClassOf>
    <SubClassOf><Class IRI="#Trainno"/><Class IRI="#Train"/></SubClassOf>
    <SubClassOf><Class IRI="#Verybad"/><Class IRI="#Cleanliness"/></SubClassOf>
    <SubClassOf><Class IRI="#Verygood"/><Class IRI="#Cleanliness"/></SubClassOf>
    <DataPropertyAssertion><DataProperty IRI="#Destination"/><NamedIndividual IRI="#Train1"/><Literal>Bang</Literal></DataPropertyAssertion>
    <DataPropertyAssertion><DataProperty IRI="#Source"/><NamedIndividual IRI="#Train1"/><Literal>hyd</Literal></DataPropertyAssertion>
    <DataPropertyAssertion><DataProperty IRI="#TrainNo"/><NamedIndividual IRI="#Train1"/><Literal datatypeIRI="http://www.w3.org/2001/XMLSchema#integer">111</Literal></DataPropertyAssertion>
    <DataPropertyAssertion><DataProperty IRI="#Destination"/><NamedIndividual IRI="#Train2"/><Literal>Chennai</Literal></DataPropertyAssertion>
    <DataPropertyAssertion><DataProperty IRI="#Source"/><NamedIndividual IRI="#Train2"/><Literal>bang</Literal></DataPropertyAssertion>
    <DataPropertyAssertion><DataProperty IRI="#TrainNo"/><NamedIndividual IRI="#Train2"/><Literal datatypeIRI="http://www.w3.org/2001/XMLSchema#integer">222</Literal></DataPropertyAssertion>
</Ontology>`;

// ── Colour palette ──────────────────────────────────────────────────
const DEPTH_COLORS = [
  "#f97316", // depth 0 – orange  (root)
  "#3b82f6", // depth 1 – blue
  "#8b5cf6", // depth 2 – purple
  "#06b6d4", // depth 3 – cyan
  "#10b981", // depth 4 – emerald
  "#ec4899", // depth 5 – pink
  "#eab308", // depth 6 – yellow
];

function colorForDepth(d) {
  return DEPTH_COLORS[Math.min(d, DEPTH_COLORS.length - 1)];
}

// ── Tree layout algorithm ───────────────────────────────────────────
function buildTree(classes, edges) {
  const children = {};
  const hasParent = new Set();

  classes.forEach((c) => (children[c] = []));

  edges.forEach(({ child, parent }) => {
    if (!children[parent]) children[parent] = [];
    children[parent].push(child);
    hasParent.add(child);
  });

  // Roots = classes with no parent declared
  const roots = classes.filter((c) => !hasParent.has(c));

  // If there are multiple roots create an artificial owl:Thing root
  const nodes = [];
  const NODE_W = 130;
  const NODE_H = 40;
  const H_GAP = 24;
  const V_GAP = 70;

  let nextX = 0;

  function layout(name, depth) {
    const kids = (children[name] || []).map((c) => layout(c, depth + 1));
    if (kids.length === 0) {
      const x = nextX;
      nextX += NODE_W + H_GAP;
      const node = {
        name,
        x,
        y: depth * (NODE_H + V_GAP),
        w: NODE_W,
        h: NODE_H,
        depth,
        children: [],
      };
      nodes.push(node);
      return node;
    }
    const minX = Math.min(...kids.map((k) => k.x));
    const maxX = Math.max(...kids.map((k) => k.x + k.w));
    const x = (minX + maxX) / 2 - NODE_W / 2;
    const node = {
      name,
      x,
      y: depth * (NODE_H + V_GAP),
      w: NODE_W,
      h: NODE_H,
      depth,
      children: kids,
    };
    nodes.push(node);
    return node;
  }

  if (roots.length === 1) {
    layout(roots[0], 0);
  } else {
    // Create virtual root
    children["owl:Thing"] = roots;
    layout("owl:Thing", 0);
  }

  return nodes;
}

// ── Canvas drawing ──────────────────────────────────────────────────
function drawGraph(ctx, nodes, edges, selected, dpr, pan, zoom) {
  const W = ctx.canvas.width / dpr;
  const H = ctx.canvas.height / dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  // Gradient background
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, "#0f172a");
  grad.addColorStop(1, "#1e293b");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Subtle grid
  ctx.save();
  ctx.translate(pan.x, pan.y);
  ctx.scale(zoom, zoom);

  const gridSize = 40;
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.lineWidth = 0.5;
  const startX = -pan.x / zoom - 200;
  const startY = -pan.y / zoom - 200;
  const endX = (W - pan.x) / zoom + 200;
  const endY = (H - pan.y) / zoom + 200;
  for (
    let gx = Math.floor(startX / gridSize) * gridSize;
    gx < endX;
    gx += gridSize
  ) {
    ctx.beginPath();
    ctx.moveTo(gx, startY);
    ctx.lineTo(gx, endY);
    ctx.stroke();
  }
  for (
    let gy = Math.floor(startY / gridSize) * gridSize;
    gy < endY;
    gy += gridSize
  ) {
    ctx.beginPath();
    ctx.moveTo(startX, gy);
    ctx.lineTo(endX, gy);
    ctx.stroke();
  }

  // Draw edges
  const nodeMap = {};
  nodes.forEach((n) => (nodeMap[n.name] = n));

  edges.forEach(({ child, parent }) => {
    const p = nodeMap[parent];
    const c = nodeMap[child];
    if (!p || !c) return;

    const x1 = p.x + p.w / 2;
    const y1 = p.y + p.h;
    const x2 = c.x + c.w / 2;
    const y2 = c.y;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    const midY = (y1 + y2) / 2;
    ctx.bezierCurveTo(x1, midY, x2, midY, x2, y2);
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Arrowhead
    const angle = Math.atan2(y2 - midY, x2 - x2);
    const arrowLen = 7;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - arrowLen, y2 - arrowLen);
    ctx.lineTo(x2 + arrowLen, y2 - arrowLen);
    ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fill();
  });

  // Draw nodes
  nodes.forEach((n) => {
    const isSelected = selected === n.name;
    const col = colorForDepth(n.depth);

    // Glow
    if (isSelected) {
      ctx.shadowColor = col;
      ctx.shadowBlur = 18;
    }

    // Node pill
    const radius = 10;
    ctx.beginPath();
    ctx.moveTo(n.x + radius, n.y);
    ctx.lineTo(n.x + n.w - radius, n.y);
    ctx.quadraticCurveTo(n.x + n.w, n.y, n.x + n.w, n.y + radius);
    ctx.lineTo(n.x + n.w, n.y + n.h - radius);
    ctx.quadraticCurveTo(n.x + n.w, n.y + n.h, n.x + n.w - radius, n.y + n.h);
    ctx.lineTo(n.x + radius, n.y + n.h);
    ctx.quadraticCurveTo(n.x, n.y + n.h, n.x, n.y + n.h - radius);
    ctx.lineTo(n.x, n.y + radius);
    ctx.quadraticCurveTo(n.x, n.y, n.x + radius, n.y);
    ctx.closePath();

    ctx.fillStyle = isSelected ? col : `${col}22`;
    ctx.fill();
    ctx.strokeStyle = col;
    ctx.lineWidth = isSelected ? 2.5 : 1.2;
    ctx.stroke();

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    // Label
    ctx.fillStyle = isSelected ? "#fff" : col;
    ctx.font = `600 ${Math.min(12, n.w / n.name.length + 2)}px Inter, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(n.name, n.x + n.w / 2, n.y + n.h / 2, n.w - 12);
  });

  ctx.restore();
}

// ── Component ───────────────────────────────────────────────────────
export default function OntologyPage() {
  const canvasRef = useRef(null);
  const [ontologyData, setOntologyData] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPaste, setShowPaste] = useState(false);
  const [customOwl, setCustomOwl] = useState("");
  const panRef = useRef({ x: 60, y: 40 });
  const zoomRef = useRef(1);
  const dragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  const parseOwl = useCallback(async (xml) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/ontology/parse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owl_xml: xml }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.detail || "Parse failed");
      }
      const data = await res.json();
      setOntologyData(data);
      const treeNodes = buildTree(data.classes, data.subClassOf);
      setNodes(treeNodes);
      setSelected(null);
      // Center the graph
      panRef.current = { x: 60, y: 40 };
      zoomRef.current = 1;
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Parse default on mount
  useEffect(() => {
    parseOwl(DEFAULT_OWL);
  }, [parseOwl]);

  // Canvas resize + draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0) return;

    const dpr = window.devicePixelRatio || 1;
    let animId;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const ctx = canvas.getContext("2d");
      drawGraph(
        ctx,
        nodes,
        ontologyData?.subClassOf || [],
        selected,
        dpr,
        panRef.current,
        zoomRef.current,
      );
      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, [nodes, selected, ontologyData]);

  // Mouse interaction
  const handleMouseDown = (e) => {
    dragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    panRef.current = { x: panRef.current.x + dx, y: panRef.current.y + dy };
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    dragging.current = false;
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.92 : 1.08;
    zoomRef.current = Math.max(0.3, Math.min(3, zoomRef.current * delta));
  };

  const handleClick = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left - panRef.current.x) / zoomRef.current;
    const my = (e.clientY - rect.top - panRef.current.y) / zoomRef.current;

    const clicked = nodes.find(
      (n) => mx >= n.x && mx <= n.x + n.w && my >= n.y && my <= n.y + n.h,
    );
    setSelected(clicked ? clicked.name : null);
  };

  const selectedInfo = selected
    ? {
        parents: (ontologyData?.subClassOf || [])
          .filter((e) => e.child === selected)
          .map((e) => e.parent),
        children: (ontologyData?.subClassOf || [])
          .filter((e) => e.parent === selected)
          .map((e) => e.child),
        individuals: (ontologyData?.individuals || []).filter((ind) => {
          // Simple heuristic: individual name starts with class name
          return ind.name.toLowerCase().startsWith(selected.toLowerCase());
        }),
      }
    : null;

  return (
    <Layout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 pb-3 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Network className="w-6 h-6 text-orange-500" />
              OWL Knowledge Graph
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Interactive ontology class hierarchy visualization
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPaste(!showPaste)}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {showPaste ? "Hide Editor" : "Paste Custom OWL"}
            </button>
            <button
              onClick={() => parseOwl(DEFAULT_OWL)}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-sm"
            >
              Reset Default
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mb-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Custom OWL input */}
        {showPaste && (
          <div className="mx-6 mb-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <textarea
              className="w-full h-36 p-3 text-xs font-mono bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Paste your OWL/XML here..."
              value={customOwl}
              onChange={(e) => setCustomOwl(e.target.value)}
            />
            <button
              onClick={() => {
                if (customOwl.trim()) parseOwl(customOwl);
              }}
              disabled={loading || !customOwl.trim()}
              className="mt-2 px-4 py-2 text-sm font-medium rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Parsing...
                </span>
              ) : (
                "Parse & Visualize"
              )}
            </button>
          </div>
        )}

        {/* Main canvas + sidebar */}
        <div className="flex-1 flex mx-6 mb-6 gap-4 min-h-0">
          {/* Canvas */}
          <div className="flex-1 rounded-xl overflow-hidden border border-gray-700/30 shadow-lg relative">
            {loading && (
              <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center z-10">
                <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
              </div>
            )}
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              onClick={handleClick}
            />
            {/* Legend */}
            <div className="absolute bottom-3 left-3 bg-slate-800/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-300 flex items-center gap-4">
              <span>🖱️ Drag to pan</span>
              <span>🔍 Scroll to zoom</span>
              <span>👆 Click node for details</span>
            </div>
          </div>

          {/* Sidebar details */}
          <div className="w-72 bg-white rounded-xl border border-gray-200 shadow-sm overflow-y-auto">
            {selected && selectedInfo ? (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-lg">
                    {selected}
                  </h3>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Parent Classes */}
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Parent Classes
                  </h4>
                  {selectedInfo.parents.length > 0 ? (
                    selectedInfo.parents.map((p) => (
                      <button
                        key={p}
                        onClick={() => setSelected(p)}
                        className="block w-full text-left px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        ↑ {p}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 italic">Root class</p>
                  )}
                </div>

                {/* Child Classes */}
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Subclasses
                  </h4>
                  {selectedInfo.children.length > 0 ? (
                    selectedInfo.children.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelected(c)}
                        className="block w-full text-left px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                      >
                        ↓ {c}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 italic">Leaf class</p>
                  )}
                </div>

                {/* Individuals */}
                {selectedInfo.individuals.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Individuals
                    </h4>
                    {selectedInfo.individuals.map((ind) => (
                      <div
                        key={ind.name}
                        className="p-3 bg-gray-50 rounded-lg mb-2 text-sm"
                      >
                        <p className="font-medium text-gray-800 mb-1">
                          {ind.name}
                        </p>
                        {Object.entries(ind.properties).map(([k, v]) => (
                          <p key={k} className="text-gray-500">
                            <span className="text-gray-700 font-medium">
                              {k}:
                            </span>{" "}
                            {v}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-400">
                <Info className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium text-gray-500">
                  Click a node in the graph to view its details
                </p>
                {ontologyData && (
                  <div className="mt-4 text-left space-y-3">
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-xs font-semibold text-orange-600 uppercase mb-1">
                        Classes
                      </p>
                      <p className="text-2xl font-bold text-orange-700">
                        {ontologyData.classes.length}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs font-semibold text-blue-600 uppercase mb-1">
                        Relationships
                      </p>
                      <p className="text-2xl font-bold text-blue-700">
                        {ontologyData.subClassOf.length}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs font-semibold text-purple-600 uppercase mb-1">
                        Properties
                      </p>
                      <p className="text-2xl font-bold text-purple-700">
                        {ontologyData.objectProperties.length +
                          ontologyData.dataProperties.length}
                      </p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <p className="text-xs font-semibold text-emerald-600 uppercase mb-1">
                        Individuals
                      </p>
                      <p className="text-2xl font-bold text-emerald-700">
                        {ontologyData.individuals.length}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
