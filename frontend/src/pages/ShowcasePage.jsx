import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getShowcase } from "../utils/api";
import { getTheme } from "../registry/themeRegistry";
export default function ShowcasePage() {
  const [items,setItems] = useState(null); const [error,setError] = useState(""); const [retry,setRetry] = useState(0);
  useEffect(() => { let active = true; setError(""); getShowcase().then(r => {if(active) setItems(r.data);}).catch(e => {if(active) setError(e.message);}); return () => {active=false;}; }, [retry]);
  return <main className="container trial-page"><h1>Made with Porty</h1><p>Portfolios listed here are public and included with their owners’ permission. Use a style with your own content.</p>{error ? <div role="alert"><p>{error}</p><button type="button" className="btn btn-secondary" onClick={() => setRetry(n=>n+1)}>Retry showcase</button></div> : !items ? <p role="status">Loading portfolios…</p> : !items.length ? <p>No owners have opted in yet. You can explore all themes in the guest trial.</p> : <div className="portfolio-grid">{items.map(item => <article className="portfolio-card glass" key={item.shareSlug}>{item.thumbnail && <img src={item.thumbnail} alt={`Portfolio by ${item.name}`} style={{width:"100%"}} />}<h2>{item.name}</h2><p>{item.title}</p><p>{getTheme(item.theme).name} · By {item.name}</p><div className="review-actions"><Link className="btn btn-secondary btn-sm" to={`/p/${item.shareSlug}`}>View portfolio</Link><Link className="btn btn-primary btn-sm" to="/try" state={{style:{theme:item.theme,themeColors:item.themeColors,motion:item.motion,layoutSettings:item.layoutSettings}}}>Use this style</Link></div></article>)}</div>}<Link to="/try" className="btn btn-primary">Try your own portfolio</Link></main>;
}
