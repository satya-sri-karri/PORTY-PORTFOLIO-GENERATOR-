import React, { useEffect, useRef, useState } from "react";
import { PortfolioRoot, PortfolioNav, ProfileMeta, Portrait, Skills, ProfileActions, PortfolioSections } from "./PortfolioParts";
import { profileLinks, orderedProjects } from "../../../utils/portfolioContent";
import "./extended.css";
import { TerminalConsole, CanvasPlayground, PixelExplorer, SceneNavigator } from "./ThemeExperiences";

function sectionList(data) {
  return [["Introduction", "pf-intro", true], ["Projects", "pf-work", data.projects.length], ["Experience", "pf-experience", data.experience.length], ["Credentials", "pf-credentials", data.certifications.length || data.achievements.length], ["Profiles", "pf-profiles", data.codingProfiles.length], ["Contact", "pf-contact", profileLinks(data).length]].filter(([, , exists]) => exists);
}
function Sheets({ data, kind }) {
  const [active, setActive] = useState("pf-intro");
  useEffect(() => {
    if (!window.IntersectionObserver) return;
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) setActive(visible[0].target.id);
    }, { rootMargin: "-15% 0px -55% 0px" });
    sectionList(data).forEach(([, id]) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [data]);
  return <nav className="ex-sheets" aria-label={kind === "files" ? "Portfolio files" : "Portfolio chapters"}>{sectionList(data).map(([label, id]) => <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined} onClick={() => setActive(id)}>{kind === "files" ? `${label.toLowerCase()}.md` : label}</a>)}</nav>;
}
function PortfolioGuide({ data }) {
  const [query, setQuery] = useState(""); const [reply, setReply] = useState(null);
  const answer = value => {
    const q = value.toLowerCase(); let text = "Choose a topic below or browse the sections directly.", id = "pf-main";
    if (/career|experience|work history|employment/.test(q)) { text = data.experience.length ? data.experience.map(x => [x.role, x.company, x.duration, x.description].filter(Boolean).join(" · ")).join("\n\n") : "No experience details have been supplied."; id = "pf-experience"; }
    else if (/project|built|portfolio|work/.test(q)) { text = data.projects.length ? data.projects.map(p => [p.title, p.description].filter(Boolean).join(" — ")).join("\n\n") : "No projects have been supplied."; id = "pf-work"; }
    else if (/skill|tool|technolog/.test(q)) text = data.skills.length ? data.skills.join(" · ") : "No skills have been supplied.";
    else if (/certif|award|credential/.test(q)) { text = [...data.certifications, ...data.achievements].map(c => c.title).join(" · ") || "No credentials have been supplied."; id = "pf-credentials"; }
    else if (/contact|email|reach|connect/.test(q)) { text = profileLinks(data).length ? "Use the provided contact and profile links." : "No contact details have been supplied."; id = "pf-contact"; }
    else if (/about|who|intro/.test(q)) text = data.about || "No biography has been supplied.";
    setReply({ text, id, available: sectionList(data).some(([, target]) => target === id) });
  };
  return <div className="ex-guide"><p className="pf-eyebrow">Portfolio guide</p><p>This guide answers common topics using the information on this page. It does not generate AI replies.</p><div className="ex-controls">{["About", "Projects", "Experience", "Skills", "Contact"].map(topic => <button key={topic} type="button" onClick={() => { setQuery(topic); answer(topic); }}>{topic}</button>)}</div><form onSubmit={event => { event.preventDefault(); answer(query); }}><label htmlFor="portfolio-question">Ask about this portfolio</label><div className="ex-query"><input id="portfolio-question" value={query} onChange={e => setQuery(e.target.value)} placeholder="Projects, experience, skills…" /><button type="submit">Ask</button></div></form>{reply && <div className="ex-answer" role="status"><p>{reply.text}</p>{reply.available && <a href={`#${reply.id}`}>Browse this section ↗</a>}</div>}</div>;
}
function StorySlides({ data }) {
  const stories = [{ title: "My perspective", text: data.about || data.title || data.name }, ...orderedProjects(data.projects).map(p => ({ title: p.title || "Project", text: p.description || "Explore this project in the full collection below.", href: "#pf-work" })), ...data.experience.map(e => ({ title: e.role || e.company, text: [e.company, e.duration].filter(Boolean).join(" · "), href: "#pf-experience" }))];
  const [index, setIndex] = useState(0); const start = useRef(null); const safeIndex = Math.min(index, stories.length - 1); const story = stories[safeIndex];
  const move = delta => setIndex(previous => (Math.min(previous, stories.length - 1) + delta + stories.length) % stories.length);
  return <div className="ex-slides" onPointerDown={e => { if (e.pointerType !== "mouse" && !e.target.closest("button, a")) start.current = e.clientX; }} onPointerUp={e => { if (start.current !== null) { const delta = e.clientX - start.current; if (Math.abs(delta) > 50) move(delta < 0 ? 1 : -1); start.current = null; } }} onPointerCancel={() => { start.current = null; }}><p className="pf-eyebrow">Story {safeIndex + 1} of {stories.length}</p><div className="ex-slide-content" key={safeIndex}><h2>{story.title}</h2><p className="pf-bio">{story.text}</p>{story.href && <a className="pf-text-link" href={story.href}>Explore the full story ↗</a>}</div><div className="ex-controls"><button type="button" onClick={() => move(-1)} disabled={stories.length < 2}>Previous story</button><button type="button" onClick={() => move(1)} disabled={stories.length < 2}>Next story</button></div></div>;
}
function IllustratedNavigation({ data, pixel = false }) {
  return <div className={`ex-scene ${pixel ? "ex-pixel-world" : "ex-desk"}`}><svg viewBox="0 0 600 330" role="group" aria-label={pixel ? "Illustrated portfolio world with section links" : "Illustrated creator’s desk with section links"}>
    <rect x="5" y="5" width="590" height="320" rx={pixel ? "0" : "22"} fill="var(--pf-surface)" stroke="var(--pf-line)" />
    {pixel ? <><path d="M5 265H595V325H5Z" fill="var(--pf-accent)" opacity=".22"/><path d="M35 80H85V60H125V80H155V110H35ZM405 55H435V35H475V55H515V90H405Z" fill="var(--pf-text)" opacity=".15"/><path d="M5 250L70 145L160 250L230 120L345 250L440 150L595 250Z" fill="var(--pf-accent)" opacity=".15"/></> : <path d="M25 260H575M50 285H550" stroke="var(--pf-line)" />}
    {data.projects.length > 0 && <a href="#pf-work" tabIndex="0" aria-label="Explore projects"><rect x="60" y="110" width="220" height="140" rx={pixel ? "0" : "8"} fill="var(--pf-bg)" stroke="var(--pf-accent)" strokeWidth="4"/><path d="M80 135H260M80 160H230M80 185H200" stroke="var(--pf-line)" strokeWidth="6"/><text x="85" y="223" fill="var(--pf-text)" fontSize="20">Projects ↗</text></a>}
    {data.experience.length > 0 && <a href="#pf-experience" tabIndex="0" aria-label="Explore experience"><rect x="325" y="90" width="210" height="75" rx={pixel ? "0" : "7"} fill="var(--pf-bg)" stroke="var(--pf-line)" strokeWidth="3"/><text x="345" y="135" fill="var(--pf-text)" fontSize="18">Experience ↗</text></a>}
    {profileLinks(data).length > 0 && <a href="#pf-contact" tabIndex="0" aria-label="Explore contact"><rect x="340" y="195" width="160" height="65" rx={pixel ? "0" : "7"} fill="var(--pf-accent)"/><text x="360" y="235" fill="var(--pf-on-accent)" fontSize="18">Contact ↗</text></a>}
    {!data.projects.length && !data.experience.length && !profileLinks(data).length && <text x="300" y="180" textAnchor="middle" fill="var(--pf-text)" fontSize="22">A space for {data.name}</text>}
  </svg><p className="pf-eyebrow">An illustrated navigation scene · Full content below</p></div>;
}
function ContentCounts({ data }) {
  return <dl className="ex-counts">{[["Projects", data.projects.length], ["Skills", data.skills.length], ["Credentials", data.certifications.length], ["Achievements", data.achievements.length]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}
function Journey({ data }) {
  const [selected, setSelected] = useState(-1);
  if (!data.experience.length) return null;
  return <nav className="ex-journey" aria-label="Career milestones">{data.experience.map((item, i) => <button key={i} type="button" aria-pressed={selected === i} onClick={() => { setSelected(i); document.querySelectorAll('#pf-experience .pf-timeline-row')[i]?.scrollIntoView({ block: "center", behavior: "auto" }); }}><span>{item.duration}</span>{item.role || item.company}</button>)}</nav>;
}
const stars = [[12,18],[32,9],[58,23],[83,12],[18,56],[44,41],[74,62],[92,43],[8,85],[55,79],[85,91],[26,75],[68,7],[37,89],[95,73]];
export default function ExtendedPortfolio({ data, config }) {
  const [reading, setReading] = useState(false); const [rain, setRain] = useState(false);
  const mode = config.mode;
  const collection = useRef(null);
  const hero = useRef(null); const [visible,setVisible] = useState(true); const [hidden,setHidden] = useState(document.hidden);
  useEffect(() => {
    const hidden = () => setHidden(document.hidden);
    const observer = new IntersectionObserver(entries => setVisible(entries[0].isIntersecting));
    if(hero.current) observer.observe(hero.current);
    document.addEventListener("visibilitychange", hidden);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", hidden); };
  }, []);
  return <PortfolioRoot data={data} theme={`ex ex-${config.id}`} colors={config.colors}>
    <PortfolioNav data={data} brand={config.brand} />
    <main id="pf-main" className={`pf-container ex-layout ${reading ? "ex-reading" : ""}`}>
      {(mode === "sheets" || mode === "files" || mode === "chapters") && <Sheets data={data} kind={mode} />}
      <section id="pf-intro" ref={hero} className="pf-hero ex-hero">
        <div className="ex-decoration" aria-hidden="true">{mode === "space" ? stars.map(([x,y],i) => <i key={i} style={{left:`${x}%`,top:`${y}%`}} />) : mode === "matrix" ? <div className={`ex-matrix ${rain && visible && !hidden && !data.staticPreview ? "ex-rain" : ""}`}>{Array.from({length:12},(_,i) => <span key={i} style={{animationDelay:`${-i*.4}s`}}>01<br/>10<br/>01<br/>11<br/>00<br/>10</span>)}</div> : <span className="ex-art" />}</div>
        <div className="ex-identity"><p className="pf-eyebrow">{config.eyebrow}</p><h1>{data.name}</h1><ProfileMeta data={data} />{data.about && <p className="pf-bio">{data.about}</p>}<Skills data={data} /><ProfileActions data={data} /></div>
        <div className="ex-portrait"><Portrait data={data} /></div>
      </section>
      {mode === "assistant" && <PortfolioGuide data={data} />}
      {(mode === "slides" || mode === "chapters") && <StorySlides data={data} />}
      {mode === "files" && <TerminalConsole data={data} />}
      {mode === "canvas" && !reading && <CanvasPlayground data={data} />}
      {mode === "pixel" && <PixelExplorer data={data} />}
      {mode === "cinema" && <SceneNavigator data={data} />}
      {(mode === "desk" || mode === "pixel") && <IllustratedNavigation data={data} pixel={mode === "pixel"} />}
      {mode === "dashboard" && <ContentCounts data={data} />}
      {mode === "journey" && <Journey data={data} />}
      {mode === "map" && <div className="ex-map"><p className="pf-eyebrow">{data.location ? `Based in ${data.location}` : "A map of my work"}</p><IllustratedNavigation data={data} /><p>Illustrated section map; no geographic distances are inferred.</p></div>}
      {(mode === "canvas" || mode === "desk") && <div className="ex-controls" role="group" aria-label="Portfolio presentation"><button type="button" aria-pressed={!reading} onClick={() => setReading(false)}>{mode === "desk" ? "Desk view" : "Board view"}</button><button type="button" aria-pressed={reading} onClick={() => setReading(true)}>Reading view</button></div>}
      {mode === "matrix" && !data.staticPreview && <div className="ex-controls"><button type="button" aria-pressed={rain} onClick={() => setRain(v => !v)}>{rain ? "Pause rain" : "Animate rain"}</button></div>}
      {mode === "carousel" && data.projects.length > 1 && <div className="ex-controls" role="group" aria-label="Project collection"><button type="button" onClick={() => collection.current?.querySelector('.pf-project-grid')?.scrollBy({left:-420,behavior:"auto"})}>Previous projects</button><button type="button" onClick={() => collection.current?.querySelector('.pf-project-grid')?.scrollBy({left:420,behavior:"auto"})}>Next projects</button></div>}
      <div ref={collection}><PortfolioSections data={data} /></div>
    </main>
  </PortfolioRoot>;
}
