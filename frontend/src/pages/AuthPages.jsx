import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sendOTP, verifyOTP, loginUser } from "../utils/api";
import Grainient from "../components/effects/Grainient";
import Logo from "../components/shared/Logo";

function PasswordInput({ id, placeholder, value, onChange, autoComplete }) {
  const [visible,setVisible] = useState(false);
  return <><input id={id} className="form-input" style={inputGlassStyle} type={visible ? "text" : "password"} placeholder={placeholder} value={value} onChange={onChange} autoComplete={autoComplete} required minLength={6} /><button type="button" className="btn btn-ghost btn-sm" style={{color:"white"}} aria-pressed={visible} onClick={() => setVisible(v=>!v)}>{visible ? "Hide password" : "Show password"}</button></>;
}

const inputGlassStyle = {
  background: "rgba(0,0,0,0.25)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#fff",
};

export const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cooldown,setCooldown] = useState(0);
  useEffect(() => { if(!cooldown) return; const timer = setTimeout(()=>setCooldown(n=>Math.max(0,n-1)),1000); return ()=>clearTimeout(timer); }, [cooldown]);
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
      setStep("otp"); setCooldown(60);
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
          {error && <div className="alert alert-error" role="alert">⚠ {error}</div>}
          {step === "email" ? (
            <form onSubmit={handleSendOTP} style={{ maxWidth: 360, margin: "0 auto" }}>
              <div className="form-group">
                <label htmlFor="auth-name" className="form-label" style={{ color: "#fff" }}>Full Name</label>
                <input id="auth-name" autoComplete="name" className="form-input" style={inputGlassStyle} placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} autoFocus />
              </div>
              <div className="form-group">
                <label htmlFor="auth-email" className="form-label" style={{ color: "#fff" }}>Email</label>
                <input id="auth-email" autoComplete="email" required className="form-input" style={inputGlassStyle} type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-glass-white btn-lg" disabled={loading} style={{ marginTop: 4, fontWeight: 700, display: "block", marginLeft: "auto", marginRight: "auto", maxWidth: 320 }}>
                {loading ? <><span className="spinner" /> Sending OTP...</> : "Send OTP →"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} style={{ maxWidth: 360, margin: "0 auto" }}>
              <div className="form-group">
                <label htmlFor="auth-otp" className="form-label" style={{ color: "#fff" }}>One-Time Password</label>
                <input id="auth-otp" autoComplete="one-time-code" pattern="[0-9]{6}" required className="form-input" style={{ ...inputGlassStyle, textAlign: "center", fontSize: 24, letterSpacing: 8 }} type="text" inputMode="numeric" maxLength={6} placeholder="000000" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} autoFocus />
                <div className="form-hint" style={{ color: "rgba(255,255,255,0.45)", textAlign: "center", marginTop: 8, fontSize: 12.5 }}>
                  A 6-digit code, valid for five minutes, was sent to <strong style={{ color: "rgba(255,255,255,0.8)" }}>{email}</strong>. If you can't find it, check your <strong style={{ color: "rgba(255,255,255,0.8)" }}>Spam / Junk</strong> folder.
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="auth-password" className="form-label" style={{ color: "#fff" }}>Set Password</label>
                <PasswordInput id="auth-password" autoComplete="new-password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-glass-white btn-lg" disabled={loading} style={{ marginTop: 4, fontWeight: 700, display: "block", marginLeft: "auto", marginRight: "auto", maxWidth: 320 }}>
                {loading ? <><span className="spinner" /> Creating account...</> : "Create Account →"}
              </button>
              <button type="button" className="btn btn-ghost btn-sm" style={{color:"white"}} disabled={loading || cooldown>0} onClick={handleSendOTP}>{cooldown>0 ? `Resend in ${cooldown}s` : "Resend OTP"}</button>
              <div style={{ textAlign: "center", marginTop: 14 }}>
                <button type="button" onClick={() => { setStep("email"); setOtp(""); setPassword(""); setError(""); }} className="btn btn-ghost btn-sm" style={{ color: "rgba(255,255,255,0.6)", border: "none", textDecoration: "underline", cursor: "pointer", background: "none", fontSize: 13 }}>
                  Change email
                </button>
              </div>
              <div className="auth-footer">
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>Already have an account? </span>
                <Link to="/login" state={{from:location.state?.from}} style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>Sign in</Link>
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
          {error && <div className="alert alert-error" role="alert">⚠ {error}</div>}
          <form onSubmit={handleSubmit} style={{ maxWidth: 360, margin: "0 auto" }}>
            <div className="form-group">
              <label htmlFor="auth-email" className="form-label" style={{ color: "#fff" }}>Email</label>
              <input id="auth-email" autoComplete="email" required className="form-input" style={inputGlassStyle} type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
            </div>
            <div className="form-group">
              <label htmlFor="auth-password" className="form-label" style={{ color: "#fff" }}>Password</label>
              <PasswordInput id="auth-password" autoComplete="current-password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-glass-white btn-lg" disabled={loading} style={{ marginTop: 4, fontWeight: 700, display: "block", marginLeft: "auto", marginRight: "auto", maxWidth: 320 }}>
              {loading ? <><span className="spinner" /> Signing in...</> : "Sign In →"}
            </button>
          </form>
          <p style={{textAlign:"center"}}><Link to="/recover" style={{color:"white"}}>Forgot password?</Link></p>
          <div className="auth-footer">
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>Don't have an account? </span>
            <Link to="/register" state={{from:location.state?.from}} style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
