import React, { useEffect } from "react";

const BG = "#0D1117";
const CARD = "#161B22";
const BORDER = "#30363D";
const GREEN = "#238636";
const ACCENT = "#58A6FF";
const ORANGE = "#D29922";
const PURPLE = "#BC8CFF";
const TEXT = "#E6EDF3";
const MUTED = "#8B949E";

const DashboardPortfolioTheme = ({ data }) => {
  const { name, title, about, avatarUrl, skills, projects, experience,
    certifications, achievements, codingProfiles, contact, socialLinks, themeColors = {} } = data;
  const ACCENT = themeColors.accent || "#58A6FF";
  const BG = themeColors.bg || "#0D1117";
  const TEXT = themeColors.text || "#E6EDF3";

  const stats = { projects: projects?.length || 0, skills: skills?.length || 0, experience: experience?.length || 0, certs: certifications?.length || 0 };

  useEffect(() => {
    const style = document.createElement("style");
    style.id = "dash-keyframes";
    style.textContent = `@keyframes dash-fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } } @keyframes dash-pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }`;
    document.head.appendChild(style);
    return () => document.getElementById("dash-keyframes")?.remove();
  }, []);

  const socials = [
    { href: socialLinks?.github, label: "GitHub" },
    { href: socialLinks?.linkedin, label: "LinkedIn" },
    { href: socialLinks?.twitter, label: "Twitter" },
    { href: socialLinks?.website, label: "Website" },
    { href: contact?.email ? `mailto:${contact.email}` : null, label: "Email" },
  ].filter(s => s.href);

  const section = { display: "flex", alignItems: "center", gap: 8, marginBottom: 20 };
  const tagPill = { fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: ACCENT, background: "rgba(88,166,255,0.1)", padding: "3px 10px", borderRadius: 4 };


  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'Space Grotesk', 'Inter', sans-serif", color: TEXT, paddingBottom: 60 }}>
      <div style={{ background: CARD, borderBottom: "1px solid " + BORDER, padding: "16px 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {avatarUrl && <img src={avatarUrl} alt={name} style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />}
            <span style={{ fontWeight: 700, fontSize: 15 }}>{name}</span>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN, display: "inline-block", animation: "dash-pulse 2s infinite" }} />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {socials.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 12, color: MUTED, textDecoration: "none", padding: "4px 10px", borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "1px solid " + BORDER }}>{s.label}</a>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: 40, animation: "dash-fadeIn 0.5s ease" }}>
          <div style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 900, marginBottom: 8 }}>{name}</div>
          {title && <div style={{ fontSize: 16, color: ACCENT, fontWeight: 600, marginBottom: 10 }}>{title}</div>}
          <p style={{ fontSize: 14, color: MUTED, maxWidth: 640, lineHeight: 1.7, marginBottom: 24 }}>{about}</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 12, maxWidth: 640 }}>
            {[
              { label: "Projects", value: stats.projects, color: ACCENT },
              { label: "Skills", value: stats.skills, color: PURPLE },
              { label: "Experience", value: stats.experience, color: ORANGE },
              { label: "Certs", value: stats.certs, color: GREEN },
            ].map(s => (
              <div key={s.label} style={{ background: CARD, border: "1px solid " + BORDER, borderRadius: 10, padding: "14px 16px", borderLeft: "3px solid " + s.color }}>
                <div style={{ fontSize: 22, fontWeight: 800 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {skills?.length > 0 && (
          <div style={{ marginBottom: 48, animation: "dash-fadeIn 0.5s ease" }}>
            <div style={section}><span style={tagPill}>SKILLS</span><span style={{ fontSize: 12, color: MUTED }}>— {skills.length} technologies</span></div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {skills.map((s, i) => (
                <span key={i} style={{ padding: "10px 16px", background: CARD, border: "1px solid " + BORDER, borderRadius: 6, color: TEXT }}>{typeof s === "string" ? s : s.name || ""}</span>
              ))}
            </div>
          </div>
        )}

        {projects?.length > 0 && (
          <div style={{ marginBottom: 48, animation: "dash-fadeIn 0.5s ease" }}>
            <div style={section}><span style={tagPill}>PROJECTS</span><span style={{ fontSize: 12, color: MUTED }}>— {projects.length} items</span></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 12 }}>
              {projects.map((p, i) => {
                const statusColors = [GREEN, ORANGE, ACCENT, PURPLE];
                return (
                  <div key={i} style={{ background: CARD, border: "1px solid " + BORDER, borderRadius: 10, padding: 20, borderTop: "3px solid " + statusColors[i % 4] }}>
                    {p.image && (
                      <img src={p.image} alt={p.title} style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 6, marginBottom: 16, background: CARD }} />
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusColors[i % 4] }} />
                      <span style={{ fontSize: 10, color: MUTED, fontFamily: "monospace" }}>Project {i + 1}</span>
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, marginBottom: 8 }}>{p.title}</h3>
                    <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, marginBottom: 12 }}>{p.description}</p>
                    {p.techStack?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
                        {p.techStack.map((t, j) => <span key={j} style={{ fontSize: 11, padding: "2px 8px", background: "rgba(88,166,255,0.08)", color: ACCENT, borderRadius: 4, fontFamily: "monospace" }}>{t}</span>)}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 8 }}>
                      {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: ACCENT, textDecoration: "none", fontWeight: 600 }}>Live ↗</a>}
                      {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: MUTED, textDecoration: "none" }}>GitHub</a>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {experience?.length > 0 && (
          <div style={{ marginBottom: 48, animation: "dash-fadeIn 0.5s ease" }}>
            <div style={section}><span style={tagPill}>EXPERIENCE</span></div>
            <div style={{ display: "grid", gap: 12 }}>
              {experience.map((e, i) => (
                <div key={i} style={{ background: CARD, border: "1px solid " + BORDER, borderRadius: 10, padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{e.role}</div>
                      <div style={{ fontSize: 13, color: ACCENT, fontWeight: 600 }}>{e.company}</div>
                    </div>
                    <div style={{ fontSize: 11, color: MUTED, fontFamily: "monospace", whiteSpace: "nowrap" }}>{e.duration}</div>
                  </div>
                  {e.description && <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, margin: 0 }}>{e.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24, marginBottom: 48, animation: "dash-fadeIn 0.5s ease" }}>
          {certifications?.length > 0 && (
            <div>
              <div style={section}><span style={tagPill}>CERTS</span></div>
              <div style={{ display: "grid", gap: 8 }}>
                {certifications.map((c, i) => (
                  <div key={i} style={{ background: CARD, border: "1px solid " + BORDER, borderRadius: 8, padding: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{c.title}</div>
                    <div style={{ fontSize: 12, color: MUTED }}>{c.issuer}{c.date && ` · ${c.date}`}</div>
                    {c.credentialUrl && <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: ACCENT, marginTop: 4, display: "inline-block" }}>Verify ↗</a>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {achievements?.length > 0 && (
            <div>
              <div style={section}><span style={tagPill}>ACHIEVEMENTS</span></div>
              <div style={{ display: "grid", gap: 8 }}>
                {achievements.map((a, i) => (
                  <div key={i} style={{ background: CARD, border: "1px solid " + BORDER, borderRadius: 8, padding: 14, display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ fontSize: 24 }}>{a.icon || "🏆"}</span>
                    <div><div style={{ fontSize: 13, fontWeight: 700 }}>{a.title}</div>{a.description && <div style={{ fontSize: 12, color: MUTED }}>{a.description}</div>}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {codingProfiles?.length > 0 && (
          <div style={{ marginBottom: 48, animation: "dash-fadeIn 0.5s ease" }}>
            <div style={section}><span style={tagPill}>CODING PROFILES</span></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10 }}>
              {codingProfiles.map((p, i) => (
                <a key={i} href={p.url || "#"} target="_blank" rel="noopener noreferrer"
                  style={{ background: CARD, border: "1px solid " + BORDER, borderRadius: 8, padding: 16, textDecoration: "none", color: TEXT }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{p.platform}</div>
                  {p.username && <div style={{ fontSize: 12, color: ACCENT, fontFamily: "monospace" }}>@{p.username}</div>}
                  {(p.rating || p.solved) && (
                    <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>{p.rating && `⭐ ${p.rating}`}{p.rating && p.solved && " · "}{p.solved && `✅ ${p.solved}`}</div>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        <div style={{ borderTop: "1px solid " + BORDER, paddingTop: 40, textAlign: "center", animation: "dash-fadeIn 0.5s ease" }}>
          <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.5rem)", fontWeight: 800, marginBottom: 8 }}>README.md</h2>
          <p style={{ fontSize: 14, color: MUTED, marginBottom: 28 }}>Contact me through the links below.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {contact?.email && <a href={`mailto:${contact.email}`} style={{ padding: "10px 22px", background: GREEN, color: "#fff", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>{contact.email}</a>}
            {contact?.phone && <a href={`tel:${contact.phone}`} style={{ padding: "10px 22px", border: "1px solid " + BORDER, color: MUTED, borderRadius: 8, fontSize: 14, textDecoration: "none" }}>{contact.phone}</a>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPortfolioTheme;
