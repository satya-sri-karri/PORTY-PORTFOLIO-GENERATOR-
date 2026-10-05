import React, { Suspense, useMemo } from "react";
import { normalizePortfolio } from "../../utils/portfolioContent";
import { getTheme } from "../../registry/themeRegistry";
class ThemeBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <div className="theme-load-message" role="alert">This theme could not be displayed. <button type="button" onClick={() => window.location.reload()}>Reload theme</button></div>;
    return this.props.children;
  }
}
export default function ThemeRenderer({ data, staticPreview = false }) {
  const content = useMemo(() => normalizePortfolio(data), [data]);
  const Component = getTheme(content.theme).component;
  return <ThemeBoundary key={content.theme}><Suspense fallback={<div className="theme-load-message" role="status">Loading theme…</div>}><Component data={staticPreview ? { ...content, staticPreview: true } : content} /></Suspense></ThemeBoundary>;
}
