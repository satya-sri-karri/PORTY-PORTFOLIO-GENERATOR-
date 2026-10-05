import React from "react";

const PAPER = "#F5F0E0";
const DARK = "#1A1A1A";
const ACCENT = "#8B0000";
const GRAY = "#666666";
const BORDER = "#CCCCCC";

const NewspaperTheme = ({ data }) => {
  const { name, title, about, avatarUrl, skills, projects, experience,
    certifications, achievements, codingProfiles, contact, socialLinks, themeColors = {} } = data;
  const ACCENT = themeColors.accent || "#8B0000";
  const PAPER = themeColors.bg || "#F5F0E0";
  const DARK = themeColors.text || "#1A1A1A";

  const socials = [
    { href: socialLinks?.github, label: "GitHub" },
    { href: socialLinks?.linkedin, label: "LinkedIn" },
    { href: socialLinks?.twitter, label: "Twitter" },
    { href: socialLinks?.website, label: "Website" },
    { href: contact?.email ? `mailto:${contact.email}` : null, label: "Email" },
  ].filter(s => s.href);

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const vol = Math.floor(Math.random() * 50 + 1);
  const no = Math.floor(Math.random() * 9999 + 1);

  const divider = { height: 1, background: BORDER, margin: "18px 0" };

  return (
    <div style={{ minHeight: "100vh", background: PAPER, fontFamily: "'Playfair Display', 'Times New Roman', Georgia, serif", color: DARK }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 28px" }}>
        <div style={{ textAlign: "center", padding: "36px 0 18px", borderBottom: `2px solid ${DARK}` }}>
          <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: GRAY, marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>
            The Daily Portfolio
          </div>
          <h1 style={{ fontSize: "clamp(3rem, 7vw, 4.5rem)", fontWeight: 900, fontFamily: "'Playfair Display', serif", margin: "0 0 4px", letterSpacing: "-0.02em", fontStyle: "italic" }}>{name}</h1>
          {title && <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.18em", color: GRAY, marginTop: 6, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>{title}</div>}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em", color: GRAY, borderBottom: `1px solid ${BORDER}`, fontFamily: "'Inter', sans-serif" }}>
          <span>{dateStr}</span>
          <span>Vol. {vol} No. {no}</span>
          <span>Price: One Shilling</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 8, textTransform: "uppercase", letterSpacing: "0.08em", color: GRAY, borderBottom: `1px solid ${BORDER}`, fontFamily: "'Inter', sans-serif" }}>
          <span>Est. {now.getFullYear() - 1}</span>
          <span>Portfolio Gazette</span>
        </div>

        <div style={{ padding: "28px 0 20px", textAlign: "center", borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: "0.25em", marginBottom: 10, fontFamily: "'Inter', sans-serif" }}>Exclusive</div>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, margin: 0, lineHeight: 1.15, fontFamily: "'Playfair Display', serif" }}>{name} Launches Portfolio</h2>
          {about && <div style={{ fontSize: 12, color: GRAY, marginTop: 12, fontStyle: "italic", fontFamily: "'Georgia', serif", maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>"{about?.split(".")[0] || "A showcase of work and experience"}."</div>}
        </div>

        {about && (
          <div style={{ padding: "24px 0", borderBottom: `1px solid ${BORDER}`, fontFamily: "'Georgia', serif" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'Inter', sans-serif", marginBottom: 12, color: DARK, borderBottom: `1px solid ${BORDER}`, paddingBottom: 6 }}>Front Page Interview</h3>
            {avatarUrl && (
              <div style={{ float: "left", margin: "0 20px 12px 0" }}>
                <img src={avatarUrl} alt={name} style={{ width: 90, height: 90, objectFit: "cover", border: "1px solid #DDD" }}
                  onError={e => e.target.style.display = "none"} />
              </div>
            )}
            <p style={{ fontSize: 14, lineHeight: 1.9, columnCount: 2, columnGap: 36, margin: 0, textAlign: "justify" }}>{about}</p>
            <div style={{ clear: "both", display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap", paddingTop: 12, borderTop: `1px dotted ${BORDER}` }}>
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: "0.05em", textDecoration: "none", fontFamily: "'Inter', sans-serif" }}>{s.label}</a>
              ))}
            </div>
          </div>
        )}

        {skills?.length > 0 && (
          <div style={{ padding: "24px 0", borderBottom: `1px solid ${BORDER}` }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "'Inter', sans-serif", marginBottom: 12 }}>Classifieds - Skills and Technologies</h3>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, columnCount: 3, columnGap: 20 }}>
              {skills.map((s, i) => (
                <div key={i} style={{ marginBottom: 6, color: GRAY }}>
                  <span style={{ color: DARK }}>+</span> {s}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8, fontSize: 9, color: GRAY, fontStyle: "italic", fontFamily: "'Georgia', serif" }}>
              {skills.length} proficiencies listed
            </div>
          </div>
        )}

        {projects?.length > 0 && (
          <div style={{ padding: "24px 0", borderBottom: `1px solid ${BORDER}` }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'Inter', sans-serif", marginBottom: 20 }}>
              <span style={{ background: DARK, color: PAPER, padding: "3px 12px", fontSize: 11 }}>Projects</span>
            </h3>
            {projects.map((p, i) => (
              <div key={i} style={{ marginBottom: 20, paddingBottom: 16, borderBottom: `1px dotted ${BORDER}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "'Inter', sans-serif", marginBottom: 4 }}>
                  Project {i + 1}
                </div>
                {p.image && (
                  <div style={{ marginBottom: 12 }}>
                    <img src={p.image} alt={p.title} style={{ width: "100%", height: 160, objectFit: "cover", filter: "grayscale(0.8)", border: "1px solid #CCC", display: "block" }} />
                    <div style={{ fontSize: 10, color: GRAY, fontStyle: "italic", marginTop: 4, fontFamily: "'Georgia', serif" }}>Figure {i + 1}: {p.title}</div>
                  </div>
                )}
                <h4 style={{ fontSize: 19, fontWeight: 700, margin: "0 0 6px", lineHeight: 1.2, fontFamily: "'Playfair Display', serif" }}>{p.title}</h4>
                <p style={{ fontSize: 13, lineHeight: 1.8, fontFamily: "'Georgia', serif", margin: 0 }}>{p.description}</p>
                <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap", fontFamily: "'Courier New', monospace", fontSize: 10, color: GRAY }}>
                  {p.techStack?.map((t, j) => (
                    <span key={j}>{t}{j < p.techStack.length - 1 ? "," : ""}</span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                  {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textDecoration: "none", fontFamily: "'Inter', sans-serif" }}>View Project</a>}
                  {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, fontWeight: 700, color: GRAY, textDecoration: "none", fontFamily: "'Inter', sans-serif" }}>Source</a>}
                </div>
              </div>
            ))}
          </div>
        )}

        {experience?.length > 0 && (
          <div style={{ padding: "24px 0", borderBottom: `1px solid ${BORDER}` }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "'Inter', sans-serif", marginBottom: 16 }}>Business Section - Career Chronicle</h3>
            <div style={{ fontSize: 9, color: GRAY, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'Inter', sans-serif", marginBottom: 12 }}>From the archives</div>
            {experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 18, paddingLeft: 18, borderLeft: `2px solid ${ACCENT}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'Inter', sans-serif" }}>{e.duration}</div>
                <h4 style={{ fontSize: 17, fontWeight: 700, margin: "2px 0", fontFamily: "'Playfair Display', serif" }}>{e.role}</h4>
                <div style={{ fontSize: 12, fontStyle: "italic", color: GRAY, marginBottom: 6 }}>{e.company}{e.current && " - Present Role"}</div>
                {e.description && <p style={{ fontSize: 13, lineHeight: 1.7, fontFamily: "'Georgia', serif", margin: 0 }}>{e.description}</p>}
                {i < experience.length - 1 && <div style={{ marginTop: 14, height: 1, background: `linear-gradient(90deg, ${BORDER}, transparent)` }} />}
              </div>
            ))}
          </div>
        )}

        <div style={{ padding: "24px 0", borderBottom: `1px solid ${BORDER}`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
          {certifications?.length > 0 && (
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'Inter', sans-serif", borderBottom: `2px solid ${DARK}`, paddingBottom: 4, marginBottom: 14 }}>Certifications</h3>
              {certifications.map((c, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: GRAY }}>{c.issuer} - {c.date}</div>
                  {c.credentialUrl && <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: ACCENT, textDecoration: "none" }}>Verify</a>}
                </div>
              ))}
            </div>
          )}
          {achievements?.length > 0 && (
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'Inter', sans-serif", borderBottom: `2px solid ${DARK}`, paddingBottom: 4, marginBottom: 14 }}>Honors and Distinctions</h3>
              <p style={{ fontSize: 9, color: GRAY, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'Inter', sans-serif", marginBottom: 10 }}>Awards and recognitions</p>
              {achievements.map((a, i) => (
                <div key={i} style={{ marginBottom: 14, padding: 10, border: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{a.icon} {a.title}</div>
                  {a.description && <div style={{ fontSize: 11, color: GRAY, lineHeight: 1.5 }}>{a.description}</div>}
                  {a.date && <div style={{ fontSize: 9, color: GRAY, marginTop: 4, fontFamily: "'Inter', sans-serif" }}>Awarded: {a.date}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {codingProfiles?.length > 0 && (
          <div style={{ padding: "24px 0", borderBottom: `1px solid ${BORDER}` }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'Inter', sans-serif", marginBottom: 12 }}>Coding Profiles</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
              {codingProfiles.map((p, i) => (
                <a key={i} href={p.url || "#"} target="_blank" rel="noopener noreferrer" style={{ color: DARK, textDecoration: "none", border: `1px solid ${BORDER}`, padding: 10, display: "block" }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{p.platform}</div>
                  <div style={{ fontSize: 11, color: GRAY, fontFamily: "'Courier New', monospace" }}>@{p.username}</div>
                  {(p.rating || p.solved) && <div style={{ fontSize: 10, color: ACCENT, marginTop: 4 }}>{p.rating && `Rating: ${p.rating}`}{p.rating && p.solved && " | "}{p.solved && `${p.solved} solved`}</div>}
                </a>
              ))}
            </div>
          </div>
        )}

        <div style={{ padding: "28px 0", textAlign: "center", borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 9, color: GRAY, textTransform: "uppercase", letterSpacing: "0.15em", fontFamily: "'Inter', sans-serif", marginBottom: 4 }}>Classified Advertisements</div>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "'Inter', sans-serif", marginBottom: 8 }}>Contact and Correspondence</h3>
          <p style={{ fontSize: 12, fontStyle: "italic", color: GRAY, marginBottom: 16, fontFamily: "'Georgia', serif" }}>
            Contact links and inquiries.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            {contact?.email && (
              <a href={`mailto:${contact.email}`} style={{ padding: "10px 24px", background: DARK, color: PAPER, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", textDecoration: "none", fontFamily: "'Inter', sans-serif" }}>{contact.email}</a>
            )}
            {socialLinks?.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" style={{ padding: "10px 24px", border: `1px solid ${DARK}`, color: DARK, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", textDecoration: "none", fontFamily: "'Inter', sans-serif" }}>LinkedIn</a>
            )}
          </div>
          <div style={{ marginTop: 12, fontSize: 9, color: GRAY, fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
            {contact?.phone && <span>Tel: {contact.phone} - </span>}
            All inquiries answered promptly.
          </div>
        </div>

        <div style={{ borderTop: `2px solid ${DARK}`, padding: "12px 0", fontSize: 10, color: GRAY, display: "flex", justifyContent: "space-between", fontFamily: "'Georgia', serif", marginTop: 4 }}>
          <span>(c) {now.getFullYear()} {name}. All Rights Reserved.</span>
          <span>Printed on recycled pixels</span>
        </div>
      </div>
    </div>
  );
};

export default NewspaperTheme;
