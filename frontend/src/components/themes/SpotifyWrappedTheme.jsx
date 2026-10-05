import React, { useState, useEffect } from "react";

const BG = "#121212";
const GREEN = "#1DB954";
const CARD = "#1E1E1E";
const TEXT = "#FFFFFF";
const MUTED = "#A0A0A0";
const ACCENTS = ["#1DB954", "#E13300", "#FFC864", "#509BF5", "#E8115B", "#BC8CFF"];

const SpotifyWrappedTheme = ({ data }) => {
  const { name, title, about, avatarUrl, skills, projects, experience,
    certifications, achievements, codingProfiles, contact, socialLinks, themeColors = {} } = data;
  const GREEN = themeColors.accent || "#1DB954";
  const BG = themeColors.bg || "#121212";
  const TEXT = themeColors.text || "#FFFFFF";

  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const s = document.createElement("style");
    s.id = "spotify-anim";
    s.textContent = `@keyframes slideIn {from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}@keyframes barGrow{from{width:0}}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}`;
    document.head.appendChild(s);
    return () => document.getElementById("spotify-anim")?.remove();
  }, []);

  const socials = [
    { href: socialLinks?.github, label: "GitHub" },
    { href: socialLinks?.linkedin, label: "LinkedIn" },
    { href: socialLinks?.twitter, label: "Twitter" },
    { href: socialLinks?.website, label: "Website" },
    { href: contact?.email ? `mailto:${contact.email}` : null, label: "Email" },
  ].filter(s => s.href);

  const slides = [
    { id: "cover", label: "Home" },
    ...(skills?.length > 0 ? [{ id: "skills", label: "Top Skills" }] : []),
    ...(projects?.length > 0 ? [{ id: "projects", label: "Projects" }] : []),
    ...(experience?.length > 0 ? [{ id: "experience", label: "Career" }] : []),
    ...(certifications?.length > 0 || achievements?.length > 0 || codingProfiles?.length > 0 ? [{ id: "more", label: "Extras" }] : []),
    { id: "contact", label: "Connect" },
  ];

  const currentId = slides[slide]?.id;

  const slideWrap = {
    minHeight: "calc(100vh - 100px)", display: "flex", flexDirection: "column",
    justifyContent: "center", padding: "0 24px",
    animation: "slideIn 0.6s ease",
  };

  const gradientText = (t, c) => ({
    fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900,
    marginBottom: 8, letterSpacing: "-0.03em", lineHeight: 1.1,
    background: `linear-gradient(135deg, ${c || GREEN}, #fff)`,
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  });

  const section = (id, content) => {
    if (currentId !== id) return null;
    return content;
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'DM Sans', 'Inter', sans-serif", color: TEXT, position: "relative" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: `rgba(18,18,18,0.95)`, padding: "14px 24px", borderBottom: `1px solid ${CARD}` }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 32, height: 32, borderRadius: "50%", background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#000", fontWeight: 900 }}>♪</span>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{name}</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {slides.map((s, i) => (
              <button key={s.id} onClick={() => setSlide(i)}
                title={s.label}
                style={{
                  width: slide === i ? 24 : 10, height: 10, borderRadius: 5, border: "none",
                  background: slide === i ? GREEN : "#333", cursor: "pointer",
                  transition: "all 0.3s", padding: 0,
                }} />
            ))}
          </div>
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 100, display: "flex", gap: 14 }}>
        <button onClick={() => setSlide(Math.max(0, slide - 1))}
          style={{ padding: "10px 24px", borderRadius: 999, border: `1px solid #333`, background: "transparent", color: MUTED, fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
          ← Back
        </button>
        <button onClick={() => setSlide(Math.min(slides.length - 1, slide + 1))}
          style={{ padding: "10px 24px", borderRadius: 999, border: "none", background: GREEN, color: "#000", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 800 }}>
          Next →
        </button>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", paddingTop: 80 }}>

        {section("cover", (
          <div style={slideWrap}>
            {avatarUrl && <img src={avatarUrl} alt={name} style={{ width: 130, height: 130, borderRadius: "50%", objectFit: "cover", marginBottom: 28, border: "4px solid #222", boxShadow: `0 0 40px ${GREEN}30` }}
              onError={e => e.target.style.display = "none"} />}
            <div style={{ fontSize: 13, color: GREEN, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Portfolio Wrapped 2026</div>
            <h1 style={{ fontSize: "clamp(3.5rem, 8vw, 6rem)", fontWeight: 900, marginBottom: 10, letterSpacing: "-0.04em", lineHeight: 0.95 }}>{name}</h1>
            {title && <p style={{ fontSize: 20, color: MUTED, fontWeight: 600, marginBottom: 14 }}>{title}</p>}
            <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.8, maxWidth: 520, marginBottom: 32 }}>{about}</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ padding: "10px 22px", borderRadius: 999, border: `1px solid #333`, color: MUTED, fontSize: 13, textDecoration: "none", fontWeight: 600, transition: "0.2s" }}>
                  {s.label}
                </a>
              ))}
            </div>
            <div style={{ marginTop: 48, fontSize: 14, color: MUTED, letterSpacing: "0.05em" }}>Swipe to explore →</div>
          </div>
        ))}

        {section("skills", (
          <div style={slideWrap}>
            <div style={{ fontSize: 13, color: GREEN, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>My Top Skills</div>
            <h2 style={gradientText("Most Used\nTechnologies")}>Most Used Technologies</h2>
            <p style={{ fontSize: 14, color: MUTED, marginBottom: 32 }}>Your coding DNA in numbers.</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {skills?.map((s, i) => (
                <span key={i} style={{
                  padding: "10px 22px", borderRadius: 999,
                  background: `linear-gradient(135deg, ${ACCENTS[i % ACCENTS.length]}30, ${ACCENTS[(i + 1) % ACCENTS.length]}30)`,
                  border: `1px solid ${ACCENTS[i % ACCENTS.length]}40`,
                  color: TEXT, fontSize: 15, fontWeight: 600,
                  animation: "fadeIn 0.5s ease", animationDelay: `${i * 0.08}s`,
                  display: "inline-flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{ color: ACCENTS[i % ACCENTS.length], fontWeight: 800 }}>#{i + 1}</span>
                  {s}
                </span>
              ))}
            </div>
            <div style={{ marginTop: 28, padding: 20, background: CARD, borderRadius: 12, display: "flex", justifyContent: "space-around", textAlign: "center" }}>
              <div><div style={{ fontSize: 32, fontWeight: 900, color: GREEN }}>{skills?.length || 0}</div><div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>Skills</div></div>
              <div><div style={{ fontSize: 32, fontWeight: 900, color: ACCENTS[3] }}>{projects?.length || 0}</div><div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>Projects</div></div>
              <div><div style={{ fontSize: 32, fontWeight: 900, color: ACCENTS[4] }}>{experience?.length || 0}</div><div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>Roles</div></div>
            </div>
          </div>
        ))}

        {section("projects", (
          <div style={slideWrap}>
            <div style={{ fontSize: 13, color: GREEN, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Discography</div>
            <h2 style={gradientText("Projects", ACCENTS[1])}>Released Works</h2>
            <p style={{ fontSize: 14, color: MUTED, marginBottom: 28 }}>{projects?.length || 0} albums released.</p>
            <div style={{ display: "grid", gap: 14 }}>
              {projects?.map((p, i) => (
                <div key={i} style={{
                  display: "flex", gap: 16, background: CARD, borderRadius: 10, padding: 18,
                  alignItems: "center", border: "1px solid rgba(255,255,255,0.04)",
                }}>
                  {p.image ? (
                    <img src={p.image} alt={p.title} style={{ width: 60, height: 60, borderRadius: 4, objectFit: "cover", flexShrink: 0 }} />
                  ) : (
                    <div style={{
                      width: 60, height: 60, borderRadius: 8,
                      background: `linear-gradient(135deg, ${ACCENTS[i % ACCENTS.length]}, ${ACCENTS[(i + 2) % ACCENTS.length]})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 26, fontWeight: 900, flexShrink: 0, color: "#000",
                    }}>{p.title[0]}</div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 3 }}>{p.title}</div>
                    <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.6, margin: 0 }}>{p.description}</p>
                    {p.techStack?.length > 0 && (
                      <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
                        {p.techStack.map((t, j) => <span key={j} style={{ fontSize: 10, padding: "2px 10px", borderRadius: 999, background: `${ACCENTS[i % ACCENTS.length]}20`, color: ACCENTS[i % ACCENTS.length], fontWeight: 600 }}>{t}</span>)}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
                      {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: GREEN, fontWeight: 700, textDecoration: "none" }}>Listen ↗</a>}
                      {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: MUTED, textDecoration: "none" }}>Credits</a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {section("experience", (
          <div style={slideWrap}>
            <div style={{ fontSize: 13, color: GREEN, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Listening History</div>
            <h2 style={gradientText("Career Path", ACCENTS[3])}>Professional Journey</h2>
            <p style={{ fontSize: 14, color: MUTED, marginBottom: 24 }}>The tracks that shaped my career.</p>
            <div style={{ display: "grid", gap: 14 }}>
              {experience?.map((e, i) => (
                <div key={i} style={{
                  background: CARD, borderRadius: 12, padding: 20,
                  borderLeft: `4px solid ${ACCENTS[i % ACCENTS.length]}`,
                  animation: "fadeIn 0.4s ease",
                  animationDelay: `${i * 0.1}s`,
                }}>
                  <div style={{ fontSize: 12, color: ACCENTS[i % ACCENTS.length], fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{e.duration}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 3 }}>{e.role}</div>
                  <div style={{ fontSize: 14, color: MUTED, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>{e.company}{e.current && <span style={{ color: GREEN, fontSize: 10 }}>● Now Playing</span>}</div>
                  {e.description && <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.7, margin: 0 }}>{e.description}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}

        {section("more", (
          <div style={slideWrap}>
            <div style={{ fontSize: 13, color: GREEN, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Extras</div>
            <h2 style={gradientText("More Stats", ACCENTS[4])}>Certifications & Achievements</h2>
            {certifications?.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, color: MUTED, fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Certifications</h3>
                <div style={{ display: "grid", gap: 8 }}>
                  {certifications.map((c, i) => (
                    <div key={i} style={{ background: CARD, borderRadius: 8, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{c.title}</div>
                        <div style={{ fontSize: 12, color: MUTED }}>{c.issuer}{c.date && ` · ${c.date}`}</div>
                      </div>
                      {c.credentialUrl && <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: GREEN, textDecoration: "none", fontWeight: 600 }}>Verify</a>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {achievements?.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, color: MUTED, fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Achievements</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
                  {achievements.map((a, i) => (
                    <div key={i} style={{ background: CARD, borderRadius: 8, padding: 16, textAlign: "center", border: `1px solid ${ACCENTS[i % ACCENTS.length]}20` }}>
                      <div style={{ fontSize: 32, marginBottom: 6 }}>{a.icon || "🏆"}</div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{a.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {codingProfiles?.length > 0 && (
              <div>
                <h3 style={{ fontSize: 14, color: MUTED, fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Coding Profiles</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
                  {codingProfiles.map((p, i) => (
                    <a key={i} href={p.url || "#"} target="_blank" rel="noopener noreferrer"
                      style={{ background: CARD, borderRadius: 8, padding: 14, textDecoration: "none", color: TEXT, display: "block" }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{p.platform}</div>
                      {p.username && <div style={{ fontSize: 11, color: MUTED, fontFamily: "monospace" }}>@{p.username}</div>}
                      {p.solved && <div style={{ fontSize: 11, color: GREEN, marginTop: 4, fontWeight: 600 }}>{p.solved} solved</div>}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {section("contact", (
          <div style={{ ...slideWrap, alignItems: "center", textAlign: "center" }}>
            <div style={{ width: 90, height: 90, borderRadius: "50%", background: `linear-gradient(135deg, ${GREEN}, #000)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, marginBottom: 24, animation: "pulse 2.5s infinite" }}>♪</div>
            <div style={{ fontSize: 13, color: GREEN, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Connect</div>
            <h2 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, marginBottom: 12, lineHeight: 1.1 }}>Let's make<br />something great</h2>
            <p style={{ fontSize: 15, color: MUTED, maxWidth: 420, marginBottom: 32, lineHeight: 1.8 }}>Find my contact links below.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              {contact?.email && <a href={`mailto:${contact.email}`} style={{ padding: "14px 32px", borderRadius: 999, background: GREEN, color: "#000", fontSize: 14, fontWeight: 800, textDecoration: "none" }}>✉ {contact.email}</a>}
              {contact?.phone && <a href={`tel:${contact.phone}`} style={{ padding: "14px 32px", borderRadius: 999, border: `1px solid #333`, color: MUTED, fontSize: 14, textDecoration: "none", fontWeight: 600 }}>📞 {contact.phone}</a>}
            </div>
            <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: MUTED, textDecoration: "none", padding: "6px 16px", border: `1px solid #333`, borderRadius: 999 }}>
                  {s.label}
                </a>
              ))}
            </div>
            <div style={{ marginTop: 48, fontSize: 12, color: MUTED, letterSpacing: "0.03em" }}>Thanks for listening. ♻️ Share your wrapped.</div>
          </div>
        ))}
        <div style={{ textAlign: "center", color: MUTED, fontSize: 11, padding: "24px 0 100px", borderTop: `1px solid ${CARD}`, marginTop: 20 }} />
      </div>
    </div>
  );
};

export default SpotifyWrappedTheme;
