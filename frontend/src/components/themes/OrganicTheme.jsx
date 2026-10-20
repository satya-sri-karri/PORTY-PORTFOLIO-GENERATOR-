import React from "react";
import { PortfolioRoot, PortfolioNav, ProfileMeta, Portrait, Skills, ProfileActions, PortfolioSections } from "./common/PortfolioParts";
import "./common/thirdBatch.css";

export default function OrganicTheme({ data }) {
  return <PortfolioRoot data={data} theme="organic" colors={{ bg: "#F1EEE4", text: "#303D2F", accent: "#526342" }}>
    <PortfolioNav data={data} brand="✳" />
    <main id="pf-main" className="pf-container"><section className="pf-hero organic-hero">
      <div className="organic-introduction"><p className="pf-eyebrow">Personal portfolio / Naturally, me</p><h1>{data.name}</h1><ProfileMeta data={data} />{data.about && <p className="pf-bio">{data.about}</p>}<ProfileActions data={data} /></div>
      <div className="organic-portrait"><Portrait data={data} /></div><div className="organic-skills"><Skills data={data} /></div>
    </section><PortfolioSections data={data} /></main>
  </PortfolioRoot>;
}
