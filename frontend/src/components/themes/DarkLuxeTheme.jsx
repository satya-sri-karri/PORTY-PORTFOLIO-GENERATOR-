import React from "react";
import { PortfolioRoot, PortfolioNav, ProfileMeta, Portrait, Skills, ProfileActions, PortfolioSections } from "./common/PortfolioParts";
import "./common/firstBatch.css";

export default function DarkLuxeTheme({ data }) {
  return <PortfolioRoot data={data} theme="luxe" colors={{ bg: "#141612", text: "#f4efdf", accent: "#dbc39a" }}>
    <PortfolioNav data={data} brand="✳" />
    <main id="pf-main" className="pf-container">
      <section className={`pf-hero luxe-hero ${data.avatarUrl ? "luxe-with-portrait" : ""}`}>
        <div><p className="pf-eyebrow">The personal collection of</p><h1>{data.name}</h1><ProfileMeta data={data} />{data.about && <p className="pf-bio">{data.about}</p>}<Skills data={data} /><ProfileActions data={data} /></div>
        <Portrait data={data} className="luxe-portrait" />
        <div className="luxe-hero-decoration" aria-hidden="true">✳</div>
      </section>
      <PortfolioSections data={data} />
    </main>
  </PortfolioRoot>;
}
