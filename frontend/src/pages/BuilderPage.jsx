import FieldGroup from "../components/builder/FieldGroup";
/**
 * BuilderPage v3
 * Left sidebar navigation, AI-powered fields, 9 sections
 * Supports both CREATE and EDIT modes
 */

import React, { useState, useEffect, useRef } from "react";
import { PersonalExtras, PresentationControls, PublishCheck, ImageCropper, publishingIssues } from "../components/builder/CompletionControls";
import ResumeImport from "../components/builder/ResumeImport";
import { readJSON, removeStored } from "../utils/storage";
import { trackStep } from "../utils/journey";
import useAISuggestion from "../hooks/useAISuggestion";
import AITextReview from "../components/builder/AITextReview";
import ThemePicker from "../components/builder/ThemePicker";
import ThemeFrame from "../components/builder/ThemeFrame";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import useBuilderSession from "../hooks/useBuilderSession";
import { usePortfolioForm } from "../hooks/usePortfolioForm";
import {
  generateBio, suggestSkills, generateProjectDesc,
} from "../utils/api";
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
  <button type="button" role="switch" aria-checked={on} className="toggle-row" onClick={onChange} style={{ cursor: "pointer", background: "transparent", border: "none", textAlign: "left" }}>
    <div className={`toggle-track ${on ? "on" : ""}`}>
      <div className="toggle-thumb" />
    </div>
    <span className="toggle-label">{label}</span>
  </button>
);

// ── Section renderers ─────────────────────────────────────────────────────────

const PersonalSection = ({ form, set, token }) => {
  const bioAI = useAISuggestion();
  const [avatarError, setAvatarError] = useState("");
  const [cropSource, setCropSource] = useState(null);
  const fileRef = useRef(null);

  const handleGenerateBio = () => {
    if (!form.name.trim()) return bioAI.setError("Add your name first.");
    if (!form.about.trim() && !form.title.trim() && !form.skills.length && !form.experience.length) {
      return bioAI.setError("Add your role, skills, experience, or a few notes about yourself first.");
    }
    bioAI.run(async signal => {
      const res = await generateBio({ name: form.name, title: form.title, about: form.about, skills: form.skills, experience: form.experience }, token, signal);
      if (typeof res.bio !== "string" || !res.bio.trim()) throw new Error("No bio was returned. Try again.");
      return res.bio;
    });
  };

  const handleAvatarFile = (file) => {
    setAvatarError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) return setAvatarError("Please choose an image file.");
    if (file.size > 5 * 1024 * 1024) return setAvatarError("Image must be under 5 MB.");
    const reader = new FileReader();
    reader.onload = () => { const image = new Image(); image.onload = () => setCropSource(reader.result); image.onerror = () => setAvatarError("Could not read that image. Try a different file."); image.src = reader.result; };
    reader.onerror = () => setAvatarError("Could not read that file.");
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <FieldGroup className="form-group">
        <label className="form-label" htmlFor="portfolio-name">Full Name *</label>
        <input id="portfolio-name" autoComplete="name" className="form-input" placeholder="John Doe" value={form.name} onChange={e => set("name", e.target.value)} />
      </FieldGroup>
      <FieldGroup className="form-group">
        <label className="form-label" htmlFor="portfolio-title">Professional Title</label>
        <input id="portfolio-title" autoComplete="organization-title" className="form-input" placeholder="Full Stack Developer · ML Engineer" value={form.title} onChange={e => set("title", e.target.value)} />
      </FieldGroup>
      <FieldGroup className="form-group">
        <div className="form-label" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <label htmlFor="portfolio-about">About Me *</label>
          <AIButton onClick={handleGenerateBio} loading={bioAI.loading}>Generate Bio</AIButton>
        </div>

        <textarea id="portfolio-about" maxLength={2000} className="form-input" rows={5} placeholder="Write a compelling bio…" value={form.about} onChange={e => set("about", e.target.value)} />
        <div className="form-hint">{form.about.length}/2000 · Generate Bio creates a draft for you to review</div>
        <AITextReview ai={bioAI} value={form.about} onChange={v => set("about", v)} onRetry={handleGenerateBio} label="bio" />
      </FieldGroup>
      <FormRow>
        <FieldGroup className="form-group">
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
        </FieldGroup>
        <FieldGroup className="form-group">
          <label className="form-label">Location</label>
          <input className="form-input" placeholder="Hyderabad, India" value={form.location} onChange={e => set("location", e.target.value)} />
        </FieldGroup>
      </FormRow>
      {cropSource && <ImageCropper source={cropSource} onApply={value => { set("avatarUrl", value); setCropSource(null); }} onCancel={() => setCropSource(null)} />}
      <PersonalExtras form={form} set={set} />
      {form.avatarUrl && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: -8 }}>
          <img key={form.avatarUrl} src={form.avatarUrl} alt="preview" onError={e => e.target.style.display = "none"}
            style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--accent)" }} />
          <span className="form-hint">Avatar preview</span>
        </div>
      )}
    </div>
  );
};

