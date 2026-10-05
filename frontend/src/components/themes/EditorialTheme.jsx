import React from "react";

const EditorialTheme = ({ data }) => {
  const { name, title, about, avatarUrl, skills, projects, experience,
    certifications, achievements, codingProfiles, contact, socialLinks, themeColors = {} } = data;

  const socials = [
    { href: socialLinks?.github, label: "GitHub" },
    { href: socialLinks?.linkedin, label: "LinkedIn" },
    { href: socialLinks?.twitter, label: "Twitter" },
    { href: socialLinks?.website, label: "Website" },
    { href: contact?.email ? `mailto:${contact.email}` : null, label: "Email" },
  ].filter(s => s.href);

  const ACCENT = themeColors.accent || "#C84B31";
  const BG = themeColors.bg || "#F5F0E8";
  const TEXT = themeColors.text || "#1A1A1A";
  const RED = ACCENT;
  const OFF_WHITE = BG;
  const DARK = TEXT;

  const s = {
    page: { minHeight: "100vh", background: OFF_WHITE, fontFamily: "'Inter', sans-serif", color: DARK },
    nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 48px", borderBottom: "2px solid" + DARK, background: OFF_WHITE, position: "sticky", top: 0, zIndex: 100 },
    navName: { fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", color: DARK },
    navLinks: { display: "flex", gap: 24 },
    navLink: { fontSize: 11, fontFamily: "'Inter', sans-serif", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#888", textDecoration: "none", transition: "color 0.2s" },
    hero: { display: "grid", gridTemplateColumns: "1.2fr 1fr", minHeight: "85vh", borderBottom: "1px solid #D8CFC0" },
    heroLeft: { padding: "100px 48px 60px", borderRight: "1px solid #D8CFC0", display: "flex", flexDirection: "column", justifyContent: "flex-end" },
    heroRight: { padding: "100px 48px 60px", display: "flex", flexDirection: "column", justifyContent: "center" },
    issueLabel: { fontSize: 10, fontFamily: "'Inter', sans-serif", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#B0A890", marginBottom: 24 },
    h1: { fontSize: "clamp(3.5rem, 8vw, 7rem)", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.04em", color: DARK, marginBottom: 24, fontFamily: "'Playfair Display', 'Georgia', serif" },
    redAccent: { color: RED },
    heroTitle: { fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: 600, letterSpacing: "0.1em", color: RED, textTransform: "uppercase", marginBottom: 16 },
    heroAbout: { fontSize: 15, lineHeight: 1.85, color: "#555", maxWidth: 420, fontWeight: 300, fontFamily: "'Inter', sans-serif" },
    avatar: { width: 80, height: 80, borderRadius: "50%", objectFit: "cover", marginBottom: 24, border: "2px solid #D8CFC0" },
    section: { padding: "80px 48px", borderBottom: "1px solid #D8CFC0", maxWidth: 1100, margin: "0 auto" },
    sectionEyebrow: { fontSize: 10, fontFamily: "'Inter', sans-serif", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#B0A890", marginBottom: 32, display: "flex", alignItems: "center", gap: 16 },
    sectionRule: { flex: 1, height: 1, background: "#D8CFC0" },
    h2: { fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 0, fontFamily: "'Playfair Display', 'Georgia', serif" },
    categoryGrid: { display: "flex", flexDirection: "column", gap: 24, marginTop: 32 },
    categoryGroup: {},
    categoryLabel: { fontSize: 11, fontFamily: "'Inter', sans-serif", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: RED, borderBottom: "2px solid " + RED, paddingBottom: 6, marginBottom: 12, display: "inline-block" },
    skillsList: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8 },
    skillTag: { padding: "4px 14px", border: "1px solid #D8CFC0", fontSize: 12, fontFamily: "'Inter', sans-serif", color: "#666", background: "transparent" },
    projectGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 32, marginTop: 40 },
    projectCard: { borderBottom: "1px solid #D8CFC0", paddingBottom: 28, transition: "border-color 0.2s" },
    projectNum: { fontSize: 10, fontFamily: "'Inter', sans-serif", fontWeight: 600, letterSpacing: "0.12em", color: "#B0A890", marginBottom: 8 },
    projectTitle: { fontSize: 20, fontWeight: 700, marginBottom: 10, fontFamily: "'Playfair Display', 'Georgia', serif", color: DARK },
    projectDesc: { fontSize: 13, color: "#666", lineHeight: 1.75, fontFamily: "'Inter', sans-serif", marginBottom: 14, fontWeight: 300 },
    pullQuote: { fontSize: 14, fontFamily: "'Playfair Display', 'Georgia', serif", fontStyle: "italic", color: RED, borderLeft: "2px solid " + RED, paddingLeft: 16, margin: "16 0", lineHeight: 1.6 },
    techRow: { display: "flex", gap: 8, flexWrap: "wrap" },
    techItem: { fontSize: 11, fontFamily: "monospace", color: RED, fontWeight: 600 },
    expList: { display: "flex", flexDirection: "column", gap: 0, marginTop: 40 },
    expItem: { display: "grid", gridTemplateColumns: "140px 1fr", gap: 32, padding: "24px 0", borderBottom: "1px solid #E8E0D0" },
    expDate: { fontSize: 11, fontFamily: "monospace", color: "#B0A890", paddingTop: 4, fontWeight: 500 },
    expRole: { fontSize: 18, fontWeight: 700, marginBottom: 4, fontFamily: "'Playfair Display', 'Georgia', serif" },
    expCompany: { fontSize: 13, color: RED, fontWeight: 600, fontFamily: "'Inter', sans-serif", marginBottom: 8 },
    expDesc: { fontSize: 13, color: "#666", lineHeight: 1.7, fontFamily: "'Inter', sans-serif", fontWeight: 300 },
    contactSection: { padding: "100px 48px", textAlign: "center", maxWidth: 700, margin: "0 auto" },
    contactH2: { fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 700, letterSpacing: "-0.04em", marginBottom: 16, fontFamily: "'Playfair Display', 'Georgia', serif" },
    primaryBtn: { display: "inline-block", padding: "14px 36px", background: DARK, color: OFF_WHITE, fontSize: 12, fontFamily: "'Inter', sans-serif", fontWeight: 600, textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase", transition: "background 0.2s" },
    outlineBtn: { display: "inline-block", padding: "14px 36px", background: "transparent", color: DARK, border: "2px solid " + DARK, fontSize: 12, fontFamily: "'Inter', sans-serif", fontWeight: 600, textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase", transition: "all 0.2s" },
    subsection: { padding: "48px", borderBottom: "1px solid #D8CFC0", maxWidth: 1100, margin: "0 auto" },
  };

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <span style={s.navName}>{name}</span>
        <div style={s.navLinks}>
          {["Skills", "Work", "Experience", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={s.navLink}>{l}</a>
          ))}
        </div>
      </nav>

      <div style={s.hero}>
        <div style={s.heroLeft}>
          <div style={s.issueLabel}>Vol. I — {new Date().getFullYear()}</div>
          <h1 style={s.h1}>
            {name.split(" ")[0]}<br />
            <span style={s.redAccent}>{name.split(" ").slice(1).join(" ")}</span>
          </h1>
        </div>
        <div style={s.heroRight}>
          {avatarUrl && (
            <img src={avatarUrl} alt={name} style={s.avatar}
              onError={e => e.target.style.display = "none"} />
          )}
          {title && <div style={s.heroTitle}>{title}</div>}
          <p style={s.heroAbout}>{about}</p>
          <div style={{ display: "flex", gap: 20, marginTop: 28, flexWrap: "wrap" }}>
            {socials.map(soc => (
              <a key={soc.label} href={soc.href} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 11, fontFamily: "'Inter', sans-serif", color: RED, fontWeight: 600, textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {soc.label} →
              </a>
            ))}
          </div>
        </div>
      </div>

      {skills?.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionEyebrow}><span>Skills</span><div style={s.sectionRule} /></div>
          <div style={s.categoryGrid}>
            {[["Languages & Frameworks", skills], ["Tools", skills.slice().reverse()]].slice(0, 1).map(([label, items]) => (
              <div key={label} style={s.categoryGroup}>
                <div style={s.categoryLabel}>{label}</div>
                <div style={s.skillsList}>
                  {items.map((sk, i) => <span key={i} style={s.skillTag}>{sk}</span>)}
                </div>
              </div>
            ))}
            {skills.length > 0 && (
              <div style={s.categoryGroup}>
                <div style={s.categoryLabel}>Technologies</div>
                <div style={s.skillsList}>
                  {skills.slice().reverse().map((sk, i) => <span key={i} style={s.skillTag}>{sk}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {projects?.length > 0 && (
        <div id="work" style={s.section}>
          <div style={s.sectionEyebrow}><span>Work</span><div style={s.sectionRule} /></div>
          <div style={s.projectGrid}>
            {projects.map((p, i) => (
              <div key={i} style={s.projectCard}>
                {p.image && (
                  <img src={p.image} alt={p.title}
                    style={{
                      width: "100%",
                      height: 180,
                      objectFit: "cover",
                      borderRadius: 2,
                      marginBottom: 16,
                    }}
                  />
                )}
                <div style={s.projectNum}>No. 0{i + 1}</div>
                <h3 style={s.projectTitle}>{p.title}</h3>
                <p style={s.projectDesc}>{p.description}</p>
                <div style={s.pullQuote}>"{p.title} — a story of craft and code."</div>
                <div style={s.techRow}>
                  {p.techStack?.map((t, j) => <span key={j} style={s.techItem}>{t}</span>)}
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
                  {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, fontFamily: "'Inter', sans-serif", color: RED, fontWeight: 600, textDecoration: "none", letterSpacing: "0.04em", textTransform: "uppercase" }}>Live ↗</a>}
                  {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, fontFamily: "'Inter', sans-serif", color: "#888", fontWeight: 500, textDecoration: "none", letterSpacing: "0.04em", textTransform: "uppercase" }}>Source</a>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {experience?.length > 0 && (
        <div id="experience" style={s.section}>
          <div style={s.sectionEyebrow}><span>Experience</span><div style={s.sectionRule} /></div>
          <div style={s.expList}>
            {experience.map((e, i) => (
              <div key={i} style={s.expItem}>
                <div style={s.expDate}>{e.duration}</div>
                <div>
                  <div style={s.expRole}>{e.role}</div>
                  <div style={s.expCompany}>{e.company}{e.current && <span style={{ color: "#888", fontWeight: 400 }}> · Present</span>}</div>
                  {e.description && <p style={s.expDesc}>{e.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {certifications?.length > 0 && (
        <div style={s.subsection}>
          <div style={s.sectionEyebrow}><span>Certifications</span><div style={s.sectionRule} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24, marginTop: 24 }}>
            {certifications.map((c, i) => (
              <div key={i} style={{ borderTop: "3px solid " + RED, paddingTop: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, fontFamily: "'Playfair Display', 'Georgia', serif" }}>{c.title}</div>
                <div style={{ fontSize: 12, color: "#888", fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>{c.issuer}{c.date && ` · ${c.date}`}</div>
                {c.credentialUrl && <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: RED, fontWeight: 600, marginTop: 8, display: "block", fontFamily: "'Inter', sans-serif", textDecoration: "none", letterSpacing: "0.04em", textTransform: "uppercase" }}>Verify ↗</a>}
              </div>
            ))}
          </div>
        </div>
      )}

      {achievements?.length > 0 && (
        <div style={s.subsection}>
          <div style={s.sectionEyebrow}><span>Achievements</span><div style={s.sectionRule} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24, marginTop: 24 }}>
            {achievements.map((a, i) => (
              <div key={i} style={{ borderLeft: "3px solid " + RED, paddingLeft: 18 }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{a.icon || "✦"}</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, fontFamily: "'Playfair Display', 'Georgia', serif" }}>{a.title}</div>
                {a.description && <div style={{ fontSize: 12, color: "#666", fontFamily: "'Inter', sans-serif", lineHeight: 1.65, fontWeight: 300 }}>{a.description}</div>}
                {a.date && <div style={{ fontSize: 11, color: "#B0A890", marginTop: 6, fontFamily: "monospace" }}>{a.date}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {codingProfiles?.length > 0 && (
        <div style={s.subsection}>
          <div style={s.sectionEyebrow}><span>Coding</span><div style={s.sectionRule} /></div>
          <div style={{ display: "flex", gap: 16, marginTop: 24, flexWrap: "wrap" }}>
            {codingProfiles.map((p, i) => (
              <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
                style={{ padding: "14px 24px", border: "1px solid #D8CFC0", textDecoration: "none", color: DARK, transition: "border-color 0.2s" }}>
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Playfair Display', 'Georgia', serif" }}>{p.platform}</div>
                {p.username && <div style={{ fontSize: 11, color: RED, fontFamily: "monospace", marginTop: 4, fontWeight: 600 }}>@{p.username}</div>}
                {(p.rating || p.solved) && <div style={{ fontSize: 11, color: "#888", marginTop: 4, fontWeight: 300 }}>{p.rating && `Rating: ${p.rating}`}{p.solved && ` · ${p.solved} solved`}</div>}
              </a>
            ))}
          </div>
        </div>
      )}

      <div style={s.contactSection}>
        <h2 style={s.contactH2}>Let's tell <span style={s.redAccent}>your story.</span></h2>
        <p style={{ fontSize: 15, color: "#666", marginBottom: 36, lineHeight: 1.7, fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>Get in touch through the links below.</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          {contact?.email && <a href={`mailto:${contact.email}`} style={s.primaryBtn}>{contact.email}</a>}
          {socialLinks?.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" style={s.outlineBtn}>LinkedIn</a>}
        </div>
      </div>
    </div>
  );
};

export default EditorialTheme;
