import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";

export interface RequirementDef {
  id: number;
  title: string;
  content: string;
}

interface RequirementBadgeProps {
  req: RequirementDef;
  sectionSelector?: string;
  index?: number;
  className?: string;
}

/* ──── Module-level state & config ──── */

const openTooltipRegistry = new Set<number>();

/** Session-level cache for tooltip size and position (persists within same browser tab) */
const tooltipStateCache = new Map<
  number,
  { width: number; height: number; posX: number; posY: number }
>();

const MIN_W = 360;
const MAX_W = 900;
const MIN_H = 300;
const MAX_H = 900;
const NORMAL_W = 480;
const NORMAL_H = 520;
const RAG_W = 680;
const RAG_H = 720;
const MOBILE_BREAKPOINT = 768;
const VIEWPORT_MARGIN = 16;

function isRagContent(content: string): boolean {
  const sectionCount = (content.match(/^## /gm) || []).length;
  return sectionCount >= 4 || content.length > 2000;
}

function getDefaultWidth(content: string, isMobile: boolean): number {
  if (isMobile) return Math.min(window.innerWidth * 0.92, MAX_W);
  return isRagContent(content) ? RAG_W : NORMAL_W;
}

function getDefaultHeight(content: string, isMobile: boolean): number {
  if (isMobile)
    return Math.min(window.innerHeight * 0.82, MAX_H);
  return isRagContent(content) ? RAG_H : NORMAL_H;
}

/* ──── Markdown parser ──── */

type MdNode =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; children: InlineNode[] }
  | { type: "ul"; items: InlineNode[][] }
  | { type: "ol"; items: InlineNode[][] }
  | { type: "blockquote"; children: InlineNode[] }
  | { type: "code"; text: string }
  | { type: "codeblock"; text: string; lang?: string }
  | { type: "hr" }
  | { type: "table"; headers: InlineNode[][]; rows: InlineNode[][][] };

type InlineNode =
  | { type: "text"; text: string }
  | { type: "bold"; children: InlineNode[] }
  | { type: "code"; text: string };

function parseInline(text: string): InlineNode[] {
  const result: InlineNode[] = [];
  let i = 0;
  while (i < text.length) {
    if (text.startsWith("**", i)) {
      const end = text.indexOf("**", i + 2);
      if (end !== -1) {
        result.push({
          type: "bold",
          children: parseInline(text.slice(i + 2, end)),
        });
        i = end + 2;
        continue;
      }
    }
    if (text[i] === "`") {
      const end = text.indexOf("`", i + 1);
      if (end !== -1) {
        result.push({ type: "code", text: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    let j = i;
    while (j < text.length && text[j] !== "*" && text[j] !== "`") j++;
    if (j > i) result.push({ type: "text", text: text.slice(i, j) });
    i = j;
    if (j === i) {
      result.push({ type: "text", text: text[i] });
      i++;
    }
  }
  return result;
}

function parseMarkdown(md: string): MdNode[] {
  const lines = md.split("\n");
  const nodes: MdNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      nodes.push({
        type: "codeblock",
        text: codeLines.join("\n"),
        lang: lang || undefined,
      });
      continue;
    }
    if (line.startsWith("|") && i + 1 < lines.length && lines[i + 1].includes("---")) {
      const headerCells = line
        .split("|")
        .filter((c) => c.trim())
        .map((c) => parseInline(c.trim()));
      i += 2;
      const rows: InlineNode[][][] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        rows.push(
          lines[i]
            .split("|")
            .filter((c) => c.trim())
            .map((c) => parseInline(c.trim()))
        );
        i++;
      }
      nodes.push({ type: "table", headers: headerCells, rows });
      continue;
    }
    if (/^[-*_]{3,}\s*$/.test(line)) {
      nodes.push({ type: "hr" });
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      nodes.push({ type: "h3", text: line.slice(4) });
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      nodes.push({ type: "h2", text: line.slice(3) });
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      nodes.push({ type: "h1", text: line.slice(2) });
      i++;
      continue;
    }
    if (line.startsWith("> ")) {
      nodes.push({
        type: "blockquote",
        children: parseInline(line.slice(2)),
      });
      i++;
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      const items: InlineNode[][] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(parseInline(lines[i].replace(/^\d+\.\s/, "")));
        i++;
      }
      nodes.push({ type: "ol", items });
      continue;
    }
    if (/^[-*]\s/.test(line)) {
      const items: InlineNode[][] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(parseInline(lines[i].replace(/^[-*]\s/, "")));
        i++;
      }
      nodes.push({ type: "ul", items });
      continue;
    }
    if (line.trim() === "") {
      i++;
      continue;
    }
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("|") &&
      !lines[i].startsWith(">") &&
      !/^[-*]\s/.test(lines[i]) &&
      !/^\d+\.\s/.test(lines[i]) &&
      !lines[i].startsWith("```")
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0)
      nodes.push({
        type: "p",
        children: parseInline(paraLines.join(" ")),
      });
    else i++;
  }
  return nodes;
}

