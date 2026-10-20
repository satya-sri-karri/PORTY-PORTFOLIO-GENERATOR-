import LearningPanel from "../components/shared/LearningPanel";
import ProfileReuse from "../components/builder/ProfileReuse";
import { getTrash, restorePortfolio, permanentlyDeletePortfolio } from "../utils/api";
import { journeyStats } from "../utils/journey";
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyPortfolios, deletePortfolio } from "../utils/api";
import { getTheme } from "../registry/themeRegistry";

const SkeletonDashboard = () => <main className="container dashboard" aria-busy="true" aria-label="Loading your portfolios"><p role="status">Getting your workspace ready…</p><div className="portfolio-grid">{[1,2].map(i => <div key={i} className="skeleton" style={{height:220}} />)}</div></main>;

const DashboardPage = () => {
  const { token, user } = useAuth();
  const [query, setQuery] = useState("");
  const [trash,setTrash] = useState(null);
  const [trashError,setTrashError] = useState("");
  const [trashBusy,setTrashBusy] = useState(false);
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
    if (!window.confirm("Move this portfolio to Trash? Its public link stops working immediately. You can restore it within 30 days.")) return;
    setDeletingId(id); setActionError("");
    try {
      await deletePortfolio(id, token);
      setPortfolios(prev => prev.filter(p => p._id !== id)); setTrash(null);
    } catch (e) { setActionError(e.message || "Could not delete this portfolio. Try again."); }
    finally { setDeletingId(null); }
  };

  const loadTrash = async () => { setTrashBusy(true);setTrashError("");try{const response=await getTrash(token);setTrash(response.data);}catch(e){setTrashError(e.message);}finally{setTrashBusy(false);} };
  const trashAction = async (id, permanent) => { if(permanent && !window.confirm("Permanently delete this trashed portfolio? This cannot be undone.")) return; setTrashBusy(true);setTrashError("");try{if(permanent) await permanentlyDeletePortfolio(id,token);else await restorePortfolio(id,token);setTrash(items=>items.filter(p=>p._id!==id));refresh();}catch(e){setTrashError(e.message);}finally{setTrashBusy(false);} };

  if (loading) return <SkeletonDashboard />;
  if (loadError) return <main className="container" style={{ paddingTop: 48 }}>
    <h1>Your portfolios could not be loaded</h1>
    <div className="alert alert-error" role="alert">{loadError}</div>
    <button className="btn btn-primary" onClick={refresh}>Retry</button>
    {loadError.includes("session") && <Link to="/login" state={{ from: { pathname: "/dashboard" } }} className="btn btn-secondary">Sign in again</Link>}
  </main>;

  const totalViews = portfolios.reduce((a, p) => a + (p.views || 0), 0);

  const visible = portfolios.filter(p => `${p.name} ${p.title || ""}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <main className="dashboard container app-dashboard">
    <header className="workspace-heading"><div><p className="app-eyebrow">Your creative workspace</p><h1>Your portfolios<span className="brand-period">.</span></h1><p>{portfolios.length ? `Welcome back${user?.name ? ", " + user.name.split(" ")[0] : ""}. Pick up where you left off.` : "A home for your work starts here."}</p></div>{portfolios.length > 0 && <Link to="/builder" className="btn btn-primary">New portfolio <span aria-hidden="true">+</span></Link>}</header>
    {actionError && <div className="alert alert-error" role="alert">{actionError}</div>}
    {portfolios.length > 0 && <div className="workspace-overview"><span><strong>{portfolios.length}</strong> portfolios</span><span><strong>{portfolios.filter(p=>p.isPublic).length}</strong> public</span><span><strong>{totalViews}</strong> page views</span><details><summary>About these numbers</summary><p>Views include repeat loads. Click counts measure reported clicks, not unique visitors or completed downloads.</p></details></div>}
    {portfolios.length > 4 && <div className="dashboard-search"><label htmlFor="portfolio-search">Find a portfolio</label><input id="portfolio-search" type="search" className="form-input" placeholder="Search by name or role" value={query} onChange={e=>setQuery(e.target.value)} /></div>}
    {!portfolios.length ? <section className="empty-state app-empty"><span className="empty-monogram" aria-hidden="true">↗</span><h2>Your next chapter starts here.</h2><p>Start with your name and a little about yourself. Add the rest as you go.</p><Link to="/builder" className="btn btn-primary">Create your first portfolio</Link></section> : <>
      {!visible.length && <div className="app-empty"><p>No portfolios match “{query}”.</p><button type="button" className="btn btn-secondary" onClick={()=>setQuery("")}>Clear search</button></div>}
      <div className="portfolio-grid">{visible.map(p => { const config=getTheme(p.theme); return <article className="portfolio-card app-portfolio-card" key={p._id}>
        <Link className="portfolio-cover-link" to={`/builder/${p._id}`} aria-label={`Edit ${p.name}`} style={{background:config.preview.bg}}>{p.thumbnail ? <img src={p.thumbnail} alt="" loading="lazy" /> : <span aria-hidden="true" style={{color:config.preview.accent}}>{p.name?.slice(0,1) || "P"}<small>YOUR PORTFOLIO</small></span>}</Link>
        <div className="portfolio-card-top"><div><h2>{p.name}</h2>{p.title && <p>{p.title}</p>}</div><span className={`portfolio-status ${p.isPublic ? "is-public" : ""}`}>{p.isPublic ? "Public" : "Private"}</span></div>
        <p className="portfolio-meta">{config.name} · Updated {new Date(p.updatedAt || p.createdAt).toLocaleDateString("en-US", {month:"short",day:"numeric"})}</p>
        <div className="portfolio-card-actions"><Link to={`/builder/${p._id}`} className="btn btn-primary btn-sm">Edit portfolio</Link><Link to={`/preview/${p._id}`} className="btn btn-secondary btn-sm">Preview</Link><details className="portfolio-more"><summary aria-label={`More options for ${p.name}`}>More <span aria-hidden="true">⌄</span></summary><div className="portfolio-more-content">
          {p.isPublic && <><p className="portfolio-card-url">{window.location.origin}/p/{p.shareSlug}</p><button type="button" className="btn btn-secondary btn-sm" onClick={()=>copyLink(p.shareSlug,p._id)}>{copiedId===p._id ? "Copied" : "Copy public link"}</button></>}
          <p className="form-hint">{p.views || 0} views · Project clicks: {p.analytics?.project || 0} · Resume clicks: {p.analytics?.resume || 0} · Contact clicks: {p.analytics?.contact || 0}</p>
          <button type="button" className="btn btn-danger btn-sm" disabled={deletingId===p._id} onClick={()=>handleDelete(p._id)}>{deletingId===p._id ? "Moving to Trash…" : "Move to Trash"}</button></div></details></div>
      </article>; })}</div></>}
    <section className="workspace-tools" aria-labelledby="workspace-tools-title"><h2 id="workspace-tools-title">Workspace tools</h2><p className="form-hint">Everything else, when you need it.</p>
      {portfolios.length > 0 && <ProfileReuse portfolios={portfolios} token={token} onUpdated={()=>getMyPortfolios(token).then(r=>setPortfolios(r.data)).catch(e=>setActionError(e.message))} />}
      <details className="profile-reuse"><summary>Trash · restore within 30 days</summary><p>Trashed portfolios are hidden immediately. Restore them with their previous visibility and stable link.</p><button type="button" className="btn btn-secondary btn-sm" disabled={trashBusy} onClick={loadTrash}>{trashBusy ? "Loading…" : "Load Trash"}</button>{trashError && <p role="alert">{trashError}</p>}{trash && !trash.length && <p>Trash is empty.</p>}{trash?.map(p=><div className="section-control" key={p._id}><span>{p.name} · Deleted {new Date(p.deletedAt).toLocaleDateString()}</span><div className="review-actions"><button type="button" className="btn btn-secondary btn-sm" disabled={trashBusy} onClick={()=>trashAction(p._id,false)}>Restore</button><button type="button" className="btn btn-danger btn-sm" disabled={trashBusy} onClick={()=>trashAction(p._id,true)}>Delete permanently</button></div></div>)}</details>
      <details className="profile-reuse"><summary>Creation activity on this browser</summary><p>Counts actions on this device across accounts, not unique people. Clearing browser storage resets them.</p>{["start","preview","save","publish","share","error","recovery"].map(step=><p key={step}>{step}: {journeyStats()?.counts?.[step] || 0}</p>)}{journeyStats()?.firstPublishedAt && journeyStats()?.startedAt && <p>Time to first publication: {Math.round((journeyStats().firstPublishedAt-journeyStats().startedAt)/60000)} minutes</p>}</details><LearningPanel token={token} />
    </section></main>;
};
export default DashboardPage;
