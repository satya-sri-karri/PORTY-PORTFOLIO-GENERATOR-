import React, { useState } from "react";

const BrutalistTheme = ({ data }) => {
  const { name, title, about, avatarUrl, skills, projects, experience,
    certifications, achievements, codingProfiles, contact, socialLinks, themeColors = {} } = data;

  const [hovered, setHovered] = useState(false);

  const socials = [
    { href: socialLinks?.github, label: "GITHUB" },
    { href: socialLinks?.linkedin, label: "LINKEDIN" },
    { href: socialLinks?.twitter, label: "TWITTER" },
    { href: socialLinks?.website, label: "WEBSITE" },
    { href: contact?.email ? `mailto:${contact.email}` : null, label: "EMAIL" },
  ].filter(s => s.href);

  const ACCENT = themeColors.accent || "#FF0000";
  const BG = themeColors.bg || "#F5F5F5";
  const TEXT = themeColors.text || "#000";
  const RED = ACCENT;
  const BLACK = TEXT;
  const WHITE = BG;
  const BORDER = `4px solid ${BLACK}`;

  return (
    <div style={{ minHeight: "100vh", background: WHITE, fontFamily: "'Arial Black', 'Impact', sans-serif", color: BLACK, overflowX: "hidden" }}>
      <style>{`
        @keyframes brutalMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .brut-btn:hover { background: ${RED} !important; color: ${WHITE} !important; transform: translate(-4px,-4px) !important; box-shadow: 8px 8px 0 ${BLACK} !important; }
        .brut-card:hover { transform: translate(-5px,-5px) !important; box-shadow: 10px 10px 0 ${BLACK} !important; }
        .brut-skill:hover { background: ${BLACK} !important; color: ${WHITE} !important; }
        .brut-social:hover { background: ${BLACK} !important; color: ${WHITE} !important; }
      `}</style>

      <nav style={{ borderBottom: BORDER, padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", background: WHITE, position: "sticky", top: 0, zIndex: 100 }}>
        <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.04em", textTransform: "uppercase" }}>{name}</span>
        <div style={{ display: "flex", gap: 0 }}>
          {socials.slice(0, 3).map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="brut-social"
              style={{ padding: "8px 16px", borderLeft: `3px solid ${BLACK}`, fontSize: 11, fontWeight: 900, letterSpacing: "0.1em", textDecoration: "none", color: BLACK, transition: "all 0.1s" }}>
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      <div style={{ borderBottom: BORDER, borderTop: BORDER, background: RED, overflow: "hidden", padding: "12px 0" }}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <div style={{ display: "flex", whiteSpace: "nowrap", animation: `brutalMarquee 20s linear infinite`, animationPlayState: hovered ? "paused" : "running" }}>
          {[...Array(8)].map((_, i) => (
            <span key={i} style={{ fontSize: 14, fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase", color: WHITE, paddingRight: 48 }}>
              {name} — {title || "DEVELOPER"} — PORTFOLIO {new Date().getFullYear()} — ★
            </span>
          ))}
        </div>
      </div>

      <div style={{ padding: "60px 32px", borderBottom: BORDER, display: "grid", gridTemplateColumns: avatarUrl ? "1fr auto" : "1fr", gap: 40, alignItems: "end" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase", color: "#AAA", marginBottom: 16, borderLeft: `6px solid ${RED}`, paddingLeft: 14 }}>
            MY PORTFOLIO
          </div>
          <h1 style={{ fontSize: "clamp(4rem, 12vw, 10rem)", fontWeight: 900, lineHeight: 0.82, letterSpacing: "-0.06em", textTransform: "uppercase", marginBottom: 28, wordBreak: "break-word" }}>
            {name.split(" ").map((word, i) => (
              <div key={i} style={{ marginTop: i > 0 ? -8 : 0 }}>{word}</div>
            ))}
          </h1>
          {title && (
            <div style={{ display: "inline-block", background: BLACK, color: WHITE, padding: "8px 20px", fontSize: 13, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 24 }}>
              {title}
            </div>
          )}
          <p style={{ fontSize: 18, lineHeight: 1.6, maxWidth: 560, color: "#444", fontFamily: "'Arial', sans-serif", fontWeight: 400, marginBottom: 32 }}>{about}</p>
          <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
            {contact?.email && (
              <a href={`mailto:${contact.email}`} className="brut-btn"
                style={{ padding: "16px 32px", background: BLACK, color: WHITE, fontSize: 13, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", border: BORDER, transition: "all 0.1s", boxShadow: `6px 6px 0 #CCC` }}>
                CONTACT ME
              </a>
            )}
            {socialLinks?.github && (
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="brut-btn"
                style={{ padding: "16px 32px", background: WHITE, color: BLACK, fontSize: 13, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", border: BORDER, marginLeft: -4, transition: "all 0.1s", boxShadow: `6px 6px 0 #CCC` }}>
                GITHUB
              </a>
            )}
          </div>
        </div>
        {avatarUrl && (
          <div style={{ border: BORDER, boxShadow: "10px 10px 0 #000", flexShrink: 0 }}>
            <img src={avatarUrl} alt={name} onError={e => e.target.style.display = "none"}
              style={{ width: 220, height: 220, objectFit: "cover", display: "block", filter: "grayscale(30%)" }} />
          </div>
        )}
      </div>

      {skills?.length > 0 && (
        <div style={{ padding: "48px 32px", borderBottom: BORDER }}>
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 28, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 24, height: 4, background: RED }} />
            SKILLS
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {skills.map((s, i) => (
              <span key={i} className="brut-skill" style={{ padding: "10px 20px", border: `3px solid ${BLACK}`, fontSize: 13, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", cursor: "default", transition: "all 0.1s", background: WHITE, color: BLACK }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {projects?.length > 0 && (
        <div style={{ padding: "48px 32px", borderBottom: BORDER }}>
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 36, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 24, height: 4, background: RED }} />
            PROJECTS
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {projects.map((p, i) => (
              <div key={i} className="brut-card" style={{ border: BORDER, padding: 28, background: i % 2 === 0 ? WHITE : BLACK, color: i % 2 === 0 ? BLACK : WHITE, boxShadow: "6px 6px 0 #CCC", transition: "all 0.1s", position: "relative", overflow: "hidden" }}>
                  {p.image && (
                    <img src={p.image} alt={p.title}
                      style={{
                        width: "100%",
                        height: 180,
                        objectFit: "cover",
                        borderRadius: 0,
                        border: "4px solid #000",
                        marginBottom: 16,
                      }}
                    />
                  )}
                  <div style={{ position: "absolute", top: 0, left: 0, width: 6, height: "100%", background: RED }} />
                <div style={{ fontSize: 40, fontWeight: 900, color: i % 2 === 0 ? "#E0E0E0" : "#333", marginBottom: 8, lineHeight: 1 }}>0{i + 1}</div>
                <h3 style={{ fontSize: 22, fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: 12 }}>{p.title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: i % 2 === 0 ? "#555" : "#AAA", fontFamily: "'Arial', sans-serif", fontWeight: 400, marginBottom: 16 }}>{p.description}</p>
                {p.techStack?.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                    {p.techStack.map((t, j) => <span key={j} style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.1em", color: RED, textTransform: "uppercase" }}>{t}</span>)}
                  </div>
                )}
                <div style={{ display: "flex", gap: 16 }}>
                  {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, fontWeight: 900, textDecoration: "none", color: i % 2 === 0 ? BLACK : WHITE, borderBottom: `3px solid ${RED}`, paddingBottom: 2, textTransform: "uppercase", letterSpacing: "0.08em" }}>LIVE ↗</a>}
                  {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, fontWeight: 900, textDecoration: "none", color: i % 2 === 0 ? "#888" : "#888", textTransform: "uppercase", letterSpacing: "0.08em" }}>CODE</a>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {experience?.length > 0 && (
        <div style={{ padding: "48px 32px", borderBottom: BORDER }}>
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 36, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 24, height: 4, background: RED }} />
            EXPERIENCE
          </div>
          {experience.map((e, i) => (
            <div key={i} style={{ borderTop: `3px solid ${BLACK}`, padding: "28px 0", display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "start" }}>
              <div>
                <h3 style={{ fontSize: 26, fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.03em", marginBottom: 6 }}>{e.role}</h3>
                <div style={{ fontSize: 14, fontWeight: 900, color: RED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>{e.company}{e.current && " ← CURRENT"}</div>
                {e.description && <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, fontFamily: "'Arial', sans-serif", fontWeight: 400 }}>{e.description}</p>}
              </div>
              <div style={{ fontSize: 11, fontWeight: 900, color: "#999", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "right", whiteSpace: "nowrap", fontFamily: "monospace" }}>{e.duration}</div>
            </div>
          ))}
        </div>
      )}

      {certifications?.length > 0 && (
        <div style={{ padding: "48px 32px", borderBottom: BORDER }}>
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 32, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 24, height: 4, background: RED }} />
            CERTIFIED
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {certifications.map((c, i) => (
              <div key={i} style={{ border: `3px solid ${BLACK}`, padding: "18px 22px" }}>
                <div style={{ fontSize: 14, fontWeight: 900, textTransform: "uppercase", marginBottom: 6 }}>{c.title}</div>
                <div style={{ fontSize: 12, color: "#555", fontFamily: "'Arial', sans-serif", fontWeight: 400 }}>{c.issuer}{c.date && ` · ${c.date}`}</div>
                {c.credentialUrl && <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: RED, marginTop: 8, display: "block", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", textDecoration: "none" }}>VERIFY ↗</a>}
              </div>
            ))}
          </div>
        </div>
      )}

      {achievements?.length > 0 && (
        <div style={{ padding: "48px 32px", borderBottom: BORDER, background: BLACK }}>
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 32, color: WHITE, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 24, height: 4, background: RED }} />
            WINS
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {achievements.map((a, i) => (
              <div key={i} style={{ border: `3px solid #333`, padding: 24, color: WHITE }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{a.icon || "🏆"}</div>
                <div style={{ fontSize: 15, fontWeight: 900, textTransform: "uppercase", marginBottom: 8 }}>{a.title}</div>
                {a.description && <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6, fontFamily: "'Arial', sans-serif" }}>{a.description}</div>}
                {a.date && <div style={{ fontSize: 11, color: RED, marginTop: 8, fontWeight: 900 }}>{a.date}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {codingProfiles?.length > 0 && (
        <div style={{ padding: "48px 32px", borderBottom: BORDER }}>
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 28, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 24, height: 4, background: RED }} />
            CODE PLATFORMS
          </div>
          <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
            {codingProfiles.map((p, i) => (
              <a key={i} href={p.url || "#"} target="_blank" rel="noopener noreferrer"
                style={{ padding: "16px 24px", border: BORDER, marginRight: -3, textDecoration: "none", color: BLACK }}>
                <div style={{ fontSize: 14, fontWeight: 900, textTransform: "uppercase" }}>{p.platform}</div>
                {p.username && <div style={{ fontSize: 11, color: RED, fontFamily: "monospace", fontWeight: 900, marginTop: 4 }}>@{p.username}</div>}
                {(p.rating || p.solved) && <div style={{ fontSize: 11, color: "#888", marginTop: 4, fontWeight: 700 }}>{p.rating && `RATING: ${p.rating}`}{p.solved && ` · ${p.solved} SOLVED`}</div>}
              </a>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding: "80px 32px", background: RED }}>
        <h2 style={{ fontSize: "clamp(3.5rem, 12vw, 9rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.05em", color: WHITE, lineHeight: 0.85, marginBottom: 32, wordBreak: "break-word" }}>
          LET'S<br />TALK.
        </h2>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {contact?.email && <a href={`mailto:${contact.email}`} className="brut-btn" style={{ padding: "16px 32px", background: WHITE, color: RED, fontSize: 14, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", border: `3px solid ${WHITE}`, transition: "all 0.1s", boxShadow: "6px 6px 0 rgba(0,0,0,0.2)" }}>{contact.email}</a>}
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "16px 32px", borderTop: BORDER, fontSize: 11, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {name} · BUILT WITH BRUTALISM · {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default BrutalistTheme;
