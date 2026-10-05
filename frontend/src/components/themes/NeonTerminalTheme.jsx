import React, { useState } from "react";
import { profileLinks } from "../../utils/portfolioContent";
import { PortfolioRoot, PortfolioNav, ProfileMeta, Portrait, Skills, ProfileActions, StandardProjects, BackgroundSections, ContactSection } from "./common/PortfolioParts";
import "./common/secondBatch.css";

export default function NeonTerminalTheme({ data }) {
  const [compact, setCompact] = useState(false);
  const files = [["about.md", "pf-main", true], ["skills.json", "pf-skills", data.skills.length], ["projects/", "pf-work", data.projects.length], ["career.log", "pf-experience", data.experience.length], ["credentials.md", "pf-credentials", data.certifications.length || data.achievements.length], ["profiles.json", "pf-profiles", data.codingProfiles.length], ["contact.sh", "pf-contact", profileLinks(data).length]].filter(([, , show]) => show);
  return <PortfolioRoot data={data} theme="terminal" colors={{ bg: "#101518", text: "#e0e9e4", accent: "#70ecab" }}>
    <PortfolioNav data={data} brand=">_" />
    <div className="terminal-workspace"><aside className="terminal-explorer"><p className="pf-eyebrow">Portfolio explorer</p><nav aria-label="Portfolio files">{files.map(([label, id]) => <a key={id} href={`#${id}`}><span aria-hidden="true">{label.endsWith("/") ? "+" : "·"}</span>{label}</a>)}</nav><p className="terminal-explorer-note">Your work. In plain view.</p></aside>
      <main id="pf-main" className={`pf-container terminal-content ${compact ? "terminal-compact" : ""}`}>
        <section className="pf-hero terminal-hero"><div className="terminal-window"><div className="terminal-window-bar"><span className="terminal-window-dots" aria-hidden="true"><i /><i /><i /></span><span>README.md</span><span className="terminal-window-language">Markdown</span></div>
          <div className="terminal-readme"><p className="pf-eyebrow"><span aria-hidden="true">$ </span>cat about.md</p><div className="terminal-identity"><div><h1>{data.name}</h1><ProfileMeta data={data} /></div><Portrait data={data} /></div>{data.about && <p className="pf-bio">{data.about}</p>}{data.skills.length > 0 && <div id="pf-skills" className="terminal-skills"><h2>Skills & tools</h2><Skills data={data} /></div>}<ProfileActions data={data} /></div>
        </div></section>
        {data.projects.length > 0 && <div className="terminal-view-controls" role="group" aria-label="Project presentation"><span className="pf-eyebrow">projects/</span><button type="button" aria-pressed={!compact} onClick={() => setCompact(false)}>Card view</button><button type="button" aria-pressed={compact} onClick={() => setCompact(true)}>Compact view</button></div>}
        <StandardProjects data={data} /><BackgroundSections data={data} /><ContactSection data={data} />
      </main>
    </div>
  </PortfolioRoot>;
}
