import React from "react";

const WALL = "#1A1A1A";
const GOLD = "#C9A84C";
const LIGHT = "#FFF8E7";
const TEXT = "#E8DDD0";
const MUTED = "#8A8078";

const MuseumTheme = ({ data }) => {
  const { name, title, about, avatarUrl, skills, projects, experience,
    certifications, achievements, codingProfiles, contact, socialLinks, themeColors = {} } = data;
  const GOLD = themeColors.accent || "#C9A84C";
  const WALL = themeColors.bg || "#1A1A1A";
  const TEXT = themeColors.text || "#E8DDD0";

  const socials = [
    { href: socialLinks?.github, label: "GitHub" },
    { href: socialLinks?.linkedin, label: "LinkedIn" },
    { href: socialLinks?.twitter, label: "Twitter" },
    { href: socialLinks?.website, label: "Website" },
    { href: contact?.email ? `mailto:${contact.email}` : null, label: "Email" },
  ].filter(s => s.href);

  const frame = {
    background: "#111111",
    border: "6px solid #3A3A3A",
    outline: "1px solid #555555",
    boxShadow: "0 0 40px rgba(0,0,0,0.5), inset 0 0 30px rgba(0,0,0,0.3)",
    padding: 20,
    transition: "box-shadow 0.5s, transform 0.4s",
    cursor: "default",
  };

  return (
    <div style={{ minHeight: "100vh", background: WALL, fontFamily: "'Playfair Display', 'Georgia', serif", color: LIGHT, position: "relative" }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .artwork:hover { box-shadow: 0 0 60px rgba(201,168,76,0.18), 0 0 120px rgba(201,168,76,0.1) !important; transform: scale(1.02); z-index: 10; }
      `}</style>
      <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ textAlign: "center", padding: "48px 0 32px", borderBottom: `1px solid ${GOLD}20` }}>
          <div style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD, marginBottom: 12, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>The Gallery of</div>
          <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 300, margin: 0, letterSpacing: "0.08em", fontStyle: "italic", color: LIGHT }}>{name}</h1>
          {title && <div style={{ fontSize: 12, color: MUTED, marginTop: 14, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif" }}>{title}</div>}
        </div>

        {about && (
          <div style={{ padding: "44px 0", display: "flex", gap: 36, alignItems: "center", borderBottom: `1px solid ${GOLD}15` }}>
            {avatarUrl && (
              <div style={{ ...frame, width: 130, height: 130, borderRadius: "50%", padding: 6, flexShrink: 0, border: "4px solid #3A3A3A", outline: "1px solid #555555" }}>
                <img src={avatarUrl} alt={name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                  onError={e => e.target.style.display = "none"} />
              </div>
            )}
            <div>
              <div style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, fontFamily: "'Inter', sans-serif", marginBottom: 10, fontWeight: 600 }}>Artist Statement</div>
              <p style={{ fontSize: 15, lineHeight: 2, margin: 0, color: TEXT, fontStyle: "italic" }}>{about}</p>
            </div>
          </div>
        )}

        {skills?.length > 0 && (
          <div style={{ padding: "40px 0", borderBottom: `1px solid ${GOLD}15` }}>
            <div style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, fontFamily: "'Inter', sans-serif", marginBottom: 20, fontWeight: 600 }}>Mediums and Techniques</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {skills.map((s, i) => (
                <span key={i} style={{
                  padding: "8px 20px", border: `1px solid ${GOLD}30`, fontSize: 12, color: TEXT,
                  letterSpacing: "0.05em", fontFamily: "'Inter', sans-serif", cursor: "default",
                  transition: "0.3s",
                }}>
                  <span style={{ color: GOLD, marginRight: 6, fontSize: 10 }}>--</span>
                  {s}
                </span>
              ))}
            </div>
            <div style={{ marginTop: 12, fontSize: 10, color: MUTED, fontStyle: "italic" }}>
              {skills.length} mediums in repertoire
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 28, padding: "20px 0", borderBottom: `1px solid ${GOLD}15`, flexWrap: "wrap" }}>
          <div style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, fontFamily: "'Inter', sans-serif", fontWeight: 600, marginRight: 12 }}>Curator Contacts:</div>
          {socials.map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, fontWeight: 700, color: GOLD, textDecoration: "none", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", transition: "0.2s" }}>{s.label}</a>
          ))}
        </div>

        {projects?.length > 0 && (
          <div style={{ padding: "44px 0", borderBottom: `1px solid ${GOLD}15` }}>
            <h2 style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, fontFamily: "'Inter', sans-serif", margin: "0 0 36px", textAlign: "center", fontWeight: 600 }}>Featured Works</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 40 }}>
              {projects.map((p, i) => (
                <div key={i} className="artwork" style={frame}>
                  {p.image && <img src={p.image} alt={p.title} style={{ width: "100%", height: "auto", maxHeight: 200, borderRadius: 0, marginBottom: 14, border: "2px solid #C9A84C", outline: "1px solid #555", objectFit: "cover" }} />}
                  <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, fontFamily: "'Inter', sans-serif", marginBottom: 10, fontWeight: 600 }}>Exhibit {String(i + 1).padStart(2, "0")}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 300, margin: "0 0 14px", fontStyle: "italic", color: LIGHT }}>{p.title}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.8, color: MUTED, margin: "0 0 14px" }}>{p.description}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                    {p.techStack?.map((t, j) => (
                      <span key={j} style={{ fontSize: 10, fontFamily: "'Inter', sans-serif", color: GOLD, border: `1px solid ${GOLD}25`, padding: "3px 10px" }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ marginTop: 14, padding: "10px 16px", background: "rgba(0,0,0,0.4)", borderLeft: `2px solid ${GOLD}`, fontSize: 12, color: MUTED, fontFamily: "'Inter', sans-serif" }}>
                    <div style={{ display: "flex", gap: 16 }}>
                      {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ color: GOLD, textDecoration: "none", fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600 }}>View Exhibit</a>}
                      {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ color: MUTED, textDecoration: "none", fontFamily: "'Inter', sans-serif", fontSize: 11 }}>Source</a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {experience?.length > 0 && (
          <div style={{ padding: "44px 0", borderBottom: `1px solid ${GOLD}15` }}>
            <h2 style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, fontFamily: "'Inter', sans-serif", margin: "0 0 8px", textAlign: "center", fontWeight: 600 }}>Career Retrospective</h2>
            <p style={{ fontSize: 11, color: MUTED, fontStyle: "italic", textAlign: "center", marginBottom: 28, maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
              A curated collection of professional engagements
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {experience.map((e, i) => (
                <div key={i} style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
                  <div style={{ fontSize: 10, color: GOLD, fontFamily: "'Inter', sans-serif", minWidth: 130, textAlign: "right", letterSpacing: "0.05em", fontWeight: 600, paddingTop: 4 }}>{e.duration}</div>
                  <div style={{ flex: 1, borderLeft: `1px solid ${GOLD}40`, paddingLeft: 28, position: "relative" }}>
                    <div style={{ position: "absolute", left: -5, top: 6, width: 9, height: 9, borderRadius: "50%", background: GOLD }} />
                    <div style={{ fontSize: 18, fontWeight: 300, fontStyle: "italic", marginBottom: 2, color: LIGHT }}>{e.role}</div>
                    <div style={{ fontSize: 11, color: GOLD, fontFamily: "'Inter', sans-serif", marginBottom: 10, fontWeight: 600 }}>{e.company}{e.current && " - Present"}</div>
                    {e.description && <p style={{ fontSize: 13, lineHeight: 1.8, color: MUTED, margin: 0 }}>{e.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ padding: "44px 0", borderBottom: `1px solid ${GOLD}15`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }}>
          {certifications?.length > 0 && (
            <div>
              <h3 style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, fontFamily: "'Inter', sans-serif", marginBottom: 16, fontWeight: 600, borderBottom: `1px solid ${GOLD}20`, paddingBottom: 8 }}>
                Certifications ({certifications.length})
              </h3>
              <p style={{ fontSize: 10, color: MUTED, fontStyle: "italic", marginBottom: 14 }}>Verified credentials and qualifications.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {certifications.map((c, i) => (
                  <div key={i} style={{ padding: 14, border: `1px solid ${GOLD}15` }}>
                    <div style={{ fontSize: 14, fontStyle: "italic", marginBottom: 4, color: LIGHT }}>{c.title}</div>
                    <div style={{ fontSize: 10, color: GOLD, fontFamily: "'Inter', sans-serif" }}>{c.issuer} - {c.date}</div>
                    {c.credentialUrl && <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: MUTED, textDecoration: "none", fontFamily: "'Inter', sans-serif", marginTop: 6, display: "inline-block", borderBottom: `1px solid ${GOLD}30` }}>View Credential</a>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {achievements?.length > 0 && (
            <div>
              <h3 style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, fontFamily: "'Inter', sans-serif", marginBottom: 16, fontWeight: 600, borderBottom: `1px solid ${GOLD}20`, paddingBottom: 8 }}>
                Honors and Awards ({achievements.length})
              </h3>
              <p style={{ fontSize: 10, color: MUTED, fontStyle: "italic", marginBottom: 14 }}>Recognitions and accolades.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {achievements.map((a, i) => (
                  <div key={i} style={{ padding: 14, border: `1px solid ${GOLD}15` }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{a.icon || "Trophy"}</div>
                    <div style={{ fontSize: 14, fontStyle: "italic", marginBottom: 2, color: LIGHT }}>{a.title}</div>
                    {a.description && <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.7 }}>{a.description}</div>}
                    {a.date && <div style={{ fontSize: 9, color: GOLD, marginTop: 8, fontFamily: "'Inter', sans-serif" }}>Year: {a.date}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {codingProfiles?.length > 0 && (
          <div style={{ padding: "44px 0", borderBottom: `1px solid ${GOLD}15` }}>
            <h3 style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, fontFamily: "'Inter', sans-serif", marginBottom: 20, fontWeight: 600 }}>Digital Galleries - Online Presence</h3>
            <p style={{ fontSize: 11, color: MUTED, fontStyle: "italic", marginBottom: 20, maxWidth: 500 }}>Visit my online portfolios on various coding platforms.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
              {codingProfiles.map((p, i) => (
                <a key={i} href={p.url || "#"} target="_blank" rel="noopener noreferrer" style={{ color: LIGHT, textDecoration: "none", border: `1px solid ${GOLD}20`, padding: 18, display: "block", transition: "0.2s", cursor: "pointer" }}>
                  <div style={{ fontSize: 14, marginBottom: 4, fontStyle: "italic" }}>{p.platform}</div>
                  <div style={{ fontSize: 11, color: GOLD, fontFamily: "'Inter', sans-serif", fontStyle: "normal" }}>@{p.username}</div>
                  {(p.rating || p.solved) && <div style={{ fontSize: 10, color: MUTED, marginTop: 6, fontStyle: "normal", fontFamily: "'Inter', sans-serif" }}>{p.rating && `Rating: ${p.rating}`}{p.rating && p.solved && " - "}{p.solved && `${p.solved} solved`}</div>}
                  <div style={{ marginTop: 8, fontSize: 9, color: GOLD, fontStyle: "normal", fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>Visit Gallery</div>
                </a>
              ))}
            </div>
          </div>
        )}

        <div style={{ padding: "44px 0", textAlign: "center" }}>
          <h3 style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, fontFamily: "'Inter', sans-serif", marginBottom: 10, fontWeight: 600 }}>Contact the Curator</h3>
          <p style={{ fontSize: 13, color: MUTED, fontStyle: "italic", marginBottom: 28 }}>Find my contact links below.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
            {contact?.email && (
              <a href={`mailto:${contact.email}`} style={{ padding: "12px 30px", border: `1px solid ${GOLD}`, color: GOLD, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", fontFamily: "'Inter', sans-serif", fontWeight: 600, transition: "0.3s" }}>Send Correspondence</a>
            )}
            {socialLinks?.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" style={{ padding: "12px 30px", border: `1px solid rgba(255,255,255,0.15)`, color: MUTED, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", fontFamily: "'Inter', sans-serif" }}>LinkedIn</a>
            )}
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${GOLD}15`, padding: "16px 0", fontSize: 9, color: "rgba(255,248,231,0.2)", display: "flex", justifyContent: "space-between", fontFamily: "'Inter', sans-serif", letterSpacing: "0.05em" }}>
          <span>(c) {new Date().getFullYear()} {name} Estate</span>
        </div>
      </div>
    </div>
  );
};

export default MuseumTheme;
