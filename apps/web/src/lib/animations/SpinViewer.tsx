"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinViewerProps {
  /** Ordered sequence of frame image URLs representing one full rotation */
  frames: string[];
  /** Accessible description of what's shown */
  alt: string;
  className?: string;
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

/**
 * Drag-to-rotate frame-sequence viewer. Not a 3D renderer — it just
 * scrubs through a preloaded image sequence, typically produced by the
 * Video → Frames tool.
 */
export function SpinViewer({ frames, alt, className }: SpinViewerProps) {
  const frameCount = frames.length;
  const [currentFrame, setCurrentFrame] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

  const containerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ dragging: false, startX: 0, startFrame: 0 });
  const hasInteracted = useRef(false);

  // Preload every frame up front so scrubbing has no per-frame network stall.
  useEffect(() => {
    let cancelled = false;
    setLoadedCount(0);
    frames.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        if (!cancelled) setLoadedCount((c) => c + 1);
      };
      img.src = src;
    });
    return () => {
      cancelled = true;
    };
  }, [frames]);

  const allLoaded = frameCount > 0 && loadedCount >= frameCount;

  // One-time idle sweep once loaded, purely to signal "this rotates" — not
  // decorative looping. Skipped for reduced-motion and after any real
  // interaction.
  useEffect(() => {
    if (!allLoaded || hasInteracted.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    const sweep = Math.max(4, Math.round(frameCount * 0.12));
    let step = 0;
    const id = setInterval(() => {
      if (cancelled || hasInteracted.current) {
        clearInterval(id);
        return;
      }
      step += 1;
      if (step <= sweep) setCurrentFrame((f) => mod(f + 1, frameCount));
      else if (step <= sweep * 2) setCurrentFrame((f) => mod(f - 1, frameCount));
      else clearInterval(id);
    }, 45);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [allLoaded, frameCount]);

  const registerInteraction = useCallback(() => {
    if (!hasInteracted.current) {
      hasInteracted.current = true;
      setShowHint(false);
    }
  }, []);

  const stepFrame = useCallback((delta: number) => setCurrentFrame((f) => mod(f + delta, frameCount)), [frameCount]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isZoomed) return;
    registerInteraction();
    dragState.current = { dragging: true, startX: e.clientX, startFrame: currentFrame };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isZoomed) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomOrigin({ x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) });
      return;
    }
    if (!dragState.current.dragging) return;
    const sensitivity = 6; // px of drag per frame step
    const delta = Math.round((e.clientX - dragState.current.startX) / sensitivity);
    setCurrentFrame(mod(dragState.current.startFrame + delta, frameCount));
  };

  const endDrag = () => {
    dragState.current.dragging = false;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      registerInteraction();
      stepFrame(1);
    } else if (e.key === "ArrowLeft") {
      registerInteraction();
      stepFrame(-1);
    } else if (e.key === "Escape" && isZoomed) {
      setIsZoomed(false);
    }
  };

  const toggleZoom = () => {
    registerInteraction();
    setIsZoomed((z) => !z);
  };

  return (
    <div
      ref={containerRef}
      role="group"
      aria-roledescription="360-degree viewer"
      aria-label={`${alt}. Frame ${currentFrame + 1} of ${frameCount}. Use the left and right arrow keys to rotate.`}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative aspect-square select-none overflow-hidden bg-[var(--surface-raised)] outline-none touch-none",
        isZoomed ? "cursor-zoom-out" : "cursor-grab active:cursor-grabbing",
        className,
      )}
    >
      {!allLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="h-px w-24 bg-[var(--border)] overflow-hidden">
            <div
              className="h-full bg-[var(--accent)] transition-[width] duration-150"
              style={{ width: `${frameCount ? (loadedCount / frameCount) * 100 : 0}%` }}
            />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">Loading</span>
        </div>
      )}

      {allLoaded && (
        <img
          src={frames[currentFrame]}
          alt={alt}
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-200"
          style={
            isZoomed ? { transform: "scale(2)", transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%` } : undefined
          }
        />
      )}

      {allLoaded && showHint && (
        <div className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-none transition-opacity duration-500">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)] bg-[var(--surface)]/90 px-3 py-1.5 border border-[var(--border)]">
            Drag to rotate
          </span>
        </div>
      )}

      {allLoaded && (
        <>
          <span className="absolute bottom-4 right-4 font-mono text-[10px] tracking-wide text-[var(--text-secondary)] bg-[var(--surface)]/90 px-2 py-1">
            {String(currentFrame + 1).padStart(3, "0")} / {String(frameCount).padStart(3, "0")}
          </span>
          <button
            type="button"
            onClick={toggleZoom}
            aria-label={isZoomed ? "Zoom out" : "Zoom in"}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-[var(--surface)]/90 border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
          >
            {isZoomed ? <ZoomOut size={16} strokeWidth={1.5} /> : <ZoomIn size={16} strokeWidth={1.5} />}
          </button>
        </>
      )}
    </div>
  );
}
