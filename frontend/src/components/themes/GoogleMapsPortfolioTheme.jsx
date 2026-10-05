import React from "react";

const RED = "#EA4335";
const YELLOW = "#FBBC05";
const GREEN = "#34A853";
const BLUE = "#4285F4";
const NAVY = "#1A2332";
const CARD_BG = "#1E2A3A";
const TEXT = "#E8EAED";
const MUTED = "#9AA0A6";

const GoogleMapsPortfolioTheme = ({ data }) => {
  const { name, title, about, avatarUrl, skills, projects, experience,
    certifications, achievements, codingProfiles, contact, socialLinks, themeColors = {} } = data;
  const RED = themeColors.accent || "#EA4335";
  const NAVY = themeColors.bg || "#1A2332";
  const TEXT = themeColors.text || "#E8EAED";

  const socials = [
    { href: socialLinks?.github, label: "GitHub" },
    { href: socialLinks?.linkedin, label: "LinkedIn" },
    { href: socialLinks?.twitter, label: "Twitter" },
    { href: socialLinks?.website, label: "Website" },
    { href: contact?.email ? `mailto:${contact.email}` : null, label: "Email" },
  ].filter(s => s.href);

  const Pin = ({ color }) => (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 22, height: 22, borderRadius: "50% 50% 50% 0", background: color,
      transform: "rotate(-45deg)", marginRight: 10, flexShrink: 0, fontSize: 10, color: "#fff", fontWeight: 700,
    }}>📍</span>
  );

  const sectionPin = (color) => ({
    display: "flex", alignItems: "center", gap: 8, marginBottom: 20,
    borderBottom: `1px solid rgba(255,255,255,0.06)`, paddingBottom: 12,
  });

  return (
    <div style={{ minHeight: "100vh", background: NAVY, fontFamily: "'Space Grotesk', 'Inter', sans-serif", color: TEXT, position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 960, margin: "0 auto", padding: "0 28px" }}>
        <div style={{ padding: "28px 0", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ display: "flex", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: RED }} />
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: YELLOW }} />
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN }} />
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: BLUE }} />
          </span>
          <span style={{ color: MUTED, fontSize: 13, fontWeight: 500 }}>Google Maps</span>
          <span style={{ color: MUTED, fontSize: 11 }}>/ Portfolio</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
        </div>

        <div style={{ padding: "40px 0 32px", display: "flex", alignItems: "center", gap: 24 }}>
          {avatarUrl && (
            <img src={avatarUrl} alt={name} style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.12)" }}
              onError={e => e.target.style.display = "none"} />
          )}
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#FFF", margin: "0 0 4px 0" }}>{name}</h1>
            {title && <div style={{ fontSize: 14, color: MUTED, marginBottom: 8 }}>{title}</div>}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ color: BLUE, fontSize: 12, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 10 }}>📍</span> {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {about && (
          <div style={{ padding: "20px 24px", marginBottom: 8, background: CARD_BG, borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)", fontSize: 14, lineHeight: 1.7, color: MUTED }}>
            <span style={{ color: BLUE, fontWeight: 600 }}>About</span>
            <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.7)" }}>{about}</p>
          </div>
        )}

        {skills?.length > 0 && (
          <div style={{ padding: "32px 0" }}>
            <div style={sectionPin()}>
              <Pin color={GREEN} />
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#FFF" }}>Skills</h2>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {skills.map((s, i) => (
                <span key={i} style={{ padding: "10px 16px", background: CARD_BG, border: `1px solid ${BLUE}40`, borderRadius: 8, color: TEXT }}>{typeof s === "string" ? s : s.name || ""}</span>
              ))}
            </div>
          </div>
        )}

        {projects?.length > 0 && (
          <div style={{ padding: "32px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={sectionPin()}>
              <Pin color={RED} />
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#FFF" }}>Places — Projects</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {projects.map((p, i) => (
                <div key={i} style={{ background: CARD_BG, borderRadius: 12, padding: 20, border: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: `rgba(66,133,244,0.12)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20 }}>📍</div>
                  <div style={{ flex: 1 }}>
                    {p.image && <img src={p.image} alt={p.title} style={{ width: "100%", height: "auto", maxHeight: 200, borderRadius: 8, marginBottom: 12, objectFit: "cover" }} />}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#FFF" }}>{p.title}</h3>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.55)", marginBottom: 12 }}>{p.description}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", fontSize: 12 }}>
                      {p.techStack?.length > 0 && (
                        <span style={{ color: YELLOW, fontSize: 11 }}>
                          {p.techStack.join(" · ")}
                        </span>
                      )}
                      <div style={{ display: "flex", gap: 12, marginLeft: "auto" }}>
                        {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ color: BLUE, textDecoration: "none", fontSize: 12, fontWeight: 600 }}>View project ↗</a>}
                        {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ color: MUTED, textDecoration: "none", fontSize: 12 }}>Source</a>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {experience?.length > 0 && (
          <div style={{ padding: "32px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={sectionPin()}>
              <Pin color={BLUE} />
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#FFF" }}>My Journey</h2>
            </div>
            <div style={{ position: "relative", paddingLeft: 32 }}>
              <div style={{ position: "absolute", left: 14, top: 8, bottom: 8, width: 2, borderLeft: `2px dotted ${BLUE}40` }} />
              {experience.map((e, i) => (
                <div key={i} style={{ display: "flex", gap: 16, marginBottom: 28, position: "relative" }}>
                  <div style={{ position: "absolute", left: -24, top: 4, width: 14, height: 14, borderRadius: "50%", background: BLUE, border: "3px solid rgba(66,133,244,0.2)" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: MUTED, marginBottom: 4, letterSpacing: "0.03em" }}>{e.duration}</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "#FFF", marginBottom: 2 }}>{e.role}</div>
                    <div style={{ fontSize: 13, color: GREEN, marginBottom: 8, fontWeight: 500 }}>{e.company}{e.current && " · Present"}</div>
                    {e.description && <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{e.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {certifications?.length > 0 && (
          <div style={{ padding: "32px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={sectionPin()}>
              <Pin color={YELLOW} />
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#FFF" }}>Certifications</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
              {certifications.map((c, i) => (
                <div key={i} style={{ background: CARD_BG, borderRadius: 10, padding: 18, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ color: YELLOW, fontSize: 16 }}>🏅</span>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#FFF" }}>{c.title}</div>
                  </div>
                  {c.issuer && <div style={{ fontSize: 12, color: MUTED }}>{c.issuer} · {c.date}</div>}
                  {c.credentialUrl && <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ color: BLUE, fontSize: 11, textDecoration: "none", marginTop: 8, display: "inline-block" }}>Verify ↗</a>}
                </div>
              ))}
            </div>
          </div>
        )}

        {achievements?.length > 0 && (
          <div style={{ padding: "32px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={sectionPin()}>
              <Pin color={GREEN} />
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#FFF" }}>Achievements</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
              {achievements.map((a, i) => (
                <div key={i} style={{ background: CARD_BG, borderRadius: 10, padding: 18, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{a.icon || "🏆"}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#FFF", marginBottom: 4 }}>{a.title}</div>
                  {a.description && <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>{a.description}</div>}
                  {a.date && <div style={{ fontSize: 10, color: MUTED, marginTop: 8 }}>{a.date}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {codingProfiles?.length > 0 && (
          <div style={{ padding: "32px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={sectionPin()}>
              <Pin color={BLUE} />
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#FFF" }}>Coding Profiles</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
              {codingProfiles.map((p, i) => (
                <a key={i} href={p.url || "#"} target="_blank" rel="noopener noreferrer" style={{ background: CARD_BG, borderRadius: 10, padding: 16, border: "1px solid rgba(255,255,255,0.06)", textDecoration: "none", display: "block" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#FFF", marginBottom: 2 }}>{p.platform}</div>
                  {p.username && <div style={{ fontSize: 12, color: MUTED }}>@{p.username}</div>}
                  {(p.rating || p.solved) && (
                    <div style={{ fontSize: 11, color: YELLOW, marginTop: 6 }}>
                      {p.rating && `Rating: ${p.rating}`}{p.rating && p.solved && " · "}{p.solved && `${p.solved} solved`}
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        <div style={{ padding: "40px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={sectionPin()}>
            <Pin color={RED} />
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#FFF" }}>Info Desk — Contact</h2>
          </div>
          <div style={{ background: CARD_BG, borderRadius: 12, padding: 24, border: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: MUTED }}>Contact me through the links below.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              {contact?.email && (
                <a href={`mailto:${contact.email}`} style={{ padding: "12px 24px", background: BLUE, color: "#FFF", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
                  📧 {contact.email}
                </a>
              )}
              {contact?.phone && (
                <a href={`tel:${contact.phone}`} style={{ padding: "12px 24px", background: "rgba(255,255,255,0.06)", color: "#FFF", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 8 }}>
                  📞 {contact.phone}
                </a>
              )}
            </div>
          </div>
        </div>

        <div style={{ padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 11, color: "rgba(255,255,255,0.2)", display: "flex", justifyContent: "space-between" }}>
          <span>Map data © {new Date().getFullYear()} {name}</span>
          <span>🗺 Portfolio</span>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsPortfolioTheme;
