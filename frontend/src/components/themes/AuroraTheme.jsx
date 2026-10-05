import React, { useEffect, useRef, useState } from "react";
import { PortfolioRoot, PortfolioNav, ProfileMeta, Portrait, Skills, ProfileActions, StandardProjects, BackgroundSections, ContactSection } from "./common/PortfolioParts";
import "./common/secondBatch.css";

function useAtmosphere(staticPreview) {
  const region = useRef(null);
  const [enabled, setEnabled] = useState(true);
  const [reduced, setReduced] = useState(true);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    const visibility = () => setVisible(!document.hidden && inView);
    let inView = true;
    update(); visibility(); media.addEventListener("change", update);
    document.addEventListener("visibilitychange", visibility);
    const observer = typeof IntersectionObserver === "function" ? new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; visibility(); }) : null;
    if (region.current) observer?.observe(region.current);
    return () => { media.removeEventListener("change", update); document.removeEventListener("visibilitychange", visibility); observer?.disconnect(); };
  }, []);
  return { region, enabled, setEnabled, controls: !staticPreview && !reduced, active: !staticPreview && !reduced && enabled && visible };
}

export default function AuroraTheme({ data }) {
  const motion = useAtmosphere(data.staticPreview);
  return <PortfolioRoot data={data} theme="aurora" colors={{ bg: "#101525", text: "#edf0fa", accent: "#c1b0f0" }}>
    <PortfolioNav data={data} brand="✧" />
    <main id="pf-main" className="pf-container">
      <section ref={motion.region} className="pf-hero aurora-hero" data-animate={motion.active}>
        <div className="aurora-atmosphere" aria-hidden="true"><div className="aurora-orbit" /><div className="aurora-orbit aurora-orbit-second" /></div>
        <div className="aurora-introduction"><p className="pf-eyebrow">A little light, a little perspective</p><Portrait data={data} /><h1>{data.name}</h1><ProfileMeta data={data} />{data.about && <p className="pf-bio">{data.about}</p>}<Skills data={data} /><ProfileActions data={data} /></div>
        {motion.controls && <button type="button" className="aurora-motion" aria-pressed={motion.enabled} onClick={() => motion.setEnabled(previous => !previous)}>{motion.enabled ? "Pause atmosphere" : "Animate atmosphere"}</button>}
      </section>
      <StandardProjects data={data} /><BackgroundSections data={data} /><ContactSection data={data} />
    </main>
  </PortfolioRoot>;
}
