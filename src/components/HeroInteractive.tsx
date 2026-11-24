"use client";

import { useEffect } from "react";

export function HeroInteractive() {
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>(".hero__card-bar i");
    if (bar) {
      requestAnimationFrame(() => {
        bar.style.width = "58%";
      });
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (reducedMotion || isTouch) return;

    const cleanups: Array<() => void> = [];

    // Radial cursor spotlight (--mx, --my) on pills, buttons, and stats card
    const spotlights = document.querySelectorAll<HTMLElement>("[data-spotlight]");
    spotlights.forEach((el) => {
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      };
      el.addEventListener("pointermove", onMove, { passive: true });
      cleanups.push(() => el.removeEventListener("pointermove", onMove));
    });

    // Subtle magnetic pull (up to 6px) on primary CTAs
    const magnetics = document.querySelectorAll<HTMLElement>("[data-magnetic]");
    magnetics.forEach((el) => {
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = ((e.clientX - r.left) / r.width - 0.5) * 12;
        const dy = ((e.clientY - r.top) / r.height - 0.5) * 12;
        el.style.transform = `translate3d(${Math.max(-6, Math.min(6, dx))}px, ${Math.max(-6, Math.min(6, dy))}px, 0)`;
      };
      const onLeave = () => {
        el.style.transform = "";
      };
      el.addEventListener("pointermove", onMove, { passive: true });
      el.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      });
    });

    // Brighten "CHESS" outline near cursor
    const strokeEl = document.querySelector<HTMLElement>(".hero .stroke-type");
    const onGlobalMove = (e: PointerEvent) => {
      if (!strokeEl) return;
      const r = strokeEl.getBoundingClientRect();
      strokeEl.style.setProperty("--cx", `${e.clientX - r.left}px`);
      strokeEl.style.setProperty("--cy", `${e.clientY - r.top}px`);
    };
    window.addEventListener("pointermove", onGlobalMove, { passive: true });
    cleanups.push(() => window.removeEventListener("pointermove", onGlobalMove));

    return () => {
      for (const fn of cleanups) fn();
    };
  }, []);

  return null;
}
