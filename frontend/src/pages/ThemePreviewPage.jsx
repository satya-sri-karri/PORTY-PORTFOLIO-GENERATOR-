import React, { useEffect, useState } from "react";
import ThemeRenderer from "../components/shared/ThemeRenderer";

// A separate document prevents theme CSS from changing the builder or other previews.
export default function ThemePreviewPage() {
  const [{ data, staticPreview }, setPreview] = useState({ data: null, staticPreview: true });
  useEffect(() => {
    const receive = event => {
      if (event.origin !== window.location.origin || event.source !== window.parent || event.data?.type !== "porty:theme-data") return;
      setPreview({ data: event.data.data, staticPreview: event.data.staticPreview !== false });
    };
    window.addEventListener("message", receive);
    window.parent.postMessage({ type: "porty:theme-ready" }, window.location.origin);
    return () => window.removeEventListener("message", receive);
  }, []);
  return data ? <div className={staticPreview ? "isolated-theme-preview" : "portfolio-document"} data-theme-id={data.theme} data-capture-id={data.__captureId || ""}><ThemeRenderer data={data} staticPreview={staticPreview} /></div> : <div className="theme-load-message" role="status">Waiting for preview…</div>;
}
