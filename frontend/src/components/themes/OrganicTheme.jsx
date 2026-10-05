import React from "react";

const OrganicTheme = ({ data }) => {
  const { name, title, about, avatarUrl, skills, projects, experience,
    certifications, achievements, codingProfiles, contact, socialLinks, themeColors = {} } = data;

  const socials = [
    { href: socialLinks?.github, label: "GitHub" },
    { href: socialLinks?.linkedin, label: "LinkedIn" },
    { href: socialLinks?.twitter, label: "Twitter" },
    { href: socialLinks?.website, label: "Website" },
    { href: contact?.email ? `mailto:${contact.email}` : null, label: "Email" },
  ].filter(s => s.href);

  const ACCENT = themeColors.accent || "#6B7C5E";
  const BG = themeColors.bg || "#F5F0E8";
  const TEXT = themeColors.text || "#2C3328";
  const CREAM = BG;
  const SAGE = ACCENT;
  const DARK = TEXT;
  const CLAY = "#C4A882";
  const DUSTY = "#8A9A80";
  const WARM = "#E8DED0";

  const s = {
    page: { minHeight: "100vh", background: CREAM, fontFamily: "'Georgia', 'Times New Roman', serif", color: DARK },
    nav: { padding: "20px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${WARM}`, position: "sticky", top: 0, background: CREAM, zIndex: 100 },
    navName: { fontSize: 14, fontWeight: 700, color: SAGE, letterSpacing: "0.04em", fontFamily: "'Inter', sans-serif" },
    navLinks: { display: "flex", gap: 28 },
    navLink: { fontSize: 12, color: DUSTY, textDecoration: "none", fontWeight: 400, fontFamily: "'Inter', sans-serif", transition: "color 0.2s" },
    hero: { maxWidth: 1000, margin: "0 auto", padding: "100px 48px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" },
    avatarWrap: { width: "100%", maxWidth: 300, borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%", overflow: "hidden", border: `4px solid ${SAGE}20`, boxShadow: `0 20px 60px ${SAGE}15` },
    avatar: { width: "100%", height: "auto", display: "block", objectFit: "cover", aspectRatio: "1" },
    eyebrow: { fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: DUSTY, marginBottom: 16, fontFamily: "'Inter', sans-serif" },
    h1: { fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: DARK, marginBottom: 16 },
    accent: { color: SAGE },
    heroTitle: { fontSize: 14, fontWeight: 600, color: SAGE, marginBottom: 20, letterSpacing: "0.04em", fontFamily: "'Inter', sans-serif" },
    heroAbout: { fontSize: 15, lineHeight: 1.85, color: DUSTY, maxWidth: 440, fontWeight: 400 },
    socials: { display: "flex", gap: 14, flexWrap: "wrap", marginTop: 28 },
    socialLink: { padding: "8px 20px", border: `1px solid ${WARM}`, borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%", fontSize: 12, color: DUSTY, textDecoration: "none", fontFamily: "'Inter', sans-serif", fontWeight: 500, transition: "all 0.2s" },
    section: { maxWidth: 1000, margin: "0 auto", padding: "80px 48px", borderTop: `1px solid ${WARM}` },
    sectionLabel: { fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: DUSTY, marginBottom: 12, fontFamily: "'Inter', sans-serif" },
    h2: { fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: DARK, lineHeight: 1.15, marginBottom: 36, letterSpacing: "-0.02em" },
    skillsGrid: { display: "flex", flexWrap: "wrap", gap: 10 },
    skillBadge: {
      padding: "9px 22px",
      border: `1px solid ${WARM}`,
      fontSize: 13,
      color: DUSTY,
      background: "transparent",
      cursor: "default",
      fontFamily: "'Inter', sans-serif",
      fontWeight: 400,
      borderRadius: "40% 60% 60% 40% / 40% 40% 60% 60%",
      transition: "all 0.3s",
    },
    projectGrid: { columns: "280px 2", columnGap: 24 },
    projectItem: { breakInside: "avoid", marginBottom: 24, borderBottom: `1px solid ${WARM}`, paddingBottom: 24 },
    projectTitle: { fontSize: 18, fontWeight: 700, color: DARK, marginBottom: 8, fontFamily: "'Georgia', serif" },
    projectDesc: { fontSize: 13, color: DUSTY, lineHeight: 1.75, marginBottom: 12, fontWeight: 400, fontFamily: "'Inter', sans-serif" },
    techRow: { display: "flex", flexWrap: "wrap", gap: 6 },
    techItem: { padding: "3px 10px", border: `1px solid ${WARM}`, borderRadius: "40% 60% 60% 40% / 40% 40% 60% 60%", fontSize: 10, color: SAGE, fontFamily: "monospace", background: `${SAGE}06` },
    projectLinks: { display: "flex", gap: 14, marginTop: 10 },
    projectLink: { fontSize: 12, color: SAGE, textDecoration: "none", fontWeight: 600, fontFamily: "'Inter', sans-serif", borderBottom: `1px solid ${SAGE}`, paddingBottom: 1 },
    expItem: { marginBottom: 36, paddingLeft: 24, borderLeft: `2px solid ${WARM}` },
    expRole: { fontSize: 17, fontWeight: 700, color: DARK, marginBottom: 2 },
    expCompany: { fontSize: 13, color: SAGE, fontWeight: 600, marginBottom: 4, fontFamily: "'Inter', sans-serif" },
    expMeta: { fontSize: 12, color: DUSTY, fontFamily: "monospace", marginBottom: 10, fontWeight: 400 },
    expDesc: { fontSize: 13, color: DUSTY, lineHeight: 1.7, fontFamily: "'Inter', sans-serif", fontWeight: 400 },
    certGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 },
    certCard: { border: `1px solid ${WARM}`, padding: "18px 20px", borderRadius: "20% 40% 40% 20% / 20% 20% 40% 40%" },
    certTitle: { fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 4 },
    certIssuer: { fontSize: 12, color: DUSTY, fontFamily: "'Inter', sans-serif" },
    achGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 },
    achCard: { borderLeft: `3px solid ${SAGE}`, padding: "16px 20px" },
    achTitle: { fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 6 },
    achDesc: { fontSize: 12, color: DUSTY, lineHeight: 1.6, fontFamily: "'Inter', sans-serif" },
    codGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 14 },
    codCard: { border: `1px solid ${WARM}`, padding: "14px 18px", borderRadius: "30% 50% 50% 30% / 30% 30% 50% 50%", textDecoration: "none", color: "inherit", display: "block", fontFamily: "'Inter', sans-serif", transition: "border-color 0.2s" },
    contact: { maxWidth: 600, margin: "0 auto", padding: "100px 48px", textAlign: "center" },
    contactH2: { fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: DARK, marginBottom: 12, letterSpacing: "-0.02em" },
    primaryBtn: { padding: "13px 32px", background: SAGE, color: CREAM, borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%", fontSize: 14, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "'Inter', sans-serif", transition: "all 0.2s" },
    ghostBtn: { padding: "13px 32px", background: "transparent", color: DUSTY, border: `1px solid ${WARM}`, borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%", fontSize: 14, fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "'Inter', sans-serif", transition: "all 0.2s" },
    footer: { textAlign: "center", padding: "24px 48px", color: DUSTY, fontSize: 11, borderTop: `1px solid ${WARM}`, fontFamily: "'Inter', sans-serif", letterSpacing: "0.04em" },
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
        <div>
          {avatarUrl ? (
            <div style={s.avatarWrap}>
              <img src={avatarUrl} alt={name} style={s.avatar}
                onError={e => e.target.style.display = "none"} />
            </div>
          ) : (
            <div style={{ ...s.avatarWrap, background: WARM, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 280 }}>
              <span style={{ fontSize: 60, color: SAGE }}>🌿</span>
            </div>
          )}
        </div>
        <div>
          <div style={s.eyebrow}>Welcome</div>
          <h1 style={s.h1}>
            I'm <span style={s.accent}>{name.split(" ")[0]}</span>
            {name.includes(" ") && <><br />{name.split(" ").slice(1).join(" ")}</>}
          </h1>
          {title && <p style={s.heroTitle}>{title}</p>}
          <p style={s.heroAbout}>{about}</p>
          <div style={s.socials}>
            {socials.map(soc => (
              <a key={soc.label} href={soc.href} target="_blank" rel="noopener noreferrer" style={s.socialLink}>
                {soc.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {skills?.length > 0 && (
        <div id="skills" style={s.section}>
          <div style={s.sectionLabel}>Skills</div>
          <h2 style={s.h2}>What I <span style={{ color: SAGE }}>cultivate</span></h2>
          <div style={s.skillsGrid}>
            {skills.map((sk, i) => (
              <span key={i} style={s.skillBadge}>{sk}</span>
            ))}
          </div>
        </div>
      )}

      {projects?.length > 0 && (
        <div id="work" style={s.section}>
          <div style={s.sectionLabel}>Work</div>
          <h2 style={s.h2}>Projects I've <span style={{ color: SAGE }}>grown</span></h2>
          <div style={s.projectGrid}>
            {projects.map((p, i) => (
              <div key={i} style={s.projectItem}>
                {p.image && (
                  <img src={p.image} alt={p.title} style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 16, marginBottom: 16, border: `1px solid ${SAGE}40` }} />
                )}
                <h3 style={s.projectTitle}>{p.title}</h3>
                <p style={s.projectDesc}>{p.description}</p>
                {p.techStack?.length > 0 && (
                  <div style={s.techRow}>
                    {p.techStack.map((t, j) => <span key={j} style={s.techItem}>{t}</span>)}
                  </div>
                )}
                <div style={s.projectLinks}>
                  {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" style={s.projectLink}>Live ↗</a>}
                  {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" style={s.projectLink}>Source</a>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {experience?.length > 0 && (
        <div id="experience" style={s.section}>
          <div style={s.sectionLabel}>Experience</div>
          <h2 style={s.h2}>My <span style={{ color: SAGE }}>journey</span></h2>
          {experience.map((e, i) => (
            <div key={i} style={s.expItem}>
              <div style={s.expRole}>{e.role}</div>
              <div style={s.expCompany}>{e.company}{e.current && <span style={{ color: DUSTY, fontWeight: 400, marginLeft: 8 }}>— Present</span>}</div>
              <div style={s.expMeta}>{e.duration}</div>
              {e.description && <p style={s.expDesc}>{e.description}</p>}
            </div>
          ))}
        </div>
      )}

      {certifications?.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionLabel}>Learning</div>
          <h2 style={s.h2}>Certifications</h2>
          <div style={s.certGrid}>
            {certifications.map((c, i) => (
              <div key={i} style={s.certCard}>
                <div style={s.certTitle}>{c.title}</div>
                {c.issuer && <div style={s.certIssuer}>{c.issuer}{c.date && ` · ${c.date}`}</div>}
                {c.credentialUrl && <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: SAGE, marginTop: 8, display: "block", textDecoration: "none", fontWeight: 600 }}>Verify ↗</a>}
              </div>
            ))}
          </div>
        </div>
      )}

      {achievements?.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionLabel}>Wins</div>
          <h2 style={s.h2}>Achievements</h2>
          <div style={s.achGrid}>
            {achievements.map((a, i) => (
              <div key={i} style={s.achCard}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{a.icon || "🌱"}</div>
                <div style={s.achTitle}>{a.title}</div>
                {a.description && <div style={s.achDesc}>{a.description}</div>}
                {a.date && <div style={{ fontSize: 11, color: DUSTY, marginTop: 6 }}>{a.date}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {codingProfiles?.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionLabel}>Code</div>
          <h2 style={s.h2}>Coding Profiles</h2>
          <div style={s.codGrid}>
            {codingProfiles.map((p, i) => (
              <a key={i} href={p.url || "#"} target="_blank" rel="noopener noreferrer" style={s.codCard}>
                <div style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 2 }}>{p.platform}</div>
                {p.username && <div style={{ fontSize: 12, color: SAGE, fontFamily: "monospace" }}>@{p.username}</div>}
                {(p.rating || p.solved) && (
                  <div style={{ fontSize: 11, color: DUSTY, marginTop: 4 }}>
                    {p.rating && `Rating: ${p.rating}`}{p.rating && p.solved && " · "}{p.solved && `${p.solved} solved`}
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      <div id="contact" style={s.contact}>
        <h2 style={s.contactH2}>Let's <span style={{ color: SAGE }}>grow</span> together.</h2>
        <p style={{ fontSize: 15, color: DUSTY, marginBottom: 36, lineHeight: 1.7, fontFamily: "'Inter', sans-serif" }}>Let’s start a conversation.</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          {contact?.email && <a href={`mailto:${contact.email}`} style={s.primaryBtn}>{contact.email}</a>}
          {socialLinks?.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" style={s.ghostBtn}>LinkedIn</a>}
        </div>
      </div>

      <div style={s.footer}>
        {name} · {new Date().getFullYear()} · Rooted in craft
      </div>
    </div>
  );
};

export default OrganicTheme;
