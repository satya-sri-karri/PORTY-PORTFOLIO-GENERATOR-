import React, { useRef, useEffect, useState } from "react";

const prompt = "Turn this photo into a polished soft 3D character portrait. Preserve my facial features, skin tone, hairstyle and clothing. Use a clean background, soft studio lighting and a centered waist-up composition. Do not add text.";

export default function StaticAvatar({ avatarUrl = "", onApply, previewOnly = false }) {
  const [preview, setPreview] = useState(""), [error, setError] = useState(""), [copied, setCopied] = useState(false);
  const reader = useRef(null);
  useEffect(() => () => reader.current?.abort(), []);
  const upload = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    reader.current?.abort(); setPreview(""); setError("");
    if (!/^image\/(png|jpeg|webp)$/.test(file.type) || file.size > 4 * 1024 * 1024) { setError("Choose a PNG, JPG or WebP image under 4 MB."); return; }
    const next = new FileReader(); reader.current = next;
    next.onload = () => setPreview(next.result);
    next.onerror = () => setError("Could not read that image. Please choose another.");
    next.readAsDataURL(file);
    event.target.value = "";
  };
  return <details className="static-avatar ai-panel"><summary>Photo or character avatar</summary>
    <p className="form-hint">Upload a photo or a character image. {previewOnly ? "Images and edits stay in this tab and clear on reload." : "Images selected here stay in your browser until you save your portfolio."}</p>
    <label className="form-label">Choose avatar<input className="form-input" type="file" accept="image/png,image/jpeg,image/webp" onChange={upload} /></label>
    <details><summary>Make a character from your photo</summary><p>Open an image-editing tool you trust, upload your photo there and use this prompt. Download the result, then upload it above. Conversion happens in the external tool.</p><p className="static-avatar-prompt">{prompt}</p><button type="button" className="btn btn-secondary btn-sm" onClick={async () => { try { await navigator.clipboard.writeText(prompt); setCopied(true); } catch { setError("Copy the prompt text above manually."); } }}>{copied ? "Prompt copied" : "Copy character prompt"}</button><p>A transparent PNG or WebP works best with the poster cover.</p></details>
    {error && <p role="alert" className="form-error">{error}</p>}
    {(preview || avatarUrl) && <img src={preview || avatarUrl} alt={preview ? "Selected avatar preview" : "Current avatar"} style={{ width: 120, height: 150, objectFit: "contain" }} />}
    {preview && <div className="review-actions"><button type="button" className="btn btn-primary btn-sm" onClick={() => { onApply(preview); setPreview(""); }}>Use avatar</button><button type="button" className="btn btn-secondary btn-sm" onClick={() => setPreview("")}>Discard</button></div>}
  </details>;
}
