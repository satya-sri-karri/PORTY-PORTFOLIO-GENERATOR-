import React, { useState } from "react";

const AIAssistantTheme = ({ data }) => {
  const { name, title, about, avatarUrl, skills, projects, experience,
    certifications, achievements, codingProfiles, contact, socialLinks, themeColors = {} } = data;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: `Hello! I'm **${name}**’s portfolio guide. Choose a topic to browse the information they supplied. I answer preset topics from this portfolio.` },
  ]);
  const [loading, setLoading] = useState(false);

  const socials = [
    { href: socialLinks?.github, label: "GitHub" },
    { href: socialLinks?.linkedin, label: "LinkedIn" },
    { href: socialLinks?.twitter, label: "Twitter" },
    { href: socialLinks?.website, label: "Website" },
    { href: contact?.email ? `mailto:${contact.email}` : null, label: "Email" },
  ].filter(s => s.href);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    const q = input.toLowerCase();
    setMessages(prev => [...prev, { role: "user", text: input }]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      let reply = "";
      if (q.includes("skill") || q.includes("tech") || q.includes("know")) {
        reply = `**${name}** lists these skills: ${(skills || []).join(", ") || "No skills listed yet."}`;
      } else if (q.includes("project") || q.includes("build") || (q.includes("work") && !q.includes("history"))) {
        const p = projects || [];
        reply = p.length > 0 ? p.map(pj => `• **${pj.title}**: ${pj.description?.substring(0, 80)}`).join("\n") : "No projects listed yet.";
      } else if (q.includes("experience") || q.includes("job") || q.includes("work history")) {
        const e = experience || [];
        reply = e.length > 0 ? e.map(ex => `• **${ex.role}** @ ${ex.company} (${ex.duration})${ex.current ? " — *Current*" : ""}`).join("\n") : "No experience listed yet.";
      } else if (q.includes("certif") || q.includes("credential")) {
        const c = certifications || [];
        reply = c.length > 0 ? c.map(cer => `• **${cer.title}** — ${cer.issuer}${cer.date ? ` (${cer.date})` : ""}`).join("\n") : "No certifications listed yet.";
      } else if (q.includes("achievement") || q.includes("award")) {
        const a = achievements || [];
        reply = a.length > 0 ? a.map(ac => `• ${ac.icon || "🏆"} **${ac.title}**: ${ac.description || ""}`).join("\n") : "No achievements listed yet.";
      } else if (q.includes("code") || q.includes("profile") || q.includes("leetcode") || q.includes("hackerrank")) {
        const cp = codingProfiles || [];
        reply = cp.length > 0 ? cp.map(pf => `• **${pf.platform}** — @${pf.username}${pf.rating ? ` (★ ${pf.rating})` : ""}${pf.solved ? ` — ${pf.solved} solved` : ""}`).join("\n") : "No coding profiles listed yet.";
      } else if (q.includes("contact") || q.includes("email") || q.includes("reach")) {
        reply = `You can reach **${name}** via:\n${contact?.email ? `• Email: ${contact.email}\n` : ""}${contact?.phone ? `• Phone: ${contact.phone}\n` : ""}${socials.map(s => `• ${s.label}: ${s.href}`).join("\n")}`;
      } else if (q.includes("about") || q.includes("who") || q.includes("intro")) {
        reply = `**${name}**${title ? ` — ${title}` : ""}\n\n${about || "No biography listed yet."}`;
      } else {
        reply = `I can tell you about **${name}**'s skills, projects, experience, certifications, achievements, coding profiles, or contact info. Try asking something specific!`;
      }
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
      setLoading(false);
    }, 600);
  };

  const ACCENT = themeColors.accent || "#10A37F";
  const BG = themeColors.bg || "#131314";
  const TEXT = themeColors.text || "#E0E0E0";
  const BUBBLE_USER = "#2B2B2B";
  const BUBBLE_ASST = "#1A2E2A";

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'Inter',-apple-system,sans-serif", color: TEXT, display: "flex", flexDirection: "column" }}>
      <div style={{
        background: "#1E1E1E", borderBottom: "1px solid #333", padding: "12px 20px",
        display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>
          {name?.charAt(0) || "A"}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{name}’s portfolio guide</div>
          <div style={{ fontSize: 11, color: ACCENT }}>Browse saved portfolio information</div>
        </div>
        {avatarUrl && (
          <img src={avatarUrl} alt="" onError={e => e.target.style.display = "none"}
            style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", border: "1px solid #333" }} />
        )}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16, maxWidth: 720, margin: "0 auto", width: "100%" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "row", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: m.role === "user" ? "#444" : ACCENT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>
              {m.role === "user" ? "U" : "P"}
            </div>
            <div style={{
              maxWidth: "80%", padding: "12px 16px", borderRadius: 16,
              background: m.role === "user" ? BUBBLE_USER : BUBBLE_ASST,
              borderBottomRightRadius: m.role === "user" ? 4 : 16,
              borderBottomLeftRadius: m.role === "user" ? 16 : 4,
              fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", color: "#D0D0D0",
            }}>
              {m.text.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
                part.startsWith("**") && part.endsWith("**")
                  ? <strong key={j} style={{ color: "#fff" }}>{part.slice(2, -2)}</strong>
                  : part
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>P</div>
            <div style={{ padding: "12px 16px", borderRadius: 16, borderBottomLeftRadius: 4, background: BUBBLE_ASST, fontSize: 20, display: "flex", gap: 3 }}>
              <span style={{ animation: "dotPulse 1s infinite" }}>.</span>
              <span style={{ animation: "dotPulse 1s infinite 0.2s" }}>.</span>
              <span style={{ animation: "dotPulse 1s infinite 0.4s" }}>.</span>
            </div>
          </div>
        )}
      </div>

      <div style={{ borderTop: "1px solid #333", padding: "16px 20px", background: "#1E1E1E", position: "sticky", bottom: 0 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", gap: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="Ask about this portfolio..."
            style={{ flex: 1, padding: "10px 16px", borderRadius: 12, border: "1px solid #333", background: "#2A2A2A", color: "#E0E0E0", fontSize: 13, outline: "none" }} />
          <button onClick={handleSend} style={{ padding: "10px 20px", borderRadius: 12, border: "none", background: ACCENT, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            Send
          </button>
        </div>
        <style>{`@keyframes dotPulse { 0%,100% { opacity:0.3; } 50% { opacity:1; } }`}</style>
        <div style={{ maxWidth: 720, margin: "10px auto 0", display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["Skills", "Projects", "Experience", "Contact"].map(s => (
            <button key={s} onClick={() => { setInput(s); }} style={{
              padding: "4px 12px", borderRadius: 999, border: "1px solid #333",
              background: "transparent", color: "#888", fontSize: 11, cursor: "pointer",
            }}>
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIAssistantTheme;
