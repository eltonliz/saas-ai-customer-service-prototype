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

/**
 * Global registry to ensure only one tooltip per requirement ID is open at a time.
 */
const openTooltipRegistry = new Set<number>();

/* ──── Simple Markdown → JSX renderer ──── */

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

/** Parse inline markdown (bold, code, text — no italic) */
function parseInline(text: string): InlineNode[] {
  const result: InlineNode[] = [];
  let i = 0;
  while (i < text.length) {
    // Bold: **text**
    if (text.startsWith("**", i)) {
      const end = text.indexOf("**", i + 2);
      if (end !== -1) {
        result.push({ type: "bold", children: parseInline(text.slice(i + 2, end)) });
        i = end + 2;
        continue;
      }
    }
    // Inline code: `text`
    if (text[i] === "`") {
      const end = text.indexOf("`", i + 1);
      if (end !== -1) {
        result.push({ type: "code", text: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    // Plain text — consume until special char
    let j = i;
    while (j < text.length && text[j] !== "*" && text[j] !== "`") j++;
    if (j > i) {
      result.push({ type: "text", text: text.slice(i, j) });
    }
    i = j;
    if (j === i) {
      result.push({ type: "text", text: text[i] });
      i++;
    }
  }
  return result;
}

/** Parse full markdown content into block nodes */
function parseMarkdown(md: string): MdNode[] {
  const lines = md.split("\n");
  const nodes: MdNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      nodes.push({ type: "codeblock", text: codeLines.join("\n"), lang: lang || undefined });
      continue;
    }

    // Table
    if (line.startsWith("|") && i + 1 < lines.length && lines[i + 1].includes("---")) {
      const headerCells = line.split("|").filter(c => c.trim()).map(c => parseInline(c.trim()));
      i += 2;
      const rows: InlineNode[][][] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        rows.push(
          lines[i].split("|").filter(c => c.trim()).map(c => parseInline(c.trim()))
        );
        i++;
      }
      nodes.push({ type: "table", headers: headerCells, rows });
      continue;
    }

    // Horizontal rule
    if (/^[-*_]{3,}\s*$/.test(line)) {
      nodes.push({ type: "hr" });
      i++;
      continue;
    }

    // Headings
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

    // Blockquote
    if (line.startsWith("> ")) {
      nodes.push({ type: "blockquote", children: parseInline(line.slice(2)) });
      i++;
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const items: InlineNode[][] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(parseInline(lines[i].replace(/^\d+\.\s/, "")));
        i++;
      }
      nodes.push({ type: "ol", items });
      continue;
    }

    // Unordered list
    if (/^[-*]\s/.test(line)) {
      const items: InlineNode[][] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(parseInline(lines[i].replace(/^[-*]\s/, "")));
        i++;
      }
      nodes.push({ type: "ul", items });
      continue;
    }

    // Empty line → skip
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph
    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("#") && !lines[i].startsWith("|") && !lines[i].startsWith(">") && !/^[-*]\s/.test(lines[i]) && !/^\d+\.\s/.test(lines[i]) && !lines[i].startsWith("```")) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      nodes.push({ type: "p", children: parseInline(paraLines.join(" ")) });
    } else {
      i++;
    }
  }

  return nodes;
}

/* ──── Render inline nodes to JSX ──── */

function RenderInline({ nodes }: { nodes: InlineNode[] }): ReactNode {
  return nodes.map((n, i) => {
    switch (n.type) {
      case "text":
        return n.text;
      case "bold":
        return <strong key={i} style={{ fontWeight: 600, color: "#0f172a" }}><RenderInline nodes={n.children} /></strong>;
      case "code":
        return <code key={i} style={{ backgroundColor: "#e2e8f0", padding: "1px 4px", borderRadius: 3, fontSize: 13, fontFamily: "'SF Mono', 'Fira Code', monospace" }}>{n.text}</code>;
    }
  });
}

/* ──── Render block nodes to JSX ──── */

