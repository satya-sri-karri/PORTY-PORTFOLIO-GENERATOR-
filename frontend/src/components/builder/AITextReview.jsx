import React, { useState } from "react";

export default function AITextReview({ ai, value, onChange, onRetry, label }) {
  const [previous, setPrevious] = useState(null);
  const [applied, setApplied] = useState(null);
  return <>
    {ai.error && <p className="form-error" role="alert">{ai.error}</p>}
    {ai.suggestion !== null && <div className="ai-review" aria-label={`${label} suggestion`}>
      <label className="form-label" htmlFor={`${label}-suggestion`}>Review suggested {label}</label>
      <p className="form-hint">Check the facts and edit this draft. Your current text stays unchanged until you apply it.</p>
      <textarea id={`${label}-suggestion`} className="form-input" rows={5} value={ai.suggestion} onChange={e => ai.setSuggestion(e.target.value)} />
      <div className="review-actions">
        <button type="button" className="btn btn-primary btn-sm" disabled={!ai.suggestion.trim() || ai.loading} onClick={() => {
          setPrevious(value); setApplied(ai.suggestion); onChange(ai.suggestion); ai.setSuggestion(null);
        }}>Apply suggestion</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => ai.setSuggestion(null)}>Dismiss suggestion</button>
        <button type="button" className="btn btn-ghost btn-sm" disabled={ai.loading} onClick={onRetry}>Try another</button>
      </div>
    </div>}
    {previous !== null && value === applied && <button type="button" className="btn btn-ghost btn-sm" onClick={() => {
      onChange(previous); setPrevious(null); setApplied(null);
    }}>Restore previous text</button>}
  </>;
}
