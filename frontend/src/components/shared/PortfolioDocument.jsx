import React, { useEffect, useRef } from "react";

// Full, keyboard-accessible browsing in its own document keeps theme navigation
// and global styles away from the owner's Back to Builder controls.
export default function PortfolioDocument({ data }) {
  const frame = useRef(null); const latest = useRef(data); latest.current = data;
  const send = () => frame.current?.contentWindow?.postMessage({ type: "porty:theme-data", data: latest.current, staticPreview: false }, window.location.origin);
  useEffect(() => {
    const receive = event => {
      if (event.origin === window.location.origin && event.source === frame.current?.contentWindow && event.data?.type === "porty:theme-ready") send();
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, []);
  useEffect(send, [data]);
  return <iframe ref={frame} src="/theme-preview" title="Full portfolio preview" onLoad={send} />;
}
