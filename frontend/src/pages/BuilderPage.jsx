/**
 * BuilderPage v3
 * Left sidebar navigation, AI-powered fields, 9 sections
 * Supports both CREATE and EDIT modes
 */

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { usePortfolioForm } from "../hooks/usePortfolioForm";
import {
  createPortfolio, updatePortfolio, getPortfolioById,
  generateBio, suggestSkills, generateProjectDesc, recommendTheme,
} from "../utils/api";
import { getAllThemes, getTheme, THEME_GROUPS } from "../registry/themeRegistry";
import ThumbnailGenerator from "../components/shared/ThumbnailGenerator";
import LineSidebar from "../components/shared/LineSidebar";
import DotField from "../components/shared/DotField";

// ── Sidebar nav items ─────────────────────────────────────────────────────────
const NAV = [
  { id: "personal",    label: "Personal Info"},
  { id: "skills",      label: "Skills" },
  { id: "projects",    label: "Projects"},
  { id: "experience",  label: "Experience"},
  { id: "certs",       label: "Certifications" },
  { id: "achievements",label: "Achievements" },
  { id: "coding",      label: "Coding Profiles" },
  { id: "contact",     label: "Contact & Social"},
  { id: "theme",       label: "Theme & Publish"},
];

// ── Reusable small components ────────────────────────────────────────────────

const AIButton = ({ onClick, loading, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className="btn btn-ai btn-sm"
    style={{ gap: 5 }}
  >
    {loading
      ? <><span className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} /> Generating…</>
      : <><span className="ai-icon">✦</span> {children}</>
    }
  </button>
);

const SubCard = ({ title, onRemove, children }) => (
  <div className="sub-card">
    <div className="sub-card-header">
      <span className="sub-card-label">{title}</span>
      <button type="button" className="btn btn-danger btn-sm" onClick={onRemove}>Remove</button>
    </div>
    {children}
  </div>
);

const FormRow = ({ children }) => (
  <div className="grid-2" style={{ marginBottom: 0 }}>{children}</div>
);

const Toggle = ({ on, onChange, label }) => (
  <div className="toggle-row" onClick={onChange} style={{ cursor: "pointer" }}>
    <div className={`toggle-track ${on ? "on" : ""}`}>
      <div className="toggle-thumb" />
    </div>
    <span className="toggle-label">{label}</span>
  </div>
);

// ── Section renderers ─────────────────────────────────────────────────────────

const PersonalSection = ({ form, set, token }) => {
  const [bioLoading, setBioLoading] = useState(false);
  const [bioError, setBioError] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const fileRef = useRef(null);

  const handleGenerateBio = async () => {
    if (!form.name) return setBioError("Add your name first.");
    setBioLoading(true); setBioError("");
    try {
      const res = await generateBio({ name: form.name, title: form.title, skills: form.skills, experience: form.experience }, token);
      set("about", res.bio);
    } catch (e) { setBioError(e.message); }
    finally { setBioLoading(false); }
  };

  const handleAvatarFile = (file) => {
    setAvatarError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) return setAvatarError("Please choose an image file.");
    if (file.size > 5 * 1024 * 1024) return setAvatarError("Image must be under 5 MB.");
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        try {
          const size = 512;
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, size, size);
          const min = Math.min(img.width, img.height);
          ctx.drawImage(img, (img.width - min) / 2, (img.height - min) / 2, min, min, 0, 0, size, size);
          set("avatarUrl", canvas.toDataURL("image/jpeg", 0.82));
        } catch {
          setAvatarError("Could not process that image. Try a different file.");
        }
      };
      img.onerror = () => setAvatarError("Could not read that image. Try a different file.");
      img.src = reader.result;
    };
    reader.onerror = () => setAvatarError("Could not read that file.");
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="form-group">
        <label className="form-label">Full Name *</label>
        <input className="form-input" placeholder="John Doe" value={form.name} onChange={e => set("name", e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">Professional Title</label>
        <input className="form-input" placeholder="Full Stack Developer · ML Engineer" value={form.title} onChange={e => set("title", e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>About Me *</span>
          <AIButton onClick={handleGenerateBio} loading={bioLoading}>Generate Bio</AIButton>
        </label>
        {bioError && <div className="form-error" style={{ marginBottom: 6 }}>⚠ {bioError}</div>}
        <textarea className="form-input" rows={5} placeholder="Write a compelling bio…" value={form.about} onChange={e => set("about", e.target.value)} />
        <div className="form-hint">{form.about.length}/2000 · Or click ✦ Generate Bio to let AI write it</div>
      </div>
      <FormRow>
        <div className="form-group">
          <label className="form-label">Avatar URL</label>
          <input className="form-input" type="url" placeholder="https://github.com/user.png" value={form.avatarUrl} onChange={e => set("avatarUrl", e.target.value)} />
          <div className="form-hint" style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
            <span>or</span>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => fileRef.current && fileRef.current.click()} style={{ padding: "4px 10px", cursor: "pointer" }}>
              ⬆ Upload from file
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { handleAvatarFile(e.target.files[0]); e.target.value = ""; }} />
          </div>
          {avatarError && <div className="form-error" style={{ marginTop: 4 }}>⚠ {avatarError}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Location</label>
          <input className="form-input" placeholder="Hyderabad, India" value={form.location} onChange={e => set("location", e.target.value)} />
        </div>
      </FormRow>
      {form.avatarUrl && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: -8 }}>
          <img src={form.avatarUrl} alt="preview" onError={e => e.target.style.display = "none"}
            style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--accent)" }} />
          <span className="form-hint">Avatar preview</span>
        </div>
      )}
    </div>
  );
};

