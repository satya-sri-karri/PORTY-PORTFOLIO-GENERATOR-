import React from "react";

const ExecutiveTheme = ({ data }) => {
  const { name, title, about, avatarUrl, skills, projects, experience,
    certifications, achievements, codingProfiles, contact, socialLinks, themeColors = {} } = data;

  const socials = [
    { href: socialLinks?.github, label: "GitHub" },
    { href: socialLinks?.linkedin, label: "LinkedIn" },
    { href: socialLinks?.twitter, label: "Twitter" },
    { href: socialLinks?.website, label: "Website" },
    { href: contact?.email ? `mailto:${contact.email}` : null, label: "Email" },
  ].filter(s => s.href);

  const ACCENT = themeColors.accent || "#C9A84C";
  const BG = themeColors.bg || "#0A1628";
  const TEXT = themeColors.text || "#F0F0F0";
  const NAVY = BG;
  const GOLD = ACCENT;
  const WHITE = TEXT;
  const CARD_BG = "#0E1E32";

  const s = {
    page: { minHeight: "100vh", background: NAVY, fontFamily: "'Inter', 'Georgia', serif", color: WHITE },
    nav: { padding: "0 48px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${GOLD}25`, position: "sticky", top: 0, background: NAVY, zIndex: 100 },
    navLeft: { display: "flex", gap: 32 },
    navLink: { fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.5)", textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.2s" },
    navName: { fontSize: 14, fontWeight: 700, color: GOLD, letterSpacing: "0.04em", textTransform: "uppercase" },
    hero: { maxWidth: 1100, margin: "0 auto", padding: "100px 48px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" },
    heroLeft: {},
    heroRight: { textAlign: "right" },
    eyebrow: { fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 16 },
    h1: { fontSize: "clamp(2.8rem, 6vw, 4.5rem)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.03em", color: WHITE, marginBottom: 16 },
    nameAccent: { color: GOLD, fontWeight: 700 },
    heroTitle: { fontSize: 15, fontWeight: 400, color: "rgba(255,255,255,0.55)", marginBottom: 24, letterSpacing: "0.02em", lineHeight: 1.7 },
    divider: { width: 60, height: 1, background: GOLD, marginBottom: 24 },
    heroAbout: { fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.85, maxWidth: 440, fontWeight: 300 },
    avatar: { width: 120, height: 120, borderRadius: "50%", objectFit: "cover", border: `2px solid ${GOLD}40`, display: "inline-block", marginBottom: 20 },
    socials: { display: "flex", gap: 12, justifyContent: "flex-end", flexWrap: "wrap" },
    socialBtn: { padding: "8px 18px", border: `1px solid ${GOLD}30`, borderRadius: 4, fontSize: 11, fontWeight: 600, color: GOLD, textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.2s" },
    section: { maxWidth: 1100, margin: "0 auto", padding: "80px 48px", borderTop: `1px solid ${GOLD}15` },
    sectionHeader: { display: "flex", alignItems: "center", gap: 20, marginBottom: 44 },
    sectionLine: { width: 40, height: 2, background: GOLD },
    sectionLabel: { fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD },
    h2: { fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 300, color: WHITE, letterSpacing: "-0.02em", marginBottom: 32 },
    card: { background: CARD_BG, border: `1px solid ${GOLD}15`, borderRadius: 8, padding: 28, transition: "border-color 0.2s" },
    skillsRow: { display: "flex", flexDirection: "column", gap: 14 },
    skillBar: { display: "flex", alignItems: "center", gap: 16 },
    skillName: { fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)", minWidth: 140 },
    barTrack: { flex: 1, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2 },
    skillPct: { fontSize: 11, color: GOLD, fontFamily: "monospace", fontWeight: 600, minWidth: 36, textAlign: "right" },
    projectGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 },
    projectCard: { background: CARD_BG, border: `1px solid ${GOLD}15`, borderRadius: 8, padding: 24, position: "relative", overflow: "hidden", transition: "border-color 0.2s" },
    accentTop: { position: "absolute", top: 0, left: 0, right: 0, height: 3, background: GOLD },
    projectTitle: { fontSize: 16, fontWeight: 600, color: WHITE, marginBottom: 10, letterSpacing: "-0.01em" },
    projectDesc: { fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: 14, fontWeight: 300 },
    techRow: { display: "flex", flexWrap: "wrap", gap: 6 },
    techBadge: { padding: "3px 10px", border: `1px solid ${GOLD}20`, borderRadius: 3, fontSize: 10, fontWeight: 600, color: GOLD, fontFamily: "monospace" },
    projectLinks: { display: "flex", gap: 12, marginTop: 14 },
    projectLink: { fontSize: 11, fontWeight: 600, color: GOLD, textDecoration: "none", letterSpacing: "0.04em", textTransform: "uppercase" },
    expItem: { display: "grid", gridTemplateColumns: "120px 1fr", gap: 32, marginBottom: 28, paddingBottom: 28, borderBottom: `1px solid ${GOLD}10` },
    expDate: { fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", paddingTop: 4, fontWeight: 500 },
    expRole: { fontSize: 16, fontWeight: 600, color: WHITE, marginBottom: 4 },
    expCompany: { fontSize: 13, color: GOLD, fontWeight: 500, marginBottom: 8 },
    expDesc: { fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, fontWeight: 300 },
    contact: { maxWidth: 1100, margin: "0 auto", padding: "100px 48px", textAlign: "center", borderTop: `1px solid ${GOLD}15` },
    contactH2: { fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 300, color: WHITE, marginBottom: 14, letterSpacing: "-0.02em" },
    primaryBtn: { display: "inline-flex", padding: "13px 32px", border: `1px solid ${GOLD}`, borderRadius: 6, color: GOLD, fontSize: 13, fontWeight: 600, textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.2s" },
    footer: { textAlign: "center", padding: "24px 48px", color: "rgba(255,255,255,0.15)", fontSize: 11, borderTop: `1px solid ${GOLD}10`, letterSpacing: "0.06em" },
  };

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.navLeft}>
          {["Skills", "Projects", "Experience", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={s.navLink}>{l}</a>
          ))}
        </div>
        <div style={s.navName}>{name}</div>
      </nav>

      <div style={s.hero}>
        <div style={s.heroLeft}>
          <div style={s.eyebrow}>Executive Profile</div>
          <h1 style={s.h1}>
            <span style={s.nameAccent}>{name.split(" ")[0]}</span>
            {name.includes(" ") && <><br />{name.split(" ").slice(1).join(" ")}</>}
          </h1>
          {title && <p style={s.heroTitle}>{title}</p>}
          <div style={s.divider} />
          <p style={s.heroAbout}>{about}</p>
        </div>
        <div style={s.heroRight}>
          {avatarUrl && (
            <img src={avatarUrl} alt={name} style={s.avatar}
              onError={e => e.target.style.display = "none"} />
          )}
          <div style={s.socials}>
            {socials.map(soc => (
              <a key={soc.label} href={soc.href} target="_blank" rel="noopener noreferrer" style={s.socialBtn}>
                {soc.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {skills?.length > 0 && (
        <div id="skills" style={s.section}>
          <div style={s.sectionHeader}>
            <div style={s.sectionLine} />
            <span style={s.sectionLabel}>Competencies</span>
          </div>
          <h2 style={s.h2}>Core Expertise</h2>
          <div style={s.skillsRow}>
            {skills.map((sk, i) => (
                <span key={i} style={{ padding: "10px 16px", border: `1px solid ${GOLD}40`, borderRadius: 4, color: GOLD, fontWeight: 500 }}>{typeof sk === "string" ? sk : sk.name || ""}</span>
              ))}
          </div>
        </div>
      )}

      {projects?.length > 0 && (
        <div id="projects" style={s.section}>
          <div style={s.sectionHeader}>
            <div style={s.sectionLine} />
            <span style={s.sectionLabel}>Portfolio</span>
          </div>
          <h2 style={s.h2}>Selected Engagements</h2>
          <div style={s.projectGrid}>
            {projects.map((p, i) => (
              <div key={i} style={s.projectCard}>
                  {p.image && (
                    <img src={p.image} alt={p.title}
                      style={{
                        width: "100%",
                        height: 180,
                        objectFit: "cover",
                        borderRadius: 6,
                        border: `1px solid ${GOLD}30`,
                        marginBottom: 16,
                      }}
                    />
                  )}
                  <div style={s.accentTop} />
                  <h3 style={s.projectTitle}>{p.title}</h3>
                <p style={s.projectDesc}>{p.description}</p>
                {p.techStack?.length > 0 && (
                  <div style={s.techRow}>
                    {p.techStack.map((t, j) => <span key={j} style={s.techBadge}>{t}</span>)}
                  </div>
                )}
                <div style={s.projectLinks}>
                  {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" style={s.projectLink}>Live ↗</a>}
                  {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" style={s.projectLink}>Repository</a>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {experience?.length > 0 && (
        <div id="experience" style={s.section}>
          <div style={s.sectionHeader}>
            <div style={s.sectionLine} />
            <span style={s.sectionLabel}>Career</span>
          </div>
          <h2 style={s.h2}>Professional History</h2>
          {experience.map((e, i) => (
            <div key={i} style={s.expItem}>
              <div style={s.expDate}>{e.duration}</div>
              <div>
                <div style={s.expRole}>{e.role}</div>
                <div style={s.expCompany}>{e.company}{e.current && <span style={{ color: "rgba(255,255,255,0.3)", marginLeft: 8, fontSize: 11, fontWeight: 400 }}>Current</span>}</div>
                {e.description && <p style={s.expDesc}>{e.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {certifications?.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionHeader}>
            <div style={s.sectionLine} />
            <span style={s.sectionLabel}>Credentials</span>
          </div>
          <h2 style={s.h2}>Certifications</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {certifications.map((c, i) => (
              <div key={i} style={{ background: CARD_BG, border: `1px solid ${GOLD}15`, borderRadius: 6, padding: 20, borderTop: `2px solid ${GOLD}` }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: WHITE, marginBottom: 4 }}>{c.title}</div>
                <div style={{ fontSize: 12, color: GOLD, fontWeight: 500 }}>{c.issuer}</div>
                {c.date && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 6, fontFamily: "monospace" }}>{c.date}</div>}
                {c.credentialUrl && <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: GOLD, marginTop: 10, display: "block", textDecoration: "none", fontWeight: 600, letterSpacing: "0.04em" }}>Verify →</a>}
              </div>
            ))}
          </div>
        </div>
      )}

      {achievements?.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionHeader}>
            <div style={s.sectionLine} />
            <span style={s.sectionLabel}>Distinctions</span>
          </div>
          <h2 style={s.h2}>Achievements</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {achievements.map((a, i) => (
              <div key={i} style={Object.assign({}, s.card, { padding: 24, textAlign: "center" })}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{a.icon || "★"}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: WHITE, marginBottom: 8 }}>{a.title}</div>
                {a.description && <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, fontWeight: 300 }}>{a.description}</p>}
                {a.date && <div style={{ fontSize: 11, color: GOLD, marginTop: 8, fontFamily: "monospace" }}>{a.date}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {codingProfiles?.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionHeader}>
            <div style={s.sectionLine} />
            <span style={s.sectionLabel}>Technical</span>
          </div>
          <h2 style={s.h2}>Coding Profiles</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
            {codingProfiles.map((p, i) => (
              <a key={i} href={p.url || "#"} target="_blank" rel="noopener noreferrer"
                style={{ background: CARD_BG, border: `1px solid ${GOLD}15`, borderRadius: 6, padding: "16px 20px", textDecoration: "none", display: "block", transition: "border-color 0.2s" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: WHITE, marginBottom: 2 }}>{p.platform}</div>
                {p.username && <div style={{ fontSize: 12, color: GOLD, fontFamily: "monospace", fontWeight: 500 }}>@{p.username}</div>}
                {(p.rating || p.solved) && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 6 }}>{p.rating && `Rating: ${p.rating}`}{p.solved && ` · ${p.solved}`}</div>}
              </a>
            ))}
          </div>
        </div>
      )}

      <div id="contact" style={s.contact}>
        <h2 style={s.contactH2}>Let's discuss <span style={{ color: GOLD, fontWeight: 600 }}>partnerships.</span></h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 36, fontWeight: 300 }}>Contact me to discuss your ideas.</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          {contact?.email && <a href={`mailto:${contact.email}`} style={s.primaryBtn}>{contact.email}</a>}
          {socialLinks?.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" style={{ ...s.primaryBtn, borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)" }}>LinkedIn</a>}
        </div>
      </div>

      <div style={s.footer}>
        {name} · {new Date().getFullYear()} · Confidential
      </div>
    </div>
  );
};

export default ExecutiveTheme;
