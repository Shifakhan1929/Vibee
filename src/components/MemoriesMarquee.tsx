import React, { useRef, useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

interface MemoriesMarqueeProps {
  children: React.ReactNode;
  speed?: number; // pixels per second (default: 34px/s for gentle, readable slow scroll)
}

export function MemoriesMarquee({ children, speed = 34 }: MemoriesMarqueeProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const isDraggingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const isUserPausedRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  // Sync ref values for the 60fps/120fps requestAnimationFrame loop
  isDraggingRef.current = isDragging;
  isHoveredRef.current = isHovered;
  isUserPausedRef.current = isUserPaused;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    let reqId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1); // cap delta to avoid large jump on tab focus
      lastTime = currentTime;

      const shouldScroll =
        !isHoveredRef.current &&
        !isUserPausedRef.current &&
        !isDraggingRef.current;

      if (shouldScroll && el) {
        el.scrollLeft += speed * delta;

        // Half width represents the exact length of the original set of columns
        const halfWidth = el.scrollWidth / 2;
        if (halfWidth > 0) {
          if (el.scrollLeft >= halfWidth) {
            el.scrollLeft -= halfWidth;
          } else if (el.scrollLeft <= 0) {
            el.scrollLeft += halfWidth;
          }
        }
      }

      reqId = requestAnimationFrame(loop);
    };

    reqId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(reqId);
  }, [speed]);

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    hasMovedRef.current = false;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    hasMovedRef.current = true;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.3;
    el.scrollLeft = scrollLeftRef.current - walk;

    // Handle wrap boundaries seamlessly while dragging
    const halfWidth = el.scrollWidth / 2;
    if (halfWidth > 0) {
      if (el.scrollLeft >= halfWidth) {
        el.scrollLeft -= halfWidth;
        scrollLeftRef.current -= halfWidth;
      } else if (el.scrollLeft <= 0) {
        el.scrollLeft += halfWidth;
        scrollLeftRef.current += halfWidth;
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Handlers for mobile & tablets
  const handleTouchStart = () => {
    setIsHovered(true);
  };

  const handleTouchEnd = () => {
    // Resume auto-scroll 1.5s after touching ends
    setTimeout(() => {
      setIsHovered(false);
    }, 1500);
  };

  // Arrow controls
  const scrollStep = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const offset = direction === "left" ? -320 : 320;
    el.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <div
      className="memories-marquee-root relative w-full group/memories"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
      }}
    >
      {/* Soft edge gradient fades for elegant bleed effect */}
      <div
        className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 z-10 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(to right, rgb(245, 243, 255) 20%, rgba(245, 243, 255, 0))",
        }}
      />
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 z-10 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(to left, rgb(255, 231, 225) 20%, rgba(255, 231, 225, 0))",
        }}
      />

      {/* Floating navigation buttons on hover */}
      <button
        type="button"
        onClick={() => scrollStep("left")}
        aria-label="Scroll memories left"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-[#1565C0] shadow-md border border-slate-200/80 flex items-center justify-center opacity-0 group-hover/memories:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xs"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => scrollStep("right")}
        aria-label="Scroll memories right"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-[#1565C0] shadow-md border border-slate-200/80 flex items-center justify-center opacity-0 group-hover/memories:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xs"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Scrollable Container with Duplicate Tracks for Infinite Smooth Marquee */}
      <div
        ref={scrollRef}
        className="memories-main-container select-none"
        style={{
          overflowX: "scroll",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          cursor: isDragging ? "grabbing" : "grab",
          WebkitOverflowScrolling: "touch",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="memories-columns-container"
          style={{
            display: "flex",
            gap: "22px",
            width: "max-content",
            transform: "none", // Override static inline translate
          }}
        >
          {/* Track 1: Original columns */}
          {children}

          {/* Track 2: Duplicate columns for seamless infinite loop */}
          {children}
        </div>
      </div>

      {/* Subtle indicator hint on hover / interaction */}
      <div className="flex items-center justify-center gap-2 mt-4 text-[11px] font-medium text-slate-500 opacity-80 transition-opacity">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/70 border border-slate-200/60 shadow-2xs backdrop-blur-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Auto-scrolling slowly · Drag or hover to explore</span>
        </span>
        <button
          type="button"
          onClick={() => setIsUserPaused((prev) => !prev)}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/70 hover:bg-white border border-slate-200/60 text-slate-600 hover:text-slate-900 cursor-pointer transition-colors shadow-2xs"
          title={isUserPaused ? "Play animation" : "Pause animation"}
        >
          {isUserPaused ? (
            <>
              <Play className="w-3 h-3 text-emerald-600" />
              <span>Resume</span>
            </>
          ) : (
            <>
              <Pause className="w-3 h-3 text-slate-500" />
              <span>Pause</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

