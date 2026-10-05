import React, { useEffect, useCallback, useMemo } from "react";

const BG = "#141414";
const CARD_BG = "#1F1F1F";
const RED = "#E50914";
const TEXT = "#FFFFFF";
const MUTED = "#B3B3B3";
const DIM = "#666666";

const NetflixPortfolioTheme = ({ data }) => {
  const { name, title, about, avatarUrl, skills, projects, experience,
    certifications, achievements, codingProfiles, contact, socialLinks, themeColors = {} } = data;
  const RED = themeColors.accent || "#E50914";
  const BG = themeColors.bg || "#141414";
  const TEXT = themeColors.text || "#FFFFFF";

  useEffect(() => {
    const s = document.createElement("style");
    s.id = "netflix-anim";
    s.textContent = `@keyframes nfFade{from{opacity:0}to{opacity:1}}@keyframes nfUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}`;
    document.head.appendChild(s);
    return () => document.getElementById("netflix-anim")?.remove();
  }, []);

  const socials = [
    { href: socialLinks?.github, label: "GitHub" },
    { href: socialLinks?.linkedin, label: "LinkedIn" },
    { href: socialLinks?.twitter, label: "Twitter" },
    { href: socialLinks?.website, label: "Website" },
    { href: contact?.email ? `mailto:${contact.email}` : null, label: "Email" },
  ].filter(s => s.href);

  const featured = projects?.[0];

  const categoryRow = (title) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <span style={{ fontSize: 12, color: RED }}>▶</span>
      <h2 style={{ fontSize: 19, fontWeight: 700, color: TEXT, margin: 0 }}>{title}</h2>
    </div>
  );

  const card = {
    borderRadius: 6, overflow: "hidden", flexShrink: 0,
    transition: "transform 0.35s ease, box-shadow 0.35s ease",
    cursor: "pointer", position: "relative",
  };

  const navItems = useMemo(() => [
    { label: "Home", id: "nf-hero" },
    ...(projects?.length > 1 ? [{ label: "Projects", id: "nf-projects" }] : []),
    ...(experience?.length > 0 ? [{ label: "Experience", id: "nf-experience" }] : []),
    ...(about ? [{ label: "About", id: "nf-about" }] : []),
    ...(contact?.email || contact?.phone || socials.length ? [{ label: "Contact", id: "nf-contact" }] : []),
  ], [projects, experience, about, contact, socials.length]);

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'DM Sans', 'Inter', sans-serif", color: TEXT }}>
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 32px", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: `linear-gradient(to bottom, ${BG}, transparent)`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <span style={{ fontSize: 24, fontWeight: 900, color: RED, letterSpacing: "-0.02em" }}>{name[0] || "P"}ORTFOLIO</span>
          <div style={{ display: "flex", gap: 16, fontSize: 13, color: MUTED }}>
            {navItems.map(n => (
              <button key={n.id} onClick={() => scrollToSection(n.id)}
                style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", fontSize: 13, fontFamily: "inherit", padding: 0, transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = TEXT}
                onMouseLeave={e => e.target.style.color = MUTED}>{n.label}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {socials.slice(0, 2).map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, color: MUTED, textDecoration: "none", padding: "4px 12px", borderRadius: 4, border: `1px solid ${DIM}40` }}>{s.label}</a>
          ))}
          {avatarUrl && <img src={avatarUrl} alt={name} style={{ width: 32, height: 32, borderRadius: 4, objectFit: "cover" }}
            onError={e => e.target.style.display = "none"} />}
        </div>
      </div>

      <section id="nf-hero" style={{ padding: "110px 32px 72px", maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ color: RED, fontSize: 12, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 14 }}>My portfolio</p>
        <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.1, fontWeight: 900, overflowWrap: "anywhere", marginBottom: 14 }}>{name}</h1>
        {title && <p style={{ color: TEXT, fontSize: 20, marginBottom: 18 }}>{title}</p>}
        {about && <p id="nf-about" style={{ color: MUTED, maxWidth: 700, fontSize: 16, lineHeight: 1.8, scrollMarginTop: 90 }}>{about}</p>}
      </section>

      {featured && (
        <div id="nf-featured" style={{
          height: "75vh", minHeight: 420,
          background: featured.image ? `linear-gradient(to top, ${BG}, transparent 60%), url(${featured.image}) center/cover no-repeat` : `linear-gradient(135deg, ${BG}, #1A0A0A)`,
          backgroundSize: "cover", backgroundPosition: "center",
          display: "flex", alignItems: "flex-end", padding: "0 60px 64px",
          position: "relative", animation: "nfFade 0.8s ease",
        }}>
          <div style={{ maxWidth: 560, animation: "nfUp 0.7s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: RED, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Featured project</span>
            </div>
            <h2 style={{ fontSize: "clamp(2.8rem, 7vw, 5rem)", fontWeight: 900, marginBottom: 14, lineHeight: 1 }}>{featured.title}</h2>
            <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7, marginBottom: 20, maxWidth: 480 }}>{featured.description}</p>
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              {featured.techStack?.map((t, i) => (
                <span key={i} style={{ fontSize: 12, padding: "4px 12px", background: "rgba(255,255,255,0.08)", borderRadius: 4, fontWeight: 600 }}>{t}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 14 }}>
              {featured.link && <a href={featured.link} target="_blank" rel="noopener noreferrer"
                style={{ padding: "12px 30px", background: RED, color: "#fff", borderRadius: 4, fontSize: 15, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                View project
              </a>}
              {featured.github && <a href={featured.github} target="_blank" rel="noopener noreferrer"
                style={{ padding: "12px 30px", border: `1px solid ${DIM}60`, color: TEXT, borderRadius: 4, fontSize: 15, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                Source code
              </a>}
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: "0 60px 60px", marginTop: featured ? -50 : 0, position: "relative", zIndex: 10 }}>

        {skills?.length > 0 && (
          <div style={{ marginBottom: 40, animation: "nfUp 0.5s ease" }}>
            {categoryRow("Tech Stack")}
            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 10, scrollBehavior: "smooth" }}>
              {skills.map((s, i) => (
                <span key={i} style={{
                  ...card, padding: "10px 22px", whiteSpace: "nowrap",
                  background: CARD_BG, border: `1px solid ${DIM}25`,
                  fontSize: 14, fontWeight: 600, color: MUTED,
                }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {projects?.length > 1 && (
          <div id="nf-projects" style={{ marginBottom: 40, animation: "nfUp 0.5s ease" }}>
            {categoryRow("My Projects")}
            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 10, scrollBehavior: "smooth" }}>
              {projects.slice(1).map((p, i) => (
                <div key={i} style={{
                  ...card, minWidth: 280, maxWidth: 280,
                  background: CARD_BG,
                }}>
                  <div style={{
                    height: 160,
                    background: p.image ? `url(${p.image}) center/cover` : `linear-gradient(135deg, ${["#E50914","#564D4D","#0080FF","#E87D0E","#B81D24","#0F79AF"][i % 6]}, ${["#B20710","#221F1F","#0055AA","#C7680C","#871014","#0A5C7E"][i % 6]})`,
                    display: "flex", alignItems: "flex-end", padding: 16, borderRadius: "6px 6px 0 0",
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, textTransform: "uppercase", letterSpacing: "0.05em" }}>{p.title}</span>
                  </div>
                  <div style={{ padding: 16 }}>
                    <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.6, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.description}</p>
                    <div style={{ display: "flex", gap: 10 }}>
                      {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: TEXT, fontWeight: 700, textDecoration: "none" }}>View project</a>}
                      {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: MUTED, textDecoration: "none" }}>Source code</a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {experience?.length > 0 && (
          <div id="nf-experience" style={{ marginBottom: 40, animation: "nfUp 0.5s ease" }}>
            {categoryRow("My Experience")}
            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 10, scrollBehavior: "smooth" }}>
              {experience.map((e, i) => (
                <div key={i} style={{
                  ...card, minWidth: 320, maxWidth: 320, padding: 22,
                  background: CARD_BG, border: `1px solid ${DIM}15`,
                }}>
                  <div style={{ fontSize: 11, color: RED, fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{e.duration}</div>
                  <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>{e.role}</div>
                  <div style={{ fontSize: 13, color: MUTED, marginBottom: 10 }}>{e.company}{e.current && <span style={{ color: RED, marginLeft: 8, fontSize: 11 }}>● Current</span>}</div>
                  {e.description && <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.7, margin: 0 }}>{e.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {certifications?.length > 0 && (
          <div style={{ marginBottom: 40, animation: "nfUp 0.5s ease" }}>
            {categoryRow("Certifications")}
            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 10, scrollBehavior: "smooth" }}>
              {certifications.map((c, i) => (
                <div key={i} style={{
                  ...card, minWidth: 230, maxWidth: 230, padding: 18,
                  background: CARD_BG, border: `1px solid ${DIM}15`,
                }}>
                  <span style={{ fontSize: 28, marginBottom: 10, display: "block" }}>🏅</span>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: MUTED }}>{c.issuer}</div>
                  {c.credentialUrl && <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: RED, marginTop: 8, display: "inline-block", fontWeight: 600 }}>View Credential</a>}
                </div>
              ))}
            </div>
          </div>
        )}

        {achievements?.length > 0 && (
          <div style={{ marginBottom: 40, animation: "nfUp 0.5s ease" }}>
            {categoryRow("Achievements")}
            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 10, scrollBehavior: "smooth" }}>
              {achievements.map((a, i) => (
                <div key={i} style={{
                  ...card, minWidth: 210, maxWidth: 210, padding: 22,
                  background: CARD_BG, border: `1px solid ${DIM}15`, textAlign: "center",
                }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>{a.icon || "🏆"}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{a.title}</div>
                  {a.description && <p style={{ fontSize: 11, color: MUTED, lineHeight: 1.5, margin: 0 }}>{a.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {codingProfiles?.length > 0 && (
          <div style={{ marginBottom: 40, animation: "nfUp 0.5s ease" }}>
            {categoryRow("Coding Profiles")}
            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 10, scrollBehavior: "smooth" }}>
              {codingProfiles.map((p, i) => (
                <a key={i} href={p.url || "#"} target="_blank" rel="noopener noreferrer"
                  style={{
                    ...card, minWidth: 200, maxWidth: 200, padding: 18,
                    background: CARD_BG, border: `1px solid ${DIM}15`,
                    textDecoration: "none", color: TEXT, display: "block",
                  }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{p.platform}</div>
                  {p.username && <div style={{ fontSize: 12, color: MUTED, fontFamily: "monospace" }}>@{p.username}</div>}
                  {p.solved && <div style={{ fontSize: 11, color: RED, marginTop: 6, fontWeight: 600 }}>{p.solved} problems</div>}
                </a>
              ))}
            </div>
          </div>
        )}

        <div id="nf-contact" style={{
          marginTop: 40, padding: "56px 0", textAlign: "center",
          borderTop: `1px solid ${DIM}25`, animation: "nfUp 0.5s ease",
        }}>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, marginBottom: 10 }}>Contact</h2>
          <p style={{ fontSize: 14, color: MUTED, marginBottom: 28, maxWidth: 500, margin: "0 auto 28px", lineHeight: 1.7 }}>Find me through the links below.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            {contact?.email && <a href={`mailto:${contact.email}`} style={{ padding: "14px 32px", background: RED, color: "#fff", borderRadius: 4, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>✉ {contact.email}</a>}
            {contact?.phone && <a href={`tel:${contact.phone}`} style={{ padding: "14px 32px", border: `1px solid ${DIM}60`, color: MUTED, borderRadius: 4, fontSize: 15, textDecoration: "none", fontWeight: 600 }}>📞 {contact.phone}</a>}
          </div>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
            {socials.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 12, color: MUTED, textDecoration: "none" }}>
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center", color: DIM, fontSize: 12, marginTop: 20, paddingTop: 20, borderTop: `1px solid ${DIM}15` }} />
      </div>
    </div>
  );
};

export default NetflixPortfolioTheme;
