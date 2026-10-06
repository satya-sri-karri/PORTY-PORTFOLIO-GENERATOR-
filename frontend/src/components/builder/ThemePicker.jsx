import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getAllThemes, getTheme, THEME_GROUPS } from "../../registry/themeRegistry";
import { recommendTheme } from "../../utils/api";
import useAISuggestion from "../../hooks/useAISuggestion";
import ThemeFrame from "./ThemeFrame";

const PALETTES = [
  { name: "Ink & paper", bg: "#fafaf5", text: "#18212c", accent: "#245c43" },
  { name: "Midnight", bg: "#101522", text: "#f5f7ff", accent: "#b9a3ff" },
  { name: "Warm studio", bg: "#fff4e8", text: "#35251f", accent: "#984222" },
];
export function contrast(a, b) {
  const lum = hex => {
    const n = hex.replace("#", "");
    const values = [0, 2, 4].map(i => parseInt(n.slice(i, i + 2), 16) / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
  };
  const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
export default function ThemePicker({ form, set, token, onFullPreview }) {
  const allThemes = getAllThemes().sort((a, b) => a.name.localeCompare(b.name));
  const [group, setGroup] = useState("All"); const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null); const [colors, setColors] = useState(null); const [device, setDevice] = useState("desktop");
  const [compare,setCompare] = useState("");
  const ai = useAISuggestion(); const dialog = useRef(null); const trigger = useRef(null);
  const filtered = allThemes.filter(t => (group === "All" || THEME_GROUPS[group].includes(t.id)) && [t.name, t.persona, t.description, ...(t.tags || [])].join(" ").toLowerCase().includes(query.trim().toLowerCase()));
  const close = () => setSelected(null);
  const open = theme => {
    trigger.current = document.activeElement;
    setCompare(""); setSelected(theme); setDevice(window.innerWidth < 768 ? "mobile" : "desktop");
    setColors(Object.fromEntries(Object.entries(theme.colors).map(([key, fallback]) => [key, form.theme === theme.id && form.themeColors?.[key] || fallback])));
  };
  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow; document.body.style.overflow = "hidden";
    dialog.current.querySelector("button").focus();
    const keydown = event => {
      if (event.key === "Escape") { event.preventDefault(); close(); }
      if (event.key !== "Tab") return;
      const focusable = Array.from(dialog.current.querySelectorAll('button:not(:disabled), input, select, summary, a[href]'));
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", keydown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", keydown); trigger.current?.focus(); };
  }, [selected]);
  const recommend = () => ai.run(async signal => {
    const res = await recommendTheme({ title: form.title, skills: form.skills, about: form.about }, token, signal);
    const choices = res.recommendations || (res.theme ? [{ theme: res.theme, reason: res.reason }] : []);
    const valid = choices.filter(choice => allThemes.some(t => t.id === choice.theme) && typeof choice.reason === "string");
    if (!valid.length) throw new Error("No available themes were suggested. Try again.");
    return valid.slice(0, 3);
  });
  const previewData = selected ? { ...form, theme: selected.id, themeColors: colors } : form;
  return <div>
    <div className="ai-panel">
      <h3 className="ai-panel-title">AI Theme Recommender</h3>
      <p className="ai-panel-desc">Get three styles to consider, with reasons based on your profile.</p>
      <button type="button" className="btn btn-ai btn-sm" disabled={ai.loading} onClick={recommend}>{ai.loading ? "Generating…" : "✦ Recommend My Theme"}</button>
      {ai.error && <p className="form-error" role="alert">{ai.error}</p>}
      {ai.suggestion?.map(rec => <div key={rec.theme} className="ai-result"><strong>{getTheme(rec.theme).name}</strong><p>{rec.reason}</p><button type="button" className="btn btn-secondary btn-sm" onClick={() => open(getTheme(rec.theme))}>Preview {getTheme(rec.theme).name}</button></div>)}
    </div>
    <div className="form-group"><div className="form-label">Visibility</div><button type="button" role="switch" aria-checked={form.isPublic} className="toggle-row" onClick={() => set("isPublic", !form.isPublic)}><span className={`toggle-track ${form.isPublic ? "on" : ""}`}><span className="toggle-thumb" /></span><span className="toggle-label">{form.isPublic ? "Public — anyone with link can view" : "Private — only you can view"}</span></button></div>
    <label className="form-label" htmlFor="theme-search">Search themes by name or style</label>
    <input id="theme-search" className="form-input" type="search" placeholder="Try Minimalist, bold, developer…" value={query} onChange={e => setQuery(e.target.value)} />
    <div className="review-actions theme-filters">{Object.keys(THEME_GROUPS).map(g => <button key={g} type="button" className={`btn btn-sm ${g === group ? "btn-primary" : "btn-ghost"}`} aria-pressed={g === group} onClick={() => setGroup(g)}>{g}</button>)}</div>
    <p className="form-hint" role="status">{filtered.length} of {allThemes.length} themes · selected: {getTheme(form.theme).name}</p>
    {!filtered.length && <p>No themes match. Try another name or choose All.</p>}
    <div className="theme-grid">{filtered.map(theme => <button key={theme.id} type="button" aria-label={`Preview ${theme.name}`} aria-pressed={form.theme === theme.id} className={`theme-card ${form.theme === theme.id ? "selected" : ""}`} onClick={() => open(theme)}>
      <ThemeFrame data={{ ...form, theme: theme.id, themeColors: form.theme === theme.id ? form.themeColors : theme.colors }} height={145} thumbnail title={`${theme.name} thumbnail`} />
      <div className="theme-card-footer"><div><div className="theme-card-name">{theme.name}{form.theme === theme.id ? " ✓" : ""}</div><div className="theme-card-persona">{theme.persona}</div></div></div>
    </button>)}</div>
    {selected && createPortal(<div className="preview-overlay" onClick={close}>
      <div ref={dialog} className="preview-modal theme-picker-dialog" role="dialog" aria-modal="true" aria-labelledby="theme-dialog-title" onClick={e => e.stopPropagation()}>
        <button type="button" className="preview-close" aria-label="Close theme preview" onClick={close}>✕</button>
        <div className="preview-info"><h2 id="theme-dialog-title">{selected.name}</h2><p className="preview-desc">{selected.description}</p>
          <div className="review-actions"><button type="button" className="btn btn-secondary btn-sm" aria-pressed={device === "desktop"} onClick={() => setDevice("desktop")}>Desktop layout</button><button type="button" className="btn btn-secondary btn-sm" aria-pressed={device === "mobile"} onClick={() => setDevice("mobile")}>Mobile layout</button>{onFullPreview && <button type="button" className="btn btn-ghost btn-sm" onClick={() => onFullPreview(previewData)}>Open full preview</button>}</div>
          <ThemeFrame data={previewData} device={device} height={340} title={`${selected.name} theme preview`} />
          <details><summary>Compare with another theme</summary><label htmlFor="theme-compare">Comparison theme</label><select id="theme-compare" className="form-input" value={compare} onChange={e=>setCompare(e.target.value)}><option value="">Choose a theme</option>{allThemes.filter(t=>t.id!==selected.id).map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select>{compare && <><p>{getTheme(compare).name} · Same content, default palette</p><ThemeFrame data={{...form,theme:compare,themeColors:getTheme(compare).colors}} device={device} height={340} title={`${getTheme(compare).name} comparison preview`} /></>}</details>
          <p className="form-hint">Preview settings are applied only when you choose Apply Theme. Open full preview to browse the portfolio.</p>
          <div className="review-actions">{[...(selected.palettes || []), ...PALETTES].map(palette => <button key={palette.name} type="button" className="btn btn-ghost btn-sm" onClick={() => setColors({ bg: palette.bg, text: palette.text, accent: palette.accent })}>{palette.name}</button>)}<button type="button" className="btn btn-secondary btn-sm" onClick={() => setColors({ ...selected.colors })}>Reset colours</button></div>
          <div className="color-fields">{[["accent", "Accent"], ["bg", "Background"], ["text", "Text"]].map(([key, label]) => <div className="color-field" key={key}><label className="color-field-label" htmlFor={`theme-color-${key}`}>{label}</label><input id={`theme-color-${key}`} type="color" value={colors[key]} onChange={e => setColors(prev => ({ ...prev, [key]: e.target.value }))} /></div>)}</div>
          <p className="form-hint">Text/background contrast: {contrast(colors.text, colors.bg).toFixed(1)}:1. Themes may use additional surface colours.</p>
          {(contrast(colors.text, colors.bg) < 4.5 || contrast(colors.accent, colors.bg) < 3) && <p className="form-error" role="status">These colours may be hard to read. Try a curated palette or Reset colours.</p>}
          <div className="preview-actions"><button type="button" className="btn btn-primary" onClick={() => { set("theme", selected.id); set("themeColors", { ...colors }); close(); }}>Apply Theme</button><button type="button" className="btn btn-secondary" onClick={close}>Cancel</button></div>
        </div>
      </div>
    </div>, document.body)}
  </div>;
}
