import { useCallback, useEffect, useRef, useState } from "react";
import { createPortfolio, getPortfolioById, updatePortfolio } from "../utils/api";
import { blank } from "./usePortfolioForm";
import { contentSnapshot, draftKey, readJSON, removeStored, writeJSON } from "../utils/storage";

export default function useBuilderSession({ id, token, user, form, load, navigate, location }) {
  const account = user?._id || user?.id || user?.email;
  const key = draftKey(account, id);
  const latest = useRef(form);
  latest.current = form;
  const record = useRef(id);
  const requestId = useRef(null);
  const lock = useRef(false);
  const baseline = useRef(contentSnapshot(blank));
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [storageError, setStorageError] = useState("");
  const [recoverable, setRecoverable] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [success, setSuccess] = useState(null);
  const [retry, setRetry] = useState(0);
  const [savedContent, setSavedContent] = useState(baseline.current);
  const dirty = ready && contentSnapshot(form) !== savedContent;

  useEffect(() => {
    let active = true;
    setReady(false); setLoadError(""); setError(""); setRecoverable(null);
    record.current = id;
    requestId.current = null;
    const draft = readJSON("localStorage", key);
    setStorageError(draft.error || "");
    const initialize = data => {
      if (!active) return;
      baseline.current = location.state?.savedContent || contentSnapshot({ ...blank, ...data });
      setSavedContent(baseline.current);
      setSavedAt(data.updatedAt || null);
      const resume = location.state?.resumeData;
      if (resume) requestId.current = location.state.clientRequestId || null;
      load(resume || data);
      // History state survives browser reloads. Consume it once so reloads fetch
      // the saved record and offer recovery instead of replaying stale content.
      if (resume) navigate(location.pathname, { replace: true, state: null });
      if (!resume && draft.value?.form && contentSnapshot(draft.value.form) !== baseline.current) {
        setRecoverable(draft.value);
      }
      setReady(true);
    };
    if (location.state?.resumeData) initialize(location.state.resumeData);
    else if (id) getPortfolioById(id, token).then(res => initialize(res.data)).catch(e => {
      if (active) setLoadError(e.message);
    });
    else initialize(blank);
    return () => { active = false; };
    // Navigation state belongs to this route transition; form changes do not reload it.
  }, [key, id, token, load, retry]); // eslint-disable-line

  const persist = useCallback(() => {
    if (!ready || recoverable) return;
    if (contentSnapshot(latest.current) === baseline.current) {
      setStorageError(removeStored("localStorage", key) || "");
    } else {
      setStorageError(writeJSON("localStorage", key, {
        form: latest.current, savedAt: new Date().toISOString(), clientRequestId: requestId.current,
      }) || "");
    }
  }, [ready, recoverable, key]);

  useEffect(() => {
    if (!ready || recoverable) return;
    const timer = setTimeout(persist, 600);
    return () => clearTimeout(timer);
  }, [form, persist, ready, recoverable]);

  useEffect(() => {
    const flush = () => persist();
    const guard = event => {
      if (!dirty) return;
      persist(); event.preventDefault(); event.returnValue = "";
    };
    window.addEventListener("beforeunload", guard);
    window.addEventListener("pagehide", flush);
    return () => {
      persist();
      window.removeEventListener("beforeunload", guard);
      window.removeEventListener("pagehide", flush);
    };
  }, [dirty, persist]);

  const recover = () => {
    requestId.current = recoverable.clientRequestId || null;
    load(recoverable.form); setRecoverable(null); setSuccess(null);
  };
  const discard = () => {
    setStorageError(removeStored("localStorage", key) || ""); setRecoverable(null);
  };
  const preview = candidate => {
    const override = candidate?.theme ? candidate : null;
    persist();
    const envelope = { data: override || latest.current, ...(override ? { resumeData: latest.current } : {}), account, clientRequestId: requestId.current, returnTo: id ? `/builder/${id}` : "/builder", savedContent: baseline.current };
    const failure = writeJSON("sessionStorage", "porty:preview:v1", envelope);
    // Same-tab navigation works when popups are blocked and carries data without storage.
    navigate("/preview", { state: { ...envelope, storageError: failure } });
  };

  const save = async thumbnail => {
    if (lock.current || !ready || recoverable) return;
    if (!form.name.trim() || !form.about.trim()) {
      setError("Name and About are required. Go to Personal Info."); return false;
    }
    lock.current = true; setSaving(true); setError(""); setSuccess(null);
    const submitted = { ...latest.current, ...(thumbnail ? { thumbnail } : {}) };
    const wasEdit = Boolean(record.current);
    if (!wasEdit && !requestId.current) requestId.current = window.crypto.randomUUID();
    persist();
    try {
      const response = wasEdit
        ? await updatePortfolio(record.current, submitted, token)
        : await createPortfolio({ ...submitted, clientRequestId: requestId.current }, token);
      const nextId = wasEdit ? record.current : response.data.id;
      const slug = response.data.shareSlug || submitted.shareSlug;
      record.current = nextId;
      const nextForm = { ...latest.current, _id: nextId, shareSlug: slug };
      // A retried create can return a record saved before the response was lost.
      // Keep newer edits marked unsaved until the owner explicitly saves them.
      baseline.current = response.data.reused ? "recovered-server-record" : contentSnapshot(submitted);
      setSavedContent(baseline.current);
      setSavedAt(new Date().toISOString());
      load(nextForm);
      const warning = removeStored("localStorage", key);
      removeStored("sessionStorage", "porty:preview:v1");
      const nextKey = draftKey(account, nextId);
      if (contentSnapshot(nextForm) !== baseline.current) {
        setStorageError(writeJSON("localStorage", nextKey, { form: nextForm, savedAt: new Date().toISOString() }) || warning || "");
      } else setStorageError(removeStored("localStorage", nextKey) || warning || "");
      setSuccess({ id: nextId, slug, isEdit: wasEdit, isPublic: submitted.isPublic });
      if (!wasEdit) navigate(`/builder/${nextId}`, { replace: true, state: { resumeData: nextForm, savedContent: baseline.current } });
      return true;
    } catch (e) {
      setError(e.message || "Save failed. Your information is still here; please try again.");
      persist(); return false;
    } finally { lock.current = false; setSaving(false); }
  };

  return { ready, loadError, error, storageError, recoverable, recover, discard, preview, save,
    saving, savedAt, success, setSuccess, dirty, retryLoad: () => setRetry(n => n + 1),
    status: saving ? "Saving…" : error ? "Save failed" : dirty ? "Unsaved changes" : savedAt ? `Saved at ${new Date(savedAt).toLocaleTimeString()}` : "New private draft" };
}
