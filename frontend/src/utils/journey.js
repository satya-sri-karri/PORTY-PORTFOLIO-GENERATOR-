import { sendJourneyEvent } from "./api";
import { readJSON, writeJSON } from "./storage";
const key = "porty:journey:v1";
export function trackStep(step) {
  if (!["start", "preview", "save", "publish", "share", "error", "recovery"].includes(step)) return;
  const current = readJSON("localStorage", key).value || { counts: {}, startedAt: null, firstPublishedAt: null };
  if (Date.now() - (current.lastEvent?.[step] || 0) < 500) return;
  current.lastEvent ||= {}; current.lastEvent[step] = Date.now();
  current.counts[step] = (current.counts[step] || 0) + 1;
  if (step === "start" && !current.startedAt) current.startedAt = Date.now();
  if (step === "publish" && !current.firstPublishedAt) current.firstPublishedAt = Date.now();
  writeJSON("localStorage", key, current);
  let sessionId = readJSON("sessionStorage", "porty:activity-session:v1").value;
  if(!sessionId) { sessionId = window.crypto.randomUUID(); if(writeJSON("sessionStorage", "porty:activity-session:v1", sessionId)) return; }
  // Events contain only a browser-session ID and step; no portfolio text or account identity.
  sendJourneyEvent(sessionId,step).catch(()=>{});
}
export function journeyStats() { return readJSON("localStorage", key).value; }
