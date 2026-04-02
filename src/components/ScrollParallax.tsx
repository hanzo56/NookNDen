"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return reduced;
}

/**
 * Hero background parallax — scrolls slower than the page for depth effect.
 * Scales the layer slightly to prevent edge gaps during translation.
 */
export function ParallaxBackground({
  children,
  speed = 0.1,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const [offsetY, setOffsetY] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;
    const onScroll = () => {
      raf = requestAnimationFrame(() => setOffsetY(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reducedMotion]);

  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={
        reducedMotion
          ? undefined
          : {
              transform: `translateY(${offsetY * speed}px) scale(1.2)`,
              willChange: "transform",
            }
      }
    >
      {children}
    </div>
  );
}

/**
 * Hero foreground content — drifts upward and fades out on scroll.
 */
export function HeroContent({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const [scrollY, setScrollY] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;
    const onScroll = () => {
      raf = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reducedMotion]);

  const opacity = reducedMotion ? 1 : Math.max(0, 1 - scrollY / 700);
  const translateY = reducedMotion ? 0 : -scrollY * 0.15;

  return (
    <div
      className={className}
      style={{
        transform: `translateY(${translateY}px)`,
        opacity,
        willChange: reducedMotion ? undefined : "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}

/**
 * Scroll-triggered reveal with fade-in, slide-up, and subtle parallax offset.
 */
export function ScrollReveal({
  children,
  speed = 0.04,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [offsetY, setOffsetY] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.08 }
    );
    observer.observe(el);

    let raf = 0;
    const onScroll = () => {
      raf = requestAnimationFrame(() => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const viewCenter = window.innerHeight / 2;
        setOffsetY((center - viewCenter) * speed);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [speed, reducedMotion]);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: isVisible
          ? `translateY(${offsetY}px)`
          : `translateY(${offsetY + 60}px)`,
        opacity: isVisible ? 1 : 0,
        transition:
          "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}
