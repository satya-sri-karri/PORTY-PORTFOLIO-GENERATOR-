import React from "react";
import { useVisibleProjects } from "./common/ProjectExplorer";
import { PortfolioRoot, PortfolioNav, ProfileMeta, Portrait, Skills, ProfileActions, ProjectMedia, ProjectLinks, ProjectStory, TechStack, SectionHeading, PortfolioSections } from "./common/PortfolioParts";
import "./common/firstBatch.css";

function ScrapbookProjects({ data }) {
  const projects = useVisibleProjects(data);
  return data.projects.length > 0 && <section id="pf-work" className="pf-section"><SectionHeading title="The things I’ve made" note="Collected work" number="01" />
        <div className={`pf-project-grid scrapbook-project-grid ${projects.length === 1 ? "scrapbook-solo" : ""}`}>{projects.map((project, i) => <article className="pf-project scrapbook-project" key={project._id || i}>
          <div className="scrapbook-photo"><ProjectMedia project={project} index={i} /><p className="scrapbook-caption">{project.featured ? "Featured project" : `No. ${String(i + 1).padStart(2, "0")}`}</p></div>
          <div className="pf-project-body"><h3>{project.title || "Untitled project"}</h3>{project.description && <p className="pf-description">{project.description}</p>}<TechStack project={project} /><ProjectStory project={project} /><ProjectLinks project={project} /></div>
        </article>)}</div>
      </section>;
}

export default function ScrapbookTheme({ data }) {
  return <PortfolioRoot data={data} theme="scrapbook" colors={{ bg: "#eee7da", text: "#302b27", accent: "#7a3d2c" }}>
    <PortfolioNav data={data} brand="✎" />
    <main id="pf-main" className="pf-container">
      <section className="pf-hero scrapbook-hero">
        <div className="scrapbook-note"><p className="pf-eyebrow">A few pages from my story</p><h1>{data.name}</h1><ProfileMeta data={data} />{data.about && <p className="pf-bio">{data.about}</p>}<Skills data={data} /><ProfileActions data={data} /></div>
        <div className="scrapbook-portrait"><Portrait data={data} /><span className="scrapbook-stamp" aria-hidden="true">made<br />with care</span></div>
      </section>
      <PortfolioSections data={data} projects={<ScrapbookProjects data={data} />} />
    </main>
  </PortfolioRoot>;
}