/* ──── Render helpers ──── */

function RenderInline({ nodes }: { nodes: InlineNode[] }): ReactNode {
  return nodes.map((n, i) => {
    if (n.type === "text") return n.text;
    if (n.type === "bold")
      return (
        <strong key={i} style={{ fontWeight: 600, color: "#0f172a" }}>
          <RenderInline nodes={n.children} />
        </strong>
      );
    if (n.type === "code")
      return (
        <code
          key={i}
          style={{
            backgroundColor: "#e2e8f0",
            padding: "1px 4px",
            borderRadius: 3,
            fontSize: 12,
          }}
        >
          {n.text}
        </code>
      );
    return null;
  });
}

function RenderMdContent({ content }: { content: string }): ReactNode {
  const nodes = parseMarkdown(content);
  return nodes.map((node, i) => {
    switch (node.type) {
      case "h1":
        return (
          <h1
            key={i}
            style={{
              fontSize: 16,
              fontWeight: 700,
              margin: "0 0 6px 0",
              color: "#0f172a",
            }}
          >
            {node.text}
          </h1>
        );
      case "h2":
        return (
          <h2
            key={i}
            style={{
              fontSize: 15,
              fontWeight: 600,
              margin: "0 0 4px 0",
              color: "#1e293b",
            }}
          >
            {node.text}
          </h2>
        );
      case "h3":
        return (
          <h3
            key={i}
            style={{
              fontSize: 14,
              fontWeight: 600,
              margin: "0 0 3px 0",
              color: "#334155",
            }}
          >
            {node.text}
          </h3>
        );
      case "p":
        return (
          <p
            key={i}
            style={{
              marginBottom: 6,
              marginTop: 0,
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            <RenderInline nodes={node.children} />
          </p>
        );
      case "ul":
        return (
          <ul
            key={i}
            style={{
              marginBottom: 6,
              paddingLeft: 16,
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            {node.items.map((item, j) => (
              <li key={j} style={{ marginBottom: 1 }}>
                <RenderInline nodes={item} />
              </li>
            ))}
          </ul>
        );
      case "ol":
        return (
          <ol
            key={i}
            style={{
              marginBottom: 6,
              paddingLeft: 16,
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            {node.items.map((item, j) => (
              <li key={j} style={{ marginBottom: 1 }}>
                <RenderInline nodes={item} />
              </li>
            ))}
          </ol>
        );
      case "blockquote":
        return (
          <blockquote
            key={i}
            style={{
              margin: "0 0 6px 0",
              padding: "4px 8px",
              borderLeft: "3px solid #cbd5e1",
              backgroundColor: "#f8fafc",
              color: "#64748b",
              fontSize: 12,
            }}
          >
            <RenderInline nodes={node.children} />
          </blockquote>
        );
      case "code":
        return (
          <code
            key={i}
            style={{
              display: "block",
              backgroundColor: "#e2e8f0",
              padding: "3px 6px",
              borderRadius: 3,
              fontSize: 12,
              fontFamily: "monospace",
              marginBottom: 6,
            }}
          >
            {node.text}
          </code>
        );
      case "codeblock":
        return (
          <pre
            key={i}
            style={{
              backgroundColor: "#1e293b",
              color: "#e2e8f0",
              padding: "8px 12px",
              borderRadius: 4,
              fontSize: 12,
              overflowX: "auto",
              marginBottom: 6,
              fontFamily: "monospace",
            }}
          >
            <code>{node.text}</code>
          </pre>
        );
      case "hr":
        return (
          <hr
            key={i}
            style={{
              border: "none",
              borderTop: "1px solid #e2e8f0",
              margin: "6px 0",
            }}
          />
        );
      case "table":
        return (
          <div key={i} style={{ overflowX: "auto", marginBottom: 6 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
              }}
            >
              <thead>
                <tr>
                  {node.headers.map((h, j) => (
                    <th
                      key={j}
                      style={{
                        border: "1px solid #cbd5e1",
                        padding: "3px 5px",
                        backgroundColor: "#f1f5f9",
                        textAlign: "left",
                        fontWeight: 600,
                      }}
                    >
                      <RenderInline nodes={h} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {node.rows.map((row, j) => (
                  <tr key={j}>
                    {row.map((cell, k) => (
                      <td
                        key={k}
                        style={{
                          border: "1px solid #e2e8f0",
                          padding: "3px 5px",
                        }}
                      >
                        <RenderInline nodes={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
    }
  });
}

/* ──── Badge component ──── */

export function RequirementBadge({
  req,
  sectionSelector,
  index = 0,
  className = "",
}: RequirementBadgeProps) {
  const [open, setOpen] = useState(false);
  const [badgePos, setBadgePos] = useState<{ top: number; right: number } | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hasClaimedRef = useRef(false);

  /* ── Mobile detection ── */
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT
  );
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── Size & position state ── */
  const saved = tooltipStateCache.get(req.id);
  const [tooltipW, setTooltipW] = useState(
    () => saved?.width ?? getDefaultWidth(req.content, isMobile)
  );
  const [tooltipH, setTooltipH] = useState(
    () => saved?.height ?? getDefaultHeight(req.content, isMobile)
  );
  const [tooltipX, setTooltipX] = useState(0);
  const [tooltipY, setTooltipY] = useState(0);
  const [ready, setReady] = useState(false);

  /* ── Drag refs ── */
  const dragRef = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    posX: 0,
    posY: 0,
  });

  /* ── Resize refs ── */
  const resizeRef = useRef({
    resizing: false,
    startMouseX: 0,
    startMouseY: 0,
    startW: 0,
    startH: 0,
    startPosX: 0,
    startPosY: 0,
  });

  /* ── Find parent container for badge placement ── */
  useEffect(() => {
    let container: HTMLElement | null = null;
    if (badgeRef.current) {
      let el: HTMLElement | null = badgeRef.current.parentElement;
      while (el) {
        const cs = window.getComputedStyle(el);
        if (cs.position === "relative") {
          container = el;
          break;
        }
        el = el.parentElement;
      }
    }
    containerRef.current = container;

    if (sectionSelector && container) {
      const target = container.querySelector(sectionSelector) as HTMLElement | null;
      if (target) {
        const containerRect = container.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const offset = index * 26;
        setBadgePos({
          top: targetRect.top - containerRect.top + 4 + offset,
          right: containerRect.right - targetRect.right + 4,
        });
        return;
      }
    }
    if (container) {
      setBadgePos({ top: 4 + index * 28, right: 8 });
    } else {
      setBadgePos(null);
    }
  }, [sectionSelector, index]);

  /* ── Compute initial tooltip position ── */
  const computeInitialPosition = useCallback(
    (w: number, h: number): { x: number; y: number } => {
      if (!badgeRef.current) {
        return {
          x: Math.max(VIEWPORT_MARGIN, (window.innerWidth - w) / 2),
          y: 60,
        };
      }
      const badgeRect = badgeRef.current.getBoundingClientRect();
      let left = badgeRect.left;
      // Ensure tooltip stays within viewport
      if (left + w > window.innerWidth - VIEWPORT_MARGIN) {
        left = window.innerWidth - w - VIEWPORT_MARGIN;
      }
      left = Math.max(VIEWPORT_MARGIN, left);
      let top = badgeRect.bottom + 8;
      if (top + h > window.innerHeight - VIEWPORT_MARGIN) {
        top = Math.max(VIEWPORT_MARGIN, window.innerHeight - h - VIEWPORT_MARGIN);
      }
      return { x: left, y: top };
    },
    []
  );

  /* ── Initialize position when tooltip opens ── */
  useEffect(() => {
    if (!open || tooltipW <= 0 || tooltipH <= 0) return;
    const raf = requestAnimationFrame(() => {
      const cached = tooltipStateCache.get(req.id);
      if (cached && cached.posX !== undefined && cached.posY !== undefined) {
        dragRef.current.posX = cached.posX;
        dragRef.current.posY = cached.posY;
        setTooltipX(cached.posX);
        setTooltipY(cached.posY);
      } else {
        const init = computeInitialPosition(tooltipW, tooltipH);
        dragRef.current.posX = init.x;
        dragRef.current.posY = init.y;
        setTooltipX(init.x);
        setTooltipY(init.y);
      }
      setReady(true);
    });
    return () => cancelAnimationFrame(raf);
  }, [open, req.id, tooltipW, tooltipH, computeInitialPosition]);

  /* ── Mouse enter → open tooltip ── */
  const handleMouseEnter = () => {
    if (!openTooltipRegistry.has(req.id) && !hasClaimedRef.current) {
      hasClaimedRef.current = true;
      openTooltipRegistry.add(req.id);
      setOpen(true);
    }
  };

  /* ── Close & save state to cache ── */
  const handleClose = useCallback(() => {
    tooltipStateCache.set(req.id, {
      width: tooltipW,
      height: tooltipH,
      posX: dragRef.current.posX,
      posY: dragRef.current.posY,
    });
    hasClaimedRef.current = false;
    openTooltipRegistry.delete(req.id);
    setOpen(false);
    setReady(false);
  }, [req.id, tooltipW, tooltipH]);

  /* ── Keep dimension ref in sync for unmount cleanup ── */
  const dimSnapshotRef = useRef({ w: tooltipW, h: tooltipH });
  dimSnapshotRef.current = { w: tooltipW, h: tooltipH };

  /* ── Save on unmount ── */
  useEffect(() => {
    return () => {
      if (hasClaimedRef.current) {
        tooltipStateCache.set(req.id, {
          width: dimSnapshotRef.current.w,
          height: dimSnapshotRef.current.h,
          posX: dragRef.current.posX,
          posY: dragRef.current.posY,
        });
      }
      hasClaimedRef.current = false;
      openTooltipRegistry.delete(req.id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Clamp to viewport ‒─ */
  const clampTooltip = useCallback(() => {
    const el = tooltipRef.current;
    if (!el) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let dx = dragRef.current.posX;
    let dy = dragRef.current.posY;

    // Clamp right & bottom edges
    const right = dx + tooltipW;
    const bottom = dy + tooltipH;
    if (right > vw - VIEWPORT_MARGIN) dx -= right - vw + VIEWPORT_MARGIN;
    if (bottom > vh - VIEWPORT_MARGIN) dy -= bottom - vh + VIEWPORT_MARGIN;
    // Clamp left & top edges
    if (dx < VIEWPORT_MARGIN) dx = VIEWPORT_MARGIN;
    if (dy < VIEWPORT_MARGIN) dy = VIEWPORT_MARGIN;

    if (dx !== dragRef.current.posX || dy !== dragRef.current.posY) {
      dragRef.current.posX = dx;
      dragRef.current.posY = dy;
      setTooltipX(dx);
      setTooltipY(dy);
    }
  }, [tooltipW, tooltipH]);

  useEffect(() => {
    if (!open || !ready) return;
    const raf = requestAnimationFrame(() => clampTooltip());
    return () => cancelAnimationFrame(raf);
  }, [open, ready, clampTooltip]);

  /* ── Drag handler (title bar only) ── */
  const handleTooltipMouseDown = useCallback((e: React.MouseEvent) => {
    // Only drag from header area
    const target = e.target as HTMLElement;
    if (!target.closest(".req-tooltip-header") || target.closest(".req-tooltip-close")) return;
    e.stopPropagation();
    e.preventDefault();
    dragRef.current.dragging = true;
    dragRef.current.startX = e.clientX - dragRef.current.posX;
    dragRef.current.startY = e.clientY - dragRef.current.posY;

    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current.dragging) return;
      dragRef.current.posX = ev.clientX - dragRef.current.startX;
      dragRef.current.posY = ev.clientY - dragRef.current.startY;
      setTooltipX(dragRef.current.posX);
      setTooltipY(dragRef.current.posY);
    };
    const onUp = () => {
      dragRef.current.dragging = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, []);

  /* ── Resize handler (bottom-right handle) ── */
  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      resizeRef.current.resizing = true;
      resizeRef.current.startMouseX = e.clientX;
      resizeRef.current.startMouseY = e.clientY;
      resizeRef.current.startW = tooltipW;
      resizeRef.current.startH = tooltipH;
      resizeRef.current.startPosX = dragRef.current.posX;
      resizeRef.current.startPosY = dragRef.current.posY;

      const onMove = (ev: MouseEvent) => {
        if (!resizeRef.current.resizing) return;
        const deltaX = ev.clientX - resizeRef.current.startMouseX;
        const deltaY = ev.clientY - resizeRef.current.startMouseY;

        let newW = resizeRef.current.startW + deltaX;
        let newH = resizeRef.current.startH + deltaY;

        // Hard constraints
        newW = Math.max(MIN_W, Math.min(MAX_W, newW));
        newH = Math.max(MIN_H, Math.min(MAX_H, newH));

        // Viewport constraint (don't push past right/bottom edge)
        const maxW = window.innerWidth - dragRef.current.posX - VIEWPORT_MARGIN;
        const maxH = window.innerHeight - dragRef.current.posY - VIEWPORT_MARGIN;
        newW = Math.min(newW, Math.max(MIN_W, maxW));
        newH = Math.min(newH, Math.max(MIN_H, maxH));

        setTooltipW(newW);
        setTooltipH(newH);
      };
      const onUp = () => {
        resizeRef.current.resizing = false;
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [tooltipW, tooltipH]
  );

  /* ── Badge styling ── */
  const badgeStyle: React.CSSProperties = badgePos
    ? {
        position: "absolute",
        top: badgePos.top,
        right: badgePos.right,
        zIndex: 20,
        display: "inline-block",
        cursor: "pointer",
      }
    : {
        position: "fixed",
        top: 80 + index * 28,
        right: 16,
        zIndex: 9980,
        display: "inline-block",
        cursor: "pointer",
      };

  return (
    <>
      {/* Badge trigger */}
      <div
        ref={badgeRef}
        className={className}
        style={badgeStyle}
        onMouseEnter={handleMouseEnter}
      >
        <span
          style={{
            display: "inline-block",
            backgroundColor: "rgb(250, 173, 20)",
            color: "#ffffff",
            fontSize: 12,
            fontWeight: 600,
            lineHeight: "16px",
            padding: "1px 5px",
            borderRadius: 3,
            border: "none",
            cursor: "pointer",
            whiteSpace: "nowrap",
            userSelect: "none",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          }}
        >
          {req.id}
        </span>
      </div>

      {/* Tooltip popover */}
      {open && (
        <div
          ref={tooltipRef}
          onMouseDown={handleTooltipMouseDown}
          onClick={(e) => e.stopPropagation()}
          className="fixed"
          style={{
            left: 0,
            top: 0,
            width: tooltipW,
            height: tooltipH,
            transform: `translate(${tooltipX}px, ${tooltipY}px)`,
            backgroundColor: "#f8f7f7",
            borderRadius: 6,
            boxShadow:
              "0 4px 24px rgba(0,0,0,0.14), 0 1px 4px rgba(0,0,0,0.08)",
            zIndex: 9999,
            cursor: "default",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
            opacity: ready ? 1 : 0,
            transition: "opacity 0.12s ease",
          }}
        >
          {/* ── Fixed title bar ── */}
          <div
            className="req-tooltip-header"
            style={{
              padding: "10px 14px 8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "grab",
              userSelect: "none",
              flexShrink: 0,
              backgroundColor: "#f8f7f7",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                minWidth: 0,
                flex: 1,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  backgroundColor: "rgb(250, 173, 20)",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 600,
                  lineHeight: "16px",
                  padding: "1px 5px",
                  borderRadius: 3,
                  flexShrink: 0,
                }}
              >
                {req.id}
              </span>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#1e293b",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {req.title}
              </span>
            </div>
            <button
              className="req-tooltip-close"
              onClick={handleClose}
              style={{
                background: "none",
                border: "none",
                fontSize: 16,
                cursor: "pointer",
                color: "#94a3b8",
                padding: "0 2px",
                lineHeight: 1,
                flexShrink: 0,
                marginLeft: 8,
              }}
              title="关闭"
            >
              ✕
            </button>
          </div>

          {/* ── Divider ── */}
          <div
            style={{
              margin: "0 14px",
              height: 1,
              backgroundColor: "#d1d5db",
              flexShrink: 0,
            }}
          />

          {/* ── Scrollable body ── */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              padding: "10px 14px 14px",
              fontSize: 13,
              lineHeight: 1.65,
              color: "#334155",
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <RenderMdContent content={req.content} />
          </div>

          {/* ── Resize handle (bottom-right, desktop only) ── */}
          {!isMobile && (
            <div
              onMouseDown={handleResizeMouseDown}
              style={{
                position: "absolute",
                bottom: 2,
                right: 2,
                width: 22,
                height: 22,
                cursor: "nwse-resize",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-end",
                padding: "0 3px 3px 0",
                zIndex: 2,
              }}
              title="拖拽调整大小"
            >
              {/* Diagonal lines resize indicator */}
              <svg width="12" height="12" viewBox="0 0 12 12" style={{ opacity: 0.35 }}>
                <path
                  d="M0 12 L12 0 M4 12 L12 4 M8 12 L12 8"
                  stroke="#64748b"
                  strokeWidth="1.2"
                  fill="none"
                />
              </svg>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default RequirementBadge;
