// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { readJSON, writeJSON, removeStored } from "../utils/storage";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [storageError, setStorageError] = useState("");
  useEffect(() => {
    let t;
    try { t = localStorage.getItem("token"); } catch { setStorageError("Browser storage is unavailable. Your sign-in will last until this page is closed."); }
    const { value: u } = readJSON("localStorage", "user");
    if (t && u) { setToken(t); setUser(u); }
    setLoading(false);
  }, []);
  const login = (t, u) => {
    setToken(t); setUser(u);
    try { localStorage.setItem("token", t); } catch { setStorageError("Your sign-in could not be saved on this device. Keep this page open."); }
    const error = writeJSON("localStorage", "user", u);
    if (error) setStorageError(error);
  };
  const logout = () => { setToken(null); setUser(null); removeStored("localStorage", "token"); removeStored("localStorage", "user"); };
  return <AuthContext.Provider value={{ user, token, login, logout, loading, storageError, isLoggedIn: !!token }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
