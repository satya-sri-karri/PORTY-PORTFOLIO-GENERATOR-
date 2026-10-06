import React from "react";
import { useVisibleProjects } from "./common/ProjectExplorer";
import { PortfolioRoot, PortfolioNav, ProfileMeta, Portrait, Skills, ProfileActions, ProjectMedia, ProjectLinks, ProjectStory, TechStack, SectionHeading, PortfolioSections } from "./common/PortfolioParts";
import "./common/secondBatch.css";

function EditorialProjects({ data }) {
  const projects = useVisibleProjects(data);
  return data.projects.length > 0 && <section id="pf-work" className="pf-section"><SectionHeading title="The work, in detail." note="Project index" number="01" /><div className="editorial-project-grid pf-project-grid">{projects.map((project, index) => <article key={project._id || index} className={`pf-project editorial-project ${index === 0 ? "editorial-lead-project" : ""}`}>
        <ProjectMedia project={project} index={index} /><div className="pf-project-body"><p className="pf-eyebrow">{project.featured ? "Featured story" : `Project / ${String(index + 1).padStart(2, "0")}`}</p><h3>{project.title || "Untitled project"}</h3>{project.description && <p className="pf-description">{project.description}</p>}<TechStack project={project} /><ProjectStory project={project} /><ProjectLinks project={project} /></div>
      </article>)}</div></section>;
}

export default function EditorialTheme({ data }) {
  return <PortfolioRoot data={data} theme="editorial" colors={{ bg: "#f5f0e8", text: "#25211e", accent: "#a13825" }}>
    <PortfolioNav data={data} brand="E" />
    <main id="pf-main" className="pf-container">
      <section className="pf-hero editorial-hero"><div className="editorial-masthead"><span>Personal edition</span><span>Work / words / perspective</span></div>
        <div className="editorial-cover"><div className="editorial-identity"><p className="pf-eyebrow">The portfolio of</p><h1>{data.name}</h1><ProfileMeta data={data} /><Skills data={data} /></div><div className="editorial-opening"><Portrait data={data} />{data.about && <div className="editorial-note"><p className="pf-eyebrow">An introduction</p><p className="pf-bio">{data.about}</p></div>}<ProfileActions data={data} /></div></div>
      </section>
      <PortfolioSections data={data} projects={<EditorialProjects data={data} />} />
    </main>
  </PortfolioRoot>;
}
