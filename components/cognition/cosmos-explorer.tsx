"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { CognitionHomePayload } from "@/lib/cognition-types";

type CosmosExplorerProps = {
  data: CognitionHomePayload;
  mode: "home" | "network";
};

type Viewport = {
  x: number;
  y: number;
  scale: number;
};

type IncomingNode = {
  id: string;
  name: string;
  summary: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  color: string;
  glowColor: string;
};

const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 980;

const STAR_FIELD = [
  { x: 96, y: 120, size: 2, opacity: 0.6 },
  { x: 180, y: 420, size: 3, opacity: 0.7 },
  { x: 228, y: 780, size: 1.5, opacity: 0.45 },
  { x: 312, y: 164, size: 2.4, opacity: 0.85 },
  { x: 428, y: 328, size: 1.6, opacity: 0.5 },
  { x: 556, y: 88, size: 2.2, opacity: 0.65 },
  { x: 648, y: 704, size: 2, opacity: 0.55 },
  { x: 760, y: 244, size: 1.8, opacity: 0.52 },
  { x: 900, y: 860, size: 2.5, opacity: 0.72 },
  { x: 1018, y: 146, size: 1.8, opacity: 0.66 },
  { x: 1140, y: 548, size: 2.8, opacity: 0.82 },
  { x: 1246, y: 226, size: 1.4, opacity: 0.48 },
  { x: 1338, y: 712, size: 2.4, opacity: 0.66 },
  { x: 1460, y: 162, size: 2.1, opacity: 0.61 },
  { x: 1524, y: 480, size: 3, opacity: 0.72 },
  { x: 870, y: 118, size: 1.4, opacity: 0.44 },
  { x: 548, y: 876, size: 1.2, opacity: 0.42 },
  { x: 1188, y: 896, size: 1.8, opacity: 0.58 }
];

const NEBULA_FIELD = [
  { left: "8%", top: "10%", width: 360, height: 220, color: "rgba(56,189,248,0.12)" },
  { left: "58%", top: "8%", width: 420, height: 260, color: "rgba(192,132,252,0.12)" },
  { left: "16%", top: "58%", width: 380, height: 260, color: "rgba(251,191,36,0.1)" },
  { left: "62%", top: "56%", width: 400, height: 240, color: "rgba(34,197,94,0.08)" }
];

function percentToCanvasX(percent: number) {
  return (percent / 100) * CANVAS_WIDTH;
}

function percentToCanvasY(percent: number) {
  return (percent / 100) * CANVAS_HEIGHT;
}

