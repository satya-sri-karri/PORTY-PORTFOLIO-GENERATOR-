import React, { useEffect, useRef, useState } from "react";
import StaticAvatar from "./StaticAvatar";
import { getCharacterAvailability, startCharacter, getCharacter, cancelCharacter } from "../../utils/api";

export default function AvatarCharacter({ avatarUrl = "", token, onApply }) {
  const [available, setAvailable] = useState(null), [photo, setPhoto] = useState("");
  const [style, setStyle] = useState("soft-3d"), [consent, setConsent] = useState(false);
  const [result, setResult] = useState(""), [busy, setBusy] = useState(false), [error, setError] = useState("");
  const request = useRef(null), reader = useRef(null);
  const source = photo || (avatarUrl.startsWith("data:image/") ? avatarUrl : "");
  useEffect(() => {
    const controller = new AbortController();
    if (token) getCharacterAvailability(controller.signal).then(data => setAvailable(data.available)).catch(() => { if (!controller.signal.aborted) setAvailable(false); });
    else setAvailable(false);
    return () => controller.abort();
  }, [token]);
  useEffect(() => () => { reader.current?.abort(); const current = request.current; current?.controller.abort(); if (current?.id) cancelCharacter(current.id, current.token).catch(() => {}); }, []);
  const upload = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    reader.current?.abort();
    setConsent(false); setResult("");
    if (!/^image\/(png|jpeg|webp)$/.test(file.type) || file.size > 4 * 1024 * 1024) { setError("Choose a PNG, JPG or WebP photo under 4 MB."); return; }
    const next = new FileReader(); reader.current = next;
    next.onload = () => { setPhoto(next.result); setResult(""); setConsent(false); setError(""); };
    next.onerror = () => setError("Could not read that photo. Please try another.");
    next.readAsDataURL(file);
  };
  const cancel = () => {
    const current = request.current; request.current = null;
    current?.controller.abort(); if (current?.id) cancelCharacter(current.id, current.token).catch(() => {});
    setBusy(false);
  };
  const generate = async () => {
    if (request.current || !source || !consent || !available || !token) return;
    const current = { controller: new AbortController(), token }; request.current = current;
    setPhoto(source); setBusy(true); setError(""); setResult("");
    try {
      const { id } = await startCharacter({ image: source, style, consent }, token, current.controller.signal);
      current.id = id;
      if (current.controller.signal.aborted) { cancelCharacter(id, token).catch(() => {}); return; }
      const until = Date.now() + 250000;
      while (!current.controller.signal.aborted) {
        const data = await getCharacter(id, token, current.controller.signal);
        if (current.controller.signal.aborted || request.current !== current) return;
        if (data.status === "complete") { setResult(data.image); return; }
        if (data.status === "failed") throw new Error(data.error);
        if (Date.now() > until) throw new Error("The free GPU is taking too long. Please try again later.");
        await new Promise((resolve, reject) => {
          const signal = current.controller.signal;
          const abort = () => { clearTimeout(timer); reject(new DOMException("Cancelled", "AbortError")); };
          const timer = setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, 3000);
          signal.addEventListener("abort", abort, { once: true });
        });
      }
    } catch (e) {
      if (!current.controller.signal.aborted) setError(e.message || "Could not generate a character. Your avatar is unchanged.");
    } finally {
      if (current.id) cancelCharacter(current.id, token).catch(() => {});
      if (request.current === current) { request.current = null; setBusy(false); }
    }
  };
  if (available === false) return <StaticAvatar avatarUrl={avatarUrl} onApply={onApply} />;
  return <details className="ai-panel"><summary>Turn your photo into a character</summary>
    <p className="form-hint">Create a 3D-style portrait using Hugging Face ZeroGPU. Free GPU access has queues and daily limits.</p>
    <label className="form-label">Source photo<input className="form-input" type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={upload} /></label>
    {source && <img src={source} alt="Photo selected for conversion" style={{ width: 80, height: 100, objectFit: "contain" }} />}
    <label className="form-label">Character style<select className="form-input" value={style} disabled={busy} onChange={event => { setStyle(event.target.value); setResult(""); }}><option value="soft-3d">Soft 3D character</option><option value="clay">Clay character</option><option value="chibi">Chibi character</option></select></label>
    <label className="form-hint"><input type="checkbox" checked={consent} disabled={busy} onChange={event => setConsent(event.target.checked)} /> Send this photo to PORTY’s Hugging Face Space for conversion.</label>
    {!token ? <p>Sign in to PORTY to generate a character.</p> : available === null ? <p role="status">Checking character generation…</p> : !available ? <p role="status">Character generation is not connected yet. You can still upload an avatar.</p> : null}
    <div className="review-actions"><button type="button" className="btn btn-ai btn-sm" disabled={!token || !available || !source || !consent || busy} onClick={generate}>{busy ? "Waiting for the free GPU…" : "Generate character"}</button>{busy && <button type="button" className="btn btn-secondary btn-sm" onClick={cancel}>Cancel generation</button>}</div>
    {busy && <p role="status">Your character is queued or generating. Your current avatar stays unchanged.</p>}{error && <p className="form-error" role="alert">{error}</p>}
    {result && <div><img src={result} alt="Generated character preview" style={{ width: 180, maxWidth: "100%", height: 240, objectFit: "contain" }} /><div className="review-actions"><button type="button" className="btn btn-primary btn-sm" onClick={() => { onApply(result); setResult(""); }}>Use character</button><button type="button" className="btn btn-secondary btn-sm" onClick={() => setResult("")}>Discard</button></div><p className="form-hint">Choose Use character to update the editor, then save your portfolio.</p></div>}
  </details>;
}
