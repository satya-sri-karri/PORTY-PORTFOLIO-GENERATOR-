import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
const ThumbnailGenerator = forwardRef(function ThumbnailGenerator({ data, onCapture }, api) {
  const frame = useRef(null); const latest = useRef(data); latest.current = data; const sequence = useRef(0);
  async function capture() {
    const request = ++sequence.current; const target = frame.current;
    if (!target?.contentWindow) return "";
    target.contentWindow.postMessage({ type: "porty:theme-data", data: { ...latest.current, __captureId: String(request) } }, window.location.origin);
    try {
      let node; const deadline = Date.now() + 6000;
      while (Date.now() < deadline) { const doc = target.contentDocument; const envelope = doc?.querySelector('[data-capture-id]'); node = doc?.querySelector('.portfolio-v4'); if (envelope?.getAttribute('data-capture-id') === String(request) && node?.querySelector('h1')) break; node = null; await new Promise(resolve => setTimeout(resolve, 80)); }
      if (!node || request !== sequence.current) return "";
      const { toJpeg } = await import("html-to-image");
      const result = await toJpeg(node, { width: 1100, height: 700, canvasWidth: 660, canvasHeight: 420, pixelRatio: 1, quality: .8, skipFonts: true });
      if (request !== sequence.current || result.length > 500000) return "";
      onCapture(result); return result;
    } catch { return ""; }
  }
  useImperativeHandle(api, () => ({ capture }));
  useEffect(() => { onCapture(""); const timer = setTimeout(capture, 900); return () => { clearTimeout(timer); sequence.current++; }; }, [data]); // eslint-disable-line
  return <iframe ref={frame} src="/theme-preview" title="Portfolio cover capture" tabIndex={-1} aria-hidden="true" onLoad={() => { frame.current.contentWindow.postMessage({ type: "porty:theme-data", data: latest.current }, window.location.origin); }} style={{ position:"fixed", left:-12000, top:0, width:1100, height:700, border:0, pointerEvents:"none" }} />;
});
export default ThumbnailGenerator;
