import React from "react";

const KineticTheme = ({ data }) => {
  const { name, title, about, avatarUrl, skills, projects, experience,
    certifications, achievements, codingProfiles, contact, socialLinks, themeColors = {} } = data;

  const socials = [
    { href: socialLinks?.github, label: "GitHub" },
    { href: socialLinks?.linkedin, label: "LinkedIn" },
    { href: socialLinks?.twitter, label: "Twitter" },
    { href: socialLinks?.website, label: "Website" },
    { href: contact?.email ? `mailto:${contact.email}` : null, label: "Email" },
  ].filter(s => s.href);

  const ACCENT = themeColors.accent || "#FFE500";
  const BG = themeColors.bg || "#050505";
  const TEXT = themeColors.text || "#FFFFFF";
  const YELLOW = ACCENT;
  const DARK = BG;

  return (
    <div style={{ minHeight: "100vh", background: DARK, fontFamily: "'Epilogue', 'Inter', sans-serif", color: TEXT, overflowX: "hidden" }}>
      <style>{`
        @keyframes progressPulse {
          0% { width: 0; }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes tiltIn {
          from { opacity: 0; transform: perspective(800px) rotateX(10deg) translateY(30px); }
          to { opacity: 1; transform: perspective(800px) rotateX(0) translateY(0); }
        }
        .kin-card:hover { border-color: ${YELLOW} !important; box-shadow: 0 0 30px ${YELLOW}20 !important; transform: translateY(-4px) !important; }
        .kin-btn:hover { background: ${YELLOW} !important; color: ${DARK} !important; transform: scale(1.05) !important; }
      `}</style>

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 40px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(5,5,5,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,229,0,0.1)" }}>
        <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: YELLOW }}>{name}</span>
        <div style={{ display: "flex", gap: 32 }}>
          {["Skills", "Projects", "Experience", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", textDecoration: "none", letterSpacing: "0.04em", textTransform: "uppercase", transition: "color 0.2s" }}>{l}</a>
          ))}
        </div>
      </nav>

      <div style={{
        position: "relative", paddingTop: 64,
        clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)",
        background: `linear-gradient(135deg, ${DARK} 0%, #0A0A0A 100%)`,
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "20%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${YELLOW}08, transparent)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "120px 40px 140px", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: YELLOW, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 30, height: 3, background: YELLOW, display: "inline-block" }} />
            PORTFOLIO
          </div>
          <h1 style={{
            fontSize: "clamp(3.5rem, 9vw, 7rem)", fontFamily: "'Epilogue', sans-serif", fontWeight: 900, lineHeight: 0.9,
            letterSpacing: "-0.05em", marginBottom: 24,
            background: `linear-gradient(135deg, #fff 30%, ${YELLOW} 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            {name}
          </h1>
          {title && <p style={{ fontSize: 18, fontWeight: 700, color: YELLOW, marginBottom: 16, letterSpacing: "0.04em", textTransform: "uppercase" }}>{title}</p>}
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.85, maxWidth: 600, marginBottom: 40 }}>{about}</p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {socials.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="kin-btn"
                style={{ padding: "12px 24px", border: "1px solid rgba(255,229,0,0.2)", borderRadius: 6, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", textDecoration: "none", transition: "all 0.3s", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {skills?.length > 0 && (
        <div id="skills" style={{ padding: "80px 40px", position: "relative" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: YELLOW, marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 20, height: 3, background: YELLOW }} />
              SKILLS
            </div>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 36, color: "#fff" }}>Technical <span style={{ color: YELLOW }}>Skills</span></h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              {skills.map((s, i) => (
                <span key={i} style={{ padding: "10px 16px", border: `1px solid ${YELLOW}40`, borderRadius: 6, color: YELLOW, fontWeight: 600 }}>{typeof s === "string" ? s : s.name || ""}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {projects?.length > 0 && (
        <div id="projects" style={{
          padding: "80px 40px", background: "#0A0A0A",
          clipPath: "polygon(0 8%, 100% 0, 100% 92%, 0 100%)",
        }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: YELLOW, marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 20, height: 3, background: YELLOW }} />
              PROJECTS
            </div>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 40, color: "#fff" }}>Work in <span style={{ color: YELLOW }}>Motion</span></h2>
            <div style={{ display: "grid", gap: 20 }}>
              {projects.map((p, i) => (
                <div key={i} className="kin-card" style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 24,
                  border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 28,
                  background: "rgba(255,255,255,0.02)", transition: "all 0.3s",
                }}>
                  {p.image && <img src={p.image} alt={p.title} style={{ width: "100%", height: "auto", maxHeight: 200, borderRadius: 0, marginBottom: 12, border: `2px solid ${YELLOW}`, objectFit: "cover", gridColumn: "1/-1" }} />}
                  <div style={{ width: 52, height: 52, borderRadius: 10, background: `${YELLOW}12`, border: `1px solid ${YELLOW}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: YELLOW, flexShrink: 0 }}>✦</div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 8, letterSpacing: "-0.02em" }}>{p.title}</h3>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: 12 }}>{p.description}</p>
                    {p.techStack?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {p.techStack.map((t, j) => <span key={j} style={{ padding: "3px 10px", border: "1px solid rgba(255,229,0,0.15)", borderRadius: 4, fontSize: 10, fontWeight: 700, color: YELLOW, fontFamily: "monospace", letterSpacing: "0.02em" }}>{t}</span>)}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="kin-btn" style={{ padding: "8px 16px", background: "transparent", border: `1px solid ${YELLOW}`, borderRadius: 6, fontSize: 12, fontWeight: 700, color: YELLOW, textDecoration: "none", transition: "all 0.3s", letterSpacing: "0.04em" }}>LIVE</a>}
                    {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "all 0.2s" }}>CODE</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {experience?.length > 0 && (
        <div id="experience" style={{ padding: "80px 40px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: YELLOW, marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 20, height: 3, background: YELLOW }} />
              EXPERIENCE
            </div>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 40, color: "#fff" }}>Career <span style={{ color: YELLOW }}>Timeline</span></h2>
            {experience.map((e, i) => (
              <div key={i} style={{ borderLeft: `3px solid ${YELLOW}`, paddingLeft: 28, marginBottom: 36, position: "relative" }}>
                <div style={{ position: "absolute", left: -9, top: 4, width: 16, height: 16, borderRadius: "50%", background: YELLOW, boxShadow: `0 0 20px ${YELLOW}40` }} />
                <div style={{ fontSize: 12, color: YELLOW, fontWeight: 700, fontFamily: "monospace", marginBottom: 4, letterSpacing: "0.04em" }}>{e.duration}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 4, letterSpacing: "-0.02em" }}>{e.role}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,229,0,0.7)", marginBottom: 10 }}>{e.company}{e.current && <span style={{ color: YELLOW, marginLeft: 10, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em" }}>● CURRENT</span>}</div>
                {e.description && <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.75 }}>{e.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {certifications?.length > 0 && (
        <div style={{ padding: "60px 40px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: YELLOW, marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 20, height: 3, background: YELLOW }} />
              CERTIFICATIONS
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
              {certifications.map((c, i) => (
                <div key={i} className="kin-card" style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 20, background: "rgba(255,255,255,0.02)", transition: "all 0.3s" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: YELLOW, fontWeight: 600 }}>{c.issuer}{c.date && ` · ${c.date}`}</div>
                  {c.credentialUrl && <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 8, display: "block", textDecoration: "none", fontWeight: 600 }}>Verify ↗</a>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {achievements?.length > 0 && (
        <div style={{ padding: "60px 40px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: YELLOW, marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 20, height: 3, background: YELLOW }} />
              ACHIEVEMENTS
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
              {achievements.map((a, i) => (
                <div key={i} className="kin-card" style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 24, textAlign: "center", background: "rgba(255,255,255,0.02)", transition: "all 0.3s" }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{a.icon || "⚡"}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 6 }}>{a.title}</div>
                  {a.description && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{a.description}</div>}
                  {a.date && <div style={{ fontSize: 11, color: YELLOW, marginTop: 8, fontWeight: 600 }}>{a.date}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {codingProfiles?.length > 0 && (
        <div style={{ padding: "60px 40px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: YELLOW, marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 20, height: 3, background: YELLOW }} />
              CODING PROFILES
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 12 }}>
              {codingProfiles.map((p, i) => (
                <a key={i} href={p.url || "#"} target="_blank" rel="noopener noreferrer" className="kin-card" style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 18, textDecoration: "none", color: "#fff", display: "block", background: "rgba(255,255,255,0.02)", transition: "all 0.3s" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{p.platform}</div>
                  {p.username && <div style={{ fontSize: 12, color: YELLOW, fontFamily: "monospace", fontWeight: 600 }}>@{p.username}</div>}
                  {(p.rating || p.solved) && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>{p.rating && `Rating: ${p.rating}`}{p.solved && ` · ${p.solved} solved`}</div>}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      <div id="contact" style={{
        background: YELLOW, padding: "80px 40px",
        clipPath: "polygon(0 12%, 100% 0, 100% 100%, 0 100%)",
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 900, color: DARK, lineHeight: 1.0, letterSpacing: "-0.04em", marginBottom: 16 }}>
            Let's create <br />momentum.
          </h2>
          <p style={{ fontSize: 16, color: "rgba(5,5,5,0.6)", marginBottom: 36, fontWeight: 500 }}>Ready to build something powerful together.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {contact?.email && <a href={`mailto:${contact.email}`} style={{ padding: "14px 32px", background: DARK, color: YELLOW, borderRadius: 6, fontSize: 14, fontWeight: 800, textDecoration: "none", letterSpacing: "0.04em", textTransform: "uppercase", transition: "all 0.3s" }}>✉ {contact.email}</a>}
            {socials.filter(s => s.label !== "Email").slice(0, 2).map(s => <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ padding: "14px 28px", border: `2px solid ${DARK}`, color: DARK, borderRadius: 6, fontSize: 13, fontWeight: 700, textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.2s" }}>{s.label}</a>)}
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "24px", color: "rgba(255,255,255,0.2)", fontSize: 12, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {name} · {new Date().getFullYear()} · ⚡ Kinetic
      </div>
    </div>
  );
};

export default KineticTheme;
