import React, { useState, useEffect } from "react";

const GREEN = "#00FF41";
const DIM = "rgba(0,255,65,0.5)";
const MUTED = "rgba(0,255,65,0.25)";
const BG = "#0A0A0A";
const BG2 = "#111111";
const CYAN = "#00FFFF";
const YELLOW = "#FFE500";
const PINK = "#FF79C6";
const PURPLE = "#BD93F9";
const ORANGE = "#FFB86C";

const Cursor = () => (
  <span style={{
    display: "inline-block", width: 10, height: 20,
    background: GREEN, marginLeft: 4,
    animation: "term-blink 1s step-end infinite",
    verticalAlign: "text-bottom",
  }} />
);

const NeonTerminalTheme = ({ data }) => {
  const { name, title, about, avatarUrl, skills, projects, experience,
    certifications, achievements, codingProfiles, contact, socialLinks, themeColors = {} } = data;
  const GREEN = themeColors.accent || "#00FF41";
  const BG = themeColors.bg || "#0A0A0A";

  const [activeTab, setActiveTab] = useState("about");
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const id = "terminal-keyframes";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = `
        @keyframes term-blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .term-link:hover { color: ${CYAN} !important; text-shadow: 0 0 8px ${CYAN}40 !important; }
        .term-btn:hover { background: ${GREEN} !important; color: ${BG} !important; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    const text = `> ${name}`;
    if (data.staticPreview || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setTyped(text); return; }
    setTyped("");
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) { setTyped(text.slice(0, i + 1)); i++; }
      else { clearInterval(timer); }
    }, 50);
    return () => clearInterval(timer);
  }, [name, data.staticPreview]);

  const asciiArt = `
  ██████  ██████  ██████  ██████  ██████
  ██      ██  ██  ██  ██  ██  ██  ██
  ██      ██████  ██████  ██████  ██
  ██      ██  ██  ██      ██      ██
  ██████  ██  ██  ██      ██      ██████
  `;

  const socials = [
    { href: socialLinks?.github, label: "github" },
    { href: socialLinks?.linkedin, label: "linkedin" },
    { href: contact?.email ? `mailto:${contact.email}` : null, label: "email" },
    { href: socialLinks?.website, label: "website" },
  ].filter(s => s.href);

  const tabs = [
    { id: "about", label: "about.md" },
    { id: "skills", label: "skills.json" },
    { id: "projects", label: "projects/" },
    { id: "experience", label: "career.log" },
    { id: "contact", label: "contact.sh" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", color: GREEN, position: "relative" }}>
      <div style={{ position: "fixed", left: 0, right: 0, height: "2px", background: "rgba(0,255,65,0.03)", animation: "scanline 8s linear infinite", pointerEvents: "none", zIndex: 999 }} />
      <div style={{ position: "fixed", inset: 0, background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 3px)", pointerEvents: "none", zIndex: 998 }} />

      <div style={{ background: "#1A1A1A", borderBottom: `1px solid ${MUTED}`, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FEBC2E" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }} />
        </div>
        <span style={{ flex: 1, textAlign: "center", fontSize: 11, color: DIM }}>
          {name.toLowerCase().replace(/\s+/g, "-")} — zsh — 80×24
        </span>
      </div>

      <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${MUTED}`, background: BG2, overflowX: "auto" }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "8px 20px", background: activeTab === tab.id ? BG : "transparent",
              border: "none", borderRight: `1px solid ${MUTED}`,
              borderBottom: activeTab === tab.id ? `2px solid ${GREEN}` : "none",
              color: activeTab === tab.id ? GREEN : DIM, fontSize: 11,
              cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
              transition: "background 0.2s",
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px", animation: "fadeIn 0.3s" }}>

        {activeTab === "about" && (
          <div>
            <div style={{ color: MUTED, fontSize: 11, marginBottom: 20 }}>
              # Welcome to {name}'s terminal portfolio
            </div>
            <pre style={{ color: DIM, fontSize: 11, lineHeight: 1.2, marginBottom: 24, fontFamily: "inherit" }}>{asciiArt}</pre>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ color: CYAN }}>user@portfolio</span>
              <span style={{ color: DIM }}>:</span>
              <span style={{ color: PURPLE }}>~</span>
              <span style={{ color: DIM }}>$</span>
              <span style={{ fontSize: 26, fontWeight: 700, color: GREEN }}>{typed}<Cursor /></span>
            </div>
            {title && (
              <div style={{ marginLeft: 16, marginBottom: 8 }}>
                <span style={{ color: MUTED }}>├── </span><span style={{ color: YELLOW }}>role</span><span style={{ color: DIM }}>:</span><span style={{ color: GREEN }}> {title}</span>
              </div>
            )}
            <div style={{ marginLeft: 16, marginBottom: 24 }}>
              <span style={{ color: MUTED }}>├── </span><span style={{ color: YELLOW }}>about</span><span style={{ color: DIM }}>:</span>
              <div style={{ color: "rgba(0,255,65,0.7)", lineHeight: 1.8, fontSize: 13, marginTop: 6, marginLeft: 20 }}>
                {about}
              </div>
            </div>
            <div style={{ color: MUTED, fontSize: 12, marginBottom: 12 }}>$ links --all</div>
            {socials.map((s, i) => (
              <div key={i} style={{ marginBottom: 4, marginLeft: 12 }}>
                <span style={{ color: CYAN }}>  ├── {s.label}</span>
                <span style={{ color: DIM }}> → </span>
                <a href={s.href} target="_blank" rel="noopener noreferrer"
                  className="term-link"
                  style={{ color: GREEN, fontSize: 12, textDecoration: "underline", textUnderlineOffset: 2 }}>
                  {s.href.replace(/^https?:\/\//, "")}
                </a>
              </div>
            ))}
          </div>
        )}

        {activeTab === "skills" && skills?.length > 0 && (
          <div>
            <div style={{ color: MUTED, fontSize: 12, marginBottom: 16 }}>$ ls -la /usr/local/bin/</div>
            {(skills || []).map((s, i) => (
              <div key={i} style={{ marginBottom: 6, marginLeft: 8 }}>
                <span style={{ color: DIM }}>{i === skills.length - 1 ? "└── " : "├── "}</span>
                <span style={{ color: CYAN }}>📦 </span>
                <span style={{ color: GREEN }}>{s}</span>
              </div>
            ))}
            <div style={{ color: MUTED, fontSize: 11, marginTop: 20 }}>
              # {skills?.length || 0} packages installed
            </div>
          </div>
        )}

        {activeTab === "projects" && projects?.length > 0 && (
          <div>
            <div style={{ color: MUTED, fontSize: 12, marginBottom: 16 }}>$ tree ~/projects/ --dirsfirst</div>
            <div style={{ color: DIM, fontSize: 11, marginBottom: 16 }}>~/projects/</div>
            {(projects || []).map((p, i) => (
              <div key={i} style={{ marginBottom: 24, marginLeft: 8 }}>
                {p.image && (
                  <img src={p.image} alt={p.title}
                    style={{
                      width: "100%",
                      height: 180,
                      objectFit: "cover",
                      borderRadius: 0,
                      border: `1px solid ${GREEN}`,
                      marginBottom: 12,
                    }}
                  />
                )}
                <div style={{ marginBottom: 4 }}>
                  <span style={{ color: DIM }}>{i === projects.length - 1 ? "└── " : "├── "}</span>
                  <span style={{ color: CYAN, fontWeight: 700, fontSize: 13 }}>{p.title}/</span>
                  <span style={{ color: DIM, fontSize: 11, marginLeft: 8 }}># {p.techStack?.join(", ") || "no deps"}</span>
                </div>
                <div style={{ color: "rgba(0,255,65,0.55)", fontSize: 12, lineHeight: 1.7, marginLeft: 32, marginBottom: 8 }}>
                  {p.description}
                </div>
                <div style={{ marginLeft: 32, display: "flex", gap: 16 }}>
                  {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="term-link" style={{ color: DIM, fontSize: 11, textDecoration: "underline" }}>$ open --live</a>}
                  {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" className="term-link" style={{ color: DIM, fontSize: 11, textDecoration: "underline" }}>$ git clone</a>}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "experience" && experience?.length > 0 && (
          <div>
            <div style={{ color: MUTED, fontSize: 12, marginBottom: 16 }}>$ cat /var/log/career.log</div>
            {(experience || []).map((e, i) => (
              <div key={i} style={{ marginBottom: 28 }}>
                <div style={{ color: DIM, fontSize: 11, marginBottom: 4 }}>
                  [{e.duration}] <span style={{ color: YELLOW }}>{e.company}</span>
                </div>
                <div style={{ color: GREEN, fontWeight: 700, fontSize: 14, marginLeft: 12 }}>
                  <span style={{ color: PURPLE }}>> </span>{e.role}
                  {e.current && <span style={{ color: "#22C55E", fontSize: 10, marginLeft: 8 }}>● RUNNING</span>}
                </div>
                {e.description && (
                  <div style={{ color: "rgba(0,255,65,0.5)", fontSize: 12, lineHeight: 1.7, marginLeft: 24, marginTop: 8 }}>
                    {e.description}
                  </div>
                )}
                <div style={{ height: 1, background: MUTED, marginTop: 20 }} />
              </div>
            ))}
          </div>
        )}

        {activeTab === "contact" && (
          <div>
            <div style={{ color: MUTED, fontSize: 12, marginBottom: 20 }}>$ ./connect.sh --verbose</div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ color: DIM, fontSize: 11, marginBottom: 12 }}>#!/bin/bash<br /># Connect with {name}</div>
              <div style={{ color: YELLOW, fontSize: 12, marginBottom: 16 }}>echo "Ready to connect →"</div>
            </div>
            {contact?.email && (
              <div style={{ marginBottom: 10, marginLeft: 8 }}>
                <span style={{ color: DIM }}>├── </span>
                <span style={{ color: CYAN }}>EMAIL</span>
                <span style={{ color: MUTED }}> = </span>
                <a href={`mailto:${contact.email}`} className="term-link" style={{ color: GREEN, fontSize: 12 }}>"{contact.email}"</a>
              </div>
            )}
            {contact?.phone && (
              <div style={{ marginBottom: 10, marginLeft: 8 }}>
                <span style={{ color: DIM }}>├── </span>
                <span style={{ color: CYAN }}>PHONE</span>
                <span style={{ color: MUTED }}> = </span>
                <span style={{ color: GREEN, fontSize: 12 }}>"{contact.phone}"</span>
              </div>
            )}
            {socials.map((s, i) => (
              <div key={i} style={{ marginBottom: 10, marginLeft: 8 }}>
                <span style={{ color: DIM }}>{i === socials.length - 1 ? "└── " : "├── "}</span>
                <span style={{ color: CYAN }}>{s.label.toUpperCase()}</span>
                <span style={{ color: MUTED }}> = </span>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="term-link" style={{ color: GREEN, fontSize: 12 }}>"{s.href}"</a>
              </div>
            ))}
            <div style={{ marginTop: 28, color: "#22C55E", fontSize: 12 }}>
              ✓ Connection established · {new Date().toISOString()}
            </div>
          </div>
        )}

        {certifications?.length > 0 && activeTab !== "contact" && activeTab !== "experience" && activeTab !== "projects" && activeTab !== "skills" && (
          <div style={{ marginTop: 32, borderTop: `1px solid ${MUTED}`, paddingTop: 24 }}>
            <div style={{ color: MUTED, fontSize: 12, marginBottom: 16 }}>$ cat /etc/certifications</div>
            {certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: 10, marginLeft: 8 }}>
                <span style={{ color: DIM }}>{i === certifications.length - 1 ? "└── " : "├── "}</span>
                <span style={{ color: YELLOW }}>🏅 {c.title}</span>
                <span style={{ color: DIM, fontSize: 11, marginLeft: 8 }}>{c.issuer}{c.date && ` · ${c.date}`}</span>
              </div>
            ))}
          </div>
        )}

        {achievements?.length > 0 && activeTab !== "contact" && activeTab !== "experience" && activeTab !== "projects" && activeTab !== "skills" && (
          <div style={{ marginTop: 24 }}>
            <div style={{ color: MUTED, fontSize: 12, marginBottom: 16 }}>$ cat /var/log/achievements.log</div>
            {achievements.map((a, i) => (
              <div key={i} style={{ marginBottom: 10, marginLeft: 8 }}>
                <span style={{ color: DIM }}>├── </span>
                <span style={{ color: GREEN, fontWeight: 700 }}>{a.icon || "★"} {a.title}</span>
                {a.description && <span style={{ color: DIM, fontSize: 11, marginLeft: 8 }}>— {a.description}</span>}
              </div>
            ))}
          </div>
        )}

        {codingProfiles?.length > 0 && activeTab !== "contact" && activeTab !== "experience" && (
          <div style={{ marginTop: 24 }}>
            <div style={{ color: MUTED, fontSize: 12, marginBottom: 16 }}>$ whoami --platforms</div>
            {codingProfiles.map((p, i) => (
              <div key={i} style={{ marginBottom: 8, marginLeft: 8 }}>
                <span style={{ color: DIM }}>{i === codingProfiles.length - 1 ? "└── " : "├── "}</span>
                <span style={{ color: PINK }}>[{p.platform}]</span>
                {p.username && <span style={{ color: GREEN, marginLeft: 8 }}>@{p.username}</span>}
                {(p.rating || p.solved) && (
                  <span style={{ color: DIM, fontSize: 11, marginLeft: 8 }}>
                    {p.rating && `rating: ${p.rating}`}{p.solved && ` | solved: ${p.solved}`}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ borderTop: `1px solid ${MUTED}`, padding: "12px 24px", textAlign: "center", color: MUTED, fontSize: 10 }}>
        [EOF] — {name} — {new Date().getFullYear()} — :q to exit
      </div>
    </div>
  );
};

export default NeonTerminalTheme;
