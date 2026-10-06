import React from "react";
import { orderedProjects } from "../../utils/portfolioContent";
import { PortfolioRoot, PortfolioNav, ProfileMeta, Portrait, Skills, ProfileActions, ProjectMedia, ProjectLinks, ProjectStory, TechStack, SectionHeading, PortfolioSections } from "./common/PortfolioParts";
import "./common/firstBatch.css";

export default function ProductShowcaseTheme({ data }) {
  const projects = orderedProjects(data.projects);
  return <PortfolioRoot data={data} theme="product" colors={{ bg: "#f4f5f0", text: "#202a27", accent: "#315e46" }}>
    <PortfolioNav data={data} brand="↗" />
    <main id="pf-main" className="pf-container">
      <section className="pf-hero product-hero"><p className="pf-eyebrow">A portfolio of ideas & execution</p><div className="product-identity"><h1>{data.name}</h1><Portrait data={data} /></div><div className="product-intro"><ProfileMeta data={data} /><div>{data.about && <p className="pf-bio">{data.about}</p>}<Skills data={data} /><ProfileActions data={data} /></div></div></section>
      <PortfolioSections data={data} projects={projects.length > 0 && <section id="pf-work" className="pf-section"><SectionHeading title="From idea to something real." note={projects.length === 1 ? "A closer look at my project" : "Project case studies"} number="01" />
        <div className="product-studies pf-project-grid">{projects.map((project, i) => <article key={project._id || i} className={`pf-project product-study ${i === 0 ? "product-study-featured" : ""}`}>
          <div className="product-display"><div className="product-device"><div className="product-device-bar" aria-hidden="true"><i /><i /><i /></div><ProjectMedia project={project} index={i} /></div></div>
          <div className="pf-project-body"><p className="pf-eyebrow">{project.featured ? "Featured case study" : `Case study ${String(i + 1).padStart(2, "0")}`}</p><h3>{project.title || "Untitled project"}</h3>{project.description && <p className="pf-description">{project.description}</p>}<TechStack project={project} /><ProjectStory project={project} open={i === 0} /><ProjectLinks project={project} /></div>
        </article>)}</div>
      </section>} />
    </main>
  </PortfolioRoot>;
}
