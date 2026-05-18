import { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import type { RequirementAnnotation } from "../data/requirementAnnotations";

interface RequirementBadgeProps {
  annotation: RequirementAnnotation;
  onHover: (ann: RequirementAnnotation, rect: DOMRect) => void;
}

export function RequirementBadge({ annotation, onHover }: RequirementBadgeProps) {
  const targetRef = useRef<Element | null>(null);
  const [badgePos, setBadgePos] = useState<{ top: number; left: number } | null>(null);
  const [usePortal, setUsePortal] = useState(false);

  const updatePosition = useCallback(() => {
    const el = document.querySelector(annotation.targetSelector);
    if (!el) return;
    targetRef.current = el;

    // Check if any parent has overflow hidden/auto/scroll
    let parent = el.parentElement;
    let needsPortal = false;
    while (parent) {
      const style = window.getComputedStyle(parent);
      if (style.overflow === "hidden" || style.overflow === "auto" || style.overflow === "scroll" ||
          style.overflowX === "hidden" || style.overflowX === "auto" || style.overflowX === "scroll" ||
          style.overflowY === "hidden" || style.overflowY === "auto" || style.overflowY === "scroll") {
        needsPortal = true;
        break;
      }
      parent = parent.parentElement;
    }
    setUsePortal(needsPortal);

    if (needsPortal) {
      const rect = el.getBoundingClientRect();
      setBadgePos({
        top: rect.top + window.scrollY - 8,
        left: rect.right + window.scrollX - 4,
      });
    }
  }, [annotation.targetSelector]);

  useEffect(() => {
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [updatePosition]);

  const handleMouseEnter = () => {
    const el = document.querySelector(annotation.targetSelector);
    if (el) {
      onHover(annotation, el.getBoundingClientRect());
    }
  };

  if (usePortal && badgePos) {
    return createPortal(
      <span
        className="requirement-badge requirement-badge-portal"
        style={{ top: badgePos.top, left: badgePos.left }}
        onMouseEnter={handleMouseEnter}
        onClick={(e) => e.stopPropagation()}
        title={`需求 [${annotation.id}] ${annotation.moduleName}`}
      >
        {annotation.id}
      </span>,
      document.body
    );
  }

  // Inline render — the target needs position:relative
  return (
    <span
      className="requirement-badge requirement-badge-static"
      onMouseEnter={handleMouseEnter}
      onClick={(e) => e.stopPropagation()}
      title={`需求 [${annotation.id}] ${annotation.moduleName}`}
    >
      {annotation.id}
    </span>
  );
}

export function AnnotationLayer({ annotations, onHover }: {
  annotations: RequirementAnnotation[];
  onHover: (ann: RequirementAnnotation, rect: DOMRect) => void;
}) {
  return (
    <>
      {annotations.map((ann) => (
        <RequirementBadge key={ann.id} annotation={ann} onHover={onHover} />
      ))}
    </>
  );
}