export function CosmosExplorer({ data, mode }: CosmosExplorerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState(data.quickPrompt);
  const [activeGraphId, setActiveGraphId] = useState<string | null>(data.graphNodes[0]?.id ?? null);
  const [hoveredGraphId, setHoveredGraphId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, scale: mode === "home" ? 1 : 1.05 });
  const [isDragging, setIsDragging] = useState(false);
  const [incomingNode, setIncomingNode] = useState<IncomingNode | null>(null);
  const [archivePulse, setArchivePulse] = useState(false);
  const dragState = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);

  const graphNodes = useMemo(() => {
    const base = data.graphNodes.map((node) => ({
      ...node,
      canvasX: percentToCanvasX(node.x),
      canvasY: percentToCanvasY(node.y)
    }));

    if (!incomingNode) {
      return base;
    }

    return [
      ...base,
      {
        id: incomingNode.id,
        name: incomingNode.name,
        summary: incomingNode.summary,
        detailId: undefined,
        color: incomingNode.color,
        glowColor: incomingNode.glowColor,
        tags: ["新发现", "自动沉淀"],
        x: 0,
        y: 0,
        size: "sm" as const,
        canvasX: incomingNode.x,
        canvasY: incomingNode.y
      }
    ];
  }, [data.graphNodes, incomingNode]);

  const filteredIds = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) {
      return new Set(graphNodes.map((node) => node.id));
    }

    return new Set(
      graphNodes
        .filter((node) => {
          const tags = node.tags.join(" ").toLowerCase();
          return (
            node.name.toLowerCase().includes(keyword) ||
            node.summary.toLowerCase().includes(keyword) ||
            tags.includes(keyword)
          );
        })
        .map((node) => node.id)
    );
  }, [graphNodes, search]);

  const spotlightId = hoveredGraphId ?? activeGraphId;

  const connectedIds = useMemo(() => {
    const ids = new Set<string>();
    if (!spotlightId) {
      return ids;
    }

    data.graphLinks.forEach((link) => {
      if (link.from === spotlightId) {
        ids.add(link.to);
      }
      if (link.to === spotlightId) {
        ids.add(link.from);
      }
    });

    return ids;
  }, [data.graphLinks, spotlightId]);

  const activeNode = useMemo(() => {
    if (!activeGraphId) {
      return graphNodes[0] ?? null;
    }
    return graphNodes.find((node) => node.id === activeGraphId) ?? graphNodes[0] ?? null;
  }, [activeGraphId, graphNodes]);

  const activeDetail = useMemo(() => {
    if (!activeNode?.detailId) {
      return data.featuredNodes[0] ?? null;
    }

    return data.featuredNodes.find((item) => item.id === activeNode.detailId) ?? data.featuredNodes[0] ?? null;
  }, [activeNode, data.featuredNodes]);

  const relatedAssets = useMemo(() => {
    return graphNodes.filter((node) => connectedIds.has(node.id) && filteredIds.has(node.id));
  }, [connectedIds, filteredIds, graphNodes]);

  const archiveView = useMemo(() => {
    if (!activeNode) {
      return data.latestArchive;
    }

    return {
      assets: data.latestArchive.assets.filter(
        (item) =>
          item.includes(activeNode.name) ||
          activeNode.name.includes(item) ||
          activeNode.tags.some((tag) => item.includes(tag))
      ),
      themes: data.latestArchive.themes.filter(
        (item) =>
          activeNode.tags.some((tag) => item.includes(tag) || tag.includes(item)) ||
          activeNode.name.includes(item) ||
          item.includes(activeNode.name)
      ),
      newInsight: activeNode
        ? `系统把这段思考贴近到“${activeNode.name}”附近，并判断它可能继续长出新的判断资产。`
        : data.latestArchive.newInsight
    };
  }, [activeNode, data.latestArchive]);

  useEffect(() => {
    if (!search.trim()) {
      return;
    }

    const keyword = search.trim().toLowerCase();
    const matched = graphNodes.find((node) => {
      const tags = node.tags.join(" ").toLowerCase();
      return node.name.toLowerCase().includes(keyword) || tags.includes(keyword);
    });

    if (matched) {
      setActiveGraphId(matched.id);
      if (containerRef.current) {
        const bounds = containerRef.current.getBoundingClientRect();
        const nextScale = 1.18;
        const nextX = bounds.width / 2 - matched.canvasX * nextScale;
        const nextY = bounds.height / 2 - matched.canvasY * nextScale;
        setViewport({ x: nextX, y: nextY, scale: nextScale });
      }
    }
  }, [graphNodes, search]);

  function focusNode(node: (typeof graphNodes)[number], scaleOverride?: number) {
    if (!containerRef.current) {
      return;
    }

    const bounds = containerRef.current.getBoundingClientRect();
    const nextScale = scaleOverride ?? viewport.scale;
    const nextX = bounds.width / 2 - node.canvasX * nextScale;
    const nextY = bounds.height / 2 - node.canvasY * nextScale;

    setViewport({ x: nextX, y: nextY, scale: nextScale });
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    setIsDragging(true);
    dragState.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: viewport.x,
      originY: viewport.y
    };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragState.current) {
      return;
    }

    const deltaX = event.clientX - dragState.current.startX;
    const deltaY = event.clientY - dragState.current.startY;

    setViewport((current) => ({
      ...current,
      x: dragState.current ? dragState.current.originX + deltaX : current.x,
      y: dragState.current ? dragState.current.originY + deltaY : current.y
    }));
  }

  function handlePointerUp() {
    setIsDragging(false);
    dragState.current = null;
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.08 : 0.08;
    setViewport((current) => ({
      ...current,
      scale: Math.min(1.8, Math.max(0.72, Number((current.scale + delta).toFixed(2))))
    }));
  }

  function triggerArchiveAnimation() {
    if (!activeNode) {
      return;
    }

    setArchivePulse(true);
    const nextNode: IncomingNode = {
      id: `incoming-${Date.now()}`,
      name: "长期回查路径",
      summary: "系统新识别到一个正在成形的判断资产。",
      x: CANVAS_WIDTH * 0.5,
      y: CANVAS_HEIGHT * 0.92,
      targetX: activeNode.canvasX + 120,
      targetY: activeNode.canvasY - 90,
      color: "#fde68a",
      glowColor: "rgba(253,230,138,0.45)"
    };
    setIncomingNode(nextNode);

    requestAnimationFrame(() => {
      setIncomingNode((current) =>
        current
          ? {
              ...current,
              x: current.targetX,
              y: current.targetY
            }
          : current
      );
    });

    window.setTimeout(() => {
      setIncomingNode(null);
      setArchivePulse(false);
    }, 2200);
  }

  return (
    <div className="relative min-h-[calc(100vh-2rem)] overflow-hidden rounded-[2.6rem] border border-slate-900/10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(192,132,252,0.14),transparent_22%),radial-gradient(circle_at_14%_86%,rgba(251,191,36,0.12),transparent_20%),linear-gradient(180deg,#020617_0%,#0f172a_52%,#111827_100%)] shadow-[0_40px_120px_-50px_rgba(15,23,42,0.95)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(148,163,184,0.08),transparent_42%)]" />

      <div className="pointer-events-none absolute inset-x-6 top-6 z-20 flex justify-center">
        <div className="pointer-events-auto w-full max-w-2xl rounded-[1.8rem] border border-white/10 bg-slate-950/45 px-5 py-4 backdrop-blur-md">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="搜索关键词、标签或问题，让系统直接在图里找到它"
            className="w-full border-0 bg-transparent text-center text-lg text-white outline-none placeholder:text-slate-400"
          />
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {data.searchHints.map((hint) => (
              <button
                key={hint}
                type="button"
                onClick={() => setSearch(hint)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 transition hover:bg-white/10"
              >
                {hint}
              </button>
            ))}
          </div>
        </div>
      </div>

        <div className="pointer-events-none absolute left-6 top-28 z-20 rounded-[1.5rem] border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-200 backdrop-blur">
        <p className="text-slate-400">{mode === "home" ? "认知资产星图" : "资产网络全景"}</p>
        <p className="mt-1 font-medium text-white">{activeNode?.name ?? "认知宇宙"}</p>
        <p className="mt-1 max-w-xs text-xs leading-5 text-slate-300">
          {activeNode?.summary ?? "在图里寻找一个判断，让系统把相关资产、主题和新洞见一起拉出来。"}
        </p>
      </div>

      <div className="pointer-events-none absolute right-6 top-28 z-20 flex items-center gap-2 rounded-[1.5rem] border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-200 backdrop-blur">
        <button
          type="button"
          onClick={() => setViewport((current) => ({ ...current, scale: Math.max(0.72, current.scale - 0.12) }))}
          className="pointer-events-auto rounded-xl border border-white/10 px-3 py-2 transition hover:bg-white/10"
        >
          -
        </button>
        <span className="min-w-16 text-center">{Math.round(viewport.scale * 100)}%</span>
        <button
          type="button"
          onClick={() => setViewport((current) => ({ ...current, scale: Math.min(1.8, current.scale + 0.12) }))}
          className="pointer-events-auto rounded-xl border border-white/10 px-3 py-2 transition hover:bg-white/10"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => setViewport({ x: 0, y: 0, scale: mode === "home" ? 1 : 1.05 })}
          className="pointer-events-auto rounded-xl border border-white/10 px-3 py-2 transition hover:bg-white/10"
        >
          重置
        </button>
      </div>

      <div
        ref={containerRef}
        className={`relative h-[calc(100vh-2rem)] min-h-[760px] overflow-hidden ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
      >
        <div className="cosmos-drift absolute inset-0 opacity-90">
          {NEBULA_FIELD.map((nebula, index) => (
            <span
              key={`${nebula.left}-${nebula.top}-${index}`}
              className="absolute rounded-full blur-3xl"
              style={{
                left: nebula.left,
                top: nebula.top,
                width: nebula.width,
                height: nebula.height,
                background: `radial-gradient(circle, ${nebula.color} 0%, transparent 72%)`
              }}
            />
          ))}
        </div>

        {STAR_FIELD.map((star, index) => (
          <span
            key={`${star.x}-${star.y}-${index}`}
            className="cosmos-twinkle absolute rounded-full bg-white"
            style={{
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              boxShadow: "0 0 14px rgba(255,255,255,0.6)",
              animationDelay: `${index * 180}ms`
            }}
          />
        ))}

        <div
          className="absolute left-0 top-0 origin-top-left transition-transform duration-500"
          style={{
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`
          }}
        >
          <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`} aria-hidden="true">
            <defs>
              {data.graphLinks.map((link) => {
                const from = graphNodes.find((item) => item.id === link.from);
                const to = graphNodes.find((item) => item.id === link.to);
                if (!from || !to) {
                  return null;
                }

                return (
                  <linearGradient key={`gradient-${link.from}-${link.to}`} id={`gradient-${link.from}-${link.to}`} x1={from.canvasX} y1={from.canvasY} x2={to.canvasX} y2={to.canvasY} gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={from.color} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={to.color} stopOpacity={0.9} />
                  </linearGradient>
                );
              })}
            </defs>
            {data.graphLinks.map((link) => {
              const from = graphNodes.find((item) => item.id === link.from);
              const to = graphNodes.find((item) => item.id === link.to);
              const isVisible = filteredIds.has(link.from) && filteredIds.has(link.to);
              const isHighlighted = link.from === spotlightId || link.to === spotlightId;

              if (!from || !to || !isVisible) {
                return null;
              }

              const controlX = (from.canvasX + to.canvasX) / 2;
              const controlY = Math.min(from.canvasY, to.canvasY) - 40;

              return (
                <path
                  key={`${link.from}-${link.to}`}
                  d={`M ${from.canvasX} ${from.canvasY} Q ${controlX} ${controlY} ${to.canvasX} ${to.canvasY}`}
                  stroke={isHighlighted ? `url(#gradient-${link.from}-${link.to})` : "rgba(148,163,184,0.18)"}
                  strokeWidth={isHighlighted ? 2.4 : 1}
                  strokeLinecap="round"
                  fill="none"
                  style={{
                    filter: isHighlighted ? `drop-shadow(0 0 9px ${from.glowColor})` : "none",
                    opacity: isHighlighted ? 0.95 : 0.7
                  }}
                />
              );
            })}
            {incomingNode && activeNode ? (
              <path
                d={`M ${CANVAS_WIDTH * 0.5} ${CANVAS_HEIGHT * 0.92} Q ${(incomingNode.x + activeNode.canvasX) / 2} ${incomingNode.y - 80} ${incomingNode.x} ${incomingNode.y}`}
                stroke="rgba(253,230,138,0.95)"
                strokeWidth={2}
                strokeLinecap="round"
                fill="none"
                style={{ filter: "drop-shadow(0 0 10px rgba(253,230,138,0.65))" }}
              />
            ) : null}
          </svg>

          {graphNodes
            .filter((node) => filteredIds.has(node.id))
            .map((node) => {
              const isActive = node.id === activeGraphId;
              const isHovered = node.id === hoveredGraphId;
              const isConnected = connectedIds.has(node.id);
              const size = node.size === "lg" ? 168 : node.size === "md" ? 138 : 112;

              return (
                <button
                  key={node.id}
                  type="button"
                  onPointerDown={(event) => event.stopPropagation()}
                  onMouseEnter={() => setHoveredGraphId(node.id)}
                  onMouseLeave={() => setHoveredGraphId(null)}
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveGraphId(node.id);
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border text-left transition duration-300"
                  style={{
                    left: node.canvasX,
                    top: node.canvasY,
                    width: size,
                    height: size,
                    borderColor: isActive ? "rgba(255,255,255,0.85)" : isHovered || isConnected ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.08)",
                    background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.28), ${node.glowColor} 36%, rgba(15,23,42,0.88) 78%)`,
                    boxShadow: isActive
                      ? `0 0 0 1px rgba(255,255,255,0.55), 0 0 38px ${node.glowColor}, 0 0 96px ${node.glowColor}`
                      : isHovered || isConnected
                        ? `0 0 26px ${node.glowColor}`
                        : `0 0 18px ${node.glowColor}`,
                    transform: `translate(-50%, -50%) scale(${isActive ? 1.12 : isHovered ? 1.08 : 1})`
                  }}
                >
                  <span
                    className={isActive ? "cosmos-pulse absolute inset-[-16%] rounded-full" : "absolute inset-[-10%] rounded-full"}
                    style={{
                      background: `radial-gradient(circle, ${node.glowColor} 0%, transparent 72%)`,
                      opacity: isActive ? 0.95 : isHovered || isConnected ? 0.55 : 0.3
                    }}
                  />
                  <span
                    className={`absolute inset-[8%] rounded-full border ${isActive ? "cosmos-float" : ""}`}
                    style={{ borderColor: "rgba(255,255,255,0.08)" }}
                  />
                  <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                    <span
                      className="mb-2 h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: node.color, boxShadow: `0 0 18px ${node.color}` }}
                    />
                    <p className="text-sm font-medium leading-5 text-white">{node.name}</p>
                    <p
                      className="mt-2 overflow-hidden text-[11px] leading-4 text-slate-200"
                      style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
                    >
                      {node.summary}
                    </p>
                    <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                      {node.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="rounded-full bg-white/8 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-slate-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-10 z-20 flex justify-center px-6">
          <div className="pointer-events-auto w-full max-w-3xl rounded-[1.9rem] border border-white/10 bg-slate-950/50 p-4 backdrop-blur-md">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className="min-h-24 w-full resize-none border-0 bg-transparent text-center text-sm leading-7 text-white outline-none placeholder:text-slate-400"
              placeholder="把你的问题直接丢进来，系统会自动归入已有认知资产，并在图里为它找到位置"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-slate-400">输入一句话后，系统会自动做标签、归档，并判断有没有新的资产正在形成。</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={triggerArchiveAnimation}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                >
                  模拟归档
                </button>
                <button
                  type="button"
                  onClick={triggerArchiveAnimation}
                  className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-slate-100"
                >
                  发送
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`cosmos-slide-in pointer-events-none absolute bottom-40 left-8 z-20 rounded-[1.5rem] border px-4 py-3 text-sm text-white backdrop-blur transition duration-300 ${
            archivePulse ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{
            borderColor: "rgba(255,255,255,0.12)",
            background: "rgba(15,23,42,0.62)",
            boxShadow: "0 0 36px rgba(125,211,252,0.14)"
          }}
        >
          <p className="text-slate-400">系统刚刚归档</p>
          <p className="mt-1 font-medium">已归入 {archiveView.assets.join(" / ") || "认知资产网络"}</p>
          <p className="mt-2 text-xs leading-5 text-slate-300">识别标签：{archiveView.themes.join(" / ") || "长期判断 / 结构化沉淀"}</p>
        </div>
      </div>

      <aside
        className={`absolute inset-y-5 right-5 z-30 w-[360px] rounded-[2rem] border border-white/10 bg-slate-950/58 p-5 text-white shadow-[0_30px_90px_-45px_rgba(15,23,42,0.95)] backdrop-blur-xl transition duration-300 ${
          activeNode ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-slate-400">认知资产详情</p>
            <h2 className="mt-1 text-2xl font-semibold">{activeNode?.name}</h2>
          </div>
          <button
            type="button"
            onClick={() => setActiveGraphId(null)}
            className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10"
          >
            关闭
          </button>
        </div>

        <div className="mt-5 space-y-4 overflow-y-auto pr-1 text-sm leading-6 text-slate-200" style={{ maxHeight: "calc(100vh - 8rem)" }}>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">这项认知资产在讲什么</p>
            <p className="mt-2">{activeDetail?.description ?? activeNode?.summary}</p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">相关标签</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {activeNode?.tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSearch(tag)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 transition hover:bg-white/10"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">周围关联</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {relatedAssets.length ? (
                relatedAssets.map((node) => (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setActiveGraphId(node.id)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200 transition hover:bg-white/10"
                  >
                    {node.name}
                  </button>
                ))
              ) : (
                <span className="text-slate-400">继续聊天后，这里会长出更多直接关联。</span>
              )}
            </div>
          </div>

          {activeDetail?.chatSnippets?.length ? (
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">相关聊天</p>
              <div className="mt-3 space-y-3">
                {activeDetail.chatSnippets.slice(0, 2).map((snippet) => (
                  <div key={snippet.id} className="rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3">
                    <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
                      <span>{snippet.role}</span>
                      <span>{snippet.timestampLabel}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-200">{snippet.content}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">归档提示</p>
            <p className="mt-2">{archiveView.newInsight}</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
