import React, { useState } from "react";
import { PortfolioRoot, PortfolioNav, ProfileMeta, Portrait, Skills, ProfileActions, StandardProjects, BackgroundSections, ContactSection } from "./common/PortfolioParts";
import "./common/thirdBatch.css";

export default function KineticTheme({ data }) {
  const [indexView, setIndexView] = useState(false);
  return <PortfolioRoot data={data} theme="kinetic" colors={{ bg: "#F3EDE3", text: "#24221E", accent: "#AD3820" }}>
    <PortfolioNav data={data} brand="↗" />
    <main id="pf-main" className={`pf-container ${indexView ? "kinetic-index" : ""}`}>
      <section className="pf-hero kinetic-hero"><div className="kinetic-title"><p className="pf-eyebrow">Personal portfolio / Signature studio</p><h1>{data.name}</h1><div className="kinetic-rule" aria-hidden="true"><span>↗</span></div></div>
        <div className="kinetic-introduction"><div><ProfileMeta data={data} />{data.about && <p className="pf-bio">{data.about}</p>}<Skills data={data} /><ProfileActions data={data} /></div><div className="kinetic-portrait"><Portrait data={data} /></div></div>
      </section>
      {data.projects.length > 0 && <div className="kinetic-view-controls" role="group" aria-label="Project presentation"><span className="pf-eyebrow">Find your perspective</span><button type="button" aria-pressed={!indexView} onClick={() => setIndexView(false)}>Gallery view</button><button type="button" aria-pressed={indexView} onClick={() => setIndexView(true)}>Index view</button></div>}
      <StandardProjects data={data} /><BackgroundSections data={data} /><ContactSection data={data} />
    </main>
  </PortfolioRoot>;
}
