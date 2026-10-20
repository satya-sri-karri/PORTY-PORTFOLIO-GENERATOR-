import React, { useId } from "react";
import { MINIMALIST_FONTS } from "../themes/minimalistOptions";
export default function MinimalistControls({ value = {}, onChange }) {
  const id = useId();
  return <div className="color-fields"><div className="form-group"><label htmlFor={`${id}-cover`}>Cover composition</label><select id={`${id}-cover`} className="form-input" value={value.cover || "character"} onChange={e => onChange({ ...value, cover: e.target.value })}><option value="character">Character / photo cover</option><option value="type">Typography cover</option></select></div><div className="form-group"><label htmlFor={`${id}-font`}>Font pairing</label><select id={`${id}-font`} className="form-input" value={value.font || "condensed"} onChange={e => onChange({ ...value, font: e.target.value })}>{Object.entries(MINIMALIST_FONTS).map(([key,label]) => <option key={key} value={key}>{label} + Inter</option>)}</select></div></div>;
}
