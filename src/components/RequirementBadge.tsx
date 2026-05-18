import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";

export interface RequirementDef {
  id: number;
  title: string;
  content: string;
}

interface RequirementBadgeProps {
  req: RequirementDef;
  /** CSS selector or ref to position relative to. If omitted, badge is position:fixed. */
  anchorRef?: React.RefObject<HTMLElement | null>;
  /** Offset from anchor's top-right corner. Default: top: -8, right: -4 */
  offset?: { top?: number; right?: number };
  /** Index for stacking multiple fixed badges vertically */
  index?: number;
  className?: string;
}

export function RequirementBadge({ req, anchorRef, offset, index = 0, className = "" }: RequirementBadgeProps) {
  const [open, setOpen] = useState(false);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ dragging: boolean; startX: number; startY: number; posX: number; posY: number }>({
    dragging: false, startX: 0, startY: 0, posX: 0, posY: 0,
  });

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Reposition tooltip to avoid viewport overflow
  const positionTooltip = useCallback(() => {
    const el = tooltipRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let dx = dragRef.current.posX;
    let dy = dragRef.current.posY;
    if (rect.right > vw - 8) dx -= (rect.right - vw + 8);
    if (rect.bottom > vh - 8) dy -= (rect.bottom - vh + 8);
    if (rect.left < 8) dx += (8 - rect.left);
    if (rect.top < 8) dy += (8 - rect.top);
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  }, []);

  useEffect(() => {
    if (!open) return;
    positionTooltip();
  }, [open, positionTooltip]);

  const handleMouseEnter = () => setOpen(true);

  const handleMouseDown = (e: React.MouseEvent) => {
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

  const badgeStyle: React.CSSProperties = anchorRef
    ? {
        position: "absolute",
        top: offset?.top ?? -8,
        right: offset?.right ?? -4,
        backgroundColor: "rgb(250, 173, 20)",
        color: "#fff",
        fontSize: "10px",
        fontWeight: 700,
        lineHeight: "14px",
        padding: "0px 4px",
        borderRadius: "2px",
        border: "none",
        cursor: "pointer",
        zIndex: 9990,
      }
    : {
        position: "fixed",
        top: 8 + index * 28,
        right: 12,
        backgroundColor: "rgb(250, 173, 20)",
        color: "#fff",
        fontSize: "11px",
        fontWeight: 700,
        lineHeight: "15px",
        padding: "1px 5px",
        borderRadius: "2px",
        border: "none",
        cursor: "pointer",
        zIndex: 9990,
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      };

  return (
    <>
      <span
        ref={badgeRef}
        style={badgeStyle}
        className={className}
        onMouseEnter={handleMouseEnter}
        title={`需求 ${req.id}: ${req.title}`}
      >
        {req.id}
      </span>

      {open && (
        <div
          ref={tooltipRef}
          onMouseDown={handleMouseDown}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            right: anchorRef ? "auto" : 12,
            left: anchorRef ? "auto" : "auto",
            top: anchorRef ? "auto" : (badgeRef.current ? badgeRef.current.getBoundingClientRect().bottom + 8 : 8 + (index + 1) * 28 + 8),
            width: 450,
            maxHeight: "70vh",
            overflowY: "auto",
            backgroundColor: "#f0efef",
            borderRadius: 4,
            boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
            zIndex: 9999,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            cursor: "default",
          }}
        >
          {/* If anchorRef is set, position relative to it */}
          {anchorRef && (
            <script
              dangerouslySetInnerHTML={{
                __html: `/* anchor positioning */`,
              }}
            />
          )}
          {/* Header */}
          <div style={{ padding: "14px 16px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  display: "inline-block",
                  backgroundColor: "rgb(250, 173, 20)",
                  color: "#fff",
                  fontSize: "10px",
                  fontWeight: 700,
                  lineHeight: "14px",
                  padding: "0px 4px",
                  borderRadius: "2px",
                }}
              >
                {req.id}
              </span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>
                需求描述：{req.title}
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                fontSize: 16,
                cursor: "pointer",
                color: "#94a3b8",
                padding: "0 2px",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
          <div style={{ margin: "0 16px", height: 1, backgroundColor: "#e2e8f0" }} />

          {/* Content */}
          <div
            style={{ padding: "12px 16px 16px", fontSize: 14, lineHeight: 1.6, color: "#334155" }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <ReactMarkdown
              components={{
                p: ({ children }) => <p style={{ marginBottom: 12, marginTop: 0 }}>{children}</p>,
                strong: ({ children }) => <strong style={{ fontWeight: 600, color: "#0f172a" }}>{children}</strong>,
                em: ({ children }) => <em style={{ fontStyle: "italic", color: "#475569" }}>{children}</em>,
                ul: ({ children }) => <ul style={{ marginBottom: 12, paddingLeft: 20 }}>{children}</ul>,
                ol: ({ children }) => <ol style={{ marginBottom: 12, paddingLeft: 20 }}>{children}</ol>,
                li: ({ children }) => <li style={{ marginBottom: 4 }}>{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote
                    style={{
                      margin: "0 0 12px 0",
                      padding: "6px 12px",
                      borderLeft: "3px solid #cbd5e1",
                      backgroundColor: "#f8fafc",
                      color: "#64748b",
                      fontSize: 13,
                    }}
                  >
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code style={{ backgroundColor: "#e2e8f0", padding: "1px 4px", borderRadius: 3, fontSize: 13 }}>
                    {children}
                  </code>
                ),
                table: ({ children }) => (
                  <div style={{ overflowX: "auto", marginBottom: 12 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th style={{ border: "1px solid #cbd5e1", padding: "6px 8px", backgroundColor: "#f1f5f9", textAlign: "left", fontWeight: 600 }}>
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td style={{ border: "1px solid #e2e8f0", padding: "6px 8px" }}>{children}</td>
                ),
                hr: () => <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "12px 0" }} />,
              }}
            >
              {req.content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </>
  );
}

export default RequirementBadge;
