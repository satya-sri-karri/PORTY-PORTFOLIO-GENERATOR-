import React, { useEffect, useMemo, useRef, useState } from "react";
import { blank } from "../../hooks/usePortfolioForm";

export function previewContent(data) {
  const hasContent = [data.name, data.title, data.about, data.avatarUrl, data.location].some(Boolean) || [data.skills, data.projects, data.experience, data.certifications, data.achievements, data.codingProfiles].some(a => a?.length) || Object.values(data.contact || {}).some(Boolean) || Object.values(data.socialLinks || {}).some(Boolean);
  return hasContent ? { data: { ...blank, ...data }, sample: false } : {
    sample: true,
    data: { ...blank, ...data, name: "Alex Morgan", title: "Designer & developer", about: "Sample portfolio: I make thoughtful digital experiences, from early sketches to working products.", skills: ["Design", "React", "JavaScript"], projects: [{ title: "Community journal", description: "Sample project: a space to collect and share neighborhood stories.", techStack: ["React", "CSS"], image: "", link: "", github: "" }] },
  };
}
export default function ThemeFrame({ data, device = "desktop", height = 320, title = "Portfolio preview", thumbnail = false }) {
  const host = useRef(null); const frame = useRef(null);
  const [visible, setVisible] = useState(false); const [width, setWidth] = useState(0); const [ready, setReady] = useState(false);
  const content = useMemo(() => previewContent(data), [data]); const latest = useRef(content.data); latest.current = content.data;
  useEffect(() => {
    const target = host.current;
    const resize = new ResizeObserver(entries => setWidth(entries[0].contentRect.width)); resize.observe(target);
    const observer = new IntersectionObserver(entries => setVisible(entries[0].isIntersecting), { rootMargin: "80px" }); observer.observe(target);
    return () => { resize.disconnect(); observer.disconnect(); };
  }, []);
  useEffect(() => {
    const receive = event => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow || event.data?.type !== "porty:theme-ready") return;
      setReady(true);
      frame.current.contentWindow.postMessage({ type: "porty:theme-data", data: latest.current }, window.location.origin);
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, []);
  useEffect(() => {
    if (ready && visible) frame.current?.contentWindow?.postMessage({ type: "porty:theme-data", data: content.data }, window.location.origin);
  }, [content.data, ready, visible]); // data changes are intentionally sent without remounting the document
  const viewport = device === "mobile" ? 390 : 1100;
  const scale = Math.min(1, width / viewport);
  return <div ref={host} className={`theme-frame ${thumbnail ? "theme-frame-thumb" : ""}`} style={{ height }}>
    {visible && width > 0 ? <iframe ref={frame} src="/theme-preview" title={title} tabIndex={-1} aria-hidden="true" onLoad={() => { frame.current?.contentWindow?.postMessage({ type: "porty:theme-data", data: latest.current }, window.location.origin); }} style={{ width: viewport, height: Math.max(850, height / scale), transform: `scale(${scale})`, transformOrigin: "top left" }} /> : <div className="theme-load-message">Theme preview</div>}
    {(!thumbnail || content.sample) && <span className="preview-content-label">{content.sample ? thumbnail ? "Sample content" : "Sample content · add your details to replace it" : "Your current content"}</span>}
  </div>;
}
