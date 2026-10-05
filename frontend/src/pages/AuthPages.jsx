import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sendOTP, verifyOTP, loginUser } from "../utils/api";
import Grainient from "../components/effects/Grainient";
import Logo from "../components/shared/Logo";

const inputGlassStyle = {
  background: "rgba(0,0,0,0.25)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#fff",
};

export const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async e => {
    e.preventDefault();
    if (!email.trim()) return setError("Enter your email.");
    setLoading(true); setError("");
    try {
      await sendOTP(email.trim(), name.trim() || undefined);
      setStep("otp");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleVerify = async e => {
    e.preventDefault();
    if (!otp.trim()) return setError("Enter the OTP.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true); setError("");
    try {
      const res = await verifyOTP(email.trim(), otp.trim(), name.trim() || undefined, password);
      login(res.token, res.user);
      const from = location.state?.from;
      navigate(from?.pathname ? `${from.pathname}${from.search || ""}` : "/dashboard", { replace: true });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "transparent" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
        <Grainient
          color1="#FF9FFC" color2="#5227FF" color3="#B497CF" timeSpeed={0.22}
          colorBalance={0.0} warpStrength={1.0} warpFrequency={5.0} warpSpeed={1.4}
          warpAmplitude={55.0} blendAngle={12} blendSoftness={0.3} rotationAmount={340.0}
          noiseScale={1.8} grainAmount={0.08} grainScale={2.2} grainAnimated={false}
          contrast={1.5} gamma={1.0} saturation={1.0} zoom={0.88}
        />
      </div>
      <div className="auth-page">
        <div className="auth-card fade-up" style={{ maxWidth: 420 }}>
          <div className="auth-header">
            <h1 className="text-on-gradient" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <Logo size={32} /> Porty
            </h1>
            <p className="text-on-gradient-secondary">
              {step === "email" ? "Create your account" : "Verify email & set password"}
            </p>
          </div>
          {error && <div className="alert alert-error">⚠ {error}</div>}
          {step === "email" ? (
            <form onSubmit={handleSendOTP} style={{ maxWidth: 360, margin: "0 auto" }}>
              <div className="form-group">
                <label className="form-label" style={{ color: "#fff" }}>Full Name</label>
                <input className="form-input" style={inputGlassStyle} placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} autoFocus />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: "#fff" }}>Email</label>
                <input className="form-input" style={inputGlassStyle} type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-glass-white btn-lg" disabled={loading} style={{ marginTop: 4, fontWeight: 700, display: "block", marginLeft: "auto", marginRight: "auto", maxWidth: 320 }}>
                {loading ? <><span className="spinner" /> Sending OTP...</> : "Send OTP →"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} style={{ maxWidth: 360, margin: "0 auto" }}>
              <div className="form-group">
                <label className="form-label" style={{ color: "#fff" }}>One-Time Password</label>
                <input className="form-input" style={{ ...inputGlassStyle, textAlign: "center", fontSize: 24, letterSpacing: 8 }} type="text" inputMode="numeric" maxLength={6} placeholder="000000" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} autoFocus />
                <div className="form-hint" style={{ color: "rgba(255,255,255,0.45)", textAlign: "center", marginTop: 8, fontSize: 12.5 }}>
                  A 6-digit code was sent to <strong style={{ color: "rgba(255,255,255,0.8)" }}>{email}</strong>. If you can't find it, check your <strong style={{ color: "rgba(255,255,255,0.8)" }}>Spam / Junk</strong> folder.
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: "#fff" }}>Set Password</label>
                <input className="form-input" style={inputGlassStyle} type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-glass-white btn-lg" disabled={loading} style={{ marginTop: 4, fontWeight: 700, display: "block", marginLeft: "auto", marginRight: "auto", maxWidth: 320 }}>
                {loading ? <><span className="spinner" /> Creating account...</> : "Create Account →"}
              </button>
              <div style={{ textAlign: "center", marginTop: 14 }}>
                <button type="button" onClick={() => { setStep("email"); setOtp(""); setPassword(""); setError(""); }} className="btn btn-ghost btn-sm" style={{ color: "rgba(255,255,255,0.6)", border: "none", textDecoration: "underline", cursor: "pointer", background: "none", fontSize: 13 }}>
                  Change email
                </button>
              </div>
              <div className="auth-footer">
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>Already have an account? </span>
                <Link to="/login" style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>Sign in</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email.trim() || !password) return setError("Email and password are required.");
    setLoading(true); setError("");
    try {
      const res = await loginUser(email.trim(), password);
      login(res.token, res.user);
      const from = location.state?.from;
      navigate(from?.pathname ? `${from.pathname}${from.search || ""}` : "/dashboard", { replace: true });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "transparent" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
        <Grainient
          color1="#FF9FFC" color2="#5227FF" color3="#B497CF" timeSpeed={0.22}
          colorBalance={0.0} warpStrength={1.0} warpFrequency={5.0} warpSpeed={1.4}
          warpAmplitude={55.0} blendAngle={12} blendSoftness={0.3} rotationAmount={340.0}
          noiseScale={1.8} grainAmount={0.08} grainScale={2.2} grainAnimated={false}
          contrast={1.5} gamma={1.0} saturation={1.0} zoom={0.88}
        />
      </div>
      <div className="auth-page">
        <div className="auth-card fade-up" style={{ maxWidth: 420 }}>
          <div className="auth-header">
            <h1 className="text-on-gradient" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <Logo size={32} /> Porty
            </h1>
            <p className="text-on-gradient-secondary">Welcome back — sign in to continue</p>
          </div>
          {error && <div className="alert alert-error">⚠ {error}</div>}
          <form onSubmit={handleSubmit} style={{ maxWidth: 360, margin: "0 auto" }}>
            <div className="form-group">
              <label className="form-label" style={{ color: "#fff" }}>Email</label>
              <input className="form-input" style={inputGlassStyle} type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ color: "#fff" }}>Password</label>
              <input className="form-input" style={inputGlassStyle} type="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-glass-white btn-lg" disabled={loading} style={{ marginTop: 4, fontWeight: 700, display: "block", marginLeft: "auto", marginRight: "auto", maxWidth: 320 }}>
              {loading ? <><span className="spinner" /> Signing in...</> : "Sign In →"}
            </button>
          </form>
          <div className="auth-footer">
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>Don't have an account? </span>
            <Link to="/register" style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
