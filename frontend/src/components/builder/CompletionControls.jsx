import React, { useEffect, useRef, useState } from "react";
import { getTheme } from "../../registry/themeRegistry";
import { contrast } from "./ThemePicker";
import { externalURL, imageURL } from "../../utils/portfolioContent";

export function PersonalExtras({ form, set }) {
  return <fieldset className="completion-fieldset"><legend>More about you · optional</legend>
    {[["availability", "Availability", "Open to internships"], ["motto", "Motto", "An idea that guides your work"], ["audience", "Audience for this version", "Recruiters, clients, collaborators…"]].map(([key, label, placeholder]) => <div className="form-group" key={key}><label htmlFor={key}>{label}</label><input id={key} className="form-input" maxLength={200} value={form[key] || ""} placeholder={placeholder} onChange={e => set(key, e.target.value)} /></div>)}
    <label htmlFor="interests">Interests · one per line</label><textarea id="interests" className="form-input" rows={3} value={(form.interests || []).join("\n")} onChange={e => set("interests", e.target.value.split("\n"))} />
    <label><input type="checkbox" checked={form.showLocation !== false} onChange={e => set("showLocation", e.target.checked)} /> Show my location</label>
    <div className="form-group"><label htmlFor="resume-link">Resume link</label><input id="resume-link" className="form-input" type="url" placeholder="https://example.com/my-resume.pdf" value={form.resumeUrl || ""} onChange={e => set("resumeUrl", e.target.value)} /><p className="form-hint">Provide a public link to your own resume. Leave it blank to omit the resume action.</p></div>
  </fieldset>;
}
export function PresentationControls({ form, set }) {
  const sections = form.sectionOrder || ["projects", "experience", "credentials", "profiles", "contact"];
  const move = (index, delta) => { const next = [...sections]; const [item] = next.splice(index, 1); next.splice(index + delta, 0, item); set("sectionOrder", next); };
  return <fieldset className="completion-fieldset"><legend>Layout & motion</legend><label htmlFor="motion-choice">Motion preference</label><select id="motion-choice" className="form-input" value={form.motion || "expressive"} onChange={e => set("motion", e.target.value)}><option value="expressive">Expressive · animated & interactive</option><option value="subtle">Subtle · gentle movement</option><option value="none">Still · no animation</option></select><p className="form-hint">Your visitor’s reduced-motion setting always takes priority.</p>
    <p>Show or hide sections without deleting your information. Move sections to change the reading order.</p>
    {["about", "skills", ...sections].map((key, i) => <div className="section-control" key={key}><label><input type="checkbox" checked={form.sectionVisibility?.[key] !== false} onChange={e => set("sectionVisibility", { ...form.sectionVisibility, [key]: e.target.checked })} /> {key === "profiles" ? "Coding profiles" : key[0].toUpperCase() + key.slice(1)}</label>{i > 1 && <span><button type="button" className="btn btn-ghost btn-sm" aria-label={`Move ${key} section up`} disabled={i === 2} onClick={() => move(i - 2, -1)}>↑</button><button type="button" className="btn btn-ghost btn-sm" aria-label={`Move ${key} section down`} disabled={i === sections.length + 1} onClick={() => move(i - 2, 1)}>↓</button></span>}</div>)}
    <label><input type="checkbox" checked={Boolean(form.showcaseOptIn)} onChange={e => set("showcaseOptIn", e.target.checked)} /> Include my published portfolio in the community showcase, credited to my name</label><p className="form-hint">Private portfolios are never listed. You can withdraw by unchecking this option and saving.</p>
  </fieldset>;
}
export function publishingIssues(form) {
  const issues = [];
  if (!form.name.trim() || !form.about.trim()) issues.push({ section: "personal", text: "Add your name and biography before saving.", blocking: true });
  if (!form.projects.length) issues.push({ section: "projects", text: "Add a project if you want to show your work." });
  (form.projects || []).forEach((p, i) => {
    if (!p.title?.trim()) issues.push({ section: "projects", text: `Give project ${i + 1} a title.`, blocking: true });
    if (!p.link && !p.github) issues.push({ section: "projects", text: `Project ${i + 1} has no link. Add a live or source link, or keep it as a written case study.` });
    if (!p.image) issues.push({ section: "projects", text: `Project ${i + 1} will use a typographic cover. Add a screenshot if you prefer.` });
  });
  const urls = [["personal", form.resumeUrl], ["personal", form.avatarUrl, true], ...Object.values(form.socialLinks || {}).map(v => ["contact", v]), ...(form.projects || []).flatMap(p => [["projects", p.link], ["projects", p.github], ["projects", p.image, true]]), ...(form.certifications || []).map(c => ["certs", c.credentialUrl]), ...(form.codingProfiles || []).map(p => ["coding", p.url])];
  urls.forEach(([section, url, isImage]) => { if (url && !(isImage ? imageURL(url) : externalURL(url))) issues.push({ section, text: `${isImage ? "Use a supported image address or upload an image" : "Use a complete http or https address"}: ${url.slice(0, 70)}`, blocking: true }); });
  if (form.contact?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact.email)) issues.push({ section: "contact", text: "Check your contact email address.", blocking: true });
  if (!form.contact?.email && !form.contact?.phone && !Object.values(form.socialLinks || {}).some(Boolean)) issues.push({ section: "contact", text: "Add a way for visitors to reach you." });
  (form.experience || []).forEach((e, i) => { if (![e.role, e.company, e.duration].every(v => v?.trim())) issues.push({ section: "experience", text: `Complete the role, organization and duration in experience ${i + 1}.`, blocking: true }); });
  for (const [field, section] of [["certifications", "certs"], ["achievements", "achievements"]]) (form[field] || []).forEach((v, i) => { if (!v.title?.trim()) issues.push({ section, text: `Add a title to ${field} ${i + 1}.`, blocking: true }); });
  const palette = { ...getTheme(form.theme).colors, ...Object.fromEntries(Object.entries(form.themeColors || {}).filter(([, v]) => v)) };
  if (contrast(palette.text, palette.bg) < 4.5) issues.push({ section: "theme", text: "Your text and background colours may be hard to read. Reset colours or choose a curated palette." });
  return issues;
}
export function PublishCheck({ form, onSection }) {
  const issues = publishingIssues(form);
  return <details className="publish-check" open={form.isPublic || undefined}><summary>Check before publishing · {issues.length ? `${issues.length} suggestions` : "Ready"}</summary><p>{form.isPublic ? "Saving makes these changes public at your existing link." : "This portfolio is private until you choose Public and save."}</p>{issues.length ? <ul>{issues.map((issue, i) => <li key={i}>{issue.text} <button type="button" className="btn btn-ghost btn-sm" onClick={() => onSection(issue.section)}>Review {issue.section}</button></li>)}</ul> : <p>Your required information and links pass these checks. Review the full preview before publishing.</p>}</details>;
}
export function ImageCropper({ source, onApply, onCancel }) {
  const dialog = useRef(null); const [zoom, setZoom] = useState(1); const [x, setX] = useState(50); const [y, setY] = useState(50); const [error, setError] = useState("");
  useEffect(() => { const el = dialog.current; const trigger = document.activeElement; el.showModal(); return () => { el.close(); trigger?.focus(); }; }, []);
  const canvasRef = useRef(null);
  const draw = (canvas,image) => { const side = Math.min(image.width,image.height)/zoom; canvas.width=canvas.height=512; const ctx=canvas.getContext("2d"); ctx.fillStyle="#fff";ctx.fillRect(0,0,512,512);ctx.drawImage(image,(image.width-side)*x/100,(image.height-side)*y/100,side,side,0,0,512,512); };
  useEffect(()=>{ const image=new Image(); let active=true; image.onload=()=>{if(active&&canvasRef.current) draw(canvasRef.current,image);}; image.src=source;return()=>{active=false;}; },[source,zoom,x,y]); // eslint-disable-line
  const apply = () => { const image = new Image(); image.onload = () => { try { const canvas = document.createElement("canvas"); draw(canvas,image); onApply(canvas.toDataURL("image/jpeg", .82)); } catch { setError("This image could not be cropped. Try another file."); } }; image.onerror = () => setError("Image could not be read."); image.src = source; };
  return <dialog className="completion-dialog" ref={dialog} aria-labelledby="crop-title" onCancel={e => { e.preventDefault(); onCancel(); }}><h2 id="crop-title">Crop image</h2><div className="crop-preview"><canvas ref={canvasRef} aria-label="Crop preview" style={{width:"100%",height:"100%"}} /></div>{[["Zoom", zoom, setZoom, 1, 3, .05], ["Horizontal position", x, setX, 0, 100, 1], ["Vertical position", y, setY, 0, 100, 1]].map(([label, value, change, min, max, step], i) => <label key={label} htmlFor={`crop-${i}`}>{label}<input id={`crop-${i}`} type="range" min={min} max={max} step={step} value={value} onChange={e => change(Number(e.target.value))} /></label>)}{error && <p role="alert">{error}</p>}<div className="review-actions"><button type="button" className="btn btn-primary" onClick={apply}>Apply crop</button><button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button></div></dialog>;
}