const SkillsSection = ({ form, set, skillInput, setSkillInput, addSkill, addSkillDirect, removeSkill, token }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const SUGGESTED = ["JavaScript","TypeScript","React","Node.js","Python","MongoDB","Express","PostgreSQL","Docker","AWS","Git","REST APIs","GraphQL","Next.js","Redux","Vue.js","Angular","MySQL","Firebase","Linux"];

  const handleSuggest = async () => {
    if (!form.title) return setError("Add your professional title first.");
    setLoading(true); setError("");
    try {
      const res = await suggestSkills({ title: form.title, currentSkills: form.skills }, token);
      res.skills.forEach(s => addSkillDirect(s));
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="ai-panel">
        <div className="ai-panel-header">
          <span style={{ fontSize: 16 }}>✦</span>
          <span className="ai-panel-title">AI Skill Suggester</span>
        </div>
        <div className="ai-panel-desc">Let AI suggest relevant skills based on your role.</div>
        {error && <div className="form-error" style={{ marginBottom: 8 }}>⚠ {error}</div>}
        <AIButton onClick={handleSuggest} loading={loading}>Suggest Skills for "{form.title || "my role"}"</AIButton>
      </div>

      <div className="form-group">
        <label className="form-label">Add Skills</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input className="form-input" placeholder="Type a skill and press Enter…" value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(); } }}
            style={{ flex: 1 }} />
          <button type="button" className="btn btn-secondary btn-sm" onClick={addSkill} style={{ flexShrink: 0 }}>Add</button>
        </div>
      </div>

      {form.skills.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 20 }}>
          {form.skills.map((s, i) => (
            <span key={i} className="tag">
              {s}
              <span className="tag-remove" onClick={() => removeSkill(i)}>×</span>
            </span>
          ))}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Quick Add</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {SUGGESTED.filter(s => !form.skills.map(x => x.toLowerCase()).includes(s.toLowerCase())).map(s => (
            <button key={s} type="button" className="btn btn-ghost btn-sm" onClick={() => addSkillDirect(s)}>+ {s}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Project image field: URL or local file upload ─────────────────────────────
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
// Capped so that 8 projects worth of inline images stays under the backend's
// 10 MB express.json limit and the browser's sessionStorage quota.
const MAX_DATA_URL_CHARS = 500000;

// Scales the image down to fit the box while preserving its aspect ratio, so
// screenshots and mockups keep their framing instead of being centre-cropped.
const fileToResizedDataUrl = (file, maxW, maxH, quality) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not read that image."));
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width, maxH / img.height);
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

const ProjectImageField = ({ value, onChange }) => {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);
  const isUpload = typeof value === "string" && value.startsWith("data:");

  const handleFile = async (file) => {
    if (!file) return;
    setError("");
    if (!file.type.startsWith("image/")) return setError("Please choose an image file.");
    if (file.size > MAX_UPLOAD_BYTES) return setError("Image must be under 5 MB.");
    setBusy(true);
    try {
      const dataUrl = await fileToResizedDataUrl(file, 1000, 1000, 0.8);
      if (dataUrl.length > MAX_DATA_URL_CHARS) {
        return setError("That image is too large to store. Try a smaller or simpler image.");
      }
      onChange(dataUrl);
    } catch (e) {
      setError(e.message || "Could not process that image.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="form-group">
        <label className="form-label">Image (screenshot / product mockup)</label>
        <input className="form-input" type="url" placeholder="https://example.com/my-product.png" value={value || ""} onChange={e => onChange(e.target.value)} />
        <div className="form-hint" style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
          <span>or</span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => fileRef.current && fileRef.current.click()} disabled={busy}
            style={{ padding: "4px 10px", cursor: busy ? "progress" : "pointer" }}>
            {busy ? "Processing…" : "⬆ Upload from file"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { handleFile(e.target.files[0]); e.target.value = ""; }} />
        </div>
        {error && <div className="form-error" style={{ marginTop: 4 }}>⚠ {error}</div>}
      </div>
      {value && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: -8, marginBottom: 16 }}>
          <img src={value} alt="preview" onError={e => e.target.style.display = "none"}
            style={{ width: 72, height: 48, borderRadius: 4, objectFit: "cover", border: "1px solid var(--accent)" }} />
          <span className="form-hint">{isUpload ? "Uploaded image" : "Image preview"}</span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange("")} style={{ padding: "4px 10px", cursor: "pointer" }}>
            ✕ Remove
          </button>
        </div>
      )}
    </>
  );
};

