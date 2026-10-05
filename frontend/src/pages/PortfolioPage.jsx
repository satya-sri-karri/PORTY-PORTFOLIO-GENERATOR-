import ThemeRenderer from "../components/shared/ThemeRenderer";
/**
 * PortfolioPage — Public view
 * Fetches portfolio by slug, applies the chosen theme component
 */

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPublicPortfolio } from "../utils/api";

const SkeletonPortfolio = () => (
  <div style={{ padding: "60px 24px", maxWidth: 900, margin: "0 auto" }}>
    <div className="skeleton" style={{ width: "70%", height: 48, marginBottom: 12, borderRadius: 8 }} />
    <div className="skeleton" style={{ width: "40%", height: 18, marginBottom: 40, borderRadius: 4 }} />
    <div className="skeleton" style={{ width: "100%", height: 200, marginBottom: 32, borderRadius: 12 }} />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
      <div className="skeleton" style={{ width: "100%", height: 120, borderRadius: 10 }} />
      <div className="skeleton" style={{ width: "100%", height: 120, borderRadius: 10 }} />
    </div>
    <div className="skeleton" style={{ width: "100%", height: 16, marginBottom: 10, borderRadius: 4 }} />
    <div className="skeleton" style={{ width: "90%", height: 16, marginBottom: 10, borderRadius: 4 }} />
    <div className="skeleton" style={{ width: "75%", height: 16, marginBottom: 10, borderRadius: 4 }} />
    <div className="skeleton" style={{ width: "60%", height: 16, borderRadius: 4 }} />
  </div>
);

const ShareBar = ({ slug }) => {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/p/${slug}`;
  const [error, setError] = useState("");
  const copy = async () => {
    setCopied(false); setError("");
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { setError("Could not copy the link. Copy the address from your browser instead."); }
  };
  const share = async () => {
    setError("");
    if (!navigator.share) return copy();
    try { await navigator.share({ url }); }
    catch (e) { if (e.name !== "AbortError") setError("Sharing failed. Try Copy link instead."); }
  };
  return (
    <>
      {error && <div className="toast" role="alert" style={{ pointerEvents: "none" }}>{error}</div>}
      {copied && (
        <div className="toast" role="status" style={{ pointerEvents: "none" }}>
          <span>✓</span> Link copied to clipboard
        </div>
      )}
      <div className="share-bar">
        <button className="btn btn-primary btn-sm" onClick={share} style={{ boxShadow: "var(--shadow-accent)" }}>
          📤 Share
        </button>
        <button className="btn btn-secondary btn-sm" onClick={copy} title="Copy link" aria-label="Copy link">
          {copied ? "✓" : "🔗"}
        </button>
        <Link to="/" className="btn btn-secondary btn-sm" title="Build your own" aria-label="Build your own portfolio" style={{ textDecoration: "none" }}>
          ✨
        </Link>
      </div>
    </>
  );
};

const PortfolioPage = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true); setError("");
    getPublicPortfolio(slug)
      .then(res => { if (active) setData(res.data); })
      .catch(err => { if (active) setError(err.message || "Portfolio not found."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);

  if (loading) {
    return <SkeletonPortfolio />;
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20, padding: 40, textAlign: "center", background: "var(--surface-0)" }}>
        <span style={{ fontSize: 56 }}>🔍</span>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Portfolio Not Found</h1>
        <p style={{ color: "var(--text-secondary)" }}>{error}</p>
        <Link to="/" className="btn btn-primary" style={{ textDecoration: "none" }}>Build Your Portfolio</Link>
      </div>
    );
  }


  return (
    <>
      <ThemeRenderer data={data} />
      <ShareBar slug={slug} />
    </>
  );
};

export default PortfolioPage;
