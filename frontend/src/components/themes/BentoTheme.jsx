import React, { useState } from "react";
import { useVisibleProjects, useProjectExplorer } from "./common/ProjectExplorer";
import { PortfolioRoot, PortfolioNav, ProfileMeta, Portrait, Skills, ProfileActions, ProjectMedia, ProjectLinks, ProjectStory, TechStack, SectionHeading, PortfolioSections } from "./common/PortfolioParts";
import "./common/thirdBatch.css";

function BentoProjects({ data }) {
  const [expanded, setExpanded] = useState(false);
  const projects = useVisibleProjects(data);
  const explorer = useProjectExplorer();
  if (!data.projects.length) return null;
  const displayed = expanded || explorer?.view === "index" || explorer?.query || explorer?.technology ? projects : projects.slice(0, 4);
  return <section id="pf-work" className="pf-section"><div className="bento-work-heading"><SectionHeading title="Projects" note="Built one idea at a time" number="01" />
    {projects.length > 4 && !explorer?.query && !explorer?.technology && explorer?.view !== "index" && <button type="button" className="bento-expand" aria-expanded={expanded} aria-controls="bento-projects" onClick={() => setExpanded(previous => !previous)}>{expanded ? "Show first 4 projects" : `View all ${projects.length} projects`}</button>}
  </div><div id="bento-projects" className={`pf-project-grid bento-projects ${projects.length === 1 ? "pf-solo-project" : ""}`}>{displayed.map((project, index) => <article className={`pf-project ${index === 0 ? "pf-featured-project" : ""}`} key={project._id || index}>
    <ProjectMedia project={project} index={index} /><div className="pf-project-body"><p className="pf-eyebrow">{project.featured ? "Featured project" : `Project ${String(index + 1).padStart(2, "0")}`}</p><h3>{project.title || "Untitled project"}</h3>{project.description && <p className="pf-description">{project.description}</p>}<TechStack project={project} /><ProjectStory project={project} /><ProjectLinks project={project} /></div>
  </article>)}</div></section>;
}

export default function BentoTheme({ data }) {
  return <PortfolioRoot data={data} theme="bento" colors={{ bg: "#F0F2F5", text: "#202D3B", accent: "#315DD2" }}>
    <PortfolioNav data={data} brand="▦" />
    <main id="pf-main" className="pf-container"><section className="pf-hero bento-hero">
      <div className="bento-identity bento-tile"><p className="pf-eyebrow">Personal portfolio / A few things about me</p><h1>{data.name}</h1><ProfileMeta data={data} /><ProfileActions data={data} /></div>
      <div className="bento-portrait bento-tile"><Portrait data={data} /></div>
      {data.about && <div className="bento-about bento-tile"><p className="pf-eyebrow">The introduction</p><p className="pf-bio">{data.about}</p></div>}
      {data.skills.length > 0 && <div className="bento-skills bento-tile"><p className="pf-eyebrow">Skills & tools</p><Skills data={data} /></div>}
    </section><PortfolioSections data={data} projects={<BentoProjects data={data} />} /></main>
  </PortfolioRoot>;
}
