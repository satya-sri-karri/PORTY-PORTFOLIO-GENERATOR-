import React, { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import { orderedProjects, projectStory } from "../../../utils/portfolioContent";

const Explorer = createContext(null);
export const useProjectExplorer = () => useContext(Explorer);
export function useVisibleProjects(data) {
  const explorer = useProjectExplorer();
  return orderedProjects(data.projects).filter(project => !explorer || explorer.matches(project));
}
export function ProjectExplorerProvider({ data, children }) {
  const [query, setQuery] = useState("");
  const [technology, setTechnology] = useState("");
  const [view, setView] = useState("theme");
  const [selected, setSelected] = useState(null);
  const opener = useRef(null);
  const projects = orderedProjects(data.projects);
  useEffect(() => { setSelected(null); setQuery(""); setTechnology(""); setView("theme"); }, [data.projects]);
  const matches = project => (!technology || project.techStack.some(item => item.toLowerCase() === technology.toLowerCase())) && [project.title, project.description, ...project.techStack].join(" ").toLowerCase().includes(query.trim().toLowerCase());
  const open = (project, element) => { opener.current = element || document.activeElement; setSelected(project); };
  const reveal = (project, root) => {
    setQuery(""); setTechnology(""); setView("index");
    requestAnimationFrame(() => root?.querySelectorAll('#pf-work .pf-project')[projects.indexOf(project)]?.scrollIntoView({block:"center",behavior:"auto"}));
  };
  const close = () => { setSelected(null); requestAnimationFrame(() => { if (opener.current?.isConnected) opener.current.focus({ preventScroll: true }); }); };
  return <Explorer.Provider value={{ projects, query, setQuery, technology, setTechnology, view, setView, matches, open, reveal, close, staticPreview: data.staticPreview }}>
    <div className={`pf-explorer-shell pf-browse-${view} ${projects.filter(matches).length <= 1 ? "pf-single-match" : ""}`}>{children}</div>
    {selected && <ProjectDetail project={selected} projects={projects} onChange={setSelected} onClose={close} />}
  </Explorer.Provider>;
}
export function ProjectCollectionControls() {
  const explorer = useProjectExplorer();
  const id = useId();
  if (!explorer || explorer.staticPreview || explorer.projects.length < 2) return null;
  const technologies = [...new Map(explorer.projects.flatMap(p => p.techStack).map(t => [t.toLowerCase(), t])).values()].sort((a,b) => a.localeCompare(b));
  const count = explorer.projects.filter(explorer.matches).length;
  return <div className="pf-collection-tools" aria-label="Explore project collection">
    <div className="pf-collection-fields"><div><label htmlFor={`${id}-search`}>Find a project</label><input id={`${id}-search`} type="search" value={explorer.query} onChange={e => explorer.setQuery(e.target.value)} placeholder="Search work or technologies" /></div>
      {technologies.length > 1 && <div><label htmlFor={`${id}-tech`}>Technology</label><select id={`${id}-tech`} value={explorer.technology} onChange={e => explorer.setTechnology(e.target.value)}><option value="">All technologies</option>{technologies.map(t => <option key={t} value={t}>{t}</option>)}</select></div>}
    </div>
    <div className="pf-collection-bottom"><p role="status">{count} of {explorer.projects.length} projects{count === 0 ? " · Try another search." : ""}</p><div role="group" aria-label="Collection view">{[["theme","Theme gallery"],["index","Reading index"]].map(([value,label]) => <button key={value} type="button" aria-pressed={explorer.view === value} onClick={() => explorer.setView(value)}>{label}</button>)}</div>{(explorer.query || explorer.technology) && <button type="button" onClick={() => { explorer.setQuery(""); explorer.setTechnology(""); }}>Clear filters</button>}</div>
  </div>;
}
export function ProjectExploreButton({ project }) {
  const explorer = useProjectExplorer();
  return explorer && !explorer.staticPreview ? <button type="button" className="pf-explore-project" onClick={e => explorer.open(project, e.currentTarget)} aria-label={`Explore ${project.title || "this project"}`}>Explore project <span aria-hidden="true">↗</span></button> : null;
}
function ProjectDetail({ project, projects, onChange, onClose }) {
  const dialog = useRef(null);
  const content = useRef(null);
  const titleId = useId();
  const [failed, setFailed] = useState(false);
  const index = Math.max(0, projects.indexOf(project));
  useEffect(() => {
    const node = dialog.current;
    node.showModal();
    const scroll = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = scroll; node.close(); };
  }, []);
  useEffect(() => { setFailed(false); content.current?.scrollTo(0,0); dialog.current?.querySelector('h2')?.focus({preventScroll:true}); }, [project]);
  const story = projectStory(project);
  const containFocus = event => {
    if (event.key !== "Tab") return;
    const controls = [...dialog.current.querySelectorAll('button:not(:disabled),a[href]')].filter(node => node.getClientRects().length);
    const first = controls[0], last = controls[controls.length-1];
    if (!controls.includes(document.activeElement) || (!event.shiftKey && document.activeElement === last) || (event.shiftKey && document.activeElement === first)) {
      event.preventDefault(); (event.shiftKey ? last : first)?.focus();
    }
  };
  return <dialog ref={dialog} className="pf-project-dialog" aria-labelledby={titleId} onKeyDown={containFocus} onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === e.currentTarget) { const r=e.currentTarget.getBoundingClientRect(); if(e.clientX<r.left || e.clientX>r.right || e.clientY<r.top || e.clientY>r.bottom) onClose(); } }}>
    <div className="pf-detail-top"><span>Project {String(index+1).padStart(2,"0")} / {String(projects.length).padStart(2,"0")}</span><button type="button" onClick={onClose} autoFocus aria-label="Close project">Close ✕</button></div>
    <div ref={content} className="pf-detail-content"><div className="pf-detail-heading"><p className="pf-eyebrow">{project.featured ? "Featured work" : "A closer look"}</p><h2 id={titleId} tabIndex={-1}>{project.title || "Untitled project"}</h2>{project.description && <p className="pf-bio">{project.description}</p>}</div>
      {project.image && !failed && <img className="pf-detail-image" src={project.image} alt={`Screenshot of ${project.title || "this project"}`} onError={() => setFailed(true)} />}
      {failed && <p className="pf-detail-image-failure">Screenshot unavailable. The project details and links are still available below.</p>}
      {project.techStack.length > 0 && <ul className="pf-tech" aria-label="Project technologies">{project.techStack.map((t,i) => <li key={i}>{t}</li>)}</ul>}
      {story.length > 0 && <dl className="pf-detail-story">{story.map(([label,value],i) => <div key={label}><dt><span aria-hidden="true">{String(i+1).padStart(2,"0")}</span>{label}</dt><dd>{value}</dd></div>)}</dl>}
      <div className="pf-detail-links">{project.link && <a href={project.link} target="_blank" rel="noopener noreferrer">Visit project ↗</a>}{project.github && <a href={project.github} target="_blank" rel="noopener noreferrer">View source code ↗</a>}</div>
    </div>
    {projects.length > 1 && <nav className="pf-detail-navigation" aria-label="Project stories"><button type="button" disabled={index===0} onClick={() => onChange(projects[index-1])}>← Previous project</button><button type="button" disabled={index===projects.length-1} onClick={() => onChange(projects[index+1])}>Next project →</button></nav>}
  </dialog>;
}

