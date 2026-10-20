import React from "react";
import { PortfolioRoot, PortfolioNav, ProfileMeta, Portrait, Skills, ProfileActions, PortfolioSections } from "./common/PortfolioParts";
import "./common/thirdBatch.css";

export default function ExecutiveTheme({ data }) {
  return <PortfolioRoot data={data} theme="executive" colors={{ bg: "#F5F3EE", text: "#192D3E", accent: "#795A28" }}>
    <PortfolioNav data={data} brand="E" />
    <main id="pf-main" className="pf-container"><section className="pf-hero executive-hero">
      <div className="executive-identity"><p className="pf-eyebrow">Professional profile</p><h1>{data.name}</h1><ProfileMeta data={data} /><ProfileActions data={data} /></div>
      <div className="executive-overview"><Portrait data={data} />{data.about && <div className="executive-summary"><p className="pf-eyebrow">In my own words</p><p className="pf-bio">{data.about}</p></div>}<Skills data={data} /></div>
    </section><PortfolioSections data={data} /></main>
  </PortfolioRoot>;
}
