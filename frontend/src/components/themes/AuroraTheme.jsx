import React, { useEffect } from "react";

const AuroraTheme = ({ data }) => {
  const { name, title, about, avatarUrl, skills, projects, experience,
    certifications, achievements, codingProfiles, contact, socialLinks, themeColors = {} } = data;

  const ACCENT = themeColors.accent || "#A78BFA";
  const BG = themeColors.bg || "#0B0B1A";
  const TEXT = themeColors.text || "#FFFFFF";

  useEffect(() => {
    const id = "aurora-theme-styles";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = `
        @keyframes auroraFloat {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(40px, -30px) scale(1.08) rotate(2deg); }
          66% { transform: translate(-20px, 20px) scale(0.95) rotate(-1deg); }
          100% { transform: translate(30px, -10px) scale(1.05) rotate(1deg); }
        }
        @keyframes auroraPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .aurora-glass:hover { border-color: rgba(167,139,250,0.4) !important; transform: translateY(-4px) !important; }
        .aurora-pill:hover { border-color: rgba(167,139,250,0.5) !important; box-shadow: 0 0 24px rgba(167,139,250,0.25) !important; }
        .aurora-glow-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 40px rgba(124,58,237,0.5) !important; }
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

  const s = {
    page: { minHeight: "100vh", background: BG, fontFamily: "'Space Grotesk', 'Inter', sans-serif", position: "relative", overflow: "hidden", color: TEXT },
    orb: (c, sz, t, l, d) => ({
      position: "fixed", width: sz, height: sz, borderRadius: "50%",
      background: c, filter: "blur(100px)", top: t, left: l,
      opacity: d ?? 0.35, animation: "auroraFloat 12s ease-in-out infinite alternate, auroraPulse 6s ease-in-out infinite",
      pointerEvents: "none", zIndex: 0,
    }),
    nav: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 40px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(11,11,26,0.7)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(167,139,250,0.08)" },
    navName: { fontSize: 15, fontWeight: 700, background: `linear-gradient(135deg, ${ACCENT}, #99F6E4)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
    navLinks: { display: "flex", gap: 32 },
    navLink: { fontSize: 13, color: "rgba(255,255,255,0.4)", cursor: "pointer", transition: "color 0.3s", textDecoration: "none", letterSpacing: "0.02em" },
    hero: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "120px 24px 60px", position: "relative", zIndex: 1 },
    avatar: { width: 104, height: 104, borderRadius: "50%", objectFit: "cover", margin: "0 auto 28px", border: "2px solid rgba(167,139,250,0.4)", boxShadow: "0 0 60px rgba(167,139,250,0.25), 0 0 120px rgba(103,232,249,0.1)", display: "block" },
    statusPill: { display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 20px", borderRadius: 999, background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)", color: ACCENT, fontSize: 12, fontWeight: 600, marginBottom: 24, letterSpacing: "0.03em" },
    h1: { fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.04em", color: TEXT, marginBottom: 16 },
    gradientText: { background: `linear-gradient(135deg, ${ACCENT}, #67E8F9)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
    heroTitle: { fontSize: 17, fontWeight: 500, color: "rgba(255,255,255,0.6)", marginBottom: 20, letterSpacing: "0.02em" },
    heroAbout: { fontSize: 16, color: "rgba(255,255,255,0.45)", maxWidth: 580, margin: "0 auto 40px", lineHeight: 1.8 },
    socials: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" },
    socialBtn: { display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 999, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.3s", textDecoration: "none", backdropFilter: "blur(8px)" },
    section: { padding: "100px 0", position: "relative", zIndex: 1 },
    container: { maxWidth: 1100, margin: "0 auto", padding: "0 24px" },
    sectionHeader: { textAlign: "center", marginBottom: 56 },
    sectionTag: { display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: ACCENT, marginBottom: 12 },
    sectionTitle: { fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, color: TEXT, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em", marginBottom: 12 },
    sectionSub: { fontSize: 15, color: "rgba(255,255,255,0.35)", fontWeight: 400 },
    glassCard: { background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "32px", transition: "all 0.4s" },
    skillsGrid: { display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" },
    skillTag: { padding: "10px 22px", borderRadius: 999, background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.15)", color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 500, cursor: "default", transition: "all 0.3s" },
    projectsScroll: { display: "flex", gap: 20, overflowX: "auto", paddingBottom: 16, scrollSnapType: "x mandatory" },
    projectCard: { flex: "0 0 340px", scrollSnapAlign: "start", background: "rgba(255,255,255,0.03)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 28, transition: "all 0.4s", cursor: "default" },
    projectTitle: { fontSize: 18, fontWeight: 700, color: TEXT, marginBottom: 10, letterSpacing: "-0.02em" },
    projectDesc: { fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.75, marginBottom: 18, fontWeight: 400 },
    techRow: { display: "flex", flexWrap: "wrap", gap: 6 },
    techBadge: { padding: "4px 10px", borderRadius: 6, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.15)", fontSize: 11, fontWeight: 600, color: ACCENT, fontFamily: "monospace" },
    projectLinks: { display: "flex", gap: 10, marginTop: 16 },
    projectLink: { padding: "6px 14px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.65)", cursor: "pointer", textDecoration: "none", transition: "all 0.3s" },
    timeline: { maxWidth: 680, margin: "0 auto" },
    timelineItem: { display: "flex", gap: 24, marginBottom: 36 },
    tlDot: { width: 14, height: 14, borderRadius: "50%", background: `linear-gradient(135deg, ${ACCENT}, #67E8F9)`, boxShadow: "0 0 20px rgba(167,139,250,0.4)", marginTop: 6, flexShrink: 0 },
    tlLine: { width: 2, flexShrink: 0, background: "linear-gradient(180deg, rgba(167,139,250,0.3), transparent)", marginLeft: 6, marginRight: 6 },
    tlRole: { fontSize: 17, fontWeight: 700, color: TEXT, marginBottom: 4 },
    tlMeta: { display: "flex", alignItems: "center", gap: 14, marginBottom: 10, flexWrap: "wrap" },
    tlCompany: { fontSize: 13, fontWeight: 600, color: ACCENT },
    tlDuration: { fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "monospace" },
    tlDesc: { fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.75 },
    contactSection: { padding: "120px 0", textAlign: "center", position: "relative", zIndex: 1 },
    contactTitle: { fontSize: "clamp(2.2rem, 5vw, 4rem)", fontWeight: 700, color: TEXT, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em", marginBottom: 16 },
    contactSub: { fontSize: 16, color: "rgba(255,255,255,0.4)", marginBottom: 40 },
    contactBtns: { display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" },
    primaryBtn: { padding: "14px 32px", borderRadius: 12, background: `linear-gradient(135deg, ${ACCENT}, #6366F1)`, border: "none", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, transition: "all 0.3s", boxShadow: "0 4px 32px rgba(124,58,237,0.35)" },
    secondaryBtn: { padding: "14px 32px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", fontSize: 15, fontWeight: 600, cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, transition: "all 0.3s" },
    footer: { textAlign: "center", padding: "32px 24px", color: "rgba(255,255,255,0.15)", fontSize: 12, borderTop: "1px solid rgba(255,255,255,0.04)", position: "relative", zIndex: 1 },
    subsection: { ...s => ({ ...s, background: "rgba(0,0,0,0.15)" }) },
    grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 },
    grid3: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 },
  };

  return (
    <div style={s.page}>
      <div style={s.orb(`radial-gradient(circle, ${ACCENT} 0%, transparent 70%)`, "600px", "-150px", "-100px")} />
      <div style={s.orb("radial-gradient(circle, #2563EB 0%, transparent 70%)", "500px", "10%", "75%")} />
      <div style={s.orb("radial-gradient(circle, #EC4899 0%, transparent 70%)", "400px", "50%", "-80px")} />
      <div style={s.orb("radial-gradient(circle, #059669 0%, transparent 70%)", "350px", "75%", "55%")} />
      <div style={s.orb("radial-gradient(circle, #6366F1 0%, transparent 60%)", "450px", "40%", "40%", 0.2)} />

      <nav style={s.nav}>
        <div style={s.navName}>{name}</div>
        <div style={s.navLinks}>
          {["Skills", "Projects", "Experience", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={s.navLink}>{l}</a>
          ))}
        </div>
      </nav>

      <section style={s.hero}>
        <div>
          {avatarUrl && (
            <img src={avatarUrl} alt={name} style={s.avatar}
              onError={e => e.target.style.display = "none"} />
          )}
          <div style={s.statusPill}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", display: "inline-block", boxShadow: "0 0 8px #22C55E" }} />
            My portfolio
          </div>
          <h1 style={s.h1}>{name}</h1>
          {title && <p style={s.heroTitle}>{title}</p>}
          <p style={s.heroAbout}>{about}</p>
          <div style={s.socials}>
            {socials.map(soc => (
              <a key={soc.label} href={soc.href} target="_blank" rel="noopener noreferrer" className="aurora-pill" style={s.socialBtn}>
                {soc.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {skills?.length > 0 && (
        <section id="skills" style={{ ...s.section, background: "rgba(0,0,0,0.12)" }}>
          <div style={s.container}>
            <div style={s.sectionHeader}>
              <div style={s.sectionTag}>Tech Stack</div>
              <h2 style={s.sectionTitle}>Skills & Technologies</h2>
              <p style={s.sectionSub}>Tools I work with daily</p>
            </div>
            <div style={s.skillsGrid}>
              {skills.map((sk, i) => <span key={i} className="aurora-pill" style={s.skillTag}>{sk}</span>)}
            </div>
          </div>
        </section>
      )}

      {projects?.length > 0 && (
        <section id="projects" style={s.section}>
          <div style={s.container}>
            <div style={s.sectionHeader}>
              <div style={s.sectionTag}>Work</div>
              <h2 style={s.sectionTitle}>Featured Projects</h2>
              <p style={s.sectionSub}>Things I've built</p>
            </div>
            <div style={s.projectsScroll}>
              {projects.map((p, i) => (
                <div key={i} className="aurora-glass" style={s.projectCard}>
                  {p.image && (
                    <img src={p.image} alt={p.title}
                      style={{
                        width: "100%",
                        height: 180,
                        objectFit: "cover",
                        borderRadius: 12,
                        marginBottom: 16,
                      }}
                    />
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✦</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>0{i + 1}</div>
                  </div>
                  <h3 style={s.projectTitle}>{p.title}</h3>
                  <p style={s.projectDesc}>{p.description}</p>
                  {p.techStack?.length > 0 && (
                    <div style={s.techRow}>
                      {p.techStack.map((t, j) => <span key={j} style={s.techBadge}>{t}</span>)}
                    </div>
                  )}
                  <div style={s.projectLinks}>
                    {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" style={s.projectLink}>Live ↗</a>}
                    {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" style={s.projectLink}>GitHub</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {experience?.length > 0 && (
        <section id="experience" style={{ ...s.section, background: "rgba(0,0,0,0.12)" }}>
          <div style={s.container}>
            <div style={s.sectionHeader}>
              <div style={s.sectionTag}>Career</div>
              <h2 style={s.sectionTitle}>Experience</h2>
            </div>
            <div style={s.timeline}>
              {experience.map((e, i) => (
                <div key={i} style={s.timelineItem}>
                  <div>
                    <div style={s.tlDot} />
                    {i < experience.length - 1 && <div style={{ ...s.tlLine, height: 40 }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={s.tlRole}>{e.role}</div>
                    <div style={s.tlMeta}>
                      <span style={s.tlCompany}>{e.company}</span>
                      <span style={s.tlDuration}>{e.duration}</span>
                      {e.current && <span style={{ fontSize: 11, color: "#22C55E", fontWeight: 700, letterSpacing: "0.03em" }}>● Current</span>}
                    </div>
                    {e.description && <p style={s.tlDesc}>{e.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {certifications?.length > 0 && (
        <section style={s.section}>
          <div style={s.container}>
            <div style={s.sectionHeader}>
              <div style={s.sectionTag}>Learning</div>
              <h2 style={s.sectionTitle}>Certifications</h2>
            </div>
            <div style={s.grid2}>
              {certifications.map((c, i) => (
                <div key={i} className="aurora-glass" style={{ ...s.glassCard, padding: 24, display: "flex", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, rgba(167,139,250,0.15), rgba(103,232,249,0.1))", border: "1px solid rgba(167,139,250,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🏅</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{c.title}</div>
                    {c.issuer && <div style={{ fontSize: 12, fontWeight: 600, color: ACCENT }}>{c.issuer}</div>}
                    {c.date && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4, fontFamily: "monospace" }}>{c.date}</div>}
                    {c.credentialUrl && <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#67E8F9", marginTop: 10, display: "block", textDecoration: "none" }}>Verify →</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {achievements?.length > 0 && (
        <section style={{ ...s.section, background: "rgba(0,0,0,0.12)" }}>
          <div style={s.container}>
            <div style={s.sectionHeader}>
              <div style={s.sectionTag}>Wins</div>
              <h2 style={s.sectionTitle}>Achievements</h2>
            </div>
            <div style={s.grid2}>
              {achievements.map((a, i) => (
                <div key={i} className="aurora-glass" style={{ ...s.glassCard, padding: 28, textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 14 }}>{a.icon || "🏆"}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 8 }}>{a.title}</div>
                  {a.description && <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>{a.description}</p>}
                  {a.date && <div style={{ fontSize: 11, color: ACCENT, marginTop: 10, fontFamily: "monospace" }}>{a.date}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {codingProfiles?.length > 0 && (
        <section style={s.section}>
          <div style={s.container}>
            <div style={s.sectionHeader}>
              <div style={s.sectionTag}>Code</div>
              <h2 style={s.sectionTitle}>Coding Profiles</h2>
            </div>
            <div style={s.grid3}>
              {codingProfiles.map((p, i) => (
                <a key={i} href={p.url || "#"} target="_blank" rel="noopener noreferrer" className="aurora-glass"
                  style={{ ...s.glassCard, padding: 20, display: "flex", gap: 14, alignItems: "center", textDecoration: "none", cursor: "pointer" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>⌘</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{p.platform}</div>
                    {p.username && <div style={{ fontSize: 12, color: ACCENT, fontFamily: "monospace" }}>@{p.username}</div>}
                    {(p.rating || p.solved) && (
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
                        {p.rating && `⭐ ${p.rating}`}{p.rating && p.solved && " · "}{p.solved && `✅ ${p.solved}`}
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="contact" style={s.contactSection}>
        <div style={s.container}>
          <h2 style={s.contactTitle}>Let's build something <span style={s.gradientText}>together</span></h2>
          <p style={s.contactSub}>Get in touch to start a conversation</p>
          <div style={s.contactBtns}>
            {contact?.email && (
              <a href={`mailto:${contact.email}`} className="aurora-glow-btn" style={s.primaryBtn}>✉ {contact.email}</a>
            )}
            {contact?.phone && (
              <a href={`tel:${contact.phone}`} style={s.secondaryBtn}>📞 {contact.phone}</a>
            )}
          </div>
        </div>
      </section>

      <div style={s.footer}>Built with Aurora ✦ {new Date().getFullYear()}</div>
    </div>
  );
};

export default AuroraTheme;
