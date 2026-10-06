import React from "react";
import "./LayoutStudio.css";

export const LAYOUT_PRESETS = [
  { id: "original", name: "Theme original", note: "Keep this theme’s own composition", settings: {} },
  { id: "editorial", name: "Editorial story", note: "Big introduction, generous project stories", settings: { hero: "centered", projects: "spotlight", spacing: "airy", typography: "editorial", image: "wide", hover: "lift" } },
  { id: "gallery", name: "Creative gallery", note: "Framed imagery with a sideways collection", settings: { hero: "split", projects: "rail", spacing: "airy", typography: "bold", image: "rounded", hover: "tilt" } },
  { id: "playful", name: "Playful deck", note: "Punchy type and responsive project cards", settings: { hero: "centered", projects: "cards", spacing: "compact", typography: "bold", image: "square", hover: "tilt" } },
  { id: "developer", name: "Developer index", note: "Compact, monospace and easy to browse", settings: { hero: "split", projects: "spotlight", spacing: "compact", typography: "mono", image: "wide", hover: "lift" } },
];
const controls = [
  ["hero", "Introduction layout", [["theme", "Theme original"], ["centered", "Centred introduction"], ["split", "Split introduction"]]],
  ["projects", "Project layout", [["theme", "Theme original"], ["cards", "Card grid"], ["spotlight", "Large project stories"], ["rail", "Horizontal gallery"]]],
  ["spacing", "Spacing", [["theme", "Theme original"], ["compact", "Compact"], ["airy", "Room to breathe"]]],
  ["typography", "Typography", [["theme", "Theme original"], ["editorial", "Editorial serif"], ["bold", "Bold sans"], ["mono", "Monospace"]]],
  ["image", "Image frames", [["theme", "Theme original"], ["wide", "Cinematic wide"], ["square", "Square"], ["rounded", "Rounded"]]],
  ["hover", "Project interaction", [["theme", "Theme interaction"], ["lift", "Lift & reveal"], ["tilt", "Tilt & light"]]],
];
export default function LayoutStudio({ value = {}, motion = "expressive", onChange, onMotion, id = "studio" }) {
  const selected = LAYOUT_PRESETS.find(p => controls.every(([key]) => (p.settings[key] || "theme") === (value[key] || "theme")));
  const apply = preset => { onChange({ ...preset.settings }); };
  const surprise = () => { const choices = LAYOUT_PRESETS.filter(p => p.id !== "original" && p.id !== selected?.id); apply(choices[Math.floor(Math.random() * choices.length)]); onMotion("expressive"); };
  return <fieldset className="layout-studio"><legend>Make it your own</legend><p>Experiment with the same content. Start with a direction, then mix the details.</p>
    <div className="studio-presets">{LAYOUT_PRESETS.map(p => <button key={p.id} type="button" className="studio-preset" aria-pressed={selected?.id === p.id} onClick={() => apply(p)}><span className={`studio-mini studio-mini-${p.id}`} aria-hidden="true"><i /><i /><i /></span><strong>{p.name}</strong><span>{p.note}</span></button>)}</div>
    <div className="review-actions"><button type="button" className="btn btn-secondary btn-sm" onClick={surprise}>Surprise me</button><button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange({})}>Reset layout</button></div>
    <label htmlFor={`${id}-motion`}>Motion preference</label><select id={`${id}-motion`} className="form-input" value={motion} onChange={e => onMotion(e.target.value)}><option value="expressive">Expressive · animated & interactive</option><option value="subtle">Subtle · gentle movement</option><option value="none">Still · no animation</option></select>
    <details><summary>Mix your own layout</summary><div className="studio-options">{controls.map(([key,label,options]) => <div key={key}><label htmlFor={`${id}-${key}`}>{label}</label><select id={`${id}-${key}`} className="form-input" value={value[key] || "theme"} onChange={e => onChange({ ...value, [key]: e.target.value })}>{options.map(([v,name]) => <option value={v} key={v}>{name}</option>)}</select></div>)}</div></details>
    <p className="form-hint">Phone layouts adapt automatically. Tilt also has a tap/keyboard highlight. Visitors can pause motion, and their reduced-motion preference is respected.</p>
  </fieldset>;
}
