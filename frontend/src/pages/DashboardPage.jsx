import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getMyPortfolios, deletePortfolio } from "../utils/api";
import { getTheme } from "../registry/themeRegistry";
import DotField from "../components/shared/DotField";

const SkeletonDashboard = () => (
  <div className="dashboard">
    <div className="container">
      <div style={{ marginBottom: 24 }}>
        <div className="skeleton" style={{ width: 260, height: 28, marginBottom: 8, background: "linear-gradient(90deg, #f0dce6 25%, #f8eaf0 50%, #f0dce6 75%)", backgroundSize: "200% 100%" }} />
        <div className="skeleton" style={{ width: 180, height: 14, background: "linear-gradient(90deg, #f0dce6 25%, #f8eaf0 50%, #f0dce6 75%)", backgroundSize: "200% 100%" }} />
      </div>
      <div className="stat-cards" style={{ marginBottom: 32 }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="stat-card" style={{ borderRadius: 16, padding: 20 }}>
            <div className="skeleton" style={{ width: 24, height: 24, borderRadius: "50%", marginBottom: 12, background: "linear-gradient(90deg, #f0dce6 25%, #f8eaf0 50%, #f0dce6 75%)", backgroundSize: "200% 100%" }} />
            <div className="skeleton" style={{ width: 48, height: 30, marginBottom: 6, background: "linear-gradient(90deg, #f0dce6 25%, #f8eaf0 50%, #f0dce6 75%)", backgroundSize: "200% 100%" }} />
            <div className="skeleton" style={{ width: 80, height: 12, background: "linear-gradient(90deg, #f0dce6 25%, #f8eaf0 50%, #f0dce6 75%)", backgroundSize: "200% 100%" }} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div className="skeleton" style={{ width: 140, height: 18, background: "linear-gradient(90deg, #f0dce6 25%, #f8eaf0 50%, #f0dce6 75%)", backgroundSize: "200% 100%" }} />
        <div className="skeleton" style={{ width: 80, height: 32, borderRadius: 8, background: "linear-gradient(90deg, #f0dce6 25%, #f8eaf0 50%, #f0dce6 75%)", backgroundSize: "200% 100%" }} />
      </div>
      <div className="portfolio-grid">
        {[1, 2].map(i => (
          <div key={i} className="portfolio-card" style={{ borderRadius: 16, padding: 20 }}>
            <div className="skeleton" style={{ height: 3, borderRadius: "16px 16px 0 0", margin: "-20px -20px 16px", background: "linear-gradient(90deg, #f0dce6 25%, #f8eaf0 50%, #f0dce6 75%)", backgroundSize: "200% 100%" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ width: "60%", height: 16, marginBottom: 6, background: "linear-gradient(90deg, #f0dce6 25%, #f8eaf0 50%, #f0dce6 75%)", backgroundSize: "200% 100%" }} />
                <div className="skeleton" style={{ width: "40%", height: 12, background: "linear-gradient(90deg, #f0dce6 25%, #f8eaf0 50%, #f0dce6 75%)", backgroundSize: "200% 100%" }} />
              </div>
              <div className="skeleton" style={{ width: 70, height: 20, borderRadius: 4, background: "linear-gradient(90deg, #f0dce6 25%, #f8eaf0 50%, #f0dce6 75%)", backgroundSize: "200% 100%" }} />
            </div>
            <div className="skeleton" style={{ width: "100%", height: 36, marginBottom: 12, borderRadius: 10, background: "linear-gradient(90deg, #f0dce6 25%, #f8eaf0 50%, #f0dce6 75%)", backgroundSize: "200% 100%" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div className="skeleton" style={{ width: 80, height: 11, background: "linear-gradient(90deg, #f0dce6 25%, #f8eaf0 50%, #f0dce6 75%)", backgroundSize: "200% 100%" }} />
              <div className="skeleton" style={{ width: 100, height: 11, background: "linear-gradient(90deg, #f0dce6 25%, #f8eaf0 50%, #f0dce6 75%)", backgroundSize: "200% 100%" }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div className="skeleton" style={{ flex: 1, height: 32, borderRadius: 6, background: "linear-gradient(90deg, #f0dce6 25%, #f8eaf0 50%, #f0dce6 75%)", backgroundSize: "200% 100%" }} />
              <div className="skeleton" style={{ flex: 1, height: 32, borderRadius: 6, background: "linear-gradient(90deg, #f0dce6 25%, #f8eaf0 50%, #f0dce6 75%)", backgroundSize: "200% 100%" }} />
              <div className="skeleton" style={{ width: 40, height: 32, borderRadius: 6, background: "linear-gradient(90deg, #f0dce6 25%, #f8eaf0 50%, #f0dce6 75%)", backgroundSize: "200% 100%" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DashboardPage = () => {
  const { token, user } = useAuth();
  const { theme } = useTheme();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [retry, setRetry] = useState(0);

  const refresh = useCallback(() => setRetry(n => n + 1), []);
  useEffect(() => {
    let active = true;
    setLoading(true); setLoadError("");
    getMyPortfolios(token)
      .then(res => { if (active) setPortfolios(res.data); })
      .catch(e => { if (active) setLoadError(e.message || "Could not load your portfolios."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token, retry]);

  const copyLink = async (slug, id) => {
    setActionError(""); setCopiedId(null);
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/p/${slug}`);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch { setActionError("Could not copy the link. Select and copy the address shown on the portfolio card."); }
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this portfolio? This cannot be undone.")) return;
    setDeletingId(id); setActionError("");
    try {
      await deletePortfolio(id, token);
      setPortfolios(prev => prev.filter(p => p._id !== id));
    } catch (e) { setActionError(e.message || "Could not delete this portfolio. Try again."); }
    finally { setDeletingId(null); }
  };

  if (loading) return <SkeletonDashboard />;
  if (loadError) return <main className="container" style={{ paddingTop: 48 }}>
    <h1>Your portfolios could not be loaded</h1>
    <div className="alert alert-error" role="alert">{loadError}</div>
    <button className="btn btn-primary" onClick={refresh}>Retry</button>
    {loadError.includes("session") && <Link to="/login" state={{ from: { pathname: "/dashboard" } }} className="btn btn-secondary">Sign in again</Link>}
  </main>;

  const totalViews = portfolios.reduce((a, p) => a + (p.views || 0), 0);

  return (
    <div className="dashboard" style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }}>
      <DotField
        dotRadius={1.5}
        dotSpacing={16}
        bulgeStrength={67}
        glowRadius={160}
        sparkle={false}
        waveAmplitude={0}
        gradientFrom={theme === "dark" ? "rgba(200, 140, 255, 0.55)" : "rgba(168, 85, 247, 0.35)"}
        gradientTo={theme === "dark" ? "rgba(220, 180, 255, 0.45)" : "rgba(180, 151, 207, 0.25)"}
        glowColor={theme === "dark" ? "#0a0510" : "#120F17"}
      />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="dashboard-header glass" style={{ padding: "24px 28px", borderRadius: 16, marginBottom: 28 }}>
           <h1 style={{ margin: 0 }}>Good to see you, <span style={{ color: "var(--accent)" }}>{user?.name?.split(" ")[0]}</span></h1>
          <p style={{ margin: "4px 0 0" }}>Manage and share your portfolios</p>
        </div>

        {actionError && <div className="alert alert-error" role="alert">{actionError}</div>}
        <p className="form-hint">Page views count public page loads, including repeat visits.</p>
        <div className="stat-cards">
          {[
            { label: "Portfolios", value: portfolios.length, icon: "◈" },
            { label: "Page views", value: totalViews, icon: "👁" },
            { label: "Public", value: portfolios.filter(p => p.isPublic).length, icon: "🌐" },
          ].map(s => (
            <div key={s.label} className="stat-card glass" style={{ borderRadius: 16 }}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="glass" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, padding: "14px 20px", borderRadius: 12 }}>
          <div className="dashboard-section-header" style={{ margin: 0 }}><h3 style={{ margin: 0 }}>Your Portfolios</h3></div>
          <Link to="/builder" className="btn btn-secondary btn-sm" style={{ textDecoration: "none", fontWeight: 600, padding: "6px 16px", borderRadius: 8 }}>+ New</Link>
        </div>

        {portfolios.length === 0 ? (
          <div className="empty-state glass" style={{ padding: "48px 32px", borderRadius: 16 }}>
            <div className="empty-state-icon">◈</div>
            <h3>No portfolios yet</h3>
            <p>Build your first portfolio — it takes about 5 minutes</p>
            <Link to="/builder" className="btn btn-secondary" style={{ textDecoration: "none", fontWeight: 600, padding: "10px 24px", borderRadius: 10 }}>Build Your Portfolio</Link>
          </div>
        ) : (
          <div className="portfolio-grid">
            {portfolios.map(p => {
              const themeConfig = getTheme(p.theme);
              const shareUrl = `${window.location.origin}/p/${p.shareSlug}`;
              return (
                <div key={p._id} className="portfolio-card glass" style={{ borderRadius: 16 }}>
                  {p.thumbnail ? (
                    <div style={{ height: 100, borderRadius: "12px 12px 0 0", margin: "-20px -20px 12px", overflow: "hidden", background: themeConfig.preview.bg }}>
                      <img src={p.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ) : (
                    <div style={{ height: 3, borderRadius: "16px 16px 0 0", background: themeConfig.preview.accent, margin: "-20px -20px 16px" }} />
                  )}
                  <div className="portfolio-card-top">
                    <div>
                      <div className="portfolio-card-name">{p.name}</div>
                      {p.title && <div className="portfolio-card-title">{p.title}</div>}
                    </div>
                    <span className="badge badge-default" style={{ fontSize: 10, textTransform: "capitalize", borderColor: themeConfig.preview.accent + "40", color: themeConfig.preview.accent, background: "var(--glass-bg)" }}>
                      {themeConfig.name}
                    </span>
                  </div>

                  <div className="portfolio-card-url" style={{ borderRadius: 10 }}>
                    <span style={{ overflowWrap: "anywhere" }}>{p.isPublic ? shareUrl : "Private — only you can preview this portfolio"}</span>
                    <button
                      className="btn btn-sm"
                      disabled={!p.isPublic}
                      onClick={() => copyLink(p.shareSlug, p._id)}
                      style={{ background: copiedId === p._id ? "#22C55E" : "var(--glass-bg)", color: copiedId === p._id ? "#fff" : "var(--text-secondary)", border: "none", padding: "4px 10px", fontSize: 11, borderRadius: 6, flexShrink: 0, fontWeight: 500 }}
                    >
                      {copiedId === p._id ? "✓ Copied" : "Copy"}
                    </button>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span className="portfolio-card-views">👁 {p.views || 0} views</span>
                    <span className="portfolio-card-date">
                      {new Date(p.updatedAt || p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>

                  <p className="form-hint">{p.isPublic ? "Public · Saving changes updates the live portfolio" : "Private · Sharing is disabled"}</p>
                  <div className="portfolio-card-actions">
                    <Link to={`/preview/${p._id}`} className="btn" style={{ flex: 1, textDecoration: "none", background: "var(--glass-bg)", color: "var(--text-primary)", fontWeight: 500, padding: "6px 0", borderRadius: 6, fontSize: 13 }}>Preview</Link>
                    <Link to={`/builder/${p._id}`} className="btn" style={{ flex: 1, textDecoration: "none", background: "var(--glass-bg)", color: "var(--text-primary)", fontWeight: 500, padding: "6px 0", borderRadius: 6, fontSize: 13 }}>Edit</Link>
                    <button className="btn" aria-label={`Delete ${p.name}`} onClick={() => handleDelete(p._id)} disabled={deletingId === p._id} style={{ flex: "0 0 36px", background: "rgba(239,68,68,0.1)", color: "#EF4444", padding: "6px 0", borderRadius: 6 }}>
                      {deletingId === p._id ? "..." : "🗑"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
