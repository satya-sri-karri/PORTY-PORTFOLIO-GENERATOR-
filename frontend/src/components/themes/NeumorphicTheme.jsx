import React from "react";

const BG = "#E8EAF0";
const ACCENT = "#6366F1";
const TEXT = "#2D2F36";
const MUTED = "#8A8C9A";

const out = (extra = {}) => ({
  boxShadow: "10px 10px 20px #c5c7ce, -10px -10px 20px #ffffff",
  background: BG,
  borderRadius: 20,
  ...extra,
});

const inn = (extra = {}) => ({
  boxShadow: "inset 8px 8px 16px #c5c7ce, inset -8px -8px 16px #ffffff",
  background: BG,
  borderRadius: 12,
  ...extra,
});

const NeumorphicTheme = ({ data }) => {
  const { name, title, about, avatarUrl, skills, projects, experience,
    certifications, achievements, codingProfiles, contact, socialLinks, themeColors = {} } = data;
  const ACCENT = themeColors.accent || "#6366F1";
  const BG = themeColors.bg || "#E8EAF0";
  const TEXT = themeColors.text || "#2D2F36";

  const socials = [
    { href: socialLinks?.github, label: "GitHub" },
    { href: socialLinks?.linkedin, label: "LinkedIn" },
    { href: socialLinks?.twitter, label: "Twitter" },
    { href: socialLinks?.website, label: "Website" },
    { href: contact?.email ? `mailto:${contact.email}` : null, label: "Email" },
  ].filter(s => s.href);

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'Inter', sans-serif", color: TEXT, padding: "0 0 80px" }}>
      <style>{`
        .neu-btn:hover { box-shadow: 4px 4px 10px #c5c7ce, -4px -4px 10px #ffffff !important; transform: translateY(2px) !important; }
        .neu-pill:hover { box-shadow: inset 6px 6px 12px #c5c7ce, inset -6px -6px 12px #ffffff !important; color: ${ACCENT} !important; }
        .neu-card:hover { box-shadow: 14px 14px 28px #c5c7ce, -14px -14px 28px #ffffff !important; transform: translateY(-3px) !important; }
      `}</style>

      <nav style={{ ...out({ padding: "0 40px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, borderRadius: 0 }) }}>
        <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em", color: TEXT }}>{name}</span>
        <div style={{ display: "flex", gap: 10 }}>
          {["Skills", "Projects", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="neu-btn"
              style={{ ...out({ padding: "8px 18px", borderRadius: 12, fontSize: 12, fontWeight: 600, color: MUTED, textDecoration: "none", cursor: "pointer", transition: "all 0.25s" }) }}>
              {l}
            </a>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ ...out({ padding: 48, marginBottom: 28, textAlign: "center", position: "relative", overflow: "hidden" }) }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 240, height: 240, borderRadius: "50%", background: `radial-gradient(circle, ${ACCENT}12, transparent)` }} />
          {avatarUrl && (
            <div style={{ ...out({ width: 110, height: 110, borderRadius: "50%", margin: "0 auto 28px", padding: 5, display: "inline-flex" }) }}>
              <img src={avatarUrl} alt={name} onError={e => e.target.style.display = "none"}
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
            </div>
          )}
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: ACCENT, marginBottom: 16 }}>Portfolio</div>
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, color: TEXT, marginBottom: 14 }}>{name}</h1>
          {title && <p style={{ fontSize: 15, fontWeight: 600, color: ACCENT, marginBottom: 18 }}>{title}</p>}
          <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.8, maxWidth: 520, margin: "0 auto 36px", fontWeight: 300 }}>{about}</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            {contact?.email && (
              <a href={`mailto:${contact.email}`} className="neu-btn"
                style={{ padding: "12px 28px", borderRadius: 14, fontSize: 14, fontWeight: 700, color: "#fff", background: ACCENT, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, transition: "all 0.25s", boxShadow: `6px 6px 16px ${ACCENT}40, -4px -4px 12px #fff` }}>
                ✉ Get In Touch
              </a>
            )}
            {socials.filter(s => s.label === "GitHub" || s.label === "LinkedIn").map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="neu-btn"
                style={{ ...out({ padding: "12px 24px", borderRadius: 14, fontSize: 13, fontWeight: 600, color: MUTED, textDecoration: "none", transition: "all 0.25s" }) }}>
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {skills?.length > 0 && (
          <div id="skills" style={{ ...out({ marginBottom: 28 }) }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: ACCENT, marginBottom: 24 }}>Skills & Technologies</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {skills.map((s, i) => (
                <span key={i} className="neu-pill" style={{ ...inn({ padding: "10px 22px", borderRadius: 12, fontSize: 13, fontWeight: 600, color: MUTED, cursor: "default", transition: "all 0.25s" }) }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {projects?.length > 0 && (
          <div id="projects" style={{ ...out({ marginBottom: 28 }) }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: ACCENT, marginBottom: 24 }}>Projects</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
              {projects.map((p, i) => (
                <div key={i} className="neu-card" style={{ ...out({ borderRadius: 18, padding: 26, transition: "all 0.25s" }) }}>
                  {p.image && <img src={p.image} alt={p.title} style={{ width: "100%", height: "auto", maxHeight: 200, borderRadius: 16, marginBottom: 18, boxShadow: "inset 4px 4px 8px #c5c7ce, inset -4px -4px 8px #ffffff, 10px 10px 20px #c5c7ce, -10px -10px 20px #ffffff", border: "2px solid #6366F1", objectFit: "cover" }} />}
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: BG, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, fontSize: 18, boxShadow: "inset 4px 4px 8px #c5c7ce, inset -4px -4px 8px #ffffff" }}>📂</div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: TEXT, marginBottom: 10, letterSpacing: "-0.02em" }}>{p.title}</h3>
                  <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.7, marginBottom: 16, fontWeight: 300 }}>{p.description}</p>
                  {p.techStack?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                      {p.techStack.map((t, j) => <span key={j} style={{ ...inn({ padding: "3px 10px", borderRadius: 8, fontSize: 10, fontWeight: 700, color: ACCENT, display: "inline-block" }) }}>{t}</span>)}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 12 }}>
                    {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textDecoration: "none" }}>Live ↗</a>}
                    {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 600, color: MUTED, textDecoration: "none" }}>GitHub</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {experience?.length > 0 && (
          <div style={{ ...out({ marginBottom: 28 }) }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: ACCENT, marginBottom: 24 }}>Experience</div>
            {experience.map((e, i) => (
              <div key={i} style={{ ...inn({ borderRadius: 16, padding: 22, marginBottom: 14 }) }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: TEXT, marginBottom: 4 }}>{e.role}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT }}>{e.company}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 11, color: MUTED, fontFamily: "monospace", fontWeight: 500 }}>{e.duration}</span>
                    {e.current && <span style={{ fontSize: 10, fontWeight: 700, background: BG, color: ACCENT, padding: "3px 10px", borderRadius: 999, boxShadow: "inset 3px 3px 6px #c5c7ce, inset -3px -3px 6px #ffffff" }}>CURRENT</span>}
                  </div>
                </div>
                {e.description && <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.7, fontWeight: 300, marginTop: 8 }}>{e.description}</p>}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: certifications?.length > 0 && achievements?.length > 0 ? "1fr 1fr" : "1fr", gap: 24, marginBottom: 28 }}>
          {certifications?.length > 0 && (
            <div style={out()}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: ACCENT, marginBottom: 24 }}>Certifications</div>
              {certifications.map((c, i) => (
                <div key={i} style={{ ...inn({ borderRadius: 14, padding: 16, marginBottom: 12 }) }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>🏅 {c.title}</div>
                  <div style={{ fontSize: 12, color: ACCENT, fontWeight: 600 }}>{c.issuer}</div>
                  {c.date && <div style={{ fontSize: 11, color: MUTED, marginTop: 4, fontFamily: "monospace" }}>{c.date}</div>}
                  {c.credentialUrl && <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: ACCENT, marginTop: 8, display: "block", fontWeight: 600, textDecoration: "none" }}>Verify ↗</a>}
                </div>
              ))}
            </div>
          )}
          {achievements?.length > 0 && (
            <div style={out()}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: ACCENT, marginBottom: 24 }}>Achievements</div>
              {achievements.map((a, i) => (
                <div key={i} style={{ ...inn({ borderRadius: 14, padding: 16, marginBottom: 12, display: "flex", alignItems: "flex-start", gap: 14 }) }}>
                  <div style={{ fontSize: 24, flexShrink: 0 }}>{a.icon || "🏆"}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{a.title}</div>
                    {a.description && <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.6, fontWeight: 300 }}>{a.description}</div>}
                    {a.date && <div style={{ fontSize: 11, color: ACCENT, marginTop: 6, fontFamily: "monospace" }}>{a.date}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {codingProfiles?.length > 0 && (
          <div style={{ ...out({ marginBottom: 28 }) }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: ACCENT, marginBottom: 24 }}>Coding Profiles</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
              {codingProfiles.map((p, i) => (
                <a key={i} href={p.url || "#"} target="_blank" rel="noopener noreferrer" className="neu-card"
                  style={{ ...out({ borderRadius: 16, padding: 20, textDecoration: "none", color: TEXT, display: "block", transition: "all 0.25s" }) }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: BG, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, fontSize: 18, boxShadow: "inset 4px 4px 8px #c5c7ce, inset -4px -4px 8px #ffffff" }}>⌘</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{p.platform}</div>
                  {p.username && <div style={{ fontSize: 12, color: ACCENT, fontFamily: "monospace", fontWeight: 600 }}>@{p.username}</div>}
                  {(p.rating || p.solved) && <div style={{ fontSize: 11, color: MUTED, marginTop: 6, fontWeight: 400 }}>{p.rating && `⭐ ${p.rating}`}{p.solved && ` · ${p.solved} solved`}</div>}
                </a>
              ))}
            </div>
          </div>
        )}

        <div id="contact" style={{ ...out({ textAlign: "center", padding: 56 }) }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: ACCENT, marginBottom: 16 }}>Get In Touch</div>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", color: TEXT, marginBottom: 12 }}>Let's work together</h2>
          <p style={{ fontSize: 15, color: MUTED, marginBottom: 36, fontWeight: 300 }}>Get in touch to start a conversation</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {contact?.email && <a href={`mailto:${contact.email}`} className="neu-btn" style={{ padding: "14px 32px", borderRadius: 16, background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none", boxShadow: `8px 8px 20px ${ACCENT}40, -4px -4px 12px #fff`, transition: "all 0.25s" }}>✉ {contact.email}</a>}
            {contact?.phone && <a href={`tel:${contact.phone}`} className="neu-btn" style={{ ...out({ padding: "14px 32px", borderRadius: 16, color: MUTED, fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "all 0.25s" }) }}>📞 {contact.phone}</a>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeumorphicTheme;
