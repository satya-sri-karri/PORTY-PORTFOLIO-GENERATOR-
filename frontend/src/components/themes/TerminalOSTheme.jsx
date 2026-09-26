import React, { useState, useEffect } from "react";

const GREEN = "#00FF41";
const DIM = "rgba(0,255,65,0.5)";
const MUTED = "rgba(0,255,65,0.2)";
const BG = "#0C0C0C";
const BG2 = "#141414";
const GRAY = "#888";
const BLUE = "#569CD6";
const YELLOW = "#FFE500";

const TerminalOSTheme = ({ data }) => {
  const { name, title, about, avatarUrl, skills, projects, experience,
    certifications, achievements, codingProfiles, contact, socialLinks, themeColors = {} } = data;
  const GREEN = themeColors.accent || "#00FF41";
  const BG = themeColors.bg || "#0C0C0C";

  const [cmd, setCmd] = useState("");
  const [history, setHistory] = useState([]);
  const [dir, setDir] = useState("~");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const socials = [
    { href: socialLinks?.github, label: "github" },
    { href: socialLinks?.linkedin, label: "linkedin" },
    { href: socialLinks?.twitter, label: "twitter" },
    { href: socialLinks?.website, label: "website" },
    { href: contact?.email ? `mailto:${contact.email}` : null, label: "email" },
  ].filter(s => s.href);

  const files = [
    { name: "README.md", type: "file" },
    { name: "about/", type: "dir" },
    { name: "skills/", type: "dir" },
    { name: "projects/", type: "dir" },
    { name: "experience/", type: "dir" },
    { name: "certs/", type: "dir" },
    { name: "contact.json", type: "file" },
  ];

  const handleCommand = (e) => {
    if (e.key !== "Enter" || !cmd.trim()) return;
    const input = cmd.trim();
    let output = "";
    const lower = input.toLowerCase();
    if (lower === "help") {
      output = `Available commands:\n  whoami, ls, about, skills, projects, experience\n  certs, contact, clear, ${socials.map(s => s.label).join(", ")}`;
    } else if (lower === "whoami") {
      output = `${name} — ${title || "Developer"}`;
    } else if (lower === "ls") {
      output = files.map(f => f.type === "dir" ? `${f.name}/` : f.name).join("    ");
    } else if (lower === "about" || lower === "cat about/") {
      output = about || "No about info";
    } else if (lower === "skills" || lower === "cat skills/") {
      output = skills?.length ? skills.join("\n  ├─ ") : "No skills";
      if (skills?.length) output = ".\n├─ " + output;
    } else if (lower === "projects" || lower === "ls projects/") {
      output = projects?.length ? projects.map(p => `📦 ${p.title}\n${p.image ? `   [img] ${p.image.startsWith("data:") ? "uploaded-image.jpg" : p.image.split('/').pop() || 'image.png'} [/img]\n` : ""}   ${p.description?.slice(0, 60)}...`).join("\n") : "No projects";
    } else if (lower === "experience" || lower === "ls experience/") {
      output = experience?.length ? experience.map(e => `  ${e.role} @ ${e.company} [${e.duration}]`).join("\n") : "No experience";
    } else if (lower === "certs" || lower === "ls certs/") {
      output = certifications?.length ? certifications.map(c => `  ${c.title} — ${c.issuer}`).join("\n") : "No certifications";
    } else if (lower === "contact" || lower === "cat contact.json") {
      output = `{\n  "email": "${contact?.email || "N/A"}",\n  "phone": "${contact?.phone || "N/A"}"\n}`;
    } else if (lower === "clear") {
      setHistory([]);
      setCmd("");
      return;
    } else if (socials.some(s => s.label === lower)) {
      const s = socials.find(x => x.label === lower);
      window.open(s.href, "_blank");
      output = `Opening ${s.label}...`;
    } else {
      output = `bash: ${input.split(" ")[0]}: command not found. Type 'help' for available commands.`;
    }
    setHistory(prev => [...prev, { dir, cmd: input, out: output }]);
    setDir("~");
    setCmd("");
  };

  useEffect(() => {
    const s = document.createElement("style");
    s.id = "term-anim";
    s.textContent = `@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}@keyframes pulse{0%,100%{opacity:0.3}50%{opacity:0.6}}`;
    document.head.appendChild(s);
    return () => document.getElementById("term-anim")?.remove();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", color: GREEN, display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#2D2D2D", padding: "8px 16px", display: "flex", alignItems: "center", gap: 10, userSelect: "none", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 7 }}>
          <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#FF5F57", cursor: "pointer" }} onClick={() => {}} />
          <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#FEBC2E", cursor: "pointer" }} onClick={() => setSidebarOpen(!sidebarOpen)} />
          <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#28C840", cursor: "pointer" }} />
        </div>
        <span style={{ flex: 1, textAlign: "center", fontSize: 12, color: "#AAA" }}>{name.toLowerCase().replace(/\s/g, "-")}@portfolio:~</span>
        <span style={{ fontSize: 11, color: GRAY }}>NORMAL</span>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {sidebarOpen && (
          <div style={{ width: 200, background: BG2, borderRight: `1px solid ${MUTED}`, padding: 12, overflow: "auto", flexShrink: 0 }}>
            <div style={{ fontSize: 10, color: GRAY, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>Explorer</span>
              <span style={{ cursor: "pointer" }} onClick={() => setSidebarOpen(false)}>×</span>
            </div>
            {files.map((f, i) => (
              <div key={i} style={{ fontSize: 12, padding: "5px 8px", cursor: "pointer", color: f.type === "dir" ? BLUE : GREEN, display: "flex", alignItems: "center", gap: 6, borderRadius: 4, transition: "0.15s" }}>
                <span>{f.type === "dir" ? "📁" : "📄"}</span>
                <span>{f.name}</span>
              </div>
            ))}
            <div style={{ marginTop: 20, fontSize: 10, color: GRAY, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Quick Links</div>
            {socials.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, padding: "4px 8px", color: GRAY, textDecoration: "none", display: "block" }}>🔗 {s.label}</a>
            ))}
          </div>
        )}

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ display: "flex", background: "#1E1E1E", borderBottom: `1px solid ${MUTED}` }}>
            <div style={{ padding: "7px 18px", fontSize: 11, background: BG, borderRight: `1px solid ${MUTED}`, color: GREEN, display: "flex", alignItems: "center", gap: 6 }}>
              <span>●</span> {name}.md
            </div>
            <div style={{ padding: "7px 18px", fontSize: 11, color: GRAY, display: "flex", alignItems: "center", gap: 6, borderRight: `1px solid ${MUTED}` }}>
              output.log
            </div>
          </div>

          <div style={{ flex: 1, padding: 16, overflow: "auto", fontSize: 13, lineHeight: 1.7 }}>
            <div style={{ color: DIM, marginBottom: 12 }}>
              <span style={{ color: GREEN }}>╭─</span> Welcome to <span style={{ color: BLUE }}>{name}</span>'s Terminal OS
              <br /><span style={{ color: GREEN }}>╰─</span> Type <span style={{ color: YELLOW }}>help</span> for available commands
              <br /><span style={{ color: GREEN }}>   </span> Profile: <span style={{ color: DIM }}>{title || "Developer"}</span>
            </div>

            {history.map((entry, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: GRAY }}>{entry.dir}</span>
                  <span style={{ color: GREEN }}>$</span>
                  <span style={{ color: "#fff" }}>{entry.cmd}</span>
                </div>
                <pre style={{ margin: "4px 0 0 20", color: entry.out.includes("command not found") ? "#FF5F57" : DIM, fontSize: 12, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{entry.out}</pre>
              </div>
            ))}

            <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 6 }}>
              <span style={{ color: GRAY }}>{dir}</span>
              <span style={{ color: GREEN, marginLeft: 8 }}>$</span>
              <input
                value={cmd}
                onChange={e => setCmd(e.target.value)}
                onKeyDown={handleCommand}
                style={{ background: "transparent", border: "none", color: GREEN, fontSize: 13, fontFamily: "inherit", outline: "none", flex: 1, marginLeft: 8, caretColor: GREEN }}
                autoFocus
                spellCheck={false}
                autoComplete="off"
              />
              {!cmd && <span style={{ width: 9, height: 18, background: GREEN, animation: "blink 1s step-end infinite" }} />}
            </div>
          </div>

          <div style={{ background: "#1E1E1E", borderTop: `1px solid ${MUTED}`, padding: "5px 16px", fontSize: 11, color: GRAY, display: "flex", gap: 24 }}>
            <span style={{ color: GREEN }}>NORMAL</span>
            <span>UTF-8</span>
            <span style={{ flex: 1 }}>{name.toLowerCase().replace(/\s/g, "-")}/portfolio</span>
            <span>LANG: JavaScript</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalOSTheme;
