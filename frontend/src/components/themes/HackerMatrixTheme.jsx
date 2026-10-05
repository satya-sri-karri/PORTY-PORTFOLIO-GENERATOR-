import React, { useEffect, useRef } from "react";

const GREEN = "#00FF41";
const DIM = "rgba(0,255,65,0.5)";
const MUTED = "rgba(0,255,65,0.12)";
const BG = "#000";
const DARK_GREEN = "rgba(0,255,65,0.06)";

const HackerMatrixTheme = ({ data }) => {
  const { name, title, about, avatarUrl, skills, projects, experience,
    certifications, achievements, codingProfiles, contact, socialLinks, themeColors = {} } = data;
  const GREEN = themeColors.accent || "#00FF41";
  const BG = themeColors.bg || "#000";

  const canvasRef = useRef(null);

  const socials = [
    { href: socialLinks?.github, label: "GitHub" },
    { href: socialLinks?.linkedin, label: "LinkedIn" },
    { href: socialLinks?.twitter, label: "Twitter" },
    { href: socialLinks?.website, label: "Website" },
    { href: contact?.email ? `mailto:${contact.email}` : null, label: "Email" },
  ].filter(s => s.href);

  useEffect(() => {
    const canvas = canvasRef.current;
    let ctx;
    try { ctx = canvas?.getContext("2d"); } catch { return; }
    if (!ctx) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fontSize = 14;
    let drops = [], frame = 0, failed = false;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drops = Array(Math.ceil(canvas.width / fontSize)).fill(1);
    };
    const draw = () => {
      ctx.fillStyle = BG;
      ctx.globalAlpha = 0.08; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.65; ctx.fillStyle = GREEN; ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const y = drops[i] * fontSize;
        ctx.fillText("0123456789ABCDEF"[Math.floor(Math.random() * 16)], i * fontSize, y);
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      ctx.globalAlpha = 1;
    };
    const loop = () => {
      frame = 0;
      if (document.hidden || motion.matches || data.staticPreview || failed) return;
      try { draw(); frame = requestAnimationFrame(loop); } catch { failed = true; }
    };
    const sync = () => {
      cancelAnimationFrame(frame); frame = 0;
      if (failed) return;
      if (motion.matches || data.staticPreview) {
        try { resize(); for (let i = 0; i < 12; i++) draw(); } catch { failed = true; }
      } else loop();
    };
    const onResize = () => { resize(); sync(); };
    resize(); sync();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", onResize); document.removeEventListener("visibilitychange", sync); motion.removeEventListener("change", sync); };
  }, [BG, GREEN, data.staticPreview]);

  useEffect(() => {
    const s = document.createElement("style");
    s.id = "hacker-anim";
    s.textContent = `@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}@keyframes glitch{0%,92%,100%{transform:translate(0)}94%{transform:translate(-2px,1px)}96%{transform:translate(2px,-1px)}98%{transform:translate(-1px,2px)}}@keyframes scan{0%{top:-100%}100%{top:100%}}`;
    document.head.appendChild(s);
    return () => document.getElementById("hacker-anim")?.remove();
  }, []);

  const cmd = (text) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontFamily: "'Courier New', monospace" }}>
      <span style={{ color: DIM, fontSize: 12, fontWeight: 700 }}>{">"}</span>
      <span style={{ color: GREEN, fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", textShadow: "0 0 8px rgba(0,255,65,0.4)" }}>{text}</span>
      <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${MUTED}, transparent)` }} />
    </div>
  );

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 36 }}>
      {cmd(title)}
      <div style={{ paddingLeft: 24 }}>{children}</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'Courier New', 'Source Code Pro', monospace", color: GREEN, position: "relative" }}>
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, opacity: 0.45 }} />

      <div style={{ position: "fixed", inset: 0, background: "repeating-linear-gradient(0deg, rgba(0,255,65,0.015) 0px, rgba(0,255,65,0.015) 2px, transparent 2px, transparent 4px)", pointerEvents: "none", zIndex: 1 }} />

      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(0,255,65,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 1 }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ padding: "40px 0 24px", borderBottom: `1px solid ${MUTED}`, textAlign: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: 12, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${MUTED}, transparent)` }} />
          <div style={{ fontSize: 9, color: DIM, letterSpacing: "0.3em", marginBottom: 10, fontFamily: "'Courier New', monospace" }}>{">"} ACCESSING PORTFOLIO DATABASE...</div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 700, margin: 0, color: GREEN, animation: "glitch 5s infinite", textShadow: "0 0 10px rgba(0,255,65,0.6), 0 0 20px rgba(0,255,65,0.2)", fontFamily: "'Courier New', monospace" }}>{"<"} {name} {">"}</h1>
          {title && <div style={{ fontSize: 12, color: DIM, marginTop: 10, letterSpacing: "0.15em", textTransform: "uppercase" }}>SYSTEM: {title}</div>}
          {avatarUrl && (
            <img src={avatarUrl} alt={name} style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover", marginTop: 16, border: `1px solid ${MUTED}`, filter: "grayscale(1) contrast(1.3) brightness(0.8)" }}
              onError={e => e.target.style.display = "none"} />
          )}
        </div>

        <div style={{ padding: "16px 0", display: "flex", gap: 12, justifyContent: "center", borderBottom: `1px solid ${MUTED}`, flexWrap: "wrap" }}>
          {socials.map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ color: GREEN, textDecoration: "none", fontSize: 12, border: `1px solid ${MUTED}`, padding: "4px 14px", transition: "0.2s", background: "rgba(0,255,65,0.02)", textShadow: "0 0 4px rgba(0,255,65,0.3)" }}>{">"}_{s.label}</a>
          ))}
        </div>

        {about && (
          <Section title="about — user profile">
            <p style={{ fontSize: 13, lineHeight: 1.9, color: "rgba(0,255,65,0.65)", margin: 0, maxWidth: 680 }}>
              <span style={{ color: DIM }}>//</span> {about}
            </p>
            <div style={{ marginTop: 8, fontSize: 11, color: DIM }}>
              <span style={{ color: GREEN }}>STATUS:</span> ONLINE <span style={{ color: DIM }}>|</span>{" "}
              <span style={{ color: GREEN }}>ROLE:</span> {title || "Developer"} <span style={{ color: DIM }}>|</span>{" "}
              <span style={{ color: GREEN }}>ACCESS:</span> GRANTED
            </div>
          </Section>
        )}

        {skills?.length > 0 && (
          <Section title="skills � network nodes">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, position: "relative" }}>
              {skills.map((s, i) => (
                <span key={i} style={{
                  padding: "7px 18px", border: `1px solid ${GREEN}`, fontSize: 12, color: GREEN,
                  background: "rgba(0,255,65,0.03)", position: "relative", textShadow: "0 0 5px rgba(0,255,65,0.3)",
                  cursor: "default",
                }}>
                  <span style={{ position: "absolute", top: -5, right: -5, width: 8, height: 8, borderRadius: "50%", background: GREEN, boxShadow: "0 0 8px rgba(0,255,65,0.8)" }} />
                  {s}
                  {i < skills.length - 1 && (
                    <span style={{ position: "absolute", bottom: -3, left: "50%", width: 1, height: 8, background: DIM, transform: "translateX(-50%)" }} />
                  )}
                </span>
              ))}
            </div>
          </Section>
        )}

        {projects?.length > 0 && (
          <Section title="projects � binaries">
            {projects.map((p, i) => (
                <div key={i} style={{ marginBottom: 20, padding: 16, border: `1px solid ${MUTED}`, background: "rgba(0,255,65,0.02)" }}>
                  {p.image && <img src={p.image} alt={p.title} style={{ width: "100%", height: "auto", maxHeight: 200, borderRadius: 0, border: "2px solid #00FF41", background: "#000", marginBottom: 12, objectFit: "cover" }} />}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ color: DIM, fontSize: 10 }}>[{String(i + 1).padStart(2, "0")}]</span>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: GREEN, textShadow: "0 0 6px rgba(0,255,65,0.3)" }}>{p.title}</h3>
                  <span style={{ fontSize: 9, color: DIM }}>.exe</span>
                </div>
                <p style={{ fontSize: 12, lineHeight: 1.8, color: "rgba(0,255,65,0.55)", margin: "0 0 12px", paddingLeft: 24 }}>{p.description}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", paddingLeft: 24 }}>
                  {p.techStack?.length > 0 && (
                    <div style={{ display: "flex", gap: 6 }}>
                      {p.techStack.map((t, j) => <span key={j} style={{ fontSize: 10, color: DIM, border: `1px solid ${MUTED}`, padding: "2px 8px" }}>{t}</span>)}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 14 }}>
                    {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ color: GREEN, fontSize: 11, textDecoration: "none", borderBottom: `1px solid ${DIM}`, textShadow: "0 0 4px rgba(0,255,65,0.3)" }}>EXECUTE</a>}
                    {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ color: DIM, fontSize: 11, textDecoration: "none", borderBottom: `1px solid ${MUTED}` }}>SOURCE</a>}
                  </div>
                </div>
              </div>
            ))}
          </Section>
        )}

        {experience?.length > 0 && (
          <Section title="experience � access log">
            {experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 16, paddingLeft: 20, borderLeft: `1px solid ${MUTED}` }}>
                <div style={{ fontSize: 10, color: DIM, fontFamily: "'Courier New', monospace" }}>[{e.duration}]</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: GREEN, margin: "2px 0", textShadow: "0 0 4px rgba(0,255,65,0.2)" }}>{e.role}</div>
                <div style={{ fontSize: 12, color: DIM }}>@ {e.company}{e.current && <span style={{ color: GREEN }}> [ACTIVE]</span>}</div>
                {e.description && <p style={{ fontSize: 12, lineHeight: 1.7, color: "rgba(0,255,65,0.5)", margin: "6px 0 0 0" }}>{e.description}</p>}
              </div>
            ))}
          </Section>
        )}

        {certifications?.length > 0 && (
          <Section title="credentials � decrypted">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
              {certifications.map((c, i) => (
                <div key={i} style={{ padding: 14, border: `1px solid ${MUTED}` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: GREEN }}>{c.title}</div>
                  <div style={{ fontSize: 10, color: DIM }}>{c.issuer} � {c.date}</div>
                  {c.credentialUrl && <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ color: DIM, fontSize: 10, textDecoration: "none", marginTop: 6, display: "inline-block", borderBottom: `1px solid ${MUTED}` }}>[verify]</a>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {achievements?.length > 0 && (
          <Section title="achievements � exploits">
            {achievements.map((a, i) => (
              <div key={i} style={{ marginBottom: 12, padding: 14, border: `1px solid ${MUTED}`, display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ fontSize: 22, color: GREEN }}>{a.icon || "?"}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: GREEN }}>{a.title}</div>
                  {a.description && <div style={{ fontSize: 11, color: "rgba(0,255,65,0.45)", lineHeight: 1.6 }}>{a.description}</div>}
                  {a.date && <div style={{ fontSize: 9, color: DIM, marginTop: 6 }}>TIMESTAMP: {a.date}</div>}
                </div>
              </div>
            ))}
          </Section>
        )}

        {codingProfiles?.length > 0 && (
          <Section title="coding profiles � whoami">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
              {codingProfiles.map((p, i) => (
                <a key={i} href={p.url || "#"} target="_blank" rel="noopener noreferrer" style={{ color: GREEN, textDecoration: "none", border: `1px solid ${MUTED}`, padding: 14, display: "block" }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{p.platform}</div>
                  <div style={{ fontSize: 11, color: DIM }}>@{p.username}</div>
                  {(p.rating || p.solved) && <div style={{ fontSize: 10, color: DIM, marginTop: 4 }}>{p.rating && `rating: ${p.rating}`}{p.rating && p.solved && " | "}{p.solved && `solved: ${p.solved}`}</div>}
                </a>
              ))}
            </div>
          </Section>
        )}

        <Section title="contact � establish connection">
          <p style={{ fontSize: 12, color: DIM, marginBottom: 16 }}>Secure channel open. Send transmission.</p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {contact?.email && (
              <a href={`mailto:${contact.email}`} style={{ padding: "12px 28px", border: `1px solid ${GREEN}`, color: GREEN, fontSize: 12, fontWeight: 700, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.1em", background: "rgba(0,255,65,0.04)", textShadow: "0 0 6px rgba(0,255,65,0.3)" }}>{">"} {contact.email}</a>
            )}
            {socialLinks?.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" style={{ padding: "12px 28px", border: `1px solid ${MUTED}`, color: DIM, fontSize: 12, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.1em" }}>{">"} LINKEDIN</a>
            )}
          </div>
        </Section>

        <div style={{ borderTop: `1px solid ${MUTED}`, padding: "16px 0", fontSize: 10, color: DIM, display: "flex", justifyContent: "space-between" }}>
          <span>{">"} SYSTEM: ONLINE | USER: {name}</span>
          <span>UPTIME: 8</span>
        </div>
      </div>
    </div>
  );
};

export default HackerMatrixTheme;
