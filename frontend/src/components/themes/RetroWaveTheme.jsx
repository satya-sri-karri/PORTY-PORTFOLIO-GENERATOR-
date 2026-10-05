import React, { useEffect } from "react";

const RetroWaveTheme = ({ data }) => {
  const { name, title, about, avatarUrl, skills, projects, experience,
    certifications, achievements, codingProfiles, contact, socialLinks, themeColors = {} } = data;

  useEffect(() => {
    const id = "retrowave-styles";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = `
        @keyframes neonPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        @keyframes gridScroll {
          from { transform: translateY(0); }
          to { transform: translateY(50px); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 5px #FF006E, 0 0 20px #FF006E40; }
          50% { box-shadow: 0 0 10px #FF006E, 0 0 30px #FF006E60; }
        }
        .retro-card:hover { border-color: #FF006E !important; box-shadow: 0 0 20px #FF006E30, 0 0 40px #00F0FF20 !important; transform: translateY(-4px) !important; }
        .retro-btn:hover { box-shadow: 0 0 20px #FF006E40 !important; transform: scale(1.05) !important; }
        .retro-pill:hover { box-shadow: 0 0 15px #00F0FF30 !important; border-color: #00F0FF !important; }
      `;
      document.head.appendChild(style);
    }
    return () => document.getElementById(id)?.remove();
  }, []);

  const socials = [
    { href: socialLinks?.github, label: "GitHub" },
    { href: socialLinks?.linkedin, label: "LinkedIn" },
    { href: socialLinks?.twitter, label: "Twitter" },
    { href: socialLinks?.website, label: "Website" },
    { href: contact?.email ? `mailto:${contact.email}` : null, label: "Email" },
  ].filter(s => s.href);

  const ACCENT = themeColors.accent || "#FF006E";
  const BG = themeColors.bg || "#0A001F";
  const TEXT_OVERRIDE = themeColors.text || "#E0D0FF";
  const PINK = ACCENT;
  const CYAN = "#00F0FF";
  const PURPLE = BG;
  const PURPLE2 = "#120030";
  const TEXT = TEXT_OVERRIDE;

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${PURPLE} 0%, ${PURPLE2} 100%)`, fontFamily: "'Inter', sans-serif", color: TEXT, position: "relative", overflowX: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0, perspective: "400px" }}>
        <div style={{
          position: "absolute", bottom: 0, left: "-20%", right: "-20%", height: "60%",
          backgroundImage: `repeating-linear-gradient(90deg, ${CYAN}10 0px, ${CYAN}10 1px, transparent 1px, transparent 40px), repeating-linear-gradient(0deg, ${PINK}10 0px, ${PINK}10 1px, transparent 1px, transparent 40px)`,
          transform: "rotateX(60deg)", transformOrigin: "bottom",
          animation: "gridScroll 4s linear infinite",
        }} />
        <div style={{ position: "absolute", bottom: "30%", left: "10%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${PINK}15, transparent)`, filter: "blur(40px)" }} />
        <div style={{ position: "absolute", top: "20%", right: "15%", width: 250, height: 250, borderRadius: "50%", background: `radial-gradient(circle, ${CYAN}12, transparent)`, filter: "blur(40px)" }} />
      </div>

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 40px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", background: `rgba(10,0,31,0.85)`, backdropFilter: "blur(16px)", borderBottom: `1px solid ${PINK}20` }}>
        <span style={{ fontSize: 16, fontWeight: 800, background: `linear-gradient(90deg, ${PINK}, ${CYAN})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.02em" }}>{name}</span>
        <div style={{ display: "flex", gap: 24 }}>
          {["Skills", "Projects", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.2s" }}>{l}</a>
          ))}
        </div>
      </nav>

      <div style={{ position: "relative", zIndex: 1, paddingTop: 64 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "100px 40px 80px", textAlign: "center" }}>
          {avatarUrl && (
            <img src={avatarUrl} alt={name} onError={e => e.target.style.display = "none"}
              style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", margin: "0 auto 28px", border: `2px solid ${PINK}`, boxShadow: `0 0 30px ${PINK}30, 0 0 60px ${CYAN}15`, display: "block" }} />
          )}
          <h1 style={{
            fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.04em", marginBottom: 16,
            background: `linear-gradient(135deg, ${PINK} 0%, ${CYAN} 50%, #B026FF 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            textShadow: `0 0 40px ${PINK}20`,
          }}>
            {name}
          </h1>
          {title && <p style={{ fontSize: 16, fontWeight: 600, color: CYAN, marginBottom: 20, letterSpacing: "0.08em", textTransform: "uppercase", textShadow: `0 0 20px ${CYAN}30` }}>{title}</p>}
          <p style={{ fontSize: 15, color: "rgba(224,208,255,0.5)", lineHeight: 1.85, maxWidth: 560, margin: "0 auto 36px" }}>{about}</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            {socials.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="retro-btn"
                style={{ padding: "10px 22px", border: `1px solid ${PINK}40`, borderRadius: 6, fontSize: 12, fontWeight: 700, color: PINK, textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.3s", background: `${PINK}08`, boxShadow: `0 0 10px ${PINK}15` }}>
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {skills?.length > 0 && (
          <div id="skills" style={{ padding: "60px 40px" }}>
            <div style={{ maxWidth: 1000, margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36 }}>
                <span style={{ height: 1, flex: 1, background: `linear-gradient(90deg, transparent, ${PINK}40, transparent)` }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: CYAN }}>SYSTEM ABILITIES</span>
                <span style={{ height: 1, flex: 1, background: `linear-gradient(90deg, transparent, ${PINK}40, transparent)` }} />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
                {skills.map((s, i) => (
                  <span key={i} className="retro-pill"
                    style={{ padding: "10px 24px", border: `1px solid ${CYAN}30`, borderRadius: 999, fontSize: 13, fontWeight: 600, color: TEXT, cursor: "default", transition: "all 0.3s", background: `${CYAN}06`, boxShadow: `0 0 10px ${CYAN}08` }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {projects?.length > 0 && (
          <div id="projects" style={{ padding: "60px 40px" }}>
            <div style={{ maxWidth: 1000, margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36 }}>
                <span style={{ height: 1, flex: 1, background: `linear-gradient(90deg, transparent, ${PINK}40, transparent)` }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: CYAN }}>SECTOR PROJECTS</span>
                <span style={{ height: 1, flex: 1, background: `linear-gradient(90deg, transparent, ${PINK}40, transparent)` }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                {projects.map((p, i) => (
                  <div key={i} className="retro-card"
                    style={{ border: `1px solid ${PINK}15`, borderRadius: 12, padding: 28, background: `rgba(255,0,110,0.03)`, transition: "all 0.3s", boxShadow: `0 0 15px ${PINK}08` }}>
                    {p.image && (
                      <img src={p.image} alt={p.title} style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 4, marginBottom: 16, border: `1px solid ${PINK}`, boxShadow: `0 0 15px ${PINK}30, 0 0 30px ${CYAN}15`, transform: "perspective(400px) rotateX(1deg)" }} />
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${CYAN}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: CYAN, background: `${CYAN}08` }}>◆</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: PINK, fontFamily: "monospace", letterSpacing: "0.1em" }}>0x{i + 1}</div>
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: TEXT, marginBottom: 10, letterSpacing: "-0.02em" }}>{p.title}</h3>
                    <p style={{ fontSize: 13, color: "rgba(224,208,255,0.45)", lineHeight: 1.7, marginBottom: 16 }}>{p.description}</p>
                    {p.techStack?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {p.techStack.map((t, j) => <span key={j} style={{ padding: "3px 10px", border: `1px solid ${PINK}20`, borderRadius: 4, fontSize: 10, fontWeight: 700, color: PINK, fontFamily: "monospace", letterSpacing: "0.03em" }}>{t}</span>)}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                      {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="retro-btn" style={{ padding: "6px 14px", border: `1px solid ${CYAN}30`, borderRadius: 5, fontSize: 11, fontWeight: 700, color: CYAN, textDecoration: "none", transition: "all 0.3s", letterSpacing: "0.04em" }}>DEPLOY →</a>}
                      {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ padding: "6px 14px", border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 5, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", textDecoration: "none", transition: "all 0.2s", letterSpacing: "0.04em" }}>SOURCE</a>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {experience?.length > 0 && (
          <div style={{ padding: "60px 40px" }}>
            <div style={{ maxWidth: 1000, margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36 }}>
                <span style={{ height: 1, flex: 1, background: `linear-gradient(90deg, transparent, ${PINK}40, transparent)` }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: CYAN }}>CHRONOLOGY</span>
                <span style={{ height: 1, flex: 1, background: `linear-gradient(90deg, transparent, ${PINK}40, transparent)` }} />
              </div>
              {experience.map((e, i) => (
                <div key={i} style={{ display: "flex", gap: 24, marginBottom: 32, position: "relative" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20 }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: PINK, boxShadow: `0 0 20px ${PINK}50, 0 0 40px ${CYAN}20`, animation: "neonPulse 2s ease-in-out infinite", flexShrink: 0 }} />
                    {i < experience.length - 1 && <div style={{ width: 2, flex: 1, background: `linear-gradient(180deg, ${PINK}40, ${CYAN}20)` }} />}
                  </div>
                  <div style={{ flex: 1, paddingBottom: 24 }}>
                    <div style={{ fontSize: 11, color: CYAN, fontFamily: "monospace", fontWeight: 600, marginBottom: 4, letterSpacing: "0.04em" }}>[{e.duration}]</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{e.role}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: PINK, marginBottom: 8 }}>{e.company}{e.current && <span style={{ color: CYAN, marginLeft: 8, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em" }}>● ACTIVE</span>}</div>
                    {e.description && <p style={{ fontSize: 13, color: "rgba(224,208,255,0.4)", lineHeight: 1.7 }}>{e.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {certifications?.length > 0 && (
          <div style={{ padding: "40px 40px" }}>
            <div style={{ maxWidth: 1000, margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36 }}>
                <span style={{ height: 1, flex: 1, background: `linear-gradient(90deg, transparent, ${PINK}40, transparent)` }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: CYAN }}>CERTIFICATIONS</span>
                <span style={{ height: 1, flex: 1, background: `linear-gradient(90deg, transparent, ${PINK}40, transparent)` }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
                {certifications.map((c, i) => (
                  <div key={i} className="retro-card" style={{ border: `1px solid ${CYAN}15`, borderRadius: 10, padding: 20, background: `${CYAN}04`, transition: "all 0.3s" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{c.title}</div>
                    <div style={{ fontSize: 12, color: PINK, fontWeight: 600 }}>{c.issuer}{c.date && ` · ${c.date}`}</div>
                    {c.credentialUrl && <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: CYAN, marginTop: 8, display: "block", textDecoration: "none", fontWeight: 600 }}>Verify →</a>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {achievements?.length > 0 && (
          <div style={{ padding: "40px 40px" }}>
            <div style={{ maxWidth: 1000, margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36 }}>
                <span style={{ height: 1, flex: 1, background: `linear-gradient(90deg, transparent, ${PINK}40, transparent)` }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: CYAN }}>ACHIEVEMENTS</span>
                <span style={{ height: 1, flex: 1, background: `linear-gradient(90deg, transparent, ${PINK}40, transparent)` }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                {achievements.map((a, i) => (
                  <div key={i} className="retro-card" style={{ border: `1px solid ${PINK}15`, borderRadius: 10, padding: 24, textAlign: "center", background: `rgba(255,0,110,0.03)`, transition: "all 0.3s" }}>
                    <div style={{ fontSize: 34, marginBottom: 12 }}>{a.icon || "★"}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 6 }}>{a.title}</div>
                    {a.description && <div style={{ fontSize: 12, color: "rgba(224,208,255,0.4)", lineHeight: 1.6 }}>{a.description}</div>}
                    {a.date && <div style={{ fontSize: 11, color: CYAN, marginTop: 8, fontFamily: "monospace" }}>{a.date}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {codingProfiles?.length > 0 && (
          <div style={{ padding: "40px 40px" }}>
            <div style={{ maxWidth: 1000, margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36 }}>
                <span style={{ height: 1, flex: 1, background: `linear-gradient(90deg, transparent, ${PINK}40, transparent)` }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: CYAN }}>NETWORK NODES</span>
                <span style={{ height: 1, flex: 1, background: `linear-gradient(90deg, transparent, ${PINK}40, transparent)` }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
                {codingProfiles.map((p, i) => (
                  <a key={i} href={p.url || "#"} target="_blank" rel="noopener noreferrer" className="retro-card"
                    style={{ border: `1px solid ${CYAN}15`, borderRadius: 10, padding: 18, textDecoration: "none", color: TEXT, display: "block", background: `${CYAN}04`, transition: "all 0.3s" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 2 }}>{p.platform}</div>
                    {p.username && <div style={{ fontSize: 12, color: PINK, fontFamily: "monospace", fontWeight: 600 }}>@{p.username}</div>}
                    {(p.rating || p.solved) && <div style={{ fontSize: 11, color: "rgba(224,208,255,0.35)", marginTop: 4 }}>{p.rating && `Rating: ${p.rating}`}{p.solved && ` · ${p.solved}`}</div>}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        <div id="contact" style={{ padding: "80px 40px", textAlign: "center" }}>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, lineHeight: 1.0, marginBottom: 16, background: `linear-gradient(135deg, ${PINK}, ${CYAN})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Let's connect.
            </h2>
            <p style={{ fontSize: 15, color: "rgba(224,208,255,0.4)", marginBottom: 36 }}>Connect with me through the links below.</p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              {contact?.email && <a href={`mailto:${contact.email}`} className="retro-btn" style={{ padding: "14px 32px", border: `1px solid ${PINK}`, borderRadius: 8, color: PINK, fontSize: 14, fontWeight: 700, textDecoration: "none", background: `${PINK}06`, boxShadow: `0 0 20px ${PINK}20`, transition: "all 0.3s" }}>✉ {contact.email}</a>}
              {socials.filter(s => s.label !== "Email").slice(0, 2).map(s => <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="retro-btn" style={{ padding: "14px 28px", border: `1px solid ${CYAN}30`, borderRadius: 8, color: CYAN, fontSize: 13, fontWeight: 600, textDecoration: "none", background: `${CYAN}06`, transition: "all 0.3s" }}>{s.label}</a>)}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", padding: "24px", color: "rgba(224,208,255,0.15)", fontSize: 11, fontFamily: "monospace", letterSpacing: "0.08em" }}>
          [ {name} // {new Date().getFullYear()} // SYNTHWAVE MODE ]
        </div>
      </div>
    </div>
  );
};

export default RetroWaveTheme;
