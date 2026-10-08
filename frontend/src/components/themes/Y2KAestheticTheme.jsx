import React from "react";
import { PortfolioRoot, PortfolioNav, ProfileMeta, Portrait, Skills, ProfileActions, PortfolioSections } from "./common/PortfolioParts";
import "./common/firstBatch.css";

export default function Y2KAestheticTheme({ data }) {
  return <PortfolioRoot data={data} theme="y2k" colors={{ bg: "#e9edf8", text: "#22283e", accent: "#464396" }}>
    <PortfolioNav data={data} brand="✦" />
    <main id="pf-main" className="pf-container">
      <section className="pf-hero y2k-hero"><div className="y2k-window"><div className="y2k-window-bar"><span>personal_homepage</span><span aria-hidden="true">− □ ×</span></div>
        <div className="y2k-hero-content"><p className="pf-eyebrow">Welcome to my corner of the internet</p><h1>{data.name}</h1><div className={`y2k-intro ${data.avatarUrl ? "y2k-with-portrait" : ""}`}><div><ProfileMeta data={data} />{data.about && <p className="pf-bio">{data.about}</p>}<Skills data={data} /><ProfileActions data={data} /></div><Portrait data={data} /></div></div>
        <span className="y2k-star y2k-star-one" aria-hidden="true">✦</span><span className="y2k-star y2k-star-two" aria-hidden="true">✧</span>
      </div></section>
      <PortfolioSections data={data} />
    </main>
  </PortfolioRoot>;
}