function RenderMdContent({ content }: { content: string }): ReactNode {
  const nodes = parseMarkdown(content);
  return nodes.map((node, i) => {
    switch (node.type) {
      case "h1":
        return <h1 key={i} style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px 0", color: "#0f172a" }}>{node.text}</h1>;
      case "h2":
        return <h2 key={i} style={{ fontSize: 16, fontWeight: 600, margin: "0 0 6px 0", color: "#1e293b" }}>{node.text}</h2>;
      case "h3":
        return <h3 key={i} style={{ fontSize: 15, fontWeight: 600, margin: "0 0 4px 0", color: "#334155" }}>{node.text}</h3>;
      case "p":
        return <p key={i} style={{ marginBottom: 8, marginTop: 0, fontSize: 15, lineHeight: 1.6 }}><RenderInline nodes={node.children} /></p>;
      case "ul":
        return (
          <ul key={i} style={{ marginBottom: 8, paddingLeft: 18, fontSize: 15, lineHeight: 1.6 }}>
            {node.items.map((item, j) => <li key={j} style={{ marginBottom: 2 }}><RenderInline nodes={item} /></li>)}
          </ul>
        );
      case "ol":
        return (
          <ol key={i} style={{ marginBottom: 8, paddingLeft: 18, fontSize: 15, lineHeight: 1.6 }}>
            {node.items.map((item, j) => <li key={j} style={{ marginBottom: 2 }}><RenderInline nodes={item} /></li>)}
          </ol>
        );
      case "blockquote":
        return (
          <blockquote key={i} style={{ margin: "0 0 8px 0", padding: "6px 10px", borderLeft: "3px solid #cbd5e1", backgroundColor: "#f8fafc", color: "#64748b", fontSize: 13 }}>
            <RenderInline nodes={node.children} />
          </blockquote>
        );
      case "code":
        return <code key={i} style={{ display: "block", backgroundColor: "#e2e8f0", padding: "4px 8px", borderRadius: 3, fontSize: 13, fontFamily: "'SF Mono', 'Fira Code', monospace", marginBottom: 8 }}>{node.text}</code>;
      case "codeblock":
        return <pre key={i} style={{ backgroundColor: "#1e293b", color: "#e2e8f0", padding: "10px 14px", borderRadius: 4, fontSize: 13, overflowX: "auto", marginBottom: 8, fontFamily: "'SF Mono', 'Fira Code', monospace" }}><code>{node.text}</code></pre>;
      case "hr":
        return <hr key={i} style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "8px 0" }} />;
      case "table":
        return (
          <div key={i} style={{ overflowX: "auto", marginBottom: 8 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  {node.headers.map((h, j) => (
                    <th key={j} style={{ border: "1px solid #cbd5e1", padding: "4px 6px", backgroundColor: "#f1f5f9", textAlign: "left", fontWeight: 600 }}>
                      <RenderInline nodes={h} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {node.rows.map((row, j) => (
                  <tr key={j}>
                    {row.map((cell, k) => (
                      <td key={k} style={{ border: "1px solid #e2e8f0", padding: "4px 6px" }}>
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

/* ──── Main Badge Component ──── */

export function RequirementBadge({ req, sectionSelector, index = 0, className = "" }: RequirementBadgeProps) {
  const [open, setOpen] = useState(false);
  const [badgeStyle, setBadgeStyle] = useState<React.CSSProperties>({});
  const badgeRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    dragging: boolean;
    startX: number;
    startY: number;
    posX: number;
    posY: number;
  }>({
    dragging: false,
    startX: 0,
    startY: 0,
    posX: 0,
    posY: 0,
  });

  // Position badge near its target module
  useEffect(() => {
    if (sectionSelector) {
      const el = document.querySelector(sectionSelector) as HTMLElement | null;
      if (el) {
        const rect = el.getBoundingClientRect();
        setBadgeStyle({
          position: "fixed",
          top: rect.top + 4 + index * 26,
          left: rect.right + 8,
          zIndex: 9980,
        });
        return;
      }
    }
    // Fallback: right-side column stacking
    setBadgeStyle({
      position: "fixed",
      top: 80 + index * 28,
      right: 16,
      zIndex: 9980,
    });
  }, [sectionSelector, index]);

  const clampTooltip = useCallback(() => {
    const el = tooltipRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let dx = dragRef.current.posX;
    let dy = dragRef.current.posY;
    if (rect.right > vw - 8) dx -= rect.right - vw + 8;
    if (rect.bottom > vh - 8) dy -= rect.bottom - vh + 8;
    if (rect.left < 8) dx += 8 - rect.left;
    if (rect.top < 8) dy += 8 - rect.top;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  }, []);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => clampTooltip());
  }, [open, clampTooltip]);

  const handleMouseEnter = () => {
    if (!openTooltipRegistry.has(req.id)) {
      openTooltipRegistry.add(req.id);
      setOpen(true);
    }
  };

  const handleClose = () => {
    openTooltipRegistry.delete(req.id);
    setOpen(false);
    dragRef.current.posX = 0;
    dragRef.current.posY = 0;
  };

  useEffect(() => {
    return () => {
      openTooltipRegistry.delete(req.id);
    };
  }, [req.id]);

  const handleTooltipMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".req-tooltip-header")) return;
    e.stopPropagation();
    e.preventDefault();
    dragRef.current.dragging = true;
    dragRef.current.startX = e.clientX - dragRef.current.posX;
    dragRef.current.startY = e.clientY - dragRef.current.posY;

    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current.dragging) return;
      dragRef.current.posX = ev.clientX - dragRef.current.startX;
      dragRef.current.posY = ev.clientY - dragRef.current.startY;
      if (tooltipRef.current) {
        tooltipRef.current.style.transform = `translate(${dragRef.current.posX}px, ${dragRef.current.posY}px)`;
      }
    };
    const onUp = () => {
      dragRef.current.dragging = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const getTooltipInitialStyle = useCallback((): React.CSSProperties => {
    if (!badgeRef.current) {
      return { right: 0, top: 0 };
    }
    const badgeRect = badgeRef.current.getBoundingClientRect();
    return {
      right: window.innerWidth - badgeRect.right,
      top: badgeRect.bottom + 8,
    };
  }, []);

  return (
    <>
      {/* Badge */}
      <div
        ref={badgeRef}
        className={className}
        style={{
          ...badgeStyle,
          display: "inline-block",
          verticalAlign: "top",
          cursor: "pointer",
        }}
        onMouseEnter={handleMouseEnter}
      >
        <span
          style={{
            display: "inline-block",
            verticalAlign: "top",
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
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
          }}
        >
          {req.id}
        </span>
      </div>

      {/* Tooltip */}
      {open && (
        <div
          ref={tooltipRef}
          onMouseDown={handleTooltipMouseDown}
          onClick={(e) => e.stopPropagation()}
          className="fixed"
          style={{
            ...getTooltipInitialStyle(),
            width: 420,
            maxHeight: "65vh",
            overflowY: "auto",
            backgroundColor: "#f8f7f7",
            borderRadius: 6,
            boxShadow: "0 4px 24px rgba(0,0,0,0.14), 0 1px 4px rgba(0,0,0,0.08)",
            zIndex: 9999,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
            cursor: "default",
            transform: "translate(0px, 0px)",
          }}
        >
          {/* Header */}
          <div
            className="req-tooltip-header"
            style={{
              padding: "10px 14px 8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "grab",
              userSelect: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  display: "inline-block",
                  verticalAlign: "top",
                  backgroundColor: "rgb(250, 173, 20)",
                  color: "#ffffff",
                  fontSize: 11,
                  fontWeight: 600,
                  lineHeight: "16px",
                  padding: "1px 5px",
                  borderRadius: 3,
                  border: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {req.id}
              </span>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#1e293b" }}>
                {req.title}
              </span>
            </div>
            <button
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
              }}
              title="关闭"
            >
              ✕
            </button>
          </div>

          {/* Divider */}
          <div style={{ margin: "0 14px", height: 1, backgroundColor: "#d1d5db" }} />

          {/* Content */}
          <div
            style={{ padding: "10px 14px 14px", fontSize: 14, lineHeight: 1.65, color: "#334155" }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <RenderMdContent content={req.content} />
          </div>
        </div>
      )}
    </>
  );
}

export default RequirementBadge;
