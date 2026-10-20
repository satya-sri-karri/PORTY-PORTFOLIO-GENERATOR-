import PortfolioDocument from "../components/shared/PortfolioDocument";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getTheme } from "../registry/themeRegistry";
import { getPortfolioById } from "../utils/api";
import { readJSON } from "../utils/storage";
import { useAuth } from "../context/AuthContext";

const PreviewPage = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const location = useLocation();
  const [envelope, setEnvelope] = useState(() => {
    if (id) return null;
    const candidate = location.state?.data ? location.state : readJSON("sessionStorage", "porty:preview:v1").value;
    return candidate?.account === (user?._id || user?.id || user?.email) ? candidate : null;
  });
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true); setError("");
    getPortfolioById(id, token).then(res => {
      if (active) setEnvelope({ data: res.data, returnTo: `/builder/${id}` });
    }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, token, retry]);

  if (loading) return <div className="loading-page"><div className="spinner spinner-lg" /></div>;
  if (error || !envelope?.data) return (
    <main className="container" style={{ paddingTop: 60 }}>
      <h2>{error ? "Preview could not be loaded" : "No preview found"}</h2>
      <p role="alert">{error || "Return to the builder and open Preview again."}</p>
      {id && <button className="btn btn-primary" onClick={() => setRetry(n => n + 1)}>Retry</button>}
      <Link to={id ? `/builder/${id}` : "/builder"} className="btn btn-secondary">Back to Builder</Link>
      {error.includes("session") && <Link to="/login" state={{ from: location }} className="btn btn-secondary">Sign in again</Link>}
    </main>
  );

  const { data } = envelope;
  const config = getTheme(data.theme);
  const returnTo = /^\/builder(?:\/[a-zA-Z0-9]+)?$/.test(envelope.returnTo || "") ? envelope.returnTo : "/builder";
  return (
    <div className="owner-preview-page">
      <div className="owner-preview-banner">
        <span>Preview · {config.name} · {id ? data.isPublic ? "Public portfolio" : "Private — only you can view" : "Unsaved preview"}</span>
        <Link to={returnTo} state={id ? undefined : { resumeData: envelope.resumeData || data, savedContent: envelope.savedContent, clientRequestId: envelope.clientRequestId }} className="btn btn-secondary btn-sm">← Back to Builder</Link>
      </div>
      {envelope.storageError && <div className="alert alert-error" role="alert">Preview is available while this page is open. {envelope.storageError}</div>}
      <div className="owner-preview-theme"><PortfolioDocument data={data} /></div>
    </div>
  );
};
export default PreviewPage;
