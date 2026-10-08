const BASE = process.env.REACT_APP_API_URL || "/api";
const req = async (method, url, body, token, signal) => {
  const h = { "Content-Type": "application/json" };
  if (token) h["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${url}`, { method, signal, headers: h, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(res.status === 401 && token
      ? "Your session has expired. Sign in again; your entered information is still here."
      : data.error || `Request failed (${res.status}). Please try again.`);
    error.status = res.status;
    throw error;
  }
  return data;
};
export const sendOTP = (email, name) => req("POST", "/auth/send-otp", { email, name });
export const verifyOTP = (email, otp, name, password) => req("POST", "/auth/verify-otp", { email, otp, name, password });
export const loginUser = (email, password) => req("POST", "/auth/login", { email, password });
export const getMe = t => req("GET", "/auth/me", null, t);
export const createPortfolio = (b, t) => req("POST", "/portfolio", b, t);
export const getMyPortfolios = t => req("GET", "/portfolio/my", null, t);
export const getPortfolioById = (id, t) => req("GET", `/portfolio/${id}`, null, t);
export const updatePortfolio = (id, b, t) => req("PUT", `/portfolio/${id}`, b, t);
export const deletePortfolio = (id, t) => req("DELETE", `/portfolio/${id}`, null, t);
export const getPublicPortfolio = slug => req("GET", `/portfolio/share/${slug}`);
export const getPortfolioCapabilities = signal => req("GET", "/portfolio/capabilities", null, null, signal);
export const generateBio = (b, t, signal) => req("POST", "/ai/bio", b, t, signal);
export const suggestSkills = (b, t, signal) => req("POST", "/ai/skills", b, t, signal);
export const generateProjectDesc = (b, t, signal) => req("POST", "/ai/project", b, t, signal);
export const recommendTheme = (b, t, signal) => req("POST", "/ai/theme-recommend", b, t, signal);

export const forgotPassword = email => req("POST", "/auth/forgot-password", { email });
export const resetPassword = (email, otp, password) => req("POST", "/auth/reset-password", { email, otp, password });
export const getTrash = token => req("GET", "/portfolio/trash", null, token);
export const restorePortfolio = (id, token) => req("POST", `/portfolio/${id}/restore`, {}, token);
export const permanentlyDeletePortfolio = (id, token) => req("DELETE", `/portfolio/${id}/permanent`, null, token);
export const getShowcase = () => req("GET", "/portfolio/showcase");
export const recordPortfolioClick = (slug, type) => req("POST", `/portfolio/events/${slug}`, { type });

export const getAggregateActivity = token => req("GET", "/metrics/summary", null, token);
export const sendFeedback = answers => req("POST", "/metrics/feedback", answers);
export const sendJourneyEvent = (sessionId,step) => req("POST", "/metrics/event", {sessionId,step});