const SkillsSection = ({ form, set, skillInput, setSkillInput, addSkill, addSkillDirect, removeSkill, token }) => {
  const skillsAI = useAISuggestion();
  const [chosen, setChosen] = useState([]);
  const SUGGESTED = ["JavaScript","TypeScript","React","Node.js","Python","MongoDB","Express","PostgreSQL","Docker","AWS","Git","REST APIs","GraphQL","Next.js","Redux","Vue.js","Angular","MySQL","Firebase","Linux"];

  const handleSuggest = () => {
    if (!form.title.trim()) return skillsAI.setError("Add your professional title first.");
    skillsAI.run(async signal => {
      const res = await suggestSkills({ title: form.title, currentSkills: form.skills }, token, signal);
      if (!Array.isArray(res.skills) || res.skills.some(s => typeof s !== "string")) throw new Error("No usable skills were returned. Try again.");
      setChosen([]);
      return [...new Set(res.skills.map(s => s.trim()).filter(s => s && !form.skills.some(existing => existing.toLowerCase() === s.toLowerCase())))];
    });
  };

  return (
    <div>
      <div className="ai-panel">
        <div className="ai-panel-header">
          <span style={{ fontSize: 16 }}>✦</span>
          <span className="ai-panel-title">AI Skill Suggester</span>
        </div>
        <div className="ai-panel-desc">Let AI suggest relevant skills based on your role.</div>
        {skillsAI.error && <div className="form-error" role="alert">{skillsAI.error}</div>}
        <AIButton onClick={handleSuggest} loading={skillsAI.loading}>Suggest Skills for "{form.title || "my role"}"</AIButton>
      </div>

      {skillsAI.suggestion && <div className="ai-review" aria-label="Skill suggestions">
        <p>Select only skills you can demonstrate. Suggestions are not claims about your experience.</p>
        <div className="skill-choices">{skillsAI.suggestion.map(skill => <label key={skill}>
          <input type="checkbox" checked={chosen.includes(skill)} onChange={e => setChosen(prev => e.target.checked ? [...prev, skill] : prev.filter(s => s !== skill))} /> {skill}
        </label>)}</div>
        {!skillsAI.suggestion.length && <p>No new suggestions. Try another request or add skills yourself.</p>}
        <div className="review-actions">
          <button type="button" className="btn btn-primary btn-sm" disabled={!chosen.length || skillsAI.loading} onClick={() => { chosen.forEach(addSkillDirect); skillsAI.setSuggestion(null); setChosen([]); }}>Add selected skills</button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => skillsAI.setSuggestion(null)}>Dismiss suggestions</button>
        </div>
      </div>}
      <FieldGroup className="form-group">
        <label className="form-label">Add Skills</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input className="form-input" placeholder="Type a skill and press Enter…" value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(); } }}
            style={{ flex: 1 }} />
          <button type="button" className="btn btn-secondary btn-sm" onClick={addSkill} style={{ flexShrink: 0 }}>Add</button>
        </div>
      </FieldGroup>

      {form.skills.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 20 }}>
          {form.skills.map((s, i) => (
            <span key={i} className="tag">
              {s}
              <button type="button" className="tag-remove" aria-label={`Remove ${s}`} onClick={() => removeSkill(i)}>×</button>
            </span>
          ))}
        </div>
      )}

      <FieldGroup className="form-group">
        <label className="form-label">Quick Add</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {SUGGESTED.filter(s => !form.skills.map(x => x.toLowerCase()).includes(s.toLowerCase())).map(s => (
            <button key={s} type="button" className="btn btn-ghost btn-sm" onClick={() => addSkillDirect(s)}>+ {s}</button>
          ))}
        </div>
      </FieldGroup>
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
        try {
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
        } catch { reject(new Error("Could not process that image. Try another file.")); }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