const ProjectsSection = ({ form, addItem, updateItem, removeItem, token }) => {
  const [aiLoading, setAiLoading] = useState({});
  const [aiErrors, setAiErrors] = useState({});
  const [techInputs, setTechInputs] = useState({});

  const handleGenDesc = async (i) => {
    const p = form.projects[i];
    if (!p.title) return setAiErrors(prev => ({ ...prev, [i]: "Add a project title first." }));
    setAiLoading(prev => ({ ...prev, [i]: true }));
    setAiErrors(prev => ({ ...prev, [i]: "" }));
    try {
      const res = await generateProjectDesc({ title: p.title, techStack: p.techStack }, token);
      updateItem("projects", i, "description", res.description);
    } catch (e) { setAiErrors(prev => ({ ...prev, [i]: e.message })); }
    finally { setAiLoading(prev => ({ ...prev, [i]: false })); }
  };

  return (
    <div>
      {form.projects.map((p, i) => (
        <SubCard key={i} title={`Project ${i + 1}`} onRemove={() => removeItem("projects", i)}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input className="form-input" placeholder="E-Commerce Platform" value={p.title} onChange={e => updateItem("projects", i, "title", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>Description</span>
              <AIButton onClick={() => handleGenDesc(i)} loading={aiLoading[i]}>Write with AI</AIButton>
            </label>
            {aiErrors[i] && <div className="form-error" style={{ marginBottom: 6 }}>⚠ {aiErrors[i]}</div>}
            <textarea className="form-input" rows={3} placeholder="What does it do? What problem does it solve?" value={p.description} onChange={e => updateItem("projects", i, "description", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Tech Stack (comma-separated)</label>
            <input className="form-input" placeholder="React, Node.js, MongoDB" value={techInputs[i] !== undefined ? techInputs[i] : p.techStack?.join(", ") || ""}
              onChange={e => setTechInputs(prev => ({ ...prev, [i]: e.target.value }))}
              onBlur={e => { updateItem("projects", i, "techStack", e.target.value.split(",").map(t => t.trim()).filter(Boolean)); setTechInputs(prev => { const n = { ...prev }; delete n[i]; return n; }); }} />
          </div>
          <ProjectImageField value={p.image} onChange={v => updateItem("projects", i, "image", v)} />
          <FormRow>
            <div className="form-group">
              <label className="form-label">Live URL</label>
              <input className="form-input" type="url" placeholder="https://myapp.com" value={p.link} onChange={e => updateItem("projects", i, "link", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input className="form-input" type="url" placeholder="https://github.com/…" value={p.github} onChange={e => updateItem("projects", i, "github", e.target.value)} />
            </div>
          </FormRow>
        </SubCard>
      ))}
      {form.projects.length < 8 && (
        <button type="button" className="add-row-btn"
          onClick={() => addItem("projects", { title: "", description: "", link: "", github: "", image: "", techStack: [] })}>
          + Add Project
        </button>
      )}
    </div>
  );
};

const ExperienceSection = ({ form, addItem, updateItem, removeItem }) => (
  <div>
    {form.experience.map((e, i) => (
      <SubCard key={i} title={`Position ${i + 1}`} onRemove={() => removeItem("experience", i)}>
        <FormRow>
          <div className="form-group">
            <label className="form-label">Job Title *</label>
            <input className="form-input" placeholder="Senior Developer" value={e.role} onChange={ev => updateItem("experience", i, "role", ev.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Company *</label>
            <input className="form-input" placeholder="Google" value={e.company} onChange={ev => updateItem("experience", i, "company", ev.target.value)} />
          </div>
        </FormRow>
        <div className="form-group">
          <label className="form-label">Duration *</label>
          <input className="form-input" placeholder="Jan 2022 – Present" value={e.duration} onChange={ev => updateItem("experience", i, "duration", ev.target.value)} />
        </div>
        <div className="form-group" style={{ marginBottom: 12 }}>
          <Toggle on={e.current} onChange={() => updateItem("experience", i, "current", !e.current)} label="Current role" />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-input" rows={3} placeholder="Key achievements and responsibilities…" value={e.description} onChange={ev => updateItem("experience", i, "description", ev.target.value)} />
        </div>
      </SubCard>
    ))}
    <button type="button" className="add-row-btn"
      onClick={() => addItem("experience", { role: "", company: "", duration: "", description: "", current: false })}>
      + Add Experience
    </button>
  </div>
);

const CertsSection = ({ form, addItem, updateItem, removeItem }) => (
  <div>
    {form.certifications.map((c, i) => (
      <SubCard key={i} title={`Certification ${i + 1}`} onRemove={() => removeItem("certifications", i)}>
        <div className="form-group">
          <label className="form-label">Certificate Title *</label>
          <input className="form-input" placeholder="AWS Solutions Architect" value={c.title} onChange={e => updateItem("certifications", i, "title", e.target.value)} />
        </div>
        <FormRow>
          <div className="form-group">
            <label className="form-label">Issuing Organization</label>
            <input className="form-input" placeholder="Amazon Web Services" value={c.issuer} onChange={e => updateItem("certifications", i, "issuer", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input className="form-input" placeholder="Dec 2023" value={c.date} onChange={e => updateItem("certifications", i, "date", e.target.value)} />
          </div>
        </FormRow>
        <div className="form-group">
          <label className="form-label">Credential URL</label>
          <input className="form-input" type="url" placeholder="https://credly.com/badges/…" value={c.credentialUrl} onChange={e => updateItem("certifications", i, "credentialUrl", e.target.value)} />
        </div>
      </SubCard>
    ))}
    <button type="button" className="add-row-btn"
      onClick={() => addItem("certifications", { title: "", issuer: "", date: "", credentialUrl: "" })}>
      + Add Certification
    </button>
  </div>
);

const AchievementsSection = ({ form, addItem, updateItem, removeItem }) => {
  const ICONS = ["🏆","⭐","🥇","🎯","🚀","💡","🎖️","🌟","🔥","💎"];
  return (
    <div>
      {form.achievements.map((a, i) => (
        <SubCard key={i} title={`Achievement ${i + 1}`} onRemove={() => removeItem("achievements", i)}>
          <div className="form-group">
            <label className="form-label">Icon</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {ICONS.map(ic => (
                <button key={ic} type="button" onClick={() => updateItem("achievements", i, "icon", ic)}
                  style={{ width: 36, height: 36, fontSize: 18, borderRadius: 8, cursor: "pointer", background: a.icon === ic ? "var(--accent-glow)" : "var(--surface-0)", border: `1.5px solid ${a.icon === ic ? "var(--accent)" : "var(--border)"}`, transition: "all 0.15s" }}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input className="form-input" placeholder="1st Place — National Hackathon" value={a.title} onChange={e => updateItem("achievements", i, "title", e.target.value)} />
          </div>
          <FormRow>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input className="form-input" placeholder="March 2024" value={a.date} onChange={e => updateItem("achievements", i, "date", e.target.value)} />
            </div>
          </FormRow>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" rows={2} placeholder="Brief details…" value={a.description} onChange={e => updateItem("achievements", i, "description", e.target.value)} />
          </div>
        </SubCard>
      ))}
      <button type="button" className="add-row-btn"
        onClick={() => addItem("achievements", { title: "", description: "", date: "", icon: "🏆" })}>
        + Add Achievement
      </button>
    </div>
  );
};

const CodingSection = ({ form, addItem, updateItem, removeItem }) => {
  const PLATFORMS = [
    { name: "LeetCode", icon: "🟨" }, { name: "Codeforces", icon: "🔵" },
    { name: "HackerRank", icon: "🟩" }, { name: "CodeChef", icon: "🟫" },
    { name: "GitHub", icon: "⬛" }, { name: "GeeksForGeeks", icon: "🟢" },
  ];
  return (
    <div>
      {form.codingProfiles.map((p, i) => (
        <SubCard key={i} title={`Profile ${i + 1}`} onRemove={() => removeItem("codingProfiles", i)}>
          <div className="form-group">
            <label className="form-label">Platform</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
              {PLATFORMS.map(pl => (
                <button key={pl.name} type="button"
                  className={`btn btn-sm ${p.platform === pl.name ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => updateItem("codingProfiles", i, "platform", pl.name)}>
                  {pl.icon} {pl.name}
                </button>
              ))}
            </div>
            <input className="form-input" placeholder="Or type custom platform" value={p.platform || ""} onChange={e => updateItem("codingProfiles", i, "platform", e.target.value)} />
          </div>
          <FormRow>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input className="form-input" placeholder="john_doe" value={p.username || ""} onChange={e => updateItem("codingProfiles", i, "username", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Profile URL</label>
              <input className="form-input" type="url" placeholder="https://leetcode.com/u/…" value={p.url || ""} onChange={e => updateItem("codingProfiles", i, "url", e.target.value)} />
            </div>
          </FormRow>
          <FormRow>
            <div className="form-group">
              <label className="form-label">Rating / Rank</label>
              <input className="form-input" placeholder="1800 / Expert" value={p.rating || ""} onChange={e => updateItem("codingProfiles", i, "rating", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Problems Solved</label>
              <input className="form-input" placeholder="450" value={p.solved || ""} onChange={e => updateItem("codingProfiles", i, "solved", e.target.value)} />
            </div>
          </FormRow>
        </SubCard>
      ))}
      <button type="button" className="add-row-btn"
        onClick={() => addItem("codingProfiles", { platform: "", username: "", url: "", rating: "", solved: "" })}>
        + Add Coding Profile
      </button>
    </div>
  );
};

const ContactSection = ({ form, setNested }) => (
  <div>
    <div className="sub-card" style={{ marginBottom: 16 }}>
      <div className="sub-card-header"><span className="sub-card-label">Contact Info</span></div>
      <div className="form-group">
        <label className="form-label">Email</label>
        <input className="form-input" type="email" placeholder="john@example.com" value={form.contact.email} onChange={e => setNested("contact", "email", e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">Phone</label>
        <input className="form-input" placeholder="+91 98765 43210" value={form.contact.phone} onChange={e => setNested("contact", "phone", e.target.value)} />
      </div>
    </div>
    <div className="sub-card">
      <div className="sub-card-header"><span className="sub-card-label">Social Links</span></div>
      {[
        { key: "github", label: "GitHub", ph: "https://github.com/username" },
        { key: "linkedin", label: "LinkedIn", ph: "https://linkedin.com/in/username" },
        { key: "twitter", label: "Twitter / X", ph: "https://twitter.com/username" },
        { key: "website", label: "Personal Website", ph: "https://yoursite.com" },
      ].map(({ key, label, ph }) => (
        <div key={key} className="form-group">
          <label className="form-label">{label}</label>
          <input className="form-input" type="url" placeholder={ph} value={form.socialLinks[key]} onChange={e => setNested("socialLinks", key, e.target.value)} />
        </div>
      ))}
    </div>
  </div>
);

const ThemeSection = ({ form, set, token }) => {
  const allThemes = getAllThemes().sort((a, b) => a.name.localeCompare(b.name));
  const groups = Object.keys(THEME_GROUPS);
  const [activeGroup, setActiveGroup] = useState("All");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRec, setAiRec] = useState(null);
  const [previewThemeId, setPreviewThemeId] = useState(null);
  const [colorState, setColorState] = useState(null);

  const filtered = activeGroup === "All"
    ? allThemes
    : allThemes.filter(t => THEME_GROUPS[activeGroup].includes(t.id));
  const previewTheme = previewThemeId ? getTheme(previewThemeId) : null;

  const openTheme = (theme) => {
    setPreviewThemeId(theme.id);
    const existing = (form.theme === theme.id && form.themeColors) ? form.themeColors : {};
    setColorState({
      accent: existing.accent || theme.colors.accent,
      bg: existing.bg || theme.colors.bg,
      text: existing.text || theme.colors.text,
    });
  };

  const closeTheme = () => { setPreviewThemeId(null); setColorState(null); };

  const applyTheme = () => {
    if (!previewTheme || !colorState) return;
    set("theme", previewTheme.id);
    set("themeColors", { ...colorState });
    closeTheme();
  };

  const modalColors = colorState || previewTheme?.colors || { accent: "#ffffff", bg: "#000000", text: "#ffffff" };

  const handleAIRecommend = async () => {
    setAiLoading(true); setAiRec(null);
    try {
      const res = await recommendTheme({ title: form.title, skills: form.skills, about: form.about }, token);
      setAiRec(res);
    } catch (e) { }
    finally { setAiLoading(false); }
  };

  return (
    <div>
      {/* AI theme recommender */}
      <div className="ai-panel" style={{ marginBottom: 28 }}>
        <div className="ai-panel-header">
          <span style={{ fontSize: 16 }}>✦</span>
          <span className="ai-panel-title">AI Theme Recommender</span>
        </div>
        <div className="ai-panel-desc">Let AI pick the best theme based on your profile.</div>
        <AIButton onClick={handleAIRecommend} loading={aiLoading}>Recommend My Theme</AIButton>
        {aiRec && (
          <div className="ai-result">
            <strong>Recommended: {getTheme(aiRec.theme)?.name}</strong>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 4 }}>{aiRec.reason}</p>
          </div>
        )}
      </div>

      {/* Visibility toggle */}
      <div className="form-group">
        <label className="form-label">Visibility</label>
        <Toggle on={form.isPublic} onChange={() => set("isPublic", !form.isPublic)}
          label={form.isPublic ? "Public — anyone with link can view" : "Private — only you can view"} />
      </div>

      {/* Group filter chips */}
      <div className="form-group">
        <label className="form-label">Choose Theme ({filtered.length} of {allThemes.length})</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {groups.map(g => (
            <button key={g} type="button" onClick={() => setActiveGroup(g)}
              className="btn btn-sm"
              style={{
                background: activeGroup === g ? "var(--accent)" : "transparent",
                color: activeGroup === g ? "#fff" : "var(--text-secondary)",
                border: activeGroup === g ? "1px solid var(--accent)" : "1px solid var(--glass-border)",
                borderRadius: 20,
                padding: "4px 14px",
                fontSize: 12,
                fontWeight: 500,
              }}>
              {g}
            </button>
          ))}
        </div>
        <div className="theme-grid">
          {filtered.map(theme => {
            const selected = form.theme === theme.id;
            return (
              <button key={theme.id} type="button" onClick={() => openTheme(theme)}
                className={`theme-card ${selected ? "selected" : ""}`}
                style={{ textAlign: "left", cursor: "pointer", background: "transparent" }}>
                {/* Mini preview */}
                <div className="theme-preview" style={{ background: theme.preview.bg }}>
                  {/* Fake nav */}
                  <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, background: theme.preview.accent }} />
                    <div style={{ height: 6, width: 50, borderRadius: 3, background: "rgba(255,255,255,0.15)" }} />
                  </div>
                  {/* Fake hero */}
                  <div style={{ padding: "12px 14px" }}>
                    <div style={{ height: 10, width: "60%", borderRadius: 4, background: "rgba(255,255,255,0.7)", marginBottom: 8 }} />
                    <div style={{ height: 7, width: "80%", borderRadius: 3, background: "rgba(255,255,255,0.3)", marginBottom: 5 }} />
                    <div style={{ height: 7, width: "65%", borderRadius: 3, background: "rgba(255,255,255,0.2)", marginBottom: 14 }} />
                    {/* Fake cards */}
                    <div style={{ display: "flex", gap: 6 }}>
                      {[70, 50, 60].map((w, i) => (
                        <div key={i} style={{ height: 26, width: w, borderRadius: 5, background: i === 0 ? theme.preview.accent : "rgba(255,255,255,0.08)" }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="theme-card-footer">
                  <div>
                    <div className="theme-card-name">{theme.name}</div>
                    <div className="theme-card-persona">{theme.persona}</div>
                  </div>
                  {selected && <span style={{ color: theme.preview.accent, fontSize: 16 }}>✓</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme preview modal — portal to body for correct fixed positioning */}
      {previewTheme && createPortal(
        <div className="preview-overlay" onClick={closeTheme}>
          <div className="preview-modal" onClick={e => e.stopPropagation()}>
            <button className="preview-close" onClick={closeTheme}>✕</button>

            <div className="preview-block" style={{ background: modalColors.bg }}>
              <div className="preview-nav">
                <div className="preview-dot" style={{ background: modalColors.accent }} />
                <div className="preview-bar" />
              </div>
              <div className="preview-hero">
                <div className="preview-heading" />
                <div className="preview-line" />
                <div className="preview-line" style={{ width: "65%" }} />
              </div>
              <div className="preview-cards">
                <div className="preview-card" style={{ background: modalColors.accent + "30" }} />
                <div className="preview-card" />
                <div className="preview-card" />
              </div>
            </div>

            <div className="preview-info">
              <h3 className="preview-name">{previewTheme.name}</h3>
              <p className="preview-persona">{previewTheme.persona}</p>
              <p className="preview-desc">{previewTheme.description}</p>

              {previewTheme.tags && (
                <div className="preview-tags">
                  {previewTheme.tags.map(t => <span key={t} className="bg">{t}</span>)}
                </div>
              )}

              <div className="color-fields">
                <div className="color-field">
                  <label className="color-field-label">
                    <span style={{ width: 12, height: 12, borderRadius: 3, background: modalColors.accent, display: "inline-block", border: "1px solid var(--glass-border)" }} />
                    Accent
                  </label>
                  <input type="color" value={modalColors.accent}
                    onChange={e => setColorState({ ...colorState, accent: e.target.value })} />
                </div>
                <div className="color-field">
                  <label className="color-field-label">
                    <span style={{ width: 12, height: 12, borderRadius: 3, background: modalColors.bg, display: "inline-block", border: "1px solid var(--glass-border)" }} />
                    Background
                  </label>
                  <input type="color" value={modalColors.bg}
                    onChange={e => setColorState({ ...colorState, bg: e.target.value })} />
                </div>
                <div className="color-field">
                  <label className="color-field-label">
                    <span style={{ width: 12, height: 12, borderRadius: 3, background: modalColors.text, display: "inline-block", border: "1px solid var(--glass-border)" }} />
                    Text
                  </label>
                  <input type="color" value={modalColors.text}
                    onChange={e => setColorState({ ...colorState, text: e.target.value })} />
                </div>
              </div>

              <div className="preview-actions">
                <button className="btn btn-primary" onClick={applyTheme}>
                  Apply Theme
                </button>
                <button className="btn btn-secondary" onClick={closeTheme}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

// ── Main BuilderPage ──────────────────────────────────────────────────────────

const BuilderPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { token } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("personal");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(isEdit);
  const [thumbnail, setThumbnail] = useState("");

  const {
    form, skillInput, setSkillInput,
    set, setNested,
    addSkill, addSkillDirect, removeSkill,
    addItem, updateItem, removeItem,
    load,
  } = usePortfolioForm();

  // Load existing portfolio in edit mode
  useEffect(() => {
    if (!isEdit) return;
    getPortfolioById(id, token)
      .then(res => load(res.data))
      .catch(() => setError("Failed to load portfolio."))
      .finally(() => setLoadingEdit(false));
  }, [id, isEdit, token]); // eslint-disable-line

  // Restore last-previewed draft in create mode (e.g. after "Back to Builder")
  useEffect(() => {
    if (isEdit) return;
    try {
      const raw = sessionStorage.getItem("preview-data-v3");
      if (raw) load(JSON.parse(raw));
    } catch { }
  }, [isEdit, load]);

  const handlePreview = () => {
    sessionStorage.setItem("preview-data-v3", JSON.stringify(form));
    window.open("/preview", "_blank");
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.about.trim()) {
      setError("Name and About are required. Go to Personal Info.");
      setActiveSection("personal");
      return;
    }
    setSaving(true); setError("");
    const saveData = { ...form };
    if (thumbnail) saveData.thumbnail = thumbnail;
    try {
      if (isEdit) {
        await updatePortfolio(id, saveData, token);
        setSuccess({ id, slug: form.shareSlug, isEdit: true });
      } else {
        const res = await createPortfolio(saveData, token);
        setSuccess({ id: res.data.id, slug: res.data.shareSlug, isEdit: false });
      }
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const renderSection = () => {
    const props = { form, set, setNested, addItem, updateItem, removeItem, token };
    switch (activeSection) {
      case "personal":     return <PersonalSection {...props} />;
      case "skills":       return <SkillsSection {...props} skillInput={skillInput} setSkillInput={setSkillInput} addSkill={addSkill} addSkillDirect={addSkillDirect} removeSkill={removeSkill} />;
      case "projects":     return <ProjectsSection {...props} />;
      case "experience":   return <ExperienceSection {...props} />;
      case "certs":        return <CertsSection {...props} />;
      case "achievements": return <AchievementsSection {...props} />;
      case "coding":       return <CodingSection {...props} />;
      case "contact":      return <ContactSection {...props} />;
      case "theme":        return <ThemeSection {...props} />;
      default:             return null;
    }
  };

  const currentNav = NAV.find(n => n.id === activeSection);

  if (loadingEdit) return (
    <div className="builder-layout">
      <div className="builder-sidebar" style={{ padding: "24px 16px" }}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="skeleton" style={{ width: "80%", height: 14, marginBottom: 16, borderRadius: 4 }} />
        ))}
      </div>
      <div className="builder-main" style={{ padding: "32px 40px" }}>
        <div className="skeleton" style={{ width: 200, height: 24, marginBottom: 24, borderRadius: 6 }} />
        <div className="skeleton" style={{ width: "100%", height: 48, marginBottom: 20, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: "100%", height: 48, marginBottom: 20, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: "70%", height: 48, marginBottom: 32, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: 140, height: 40, borderRadius: 8 }} />
      </div>
    </div>
  );

  // Success state — stored for toast, form stays visible for re-saves

  return (
    <div className="builder-page" style={{ position: "relative", minHeight: "calc(100vh - 52px)" }}>
      <DotField
        dotRadius={1.5}
        dotSpacing={16}
        bulgeStrength={67}
        glowRadius={160}
        sparkle={false}
        waveAmplitude={0}
        gradientFrom={theme === "dark" ? "rgba(200, 140, 255, 0.55)" : "rgba(168, 85, 247, 0.35)"}
        gradientTo={theme === "dark" ? "rgba(220, 180, 255, 0.45)" : "rgba(180, 151, 207, 0.25)"}
        glowColor={theme === "dark" ? "#0a0510" : "#120F17"}
      />
      {/* Success toast */}
      {success && (
        <div className="toast fade-up">
          <span>🎉 {success.isEdit ? "Updated" : "Created"} — </span>
          <a href={`/p/${success.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-light)", textDecoration: "underline" }}>View portfolio</a>
          <button type="button" onClick={() => setSuccess(null)} style={{ background: "none", border: "none", color: "var(--text-tertiary)", cursor: "pointer", fontSize: 14, marginLeft: 8, padding: 0, lineHeight: 1 }}>✕</button>
        </div>
      )}
      {/* Hidden thumbnail capture — re-captures when theme changes */}
      {form.name && <ThumbnailGenerator key={form.theme + form.name} data={{ name: form.name, title: form.title, theme: form.theme }} onCapture={setThumbnail} />}
      <div className="builder-layout" style={{ position: "relative", zIndex: 1 }}>
        {/* Sidebar */}
        <aside className="builder-sidebar" style={{ display: "flex", flexDirection: "column", background: "transparent", borderRight: "none", padding: "var(--space-6) 0" }}>
          <div className="builder-sidebar-header glass" style={{ margin: "0 8px 12px", borderRadius: 10, padding: "12px 16px", border: "none" }}>
            <div className="builder-sidebar-title">{isEdit ? "Edit Portfolio" : "New Portfolio"}</div>
          </div>
          <div className="glass" style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "flex-start", padding: "12px 0 0", margin: "0 8px", borderRadius: 12, border: "none" }}>
            <LineSidebar
              items={NAV.map(i => i.label)}
              accentColor={theme === "dark" ? "#FFFFFF" : "#000000"}
              textColor={theme === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"}
              markerColor={theme === "dark" ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)"}
              showIndex={false}
              showMarker
              maxShift={30}
              markerLength={20}
              markerGap={0}
              tickScale={0.5}
              scaleTick
              itemGap={20}
              fontSize={0.85}
              defaultActive={NAV.findIndex(n => n.id === activeSection)}
              onItemClick={(index) => setActiveSection(NAV[index].id)}
            />
          </div>
          {/* Sidebar action buttons — always visible */}
          <div className="glass" style={{ margin: "8px 8px 0", padding: "10px 12px", borderRadius: 12, border: "none", display: "flex", flexDirection: "column", gap: 6 }}>
            <button className="btn btn-secondary btn-sm" onClick={handlePreview} style={{ width: "100%", justifyContent: "center" }}>
              👁 Preview
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving} style={{ width: "100%", justifyContent: "center" }}>
              {saving
                ? <><span className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} /> {isEdit ? "Saving…" : "Creating…"}</>
                : isEdit ? "💾 Save Changes" : "🚀 Generate Portfolio"
              }
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main style={{ overflow: "auto", padding: "var(--space-6) var(--space-6) var(--space-6) 0" }}>
          <div className="builder-main glass" style={{ borderRadius: 16, padding: "var(--space-8) var(--space-10)", border: "none" }}>
            <div className="builder-section-title">{currentNav?.label}</div>
            <div className="builder-section-sub">
              {activeSection === "personal" && "Start with the basics — who you are"}
              {activeSection === "skills" && "Showcase your tech stack"}
              {activeSection === "projects" && "Add your best work (up to 8)"}
              {activeSection === "experience" && "Your professional journey"}
              {activeSection === "certs" && "Certifications and credentials"}
              {activeSection === "achievements" && "Awards and notable wins"}
              {activeSection === "coding" && "Your competitive programming profiles"}
              {activeSection === "contact" && "How people can reach you"}
              {activeSection === "theme" && "Pick a visual identity for your portfolio"}
            </div>

            {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>⚠ {error}</div>}

            {success && (
              <div className="alert alert-success" style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>✅ {success.isEdit ? "Portfolio updated!" : "Portfolio created!"} — <a href={`/p/${success.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>View it here</a></span>
                <button type="button" onClick={() => setSuccess(null)} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: 16, padding: 0, lineHeight: 1 }}>✕</button>
              </div>
            )}

            {renderSection()}

            <div className="builder-footer" style={{ borderTop: "none", marginTop: 0 }}>
              <button className="btn btn-ghost" onClick={() => {
                const idx = NAV.findIndex(n => n.id === activeSection);
                if (idx > 0) setActiveSection(NAV[idx - 1].id);
              }} disabled={activeSection === NAV[0].id}>
                ← Back
              </button>
              <div className="builder-footer-right">
                {activeSection !== NAV[NAV.length - 1].id ? (
                  <button className="btn btn-primary" onClick={() => {
                    const idx = NAV.findIndex(n => n.id === activeSection);
                    setActiveSection(NAV[idx + 1].id);
                  }}>
                    Next →
                  </button>
                ) : (
                  <span />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BuilderPage;
