import React from "react";
import { PortfolioRoot, PortfolioNav, ProfileMeta, Portrait, Skills, ProfileActions, StandardProjects, BackgroundSections, ContactSection } from "./common/PortfolioParts";
import "./common/firstBatch.css";

// Keep the saved identifier `minimalist`; this is its Swiss Design upgrade.
export default function MinimalistTheme({ data }) {
  return <PortfolioRoot data={data} theme="swiss" colors={{ bg: "#f7f6f2", text: "#20211f", accent: "#b33b28" }}>
    <PortfolioNav data={data} brand="●" />
    <main id="pf-main" className="pf-container">
      <section className="pf-hero swiss-hero"><div className="swiss-hero-heading"><p className="pf-eyebrow">A personal portfolio</p><h1>{data.name}</h1></div>
        <div className={`swiss-intro ${data.avatarUrl ? "swiss-with-portrait" : ""}`}><ProfileMeta data={data} /><div>{data.about && <p className="pf-bio">{data.about}</p>}<Skills data={data} /><ProfileActions data={data} /></div><Portrait data={data} /></div>
        <div className="swiss-ruler" aria-hidden="true"><span>FORM / FUNCTION</span><span>↓</span></div>
      </section>
      <StandardProjects data={data} /><BackgroundSections data={data} /><ContactSection data={data} />
    </main>
  </PortfolioRoot>;
}
