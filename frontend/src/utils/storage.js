// Storage is optional: private browsing, quotas and device policies can disable it.
export const readJSON = (storage, key) => {
  try {
    const raw = window[storage].getItem(key);
    return { value: raw ? JSON.parse(raw) : null, error: null };
  } catch {
    return { value: null, error: "Browser storage is unavailable. Keep this page open until you save your work." };
  }
};

export const writeJSON = (storage, key, value) => {
  try {
    window[storage].setItem(key, JSON.stringify(value));
    return null;
  } catch {
    return "Your draft could not be stored on this device. Keep this page open and save to your account before leaving.";
  }
};

export const removeStored = (storage, key) => {
  try { window[storage].removeItem(key); return null; }
  catch { return "The saved draft could not be cleared on this device."; }
};

export const draftKey = (userId, recordId) => `porty:draft:v1:${userId}:${recordId || "new"}`;

export const contentSnapshot = data => {
  const { _id, id, userId, shareSlug, views, createdAt, updatedAt, __v, thumbnail, analytics, deletedAt, ...content } = data;
  // Object key order can change when fields are normalized after saving.
  // Compare values deterministically while retaining meaningful array order.
  const canonical = value => Array.isArray(value) ? value.map(canonical)
    : value && typeof value === "object" ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
  return JSON.stringify(canonical(content));
};
