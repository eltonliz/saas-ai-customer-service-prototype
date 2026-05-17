import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { marked } from "marked";
import type { RequirementAnnotation } from "../data/requirementAnnotations";

interface TooltipInstance {
  annotation: RequirementAnnotation;
  position: { x: number; y: number };
}

interface RequirementTooltipProps {
  instance: TooltipInstance;
  onClose: (id: number) => void;
  onDragEnd: (id: number, x: number, y: number) => void;
}

declare global {
  interface Window {
    __reqTooltipOpen?: (ann: RequirementAnnotation, rect: DOMRect) => void;
  }
}

function RequirementTooltip({ instance, onClose, onDragEnd }: RequirementTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(instance.position);
  const [adjustedPos, setAdjustedPos] = useState(instance.position);
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Parse markdown
  const htmlContent = useMemo(() => {
    return marked(instance.annotation.markdown, { breaks: true }) as string;
  }, [instance.annotation.markdown]);

  // Adjust position to stay within viewport
  useEffect(() => {
    const el = tooltipRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let newX = pos.x;
    let newY = pos.y;

    if (rect.right > vw) newX = vw - rect.width - 8;
    if (rect.left < 0) newX = 8;
    if (rect.bottom > vh) newY = vh - rect.height - 8;
    if (rect.top < 0) newY = 8;

    if (newX !== pos.x || newY !== pos.y) {
      setAdjustedPos({ x: newX, y: newY });
    } else {
      setAdjustedPos(pos);
    }
  }, [pos]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    dragging.current = true;
    const rect = tooltipRef.current?.getBoundingClientRect();
    if (rect) {
      dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    const handleMouseMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      ev.preventDefault();
      setPos({ x: ev.clientX - dragOffset.current.x, y: ev.clientY - dragOffset.current.y });
    };

    const handleMouseUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      onDragEnd(instance.annotation.id, pos.x, pos.y);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [instance.annotation.id, onDragEnd, pos]);

  const handleClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onClose(instance.annotation.id);
  }, [instance.annotation.id, onClose]);

  return (
    <div
      ref={tooltipRef}
      className="requirement-tooltip"
      style={{ left: adjustedPos.x, top: adjustedPos.y }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="requirement-tooltip-header" onMouseDown={handleMouseDown}>
        <span className="requirement-tooltip-title">
          <span className="requirement-badge" style={{ marginRight: 6 }}>{instance.annotation.id}</span>
          需求描述：{instance.annotation.moduleName}
        </span>
        <button type="button" className="requirement-tooltip-close" onClick={handleClose}>✕</button>
      </div>
      <div
        className="requirement-tooltip-body"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}

export function TooltipManager({ activeAnnotations }: {
  activeAnnotations: RequirementAnnotation[];
}) {
  const [tooltips, setTooltips] = useState<Map<number, TooltipInstance>>(new Map());

  const openTooltip = useCallback((annotation: RequirementAnnotation, rect: DOMRect) => {
    setTooltips((prev) => {
      const next = new Map(prev);
      if (!next.has(annotation.id)) {
        next.set(annotation.id, {
          annotation,
          position: { x: rect.right + 8, y: rect.top + 8 },
        });
      }
      return next;
    });
  }, []);

  const closeTooltip = useCallback((id: number) => {
    setTooltips((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const updatePosition = useCallback((id: number, x: number, y: number) => {
    setTooltips((prev) => {
      const next = new Map(prev);
      const existing = next.get(id);
      if (existing) {
        next.set(id, { ...existing, position: { x, y } });
      }
      return next;
    });
  }, []);

  // Expose openTooltip globally so RequirementBadge can call it
  useEffect(() => {
    window.__reqTooltipOpen = openTooltip;
    return () => { delete window.__reqTooltipOpen; };
  }, [openTooltip]);

  return (
    <>
      {Array.from(tooltips.values()).map((inst) => (
        <RequirementTooltip
          key={inst.annotation.id}
          instance={inst}
          onClose={closeTooltip}
          onDragEnd={updatePosition}
        />
      ))}
    </>
  );
}

export function useAnnotationLayer(annotations: RequirementAnnotation[]) {
  const handleBadgeHover = useCallback((ann: RequirementAnnotation, rect: DOMRect) => {
    window.__reqTooltipOpen?.(ann, rect);
  }, []);

  // Filter annotations relevant to current page
  const pageAnnotations = useMemo(() => {
    const path = window.location.hash.replace("#", "") || "/";
    return annotations.filter((a) => {
      if (!a.pagePath) return true;
      return path.includes(a.pagePath) || a.pagePath.includes(path);
    });
  }, [annotations]);

  return { handleBadgeHover, pageAnnotations };
}
