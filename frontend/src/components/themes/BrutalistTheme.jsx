import React from "react";
import { PortfolioRoot, PortfolioNav, ProfileMeta, Portrait, Skills, ProfileActions, PortfolioSections } from "./common/PortfolioParts";
import "./common/secondBatch.css";

export default function BrutalistTheme({ data }) {
  return <PortfolioRoot data={data} theme="brutalist" colors={{ bg: "#f5f5f0", text: "#191916", accent: "#c53924" }}>
    <PortfolioNav data={data} brand="B" />
    <main id="pf-main" className="pf-container">
      <section className="pf-hero brutalist-hero"><div className="brutalist-heading"><p className="pf-eyebrow">Personal portfolio / Make an impression</p><h1>{data.name}</h1><span className="brutalist-arrow" aria-hidden="true">↙</span></div>
        <div className={`brutalist-intro ${data.avatarUrl ? "brutalist-with-portrait" : ""}`}><div className="brutalist-facts"><ProfileMeta data={data} /><Skills data={data} /></div><div className="brutalist-note">{data.about && <p className="pf-bio">{data.about}</p>}<ProfileActions data={data} /></div><Portrait data={data} /></div>
      </section>
      <PortfolioSections data={data} />
    </main>
  </PortfolioRoot>;
}
