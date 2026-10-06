import { useEffect, useRef, useState } from "react";

// Shared lifecycle and input scheduling only; visuals belong to individual themes.
export default function usePortfolioMotion(data, effect) {
  const root = useRef(null);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [hidden, setHidden] = useState(document.hidden);
  const [visible, setVisible] = useState(true);
  const active = !data.staticPreview && data.motion !== "none" && !paused && !reduced && !hidden;
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    const visibility = () => setHidden(document.hidden);
    media.addEventListener("change", update); document.addEventListener("visibilitychange", visibility);
    return () => { media.removeEventListener("change", update); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  useEffect(() => {
    const el = root.current; if (!el || !window.IntersectionObserver) return;
    const scenes = new Set();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting ? scenes.add(entry.target) : scenes.delete(entry.target));
      setVisible(scenes.size > 0);
    });
    el.querySelectorAll(".pf-hero, .ex-pixel-game").forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [effect.id]);
  useEffect(() => {
    const el = root.current; if (!active || !el || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      entry.target.dataset.effectVisible = String(entry.isIntersecting);
      if (entry.isIntersecting) entry.target.classList.add("pf-effect-entered");
    }), { threshold: .1 });
    el.querySelectorAll([effect.reveal, ".pf-effect-art, .product-device, .terminal-window, .pf-project-media, .ex-desk svg, .ex-slides"].filter(Boolean).join(",")).forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [active, effect.id, effect.reveal, data]);
  useEffect(() => {
    const el = root.current;
    if (!active || !el || data.motion !== "expressive" || !["space-explorer", "scroll-cinema"].includes(effect.id)) return;
    let frame = 0;
    const update = () => { frame = 0; const hero = el.querySelector(".pf-hero"); if (hero) el.style.setProperty("--pf-depth", `${Math.max(-18, Math.min(18, -hero.getBoundingClientRect().top * .025))}px`); };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update(); window.addEventListener("scroll", scroll, { passive: true });
    return () => { window.removeEventListener("scroll", scroll); cancelAnimationFrame(frame); el.style.removeProperty("--pf-depth"); };
  }, [active, data.motion, effect.id]);
  useEffect(() => {
    const el = root.current;
    if (!active || !el || data.motion !== "expressive" || !effect.pointer) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0, target = null, point = null;
    const properties = ["--pf-light-x", "--pf-light-y", "--pf-angle-x", "--pf-angle-y"];
    const reset = () => {
      cancelAnimationFrame(frame); frame = 0;
      if (target) { target.classList.remove("pf-pointer-active"); properties.forEach(key => target.style.removeProperty(key)); }
      target = null;
    };
    const move = event => {
      if (!fine.matches || event.pointerType !== "mouse") return;
      const next = event.target.closest(effect.pointer);
      if (!next || !el.contains(next) || next.closest(".ex-reading")) { reset(); return; }
      if (target !== next) { reset(); target = next; }
      point = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(() => {
        frame = 0; if (!target) return;
        const r = target.getBoundingClientRect();
        const x = Math.min(1, Math.max(0, (point.x - r.left) / r.width)), y = Math.min(1, Math.max(0, (point.y - r.top) / r.height));
        target.classList.add("pf-pointer-active");
        target.style.setProperty("--pf-light-x", `${x * 100}%`); target.style.setProperty("--pf-light-y", `${y * 100}%`);
        target.style.setProperty("--pf-angle-x", `${(0.5 - y) * 6}deg`); target.style.setProperty("--pf-angle-y", `${(x - 0.5) * 6}deg`);
      });
    };
    el.addEventListener("pointermove", move, { passive: true }); el.addEventListener("pointerleave", reset); fine.addEventListener("change", reset);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", reset); fine.removeEventListener("change", reset); reset(); };
  }, [active, data.motion, effect.pointer]);
  return { root, paused, setPaused, reduced, active, ambient: active && visible };
}