export function themeDirection(theme) {
  const id = theme.replace(/^ex ex-/, "");
  if (["luxe","editorial","executive","museum","newspaper","victorian","wabi-sabi","storybook"].includes(id)) return "editorial";
  if (["scrapbook","comic-book","maximalism","y2k","spotify-wrapped","infinite-canvas","brutalist"].includes(id)) return "playful";
  if (["neon-terminal","terminal","terminal-os","blueprint","hacker-matrix","cyberpunk-2077","dashboard-portfolio"].includes(id)) return "technical";
  if (["organic","bohemian","conceptual-sketch"].includes(id)) return "organic";
  if (["aurora","space-explorer","surrealism","retro-wave"].includes(id)) return "cosmic";
  if (["scroll-cinema","netflix-portfolio"].includes(id)) return "cinematic";
  return "modern";
}
export function SignatureArt() {
  return <svg className="pf-signature-art" viewBox="0 0 180 180" aria-hidden="true" focusable="false"><g className="pf-signature-orbits" fill="none" stroke="currentColor" strokeWidth="1"><ellipse cx="90" cy="90" rx="76" ry="30" /><ellipse cx="90" cy="90" rx="76" ry="30" transform="rotate(60 90 90)"/><ellipse cx="90" cy="90" rx="76" ry="30" transform="rotate(120 90 90)"/></g><g className="pf-signature-lines" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 18H162V162H18ZM18 90H162M90 18V162M18 18L162 162M162 18L18 162"/></g><g className="pf-signature-flower" fill="none" stroke="currentColor" strokeWidth="2">{Array.from({length:8},(_,i) => <ellipse key={i} cx="90" cy="56" rx="18" ry="38" transform={`rotate(${i*45} 90 90)`}/>)}<circle cx="90" cy="90" r="12"/></g></svg>;
}
