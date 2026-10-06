import { useEffect, useRef, useState } from "react";

export default function usePortfolioMotion(data) {
  const root = useRef(null);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [hidden, setHidden] = useState(document.hidden);
  const [heroVisible, setHeroVisible] = useState(true);
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
    const visible = new Set();
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)); setHeroVisible(visible.size > 0); });
    el.querySelectorAll(".pf-hero, .ex-pixel-game").forEach(scene => observer.observe(scene));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const el = root.current; if (!active || !el || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("pf-studio-entered"); observer.unobserve(entry.target);
    }), { threshold: .08 });
    el.querySelectorAll(".pf-section-heading, .pf-project, .pf-timeline-row, .pf-credential, .ex-scene").forEach((node, i) => {
      node.style.setProperty("--pf-enter-delay", `${(i % 3) * 65}ms`); observer.observe(node);
    });
    return () => observer.disconnect();
  }, [active, data.projects.length, data.experience.length, data.certifications.length, data.achievements.length]);
  useEffect(() => {
    const el = root.current; if (!active || !el) return;
    let frame = 0;
    const update = () => { frame = 0; const rect = el.getBoundingClientRect(); const travel = Math.max(1, el.scrollHeight - window.innerHeight); el.style.setProperty("--pf-progress", Math.min(1, Math.max(0, -rect.top / travel))); const hero = el.querySelector(".pf-hero"); if (hero && data.motion === "expressive") { const box=hero.getBoundingClientRect(); el.style.setProperty("--pf-depth", `${Math.max(-30, Math.min(30, -box.top * .045))}px`); } };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update(); window.addEventListener("scroll", scroll, { passive: true }); window.addEventListener("resize", scroll);
    return () => { window.removeEventListener("scroll", scroll); window.removeEventListener("resize", scroll); cancelAnimationFrame(frame); el.style.removeProperty("--pf-depth"); };
  }, [active, data.motion]);
  useEffect(() => {
    const el = root.current; if (!active || !el || data.motion !== "expressive" || data.layoutSettings.hover === "lift") return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)"); let frame = 0, target = null, point = null;
    const reset = () => { cancelAnimationFrame(frame); frame=0; if(target) { target.classList.remove("pf-tilting"); ["--pf-tilt-x","--pf-tilt-y","--pf-light-x","--pf-light-y"].forEach(k => target.style.removeProperty(k)); } target=null; };
    const move = event => {
      if (!fine.matches || event.pointerType !== "mouse") return;
      const next = event.target.closest(".pf-project-media, .ex-scene svg");
      if (!next || !el.contains(next)) { reset(); return; }
      if (target !== next) { reset(); target=next; }
      point={x:event.clientX,y:event.clientY};
      if (!frame) frame=requestAnimationFrame(() => { frame=0; if(!target) return; const r=target.getBoundingClientRect(); const x=Math.min(1,Math.max(0,(point.x-r.left)/r.width)), y=Math.min(1,Math.max(0,(point.y-r.top)/r.height)); target.classList.add("pf-tilting"); target.style.setProperty("--pf-tilt-x",`${(0.5-y)*7}deg`);target.style.setProperty("--pf-tilt-y",`${(x-0.5)*7}deg`);target.style.setProperty("--pf-light-x",`${x*100}%`);target.style.setProperty("--pf-light-y",`${y*100}%`); });
    };
    el.addEventListener("pointermove", move, {passive:true}); el.addEventListener("pointerleave",reset);
    return () => { el.removeEventListener("pointermove",move);el.removeEventListener("pointerleave",reset);reset(); };
  }, [active, data.motion, data.layoutSettings.hover]);
  return { root, paused, setPaused, reduced, active, ambient: active && heroVisible };
}
