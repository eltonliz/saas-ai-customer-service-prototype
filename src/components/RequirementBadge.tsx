import { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import type { RequirementAnnotation } from "../data/requirementAnnotations";

interface RequirementBadgeProps {
  annotation: RequirementAnnotation;
  onHover: (ann: RequirementAnnotation, rect: DOMRect) => void;
}

const BADGE_SAFE_OFFSET_X = 8;
const BADGE_SAFE_OFFSET_Y = 8;

function isInsidePhonePreview(el: Element): boolean {
  let parent: Element | null = el;
  while (parent) {
    if (parent.hasAttribute("data-phone-preview-shell")) return true;
    parent = parent.parentElement;
  }
  return false;
}

export function RequirementBadge({ annotation, onHover }: RequirementBadgeProps) {
  const [badgePos, setBadgePos] = useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const observerRef = useRef<MutationObserver | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const updatePosition = useCallback(() => {
    const el = document.querySelector(annotation.targetSelector);
    if (!el) return;

    const rect = el.getBoundingClientRect();

    // If target is inside PhonePreview, check if it's in the visible area
    if (isInsidePhonePreview(el)) {
      const shell = document.querySelector("[data-phone-preview-shell]");
      if (shell) {
        const shellRect = shell.getBoundingClientRect();
        // Badge position (right edge of target, offset inward)
        const badgeLeft = rect.right - 6;
        const badgeTop = rect.top + BADGE_SAFE_OFFSET_Y;
        if (badgeLeft < shellRect.left + 8 || badgeLeft > shellRect.right - 8 ||
            badgeTop < shellRect.top + 8 || badgeTop > shellRect.bottom - 8) {
          setBadgePos(null);
          setMounted(true);
          return;
        }
      }
    }

    // position:fixed uses viewport-relative coords. getBoundingClientRect already returns viewport coords.
    // DO NOT add window.scrollX/scrollY.
    setBadgePos({
      top: rect.top + BADGE_SAFE_OFFSET_Y,
      left: rect.right - 6,
    });
    setMounted(true);
  }, [annotation.targetSelector]);

  useEffect(() => {
    updatePosition();

    // Capture scrolls from any ancestor (including inside PhonePreview)
    window.addEventListener("scroll", updatePosition, { capture: true, passive: true });
    window.addEventListener("resize", updatePosition);

    // Observer for DOM mutations (dynamic content)
    const el = document.querySelector(annotation.targetSelector);
    if (el) {
      observerRef.current = new MutationObserver(updatePosition);
      observerRef.current.observe(el, { attributes: true, childList: true, subtree: true });
    } else {
      // Target doesn't exist yet — poll until it appears
      pollRef.current = setInterval(() => {
        const found = document.querySelector(annotation.targetSelector);
        if (found) {
          if (pollRef.current) clearInterval(pollRef.current);
          pollRef.current = null;
          observerRef.current = new MutationObserver(updatePosition);
          observerRef.current.observe(found, { attributes: true, childList: true, subtree: true });
          updatePosition();
        }
      }, 500);
    }

    return () => {
      observerRef.current?.disconnect();
      if (pollRef.current) clearInterval(pollRef.current);
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

  if (!mounted || !badgePos) return null;

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
    document.body,
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
