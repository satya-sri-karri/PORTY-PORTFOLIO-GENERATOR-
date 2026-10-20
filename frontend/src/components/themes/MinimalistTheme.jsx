import React from "react";
import { PortfolioRoot, PortfolioNav, Portrait, Skills, ProfileActions, ProjectMedia, ProjectLinks, ProjectStory, TechStack, SectionHeading, PortfolioSections } from "./common/PortfolioParts";
import { orderedProjects } from "../../utils/portfolioContent";
import { MINIMALIST_PALETTES } from "./minimalistOptions";
import "./minimalist.css";

export default function MinimalistTheme({ data }) {
  const settings = data.minimalistSettings || {};
  const character = settings.cover !== "type" && !!data.avatarUrl;
  const projects = orderedProjects(data.projects);
  return <PortfolioRoot data={data} theme="poster" colors={MINIMALIST_PALETTES[0]}>
    <div className="mp-layout" data-font={settings.font || "condensed"}>
    <PortfolioNav data={data} brand="↗" />
    <main id="pf-main" className="pf-container">
      <section className={`pf-hero mp-cover ${character ? "mp-character" : "mp-type"}`}>
        <div className="mp-cover-top"><span>{data.title || "Selected work"}</span><span>Personal portfolio</span></div>
        <div className="mp-stage"><div className="mp-word" aria-hidden="true">PORTFOLIO</div>{character && <div className="mp-avatar"><Portrait data={data} /></div>}</div>
        <div className="mp-cover-bottom"><div><p className="pf-eyebrow">Hello, I’m</p><h1>{data.name || "Your name"}</h1>{data.location && <p>{data.location}</p>}</div><ProfileActions data={data} /></div>
      </section>
      {(data.about || data.skills.length > 0 || data.availability || data.motto || data.interests.length > 0) && <section className="mp-intro pf-section" aria-label="Introduction"><div><p className="pf-eyebrow">A little introduction</p><h2>Ideas. Intent.<br />A personal perspective.</h2></div><div>{data.about && <p className="pf-bio">{data.about}</p>}{data.availability && <p>{data.availability}</p>}{data.motto && <p>{data.motto}</p>}{data.interests.length > 0 && <p>{data.interests.join(" · ")}</p>}<Skills data={data} /></div></section>}
      <PortfolioSections data={data} projects={projects.length > 0 && <section id="pf-work" className="pf-section mp-work"><SectionHeading title="Selected work" note="A collection of things I’ve made" number="01" /><div className="mp-projects">{projects.map((project, i) => <article id={`pf-project-${i + 1}`} tabIndex={-1} className="pf-project mp-project" key={project._id || i}>
        <ProjectMedia project={project} index={i} /><div className="pf-project-body"><p className="pf-eyebrow">{project.featured ? "Featured project" : `Project ${String(i + 1).padStart(2, "0")}`}</p><h3>{project.title || "Untitled project"}</h3>{project.description && <p className="pf-description">{project.description}</p>}<TechStack project={project} /><ProjectStory project={project} /><ProjectLinks project={project} /></div>
      </article>)}</div></section>} />
    </main></div>
  </PortfolioRoot>;
}
