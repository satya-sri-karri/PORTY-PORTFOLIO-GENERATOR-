import React from "react";
import { effectFor } from "../themes/common/themeEffectCatalog";
export default function MotionControls({ theme, motion = "expressive", onMotion, id = "theme-effects" }) {
  const effect = effectFor(theme);
  return <fieldset className="motion-controls" style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 18, margin: "24px 0", minWidth: 0 }}>
    <legend style={{ padding: "0 8px" }}>Theme effects</legend>
    <p><strong>{effect.name}</strong></p><p className="form-hint">{effect.note}</p>
    <label htmlFor={`${id}-motion`} className="form-label" style={{ marginTop: 16 }}>Motion preference</label>
    <select id={`${id}-motion`} className="form-input" value={motion} onChange={e => onMotion(e.target.value)}>
      <option value="expressive">Expressive · full theme effects</option><option value="subtle">Subtle · quiet details</option><option value="none">Still · no animation</option>
    </select>
    <p className="form-hint" style={{ marginTop: 12 }}>The theme keeps its own layout, type and image frames. Visitors can pause movement, and reduced motion is respected.</p>
  </fieldset>;
}