const ProjectImageField = ({ value, onChange }) => {
  const changeRef = useRef(onChange); changeRef.current = onChange;
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);
  const [cropSource,setCropSource] = useState(null);
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
      if (mounted.current) changeRef.current(dataUrl);
    } catch (e) {
      setError(e.message || "Could not process that image.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <FieldGroup className="form-group">
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
      </FieldGroup>
      {cropSource && <ImageCropper source={cropSource} onApply={v=>{ if(mounted.current) changeRef.current(v); setCropSource(null); }} onCancel={()=>setCropSource(null)} />}
      {value && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: -8, marginBottom: 16 }}>
          <img key={value} src={value} alt="preview" onError={e => e.target.style.display = "none"}
            style={{ width: 72, height: 48, borderRadius: 4, objectFit: "cover", border: "1px solid var(--accent)" }} />
          <span className="form-hint">{isUpload ? "Uploaded image" : "Image preview"}</span>
          {isUpload && <button type="button" className="btn btn-ghost btn-sm" onClick={()=>setCropSource(value)}>Crop image</button>}
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange("")} style={{ padding: "4px 10px", cursor: "pointer" }}>
            ✕ Remove
          </button>
        </div>
      )}
    </>
  );
};

const ProjectEditor = ({ p, i, updateItem, onRemove, onMove, count, onFeature, token }) => {
  const ai = useAISuggestion();
  const [techInput, setTechInput] = useState(null);
  const handleGenerate = () => {
    if (!p.title.trim()) return ai.setError("Add a project title first.");
    if (!p.description.trim() && ![p.problem, p.contribution, p.process, p.outcome].some(value => value?.trim())) return ai.setError("Add a few facts about what you built and your contribution first. AI can then refine your description.");
    ai.run(async signal => {
      const res = await generateProjectDesc({ title: p.title, description: p.description, techStack: p.techStack, problem: p.problem, contribution: p.contribution, process: p.process, outcome: p.outcome }, token, signal);
      if (typeof res.description !== "string" || !res.description.trim()) throw new Error("No description was returned. Try again.");
      return res.description;
    });
  };
  return <SubCard title={`Project ${i + 1}`} onRemove={onRemove}>
    <div className="review-actions">
      <button type="button" className="btn btn-secondary btn-sm" aria-label={`Move project ${i + 1} up`} disabled={i === 0} onClick={() => onMove(i - 1)}>↑ Move up</button>
      <button type="button" className="btn btn-secondary btn-sm" aria-label={`Move project ${i + 1} down`} disabled={i === count - 1} onClick={() => onMove(i + 1)}>↓ Move down</button>
      <button type="button" className={`btn btn-sm ${p.featured ? "btn-primary" : "btn-ghost"}`} aria-pressed={Boolean(p.featured)} onClick={onFeature}>{p.featured ? "★ Featured project" : "☆ Feature project"}</button>
    </div>
    <FieldGroup className="form-group">
      <label className="form-label" htmlFor={`project-title-${i}`}>Title *</label>
      <input id={`project-title-${i}`} className="form-input" placeholder="E-Commerce Platform" value={p.title} onChange={e => updateItem("projects", i, "title", e.target.value)} />
    </FieldGroup>
    <FieldGroup className="form-group">
      <div className="form-label review-actions">
        <label htmlFor={`project-description-${i}`}>Description</label>
        <AIButton onClick={handleGenerate} loading={ai.loading}>Write with AI</AIButton>
      </div>
      <textarea id={`project-description-${i}`} className="form-input" rows={4} placeholder="What does it do? What problem does it solve?" value={p.description} onChange={e => updateItem("projects", i, "description", e.target.value)} />
      <p className="form-hint">Describe the problem, your contribution, tools, and any outcome you can support. Leave unknown results out.</p>
      <AITextReview ai={ai} value={p.description} onChange={v => updateItem("projects", i, "description", v)} onRetry={handleGenerate} label={`project-${i + 1}`} />
    </FieldGroup>
    <FieldGroup className="form-group">
      <label className="form-label" htmlFor={`project-tech-${i}`}>Tech Stack (comma-separated)</label>
      <input id={`project-tech-${i}`} className="form-input" placeholder="React, Node.js, MongoDB" value={techInput ?? (p.techStack || []).join(", ")}
        onChange={e => { setTechInput(e.target.value); updateItem("projects", i, "techStack", e.target.value.split(",").map(t => t.trim()).filter(Boolean)); }} onBlur={() => setTechInput(null)} />
    </FieldGroup>
    <details className="builder-project-story">
      <summary>Add a project story (optional)</summary>
      <p className="form-hint">Add only facts you can support. These fields appear in every theme and help AI refine your description.</p>
      {[["problem", "The problem", "Who needed this, and what problem did they have?"], ["contribution", "My contribution", "What did you personally design or build?"], ["process", "The process", "How did you approach it? Which decisions mattered?"], ["outcome", "The outcome", "What changed? Use measured results only when you have them."]].map(([field, label, placeholder]) => <FieldGroup className="form-group" key={field}>
        <label className="form-label" htmlFor={`project-${field}-${i}`}>{label}</label>
        <textarea className="form-input" id={`project-${field}-${i}`} placeholder={placeholder} rows={3} value={p[field] || ""} onChange={e => updateItem("projects", i, field, e.target.value)} />
      </FieldGroup>)}
    </details>
    <ProjectImageField value={p.image} onChange={v => updateItem("projects", i, "image", v)} />
    <FormRow>
      <FieldGroup className="form-group"><label className="form-label">Live URL</label><input className="form-input" type="url" placeholder="https://myapp.com" value={p.link} onChange={e => updateItem("projects", i, "link", e.target.value)} /></FieldGroup>
      <FieldGroup className="form-group"><label className="form-label">GitHub URL</label><input className="form-input" type="url" placeholder="https://github.com/…" value={p.github} onChange={e => updateItem("projects", i, "github", e.target.value)} /></FieldGroup>
    </FormRow>
  </SubCard>;
};

