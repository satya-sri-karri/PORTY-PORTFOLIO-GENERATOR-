import React, { useEffect, useState } from "react";
import { orderedProjects, profileLinks, projectStory, readableOn } from "../../../utils/portfolioContent";
import "./portfolio.css";

export function PortfolioRoot({ data, theme, colors, children }) {
  const palette = Object.fromEntries(Object.entries(colors).map(([key, fallback]) => [key, data.themeColors[key] || fallback]));
  return <div className={`portfolio-v4 pf-${theme} ${data.staticPreview ? "pf-static" : ""}`} style={{ "--pf-bg": palette.bg, "--pf-text": palette.text, "--pf-accent": palette.accent, "--pf-on-accent": readableOn(palette.accent) }}>
    <a className="pf-skip" href="#pf-main">Skip to content</a>{children}
  </div>;
}
export function PortfolioNav({ data, brand }) {
  const sections = [["Projects", data.projects.length, "work"], ["Experience", data.experience.length, "experience"], ["Credentials", data.certifications.length || data.achievements.length, "credentials"], ["Profiles", data.codingProfiles.length, "profiles"], ["Contact", profileLinks(data).length, "contact"]].filter(([, show]) => show).sort((a, b) => (data.sectionOrder || []).indexOf(a[2] === "work" ? "projects" : a[2]) - (data.sectionOrder || []).indexOf(b[2] === "work" ? "projects" : b[2]));
  return <header className="pf-nav"><a className="pf-brand" href="#pf-main"><span className="pf-brand-mark" aria-hidden="true">{brand || "↗"}</span><span>{data.name || "Portfolio"}</span></a><nav aria-label="Portfolio sections">{sections.map(([label, , id]) => <a key={id} href={`#pf-${id}`}>{label}</a>)}</nav></header>;
}
export function ProfileMeta({ data }) {
  if (!data.title && !data.location && !data.availability && !data.motto && !data.interests?.length) return null;
  return <div className="pf-profile-meta">{data.title && <p className="pf-role">{data.title}</p>}{data.location && <p className="pf-location">{data.location}</p>}{data.availability && <p className="pf-location">{data.availability}</p>}{data.motto && <p className="pf-motto">{data.motto}</p>}{data.interests?.length > 0 && <p className="pf-location">Interests: {data.interests.join(" · ")}</p>}</div>;
}
export function Portrait({ data, className = "" }) {
  const [failed, setFailed] = useState(false); useEffect(() => setFailed(false), [data.avatarUrl]);
  return data.avatarUrl && !failed ? <img className={`pf-portrait ${className}`} src={data.avatarUrl} alt={`Portrait of ${data.name}`} decoding="async" onError={() => setFailed(true)} /> : null;
}
export function Skills({ data }) {
  return data.skills.length ? <div className="pf-skills" aria-label="Skills">{data.skills.map((skill, i) => <span key={i}>{skill}</span>)}</div> : null;
}
export function ProfileActions({ data }) {
  return <div className="pf-actions">{data.projects.length > 0 && <a className="pf-button" href="#pf-work">Explore my work <span aria-hidden="true">↗</span></a>}{profileLinks(data).length > 0 && <a className="pf-text-link" href="#pf-contact">Get in touch <span aria-hidden="true">↗</span></a>}</div>;
}
export function ProjectMedia({ project, index = 0, className = "" }) {
  const [failed, setFailed] = useState(false); useEffect(() => setFailed(false), [project.image]);
  return <div className={`pf-project-media ${className}`}>
    {project.image && !failed ? <img src={project.image} alt={`Screenshot of ${project.title || "this project"}`} loading="lazy" decoding="async" onError={() => setFailed(true)} /> : <div className="pf-project-cover" role="img" aria-label={`Typographic cover for ${project.title || "this project"}`}>
      <span className="pf-cover-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span className="pf-cover-glyph" aria-hidden="true">{(project.title || "P").slice(0, 1).toUpperCase()}</span><span className="pf-cover-note">{project.image && failed ? "Screenshot unavailable" : "Typographic project cover"}</span>
    </div>}
  </div>;
}
export function ProjectLinks({ project }) {
  return <div className="pf-project-links">{project.link && <a href={project.link} target="_blank" rel="noopener noreferrer">View project <span aria-hidden="true">↗</span></a>}{project.github && <a href={project.github} target="_blank" rel="noopener noreferrer">Source code <span aria-hidden="true">↗</span></a>}</div>;
}
export function TechStack({ project }) {
  return project.techStack.length ? <ul className="pf-tech" aria-label="Project technologies">{project.techStack.map((tech, i) => <li key={i}>{tech}</li>)}</ul> : null;
}
export function ProjectStory({ project, open = false }) {
  const story = projectStory(project);
  return story.length ? <details className="pf-story" open={open || undefined}><summary>Project story</summary><dl>{story.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></details> : null;
}
export function SectionHeading({ title, note, number }) {
  return <div className="pf-section-heading"><p className="pf-eyebrow">{number && <span>{number} / </span>}{note || "Portfolio"}</p><h2>{title}</h2></div>;
}
export function StandardProjects({ data, storyOpen = false }) {
  const projects = orderedProjects(data.projects);
  if (!projects.length) return null;
  return <section id="pf-work" className="pf-section"><SectionHeading title="Projects" note="Ideas put into practice" number="01" />
    <div className={`pf-project-grid ${projects.length === 1 ? "pf-solo-project" : ""}`}>{projects.map((project, i) => <article className={`pf-project ${i === 0 ? "pf-featured-project" : ""}`} key={project._id || i}>
      <ProjectMedia project={project} index={i} /><div className="pf-project-body"><p className="pf-eyebrow">{project.featured ? "Featured project" : `Project ${String(i + 1).padStart(2, "0")}`}</p><h3>{project.title || "Untitled project"}</h3>{project.description && <p className="pf-description">{project.description}</p>}<TechStack project={project} /><ProjectStory project={project} open={storyOpen && i === 0} /><ProjectLinks project={project} /></div>
    </article>)}</div>
  </section>;
}
export function BackgroundSections({ data }) {
  return <>
    {data.experience.length > 0 && <section id="pf-experience" className="pf-section"><SectionHeading title="Experience" note="The journey so far" number="02" /><div className="pf-timeline">{data.experience.map((item, i) => <article key={item._id || i} className="pf-timeline-row"><div className="pf-date">{item.duration}{item.current && <span>Current role</span>}</div><div><h3>{item.role || item.company}</h3>{item.role && item.company && <p className="pf-company">{item.company}</p>}{item.description && <p className="pf-description">{item.description}</p>}</div></article>)}</div></section>}
    {(data.certifications.length > 0 || data.achievements.length > 0) && <section id="pf-credentials" className="pf-section"><SectionHeading title="Credentials & recognition" note="Learning and milestones" number="03" /><div className="pf-credential-grid">
      {data.certifications.map((item, i) => <article className="pf-credential" key={`cert-${item._id || i}`}><p className="pf-eyebrow">Certification{item.date && ` / ${item.date}`}</p><h3>{item.title || item.issuer}</h3>{item.title && item.issuer && <p>{item.issuer}</p>}{item.credentialUrl && <a className="pf-text-link" href={item.credentialUrl} target="_blank" rel="noopener noreferrer">View credential ↗</a>}</article>)}
      {data.achievements.map((item, i) => <article className="pf-credential" key={`award-${item._id || i}`}><p className="pf-eyebrow">Achievement{item.date && ` / ${item.date}`}</p><h3>{item.title || "Achievement"}</h3>{item.description && <p className="pf-description">{item.description}</p>}</article>)}
    </div></section>}
    {data.codingProfiles.length > 0 && <section id="pf-profiles" className="pf-section"><SectionHeading title="Coding profiles" note="More of my work" number="04" /><div className="pf-credential-grid">{data.codingProfiles.map((profile, i) => <article className="pf-credential" key={profile._id || i}><h3>{profile.platform || "Coding profile"}</h3>{profile.username && <p className="pf-mono">{profile.username}</p>}<p>{[profile.rating && `Rating: ${profile.rating}`, profile.solved && `Problems solved: ${profile.solved}`].filter(Boolean).join(" · ")}</p>{profile.url && <a className="pf-text-link" href={profile.url} target="_blank" rel="noopener noreferrer">Visit profile ↗</a>}</article>)}</div></section>}
  </>;
}
export function ContactSection({ data, footer = true }) {
  const links = profileLinks(data);
  return <>{links.length > 0 && <section id="pf-contact" className="pf-section pf-contact"><p className="pf-eyebrow">Keep in touch</p><h2>Let’s connect.</h2><div className="pf-contact-links">{links.map(link => <a key={link.label} href={link.href} target={/^https?:/.test(link.href) ? "_blank" : undefined} rel={/^https?:/.test(link.href) ? "noopener noreferrer" : undefined}><span>{link.label}</span><span>{link.label === "Email" ? data.contact.email : link.label === "Phone" ? data.contact.phone : "↗"}</span></a>)}</div></section>}
    {footer && <PortfolioFooter data={data} />}</>;
}

export function PortfolioFooter({ data }) {
  return <footer className="pf-footer"><span>{data.name}</span><a href="#pf-main">Back to top ↑</a></footer>;
}
export function PortfolioSections({ data, projects }) {
  const order = data.sectionOrder || ["projects", "experience", "credentials", "profiles", "contact"];
  return <>{order.map(key => {
    if (key === "projects") return <React.Fragment key={key}>{projects || <StandardProjects data={data} />}</React.Fragment>;
    if (key === "contact") return <ContactSection key={key} data={data} footer={false} />;
    return <BackgroundSections key={key} data={{ ...data, experience: key === "experience" ? data.experience : [], certifications: key === "credentials" ? data.certifications : [], achievements: key === "credentials" ? data.achievements : [], codingProfiles: key === "profiles" ? data.codingProfiles : [] }} />;
  })}<PortfolioFooter data={data} /></>;
}
