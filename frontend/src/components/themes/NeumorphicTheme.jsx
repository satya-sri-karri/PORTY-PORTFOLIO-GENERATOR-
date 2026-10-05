import React from "react";
import { PortfolioRoot, PortfolioNav, ProfileMeta, Portrait, Skills, ProfileActions, StandardProjects, BackgroundSections, ContactSection } from "./common/PortfolioParts";
import "./common/secondBatch.css";

export default function NeumorphicTheme({ data }) {
  return <PortfolioRoot data={data} theme="neumorphic" colors={{ bg: "#e8eced", text: "#263339", accent: "#4659a8" }}>
    <PortfolioNav data={data} brand="N" />
    <main id="pf-main" className="pf-container">
      <section className="pf-hero neumorphic-hero"><div className="neumorphic-profile"><div className="neumorphic-avatar"><Portrait data={data} /></div><p className="pf-eyebrow">A personal space for my work</p><h1>{data.name}</h1><ProfileMeta data={data} /></div><div className="neumorphic-introduction">{data.about && <p className="pf-bio">{data.about}</p>}<Skills data={data} /><ProfileActions data={data} /></div></section>
      <StandardProjects data={data} /><BackgroundSections data={data} /><ContactSection data={data} />
    </main>
  </PortfolioRoot>;
}
