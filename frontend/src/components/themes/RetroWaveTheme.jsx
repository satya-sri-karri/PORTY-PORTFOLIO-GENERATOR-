import React from "react";
import { PortfolioRoot, PortfolioNav, ProfileMeta, Portrait, Skills, ProfileActions, StandardProjects, BackgroundSections, ContactSection } from "./common/PortfolioParts";
import "./common/thirdBatch.css";

export default function RetroWaveTheme({ data }) {
  return <PortfolioRoot data={data} theme="retro" colors={{ bg: "#140D25", text: "#F8ECFA", accent: "#FF93CF" }}>
    <PortfolioNav data={data} brand="R" />
    <main id="pf-main" className="pf-container"><section className="pf-hero retro-hero">
      <div className="retro-horizon" aria-hidden="true"><div className="retro-sun" /><div className="retro-grid" /></div>
      <div className="retro-introduction"><p className="pf-eyebrow">Personal portfolio / Beyond the horizon</p><Portrait data={data} /><h1>{data.name}</h1><ProfileMeta data={data} />{data.about && <p className="pf-bio">{data.about}</p>}<Skills data={data} /><ProfileActions data={data} /></div>
    </section><StandardProjects data={data} /><BackgroundSections data={data} /><ContactSection data={data} /></main>
  </PortfolioRoot>;
}