const ProjectsSection = ({ form, set, addItem, updateItem, moveItem, removeItem, token }) => {
  // Keys belong to editors, not array positions. Removing one cannot move its AI draft to another project.
  const keys = useRef([]);
  const counter = useRef(0);
  while (keys.current.length < form.projects.length) keys.current.push(++counter.current);
  return <div>
    <p className="form-hint">Arrange your projects with Move up/down. Every theme supports featured selection and project stories.</p>
    {form.projects.map((p, i) => <ProjectEditor key={keys.current[i]} p={p} i={i} updateItem={updateItem} token={token} count={form.projects.length}
      onMove={to => { const [key] = keys.current.splice(i, 1); keys.current.splice(to, 0, key); moveItem("projects", i, to); }}
      onFeature={() => set("projects", form.projects.map((project, index) => ({ ...project, featured: index === i ? !project.featured : false })))}
      onRemove={() => { keys.current.splice(i, 1); removeItem("projects", i); }} />)}
    {form.projects.length < 8 && <button type="button" className="add-row-btn" onClick={() => addItem("projects", { title: "", description: "", link: "", github: "", image: "", techStack: [] })}>+ Add Project</button>}
  </div>;
};

const ExperienceSection = ({ form, addItem, updateItem, removeItem }) => (
  <div>
    {form.experience.map((e, i) => (
      <SubCard key={i} title={`Position ${i + 1}`} onRemove={() => removeItem("experience", i)}>
        <FormRow>
          <FieldGroup className="form-group">
            <label className="form-label">Job Title *</label>
            <input className="form-input" placeholder="Senior Developer" value={e.role} onChange={ev => updateItem("experience", i, "role", ev.target.value)} />
          </FieldGroup>
          <FieldGroup className="form-group">
            <label className="form-label">Company *</label>
            <input className="form-input" placeholder="Google" value={e.company} onChange={ev => updateItem("experience", i, "company", ev.target.value)} />
          </FieldGroup>
        </FormRow>
        <FieldGroup className="form-group">
          <label className="form-label">Duration *</label>
          <input className="form-input" placeholder="Jan 2022 – Present" value={e.duration} onChange={ev => updateItem("experience", i, "duration", ev.target.value)} />
        </FieldGroup>
        <FieldGroup className="form-group" style={{ marginBottom: 12 }}>
          <Toggle on={e.current} onChange={() => updateItem("experience", i, "current", !e.current)} label="Current role" />
        </FieldGroup>
        <FieldGroup className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-input" rows={3} placeholder="Key achievements and responsibilities…" value={e.description} onChange={ev => updateItem("experience", i, "description", ev.target.value)} />
        </FieldGroup>
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
        <FieldGroup className="form-group">
          <label className="form-label">Certificate Title *</label>
          <input className="form-input" placeholder="AWS Solutions Architect" value={c.title} onChange={e => updateItem("certifications", i, "title", e.target.value)} />
        </FieldGroup>
        <FormRow>
          <FieldGroup className="form-group">
            <label className="form-label">Issuing Organization</label>
            <input className="form-input" placeholder="Amazon Web Services" value={c.issuer} onChange={e => updateItem("certifications", i, "issuer", e.target.value)} />
          </FieldGroup>
          <FieldGroup className="form-group">
            <label className="form-label">Date</label>
            <input className="form-input" placeholder="Dec 2023" value={c.date} onChange={e => updateItem("certifications", i, "date", e.target.value)} />
          </FieldGroup>
        </FormRow>
        <FieldGroup className="form-group">
          <label className="form-label">Credential URL</label>
          <input className="form-input" type="url" placeholder="https://credly.com/badges/…" value={c.credentialUrl} onChange={e => updateItem("certifications", i, "credentialUrl", e.target.value)} />
        </FieldGroup>
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
          <FieldGroup className="form-group">
            <label className="form-label">Icon</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {ICONS.map(ic => (
                <button key={ic} type="button" onClick={() => updateItem("achievements", i, "icon", ic)}
                  style={{ width: 36, height: 36, fontSize: 18, borderRadius: 8, cursor: "pointer", background: a.icon === ic ? "var(--accent-glow)" : "var(--surface-0)", border: `1.5px solid ${a.icon === ic ? "var(--accent)" : "var(--border)"}`, transition: "all 0.15s" }}>
                  {ic}
                </button>
              ))}
            </div>
          </FieldGroup>
          <FieldGroup className="form-group">
            <label className="form-label">Title *</label>
            <input className="form-input" placeholder="1st Place — National Hackathon" value={a.title} onChange={e => updateItem("achievements", i, "title", e.target.value)} />
          </FieldGroup>
          <FormRow>
            <FieldGroup className="form-group">
              <label className="form-label">Date</label>
              <input className="form-input" placeholder="March 2024" value={a.date} onChange={e => updateItem("achievements", i, "date", e.target.value)} />
            </FieldGroup>
          </FormRow>
          <FieldGroup className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" rows={2} placeholder="Brief details…" value={a.description} onChange={e => updateItem("achievements", i, "description", e.target.value)} />
          </FieldGroup>
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
          <FieldGroup className="form-group">
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
          </FieldGroup>
          <FormRow>
            <FieldGroup className="form-group">
              <label className="form-label">Username</label>
              <input className="form-input" placeholder="john_doe" value={p.username || ""} onChange={e => updateItem("codingProfiles", i, "username", e.target.value)} />
            </FieldGroup>
            <FieldGroup className="form-group">
              <label className="form-label">Profile URL</label>
              <input className="form-input" type="url" placeholder="https://leetcode.com/u/…" value={p.url || ""} onChange={e => updateItem("codingProfiles", i, "url", e.target.value)} />
            </FieldGroup>
          </FormRow>
          <FormRow>
            <FieldGroup className="form-group">
              <label className="form-label">Rating / Rank</label>
              <input className="form-input" placeholder="1800 / Expert" value={p.rating || ""} onChange={e => updateItem("codingProfiles", i, "rating", e.target.value)} />
            </FieldGroup>
            <FieldGroup className="form-group">
              <label className="form-label">Problems Solved</label>
              <input className="form-input" placeholder="450" value={p.solved || ""} onChange={e => updateItem("codingProfiles", i, "solved", e.target.value)} />
            </FieldGroup>
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
      <FieldGroup className="form-group">
        <label className="form-label">Email</label>
        <input className="form-input" type="email" placeholder="john@example.com" value={form.contact.email} onChange={e => setNested("contact", "email", e.target.value)} />
      </FieldGroup>
      <FieldGroup className="form-group">
        <label className="form-label">Phone</label>
        <input className="form-input" placeholder="+91 98765 43210" value={form.contact.phone} onChange={e => setNested("contact", "phone", e.target.value)} />
      </FieldGroup>
    </div>
    <div className="sub-card">
      <div className="sub-card-header"><span className="sub-card-label">Social Links</span></div>
      {[
        { key: "github", label: "GitHub", ph: "https://github.com/username" },
        { key: "linkedin", label: "LinkedIn", ph: "https://linkedin.com/in/username" },
        { key: "twitter", label: "Twitter / X", ph: "https://twitter.com/username" },
        { key: "website", label: "Personal Website", ph: "https://yoursite.com" },
      ].map(({ key, label, ph }) => (
        <FieldGroup key={key} className="form-group">
          <label className="form-label">{label}</label>
          <input className="form-input" type="url" placeholder={ph} value={form.socialLinks[key]} onChange={e => setNested("socialLinks", key, e.target.value)} />
        </FieldGroup>
      ))}
    </div>
  </div>
);

const ThemeSection = ThemePicker;

// ── Main BuilderPage ──────────────────────────────────────────────────────────

const BuilderPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { token, user, storageError: authStorageError } = useAuth();
  const location = useLocation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("personal");
  const [view, setView] = useState("edit");
  const [previewDevice, setPreviewDevice] = useState(() => window.matchMedia("(min-width: 1280px)").matches ? "desktop" : "mobile");
  const [wide, setWide] = useState(() => window.matchMedia("(min-width: 1280px)").matches);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1280px)");
    const change = () => { setWide(media.matches); setPreviewDevice(media.matches ? "desktop" : "mobile"); }; media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  const [, setThumbnail] = useState("");
  const coverCapture = useRef(null);
  const saveLock = useRef(false);
  const [capturingCover,setCapturingCover] = useState(false);

  const {
    form, skillInput, setSkillInput,
    set, setNested,
    addSkill, addSkillDirect, removeSkill,
    addItem, updateItem, moveItem, removeItem,
    load, undo, redo, canUndo, canRedo,
  } = usePortfolioForm();

  const session = useBuilderSession({ id, token, user, form, load, navigate, location });
  const { ready, loadError, error, storageError, recoverable, saving, success, setSuccess } = session;
  const handlePreview = candidate => { trackStep("preview"); session.preview(candidate); };
  const [validationError, setValidationError] = useState("");
  const [guestDraft, setGuestDraft] = useState(() => readJSON("localStorage", "porty:guest:v1").value);
  const handleSave = async () => {
    const blocking = publishingIssues(form).filter(i => i.blocking);
    if (blocking.length) { setValidationError(blocking.map(i => i.text).join(" ")); setActiveSection(blocking[0].section); return; }
    setValidationError("");
    if (saveLock.current) return;
    saveLock.current = true; setCapturingCover(true);
    const thumbnail = await coverCapture.current?.capture() || "";
    setCapturingCover(false);
    const saved = await session.save(thumbnail);
    saveLock.current = false;
    if (saved) { trackStep("save"); if (form.isPublic) trackStep("publish"); }
    if (saved === false && (!form.name.trim() || !form.about.trim())) setActiveSection("personal");
  };

  const renderSection = () => {
    const props = { form, onFullPreview: handlePreview, set, setNested, addItem, updateItem, moveItem, removeItem, token };
    switch (activeSection) {
      case "personal":     return <PersonalSection {...props} />;
      case "skills":       return <SkillsSection {...props} skillInput={skillInput} setSkillInput={setSkillInput} addSkill={addSkill} addSkillDirect={addSkillDirect} removeSkill={removeSkill} />;
      case "projects":     return <ProjectsSection {...props} />;
      case "experience":   return <ExperienceSection {...props} />;
      case "certs":        return <CertsSection {...props} />;
      case "achievements": return <AchievementsSection {...props} />;
      case "coding":       return <CodingSection {...props} />;
      case "contact":      return <ContactSection {...props} />;
      case "theme":        return <><ThemeSection {...props} /><PresentationControls form={form} set={set} /><PublishCheck form={form} onSection={setActiveSection} /></>;
      default:             return null;
    }
  };

  const currentNav = NAV.find(n => n.id === activeSection);

  if (loadError) return (
    <main className="container" style={{ paddingTop: 48 }}>
      <div className="alert alert-error" role="alert">{loadError}</div>
      <button className="btn btn-primary" onClick={session.retryLoad}>Retry</button>
      <Link className="btn btn-secondary" to="/login" state={{ from: location }}>Sign in again</Link>
      <Link className="btn btn-secondary" to="/dashboard">Dashboard</Link>
    </main>
  );
  if (!ready) return (
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
          <Link to={success.isPublic ? `/p/${success.slug}` : `/preview/${success.id}`} style={{ color: "var(--accent-light)", textDecoration: "underline" }}>View portfolio</Link>
          <button type="button" onClick={() => setSuccess(null)} style={{ background: "none", border: "none", color: "var(--text-tertiary)", cursor: "pointer", fontSize: 14, marginLeft: 8, padding: 0, lineHeight: 1 }}>✕</button>
        </div>
      )}
      {/* Hidden thumbnail capture — re-captures when theme changes */}
      {form.name && <ThumbnailGenerator ref={coverCapture} data={form} onCapture={setThumbnail} />}
      <div className={`builder-layout builder-with-preview view-${view}`} style={{ position: "relative", zIndex: 1 }}>
        {/* Sidebar */}
        <aside className="builder-sidebar builder-sidebar-active" style={{ display: "flex", flexDirection: "column", background: "transparent", borderRight: "none", padding: "var(--space-6) 0" }}>
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
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving || capturingCover || Boolean(recoverable)} style={{ width: "100%", justifyContent: "center" }}>
              {capturingCover ? "Preparing portfolio cover…" : saving
                ? <><span className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} /> {isEdit ? "Saving…" : "Creating…"}</>
                : isEdit ? "💾 Save Changes" : form.isPublic ? "Publish Portfolio" : "Save Private Portfolio"
              }
            </button>
          </div>
        </aside>

        <div className="builder-view-switch review-actions"><button type="button" className="btn btn-secondary btn-sm" aria-pressed={view === "edit"} onClick={() => setView("edit")}>Edit details</button><button type="button" className="btn btn-secondary btn-sm" aria-pressed={view === "preview"} onClick={() => setView("preview")}>Live preview</button></div>
        {/* Main content */}
        <main className="builder-content" style={{ overflow: "auto", padding: "var(--space-6) var(--space-6) var(--space-6) 0" }}>
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

            <div role="status" className="builder-save-status">{capturingCover ? "Preparing portfolio cover…" : session.status}</div>
            <p className="form-hint">{form.isPublic ? "Saving publishes your changes to your live portfolio." : "Saving keeps this portfolio private. Turn on Public in Theme & Publish when you are ready to share."}</p>
            {(storageError || authStorageError) && <div className="alert alert-error" role="alert">{storageError || authStorageError}</div>}
            {recoverable && <div className="alert alert-info" role="status">
              <p>A draft from {new Date(recoverable.savedAt).toLocaleString()} is available. Choose whether to recover it or {isEdit ? "keep the saved version" : "start a new portfolio"}.</p>
              <button className="btn btn-primary btn-sm" onClick={session.recover}>Recover draft</button>
              <button className="btn btn-secondary btn-sm" onClick={session.discard}>{isEdit ? "Keep saved version" : "Start new portfolio"}</button>
            </div>}
            {error && <div className="alert alert-error" role="alert" style={{ marginBottom: 20 }}>⚠ {error}
              {error.includes("session") && <Link to="/login" state={{ from: location }}> Sign in again</Link>}
            </div>}

            {success && (
              <div className="alert alert-success" style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>✅ {success.isEdit ? "Portfolio updated!" : "Portfolio created!"} — <Link to={success.isPublic ? `/p/${success.slug}` : `/preview/${success.id}`} style={{ color: "inherit", textDecoration: "underline" }}>View it here</Link></span>
                <button type="button" onClick={() => setSuccess(null)} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: 16, padding: 0, lineHeight: 1 }}>✕</button>
              </div>
            )}

            {validationError && <p className="alert alert-error" role="alert">{validationError}</p>}
            {!id && guestDraft && <div className="alert alert-info"><p>Your guest trial is available. Import it into this private draft?</p><button type="button" className="btn btn-primary btn-sm" onClick={() => { load({ ...guestDraft, isPublic: false }); removeStored("localStorage", "porty:guest:v1"); setGuestDraft(null); }}>Continue guest work</button><button type="button" className="btn btn-ghost btn-sm" onClick={() => setGuestDraft(null)}>Keep current draft</button></div>}
            <div className="review-actions"><button type="button" className="btn btn-secondary btn-sm" disabled={!canUndo || saving || Boolean(recoverable)} onClick={undo}>Undo</button><button type="button" className="btn btn-secondary btn-sm" disabled={!canRedo || saving || Boolean(recoverable)} onClick={redo}>Redo</button></div>
            {activeSection === "personal" && <ResumeImport form={form} onApply={next => { Object.entries(next).forEach(([key, value]) => set(key, value)); }} />}
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
        <aside className="builder-live-preview glass" aria-label="Live portfolio preview">
          <h2>Live preview</h2>
          <p className="form-hint">Changes appear here as you type.</p>
          <div className="review-actions"><button type="button" className="btn btn-secondary btn-sm" aria-pressed={previewDevice === "desktop"} onClick={() => setPreviewDevice("desktop")}>Desktop layout</button><button type="button" className="btn btn-secondary btn-sm" aria-pressed={previewDevice === "mobile"} onClick={() => setPreviewDevice("mobile")}>Mobile layout</button></div>
          {(wide || view === "preview") && <ThemeFrame data={form} device={previewDevice} height={500} title="Live portfolio preview" />}
          <button type="button" className="btn btn-ghost btn-sm" onClick={handlePreview}>Open full preview</button>
        </aside>
      </div>
    </div>
  );
};

export default BuilderPage;
