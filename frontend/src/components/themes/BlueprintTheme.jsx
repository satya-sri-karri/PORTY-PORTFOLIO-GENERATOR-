import React, { useState, useEffect } from "react";

const BlueprintTheme = ({ data }) => {
  const { name, title, about, avatarUrl, skills, projects, experience,
    certifications, achievements, codingProfiles, contact, socialLinks, themeColors = {} } = data;
  const [active, setActive] = useState("about");

  const socials = [
    { href: socialLinks?.github, label: "GitHub" },
    { href: socialLinks?.linkedin, label: "LinkedIn" },
    { href: socialLinks?.twitter, label: "Twitter" },
    { href: socialLinks?.website, label: "Website" },
    { href: contact?.email ? `mailto:${contact.email}` : null, label: "Email" },
  ].filter(s => s.href);

  useEffect(() => {
    const style = document.createElement("style");
    style.id = "blueprint-keyframes";
    style.textContent = `@keyframes blueprintPulse { 0%,100% { opacity:0.4; } 50% { opacity:0.8; } }`;
    document.head.appendChild(style);
    return () => document.getElementById("blueprint-keyframes")?.remove();
  }, []);

  const CYAN = themeColors.accent || "#4FC3F7";
  const BG = themeColors.bg || "#0A1628";
  const WHITE = themeColors.text || "rgba(255,255,255,0.85)";
  const LINE = "rgba(79,195,247,0.15)";
  const MUTED = "rgba(79,195,247,0.5)";
  const ACCENT = "#FFD700";

  const blueprintCard = {
    background: "rgba(10,22,40,0.85)",
    border: "1px solid " + LINE,
    borderRadius: 4,
    padding: 24,
    position: "relative",
  };

  const tabs = [
    { id: "about", label: "SHEET-01" }, { id: "skills", label: "SHEET-02" },
    { id: "projects", label: "SHEET-03" }, { id: "experience", label: "SHEET-04" },
    { id: "more", label: "SHEET-05" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace", color: CYAN, position: "relative", overflowX: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, backgroundImage: `repeating-linear-gradient(0deg,${LINE} 0px,${LINE} 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,${LINE} 0px,${LINE} 1px,transparent 1px,transparent 40px)`, backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0, opacity: 0.6 }} />

      <div style={{ position: "fixed", inset: 12, border: "1px solid " + LINE, pointerEvents: "none", zIndex: 1 }}>
        {["tl", "tr", "bl", "br"].map(c => {
          const isTop = c === "tl" || c === "tr";
          const isLeft = c === "tl" || c === "bl";
          return (
            <div key={c} style={{ position: "absolute", [isTop ? "top" : "bottom"]: -8, [isLeft ? "left" : "right"]: -8, width: 14, height: 14, borderTop: "2px solid " + CYAN, borderLeft: isLeft ? "2px solid " + CYAN : "none", borderRight: isLeft ? "none" : "2px solid " + CYAN, transform: isTop ? "none" : "rotate(180deg)" }} />
          );
        })}
      </div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: 960, margin: "0 auto", padding: "32px 24px 60px" }}>
        <div style={{ ...blueprintCard, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>PROJECT: {name?.toUpperCase().replace(/ /g, "_")}</div>
            <div style={{ fontSize: 11, color: MUTED }}>DISCIPLINE: {title?.toUpperCase() || "PORTFOLIO"}</div>
          </div>
          <div style={{ fontSize: 11, color: MUTED, textAlign: "right" }}>
            <div>SHEET {tabs.findIndex(t => t.id === active) + 1} OF {tabs.length}</div>
            <div>SCALE: 1:1</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "1px solid " + LINE }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActive(t.id)} style={{
              padding: "8px 20px", border: "1px solid " + LINE, borderBottom: active === t.id ? "2px solid " + CYAN : "1px solid " + LINE,
              background: active === t.id ? "rgba(79,195,247,0.06)" : "transparent",
              color: active === t.id ? CYAN : MUTED, fontSize: 11, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.05em",
            }}>
              [{t.label}]
            </button>
          ))}
        </div>

        {active === "about" && (
          <div style={{ ...blueprintCard }}>
            <div style={{ fontSize: 10, color: MUTED, marginBottom: 16, display: "flex", gap: 16 }}>
              <span>DWG NO: A-001</span><span>REV: 1.0</span>
            </div>
            <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
              {avatarUrl && (
                <div style={{ border: "1px solid " + LINE, padding: 4, borderRadius: 2 }}>
                  <img src={avatarUrl} alt={name} onError={e => e.target.style.display = "none"} style={{ width: 80, height: 80, objectFit: "cover", display: "block" }} />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: WHITE, marginBottom: 4, letterSpacing: "-0.02em" }}>{name}</h1>
                {title && <div style={{ fontSize: 12, color: ACCENT, marginBottom: 16, letterSpacing: "0.1em" }}>◆ {title?.toUpperCase()}</div>}
                <p style={{ fontSize: 12, lineHeight: 1.9, color: "rgba(79,195,247,0.7)", maxWidth: 600 }}>{about}</p>
              </div>
            </div>
            {socials.length > 0 && (
              <div style={{ marginTop: 20, borderTop: "1px solid " + LINE, paddingTop: 16 }}>
                <div style={{ fontSize: 10, color: MUTED, marginBottom: 8 }}>EXTERNAL REFERENCES:</div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  {socials.map(s => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 11, color: CYAN, textDecoration: "none", borderBottom: "1px dashed " + LINE }}>
                      [{s.label}]
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {active === "skills" && skills?.length > 0 && (
          <div style={{ ...blueprintCard }}>
            <div style={{ fontSize: 10, color: MUTED, marginBottom: 16 }}>DWG NO: A-002 // MATERIALS SPEC</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {skills.map((s, i) => (
                <span key={i} style={{
                  padding: "6px 14px", border: "1px solid " + LINE, fontSize: 11, color: CYAN,
                  background: "rgba(79,195,247,0.04)", letterSpacing: "0.03em", position: "relative",
                }}>
                  {s}
                  <span style={{ position: "absolute", bottom: -2, right: -2, fontSize: 8, color: MUTED }}>◇</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {active === "projects" && projects?.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: 10, color: MUTED, marginBottom: 4 }}>DWG NO: A-003 // STRUCTURAL PLANS</div>
            {projects.map((p, i) => (
              <div key={i} style={{ ...blueprintCard }}>
                {p.image && (
                  <img src={p.image} alt={p.title}
                    style={{
                      width: "100%",
                      height: 180,
                      objectFit: "cover",
                      borderRadius: 2,
                      border: `1px solid ${LINE}`,
                      marginBottom: 12,
                    }}
                  />
                )}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 10, color: MUTED, marginBottom: 4 }}>DETAIL {String(i + 1).padStart(3, "0")}</div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: WHITE }}>{p.title}</h3>
                  </div>
                  <div style={{ fontSize: 10, color: MUTED, textAlign: "right" }}><div>SHEET {i + 1}/3</div></div>
                </div>
                <div style={{ borderTop: "1px solid " + LINE, borderBottom: "1px solid " + LINE, padding: "12px 0", marginBottom: 12 }}>
                  <p style={{ fontSize: 11, lineHeight: 1.8, color: "rgba(79,195,247,0.65)" }}>{p.description}</p>
                </div>
                {p.techStack?.length > 0 && (
                  <div style={{ fontSize: 10, color: MUTED, marginBottom: 12 }}>
                    <span style={{ color: ACCENT }}>SPECS:</span> {p.techStack.join(", ")}
                  </div>
                )}
                <div style={{ display: "flex", gap: 16, fontSize: 10 }}>
                  {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ color: CYAN, textDecoration: "none", borderBottom: "1px dashed " + LINE }}>VIEW_BUILD</a>}
                  {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ color: MUTED, textDecoration: "none", borderBottom: "1px dashed " + LINE }}>SOURCE_CODE</a>}
                </div>
              </div>
            ))}
          </div>
        )}

        {active === "experience" && experience?.length > 0 && (
          <div>
            <div style={{ fontSize: 10, color: MUTED, marginBottom: 16 }}>DWG NO: A-004 // CONSTRUCTION LOG</div>
            {experience.map((e, i) => (
              <div key={i} style={{ ...blueprintCard, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ fontSize: 11, color: ACCENT, fontFamily: "monospace", minWidth: 80 }}>{e.duration}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: WHITE }}>{e.role}</div>
                    <div style={{ fontSize: 11, color: CYAN, marginBottom: 8 }}>{e.company}</div>
                    {e.description && <p style={{ fontSize: 11, lineHeight: 1.8, color: "rgba(79,195,247,0.6)" }}>{e.description}</p>}
                  </div>
                </div>
                <div style={{ borderTop: "1px solid " + LINE, marginTop: 12, paddingTop: 8, display: "flex", justifyContent: "flex-end", fontSize: 10, color: MUTED }}>
                  {e.current ? "● ACTIVE CONTRACT" : "CONTRACT COMPLETE"}
                </div>
              </div>
            ))}
          </div>
        )}

        {active === "more" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: 10, color: MUTED, marginBottom: 4 }}>DWG NO: A-005 // APPENDIX</div>
            {certifications?.length > 0 && (
              <div style={{ ...blueprintCard }}>
                <div style={{ fontSize: 10, color: MUTED, marginBottom: 12 }}>CERTIFICATIONS:</div>
                {certifications.map((c, i) => (
                  <div key={i} style={{ padding: "8px 0", borderBottom: i < certifications.length - 1 ? "1px solid " + LINE : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div><span style={{ fontSize: 12, color: WHITE }}>{c.title}</span><span style={{ fontSize: 10, color: MUTED, marginLeft: 8 }}>— {c.issuer}</span></div>
                    <div style={{ fontSize: 10, color: MUTED }}>{c.date}{c.credentialUrl && <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ color: CYAN, marginLeft: 8, textDecoration: "none" }}>[VERIFY]</a>}</div>
                  </div>
                ))}
              </div>
            )}
            {achievements?.length > 0 && (
              <div style={{ ...blueprintCard }}>
                <div style={{ fontSize: 10, color: MUTED, marginBottom: 12 }}>ACHIEVEMENTS:</div>
                {achievements.map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: i < achievements.length - 1 ? "1px solid " + LINE : "none" }}>
                    <span style={{ fontSize: 16 }}>{a.icon || "★"}</span>
                    <div><div style={{ fontSize: 12, color: WHITE }}>{a.title}</div>{a.description && <div style={{ fontSize: 10, color: "rgba(79,195,247,0.6)" }}>{a.description}</div>}{a.date && <div style={{ fontSize: 10, color: MUTED }}>{a.date}</div>}</div>
                  </div>
                ))}
              </div>
            )}
            {codingProfiles?.length > 0 && (
              <div style={{ ...blueprintCard }}>
                <div style={{ fontSize: 10, color: MUTED, marginBottom: 12 }}>CODING PROFILES:</div>
                {codingProfiles.map((p, i) => (
                  <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < codingProfiles.length - 1 ? "1px solid " + LINE : "none", textDecoration: "none" }}>
                    <div><span style={{ fontSize: 11, color: CYAN }}>{p.platform}</span><span style={{ fontSize: 10, color: MUTED, marginLeft: 8 }}>@{p.username}</span></div>
                    <div style={{ fontSize: 10, color: ACCENT }}>{p.rating && `RATING: ${p.rating}`}{p.rating && p.solved ? " | " : ""}{p.solved && `SOLVED: ${p.solved}`}</div>
                  </a>
                ))}
              </div>
            )}
            <div style={{ ...blueprintCard }}>
              <div style={{ fontSize: 10, color: MUTED, marginBottom: 12 }}>CONTACT INFO:</div>
              {contact?.email && <div style={{ fontSize: 11, color: CYAN }}>{contact.email}</div>}
              {contact?.phone && <div style={{ fontSize: 11, color: CYAN, marginTop: 6 }}>{contact.phone}</div>}
            </div>
          </div>
        )}

        <div style={{ marginTop: 40, borderTop: "1px solid " + LINE, paddingTop: 12, fontSize: 9, color: MUTED, textAlign: "center", letterSpacing: "0.1em" }}>
          BLUEPRINT v2.0 // {name?.toUpperCase()} // ALL RIGHTS RESERVED // {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};

export default BlueprintTheme;
