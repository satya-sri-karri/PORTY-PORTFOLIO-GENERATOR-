import React from "react";
import { Link } from "react-router-dom";
import { getAllThemes } from "../registry/themeRegistry";
import Grainient from "../components/effects/Grainient";
import TextPressure from "../components/effects/TextPressure";

const FEATURES = [
  { icon: "✦", label: "AI Bio Generator", desc: "Review a biography draft based on your real information" },
  { icon: "✦", label: "AI Project Descriptions", desc: "Review and refine a draft based on your project facts" },
  { icon: "✦", label: "AI Skill Suggester", desc: "Discover relevant skills for your role" },
  { icon: "✦", label: "AI Theme Recommender", desc: "Find your perfect visual identity" },
  { icon: "◈", label: `${getAllThemes().length} Distinct Themes`, desc: "From brutalist to luxe — each tells a different story" },
  { icon: "◈", label: "9 Portfolio Sections", desc: "Skills, projects, experience, certs, achievements, coding profiles" },
  { icon: "◈", label: "Instant Share Links", desc: "Unique URL — shareable without login" },
  { icon: "◈", label: "Edit Anytime", desc: "Update your portfolio whenever you want" },
];

const textShadow = "0 1px 12px rgba(0,0,0,0.18)";

const LandingPage = () => {
  const themes = getAllThemes().slice(0, 6);
  return (
    <div className="landing-page" style={{ position: "relative", minHeight: "100vh", background: "transparent" }}>

      {/* Full-page animated gradient — fixed so every section below scrolls over it.
          Explicit vw/vh (not `inset:0` + percentage heights) so sizing never
          depends on an ancestor's computed height. */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden",pointerEvents:"none" }}>
        <Grainient
          color1="#FF9FFC"
          color2="#5227FF"
          color3="#B497CF"
          timeSpeed={0.22}
          colorBalance={0.0}
          warpStrength={1.0}
          warpFrequency={5.0}
          warpSpeed={1.4}
          warpAmplitude={55.0}
          blendAngle={12}
          blendSoftness={0.3}
          rotationAmount={340.0}
          noiseScale={1.8}
          grainAmount={0.08}
          grainScale={2.2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1.0}
          saturation={1.0}
          zoom={0.88}
        />
      </div>

      <div
          style={{
              position: "relative",
              zIndex: 1
          }}
      >

      {/* Hero */}
      <section style={{ minHeight: "92vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 24px 60px", position: "relative" }}>
        <div style={{ position: "relative", zIndex: 1, maxWidth: 720 }}>

          <p className="text-on-gradient-secondary" style={{
            fontSize: 19, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
            marginTop: 0, marginBottom: 4, textShadow
          }}>
            build your
          </p>
          <div style={{ height: "clamp(90px, 16vw, 160px)", marginBottom: 0 }}>
            <TextPressure
              text="Portfolio"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              textColor="#ffffff"
              minFontSize={56}
            />
          </div>
          <p className="text-on-gradient-secondary" style={{
            fontSize: 19, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
            marginTop: -30, marginBottom: 32, textShadow
          }}>
            in minutes
          </p>

          <p className="fade-up d-2 text-on-gradient-secondary" style={{ fontSize: 19, maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.75, fontWeight: 400, textShadow }}>
            Your story. Your skills. Your portfolio.
            Create multiple stunning, portfolios with modern templates, and real-time analytics to track your impact.
          </p>

          <div className="fade-up d-3" style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register" className="btn btn-glass-white btn-xl" style={{ textDecoration: "none" }}>
              Get started free →
            </Link>
            <Link to="/login" className="btn btn-glass-outline btn-lg" style={{ textDecoration: "none" }}>
              Sign in
            </Link>
          </div>

          <p className="fade-up d-4 text-on-gradient-tertiary" style={{ fontSize: 12, marginTop: 16, textShadow }}>
             Takes 5 minutes
          </p>
        </div>
      </section>

      {/* Theme preview strip */}
      <section style={{ padding: "0 0 80px", overflow: "hidden", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p className="text-on-gradient-tertiary" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", textShadow }}>
            {getAllThemes().length} Distinct Themes
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, padding: "0 24px", overflowX: "auto", paddingBottom: 8 }}>
          {getAllThemes().map(theme => (
            <div key={theme.id} className="glass" style={{ flexShrink: 0, width: 180, borderRadius: 12, overflow: "hidden", transition: "transform 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{ height: 100, background: theme.preview.bg, position: "relative" }}>
                <div style={{ position: "absolute", bottom: 10, left: 12, right: 12 }}>
                  <div style={{ height: 8, width: "60%", borderRadius: 3, background: "rgba(255,255,255,0.5)", marginBottom: 5 }} />
                  <div style={{ height: 5, width: "80%", borderRadius: 2, background: "rgba(255,255,255,0.2)" }} />
                </div>
                <div style={{ position: "absolute", top: 8, right: 8, width: 20, height: 6, borderRadius: 3, background: theme.preview.accent }} />
              </div>
              <div style={{ padding: "10px 12px" }}>
                <div className="text-on-gradient" style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>{theme.name}</div>
                <div className="text-on-gradient-tertiary" style={{ fontSize: 10 }}>{theme.persona}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-on-gradient" style={{ padding: "80px 24px", borderTop: "1px solid" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div className="badge-glass-pill" style={{ marginBottom: 16, padding: "6px 16px" }}>Features</div>
            <h2 className="text-on-gradient" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 10, textShadow }}>
              Everything in one place
            </h2>
            <p className="text-on-gradient-secondary" style={{ fontSize: 15, fontWeight: 400, textShadow }}>
              AI writing assistance + {getAllThemes().length} themes + 9 sections
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="card card-hover" style={{ padding: "20px 22px" }}>
                <div className="text-on-gradient" style={{ fontSize: 18, marginBottom: 10, fontWeight: 700 }}>{f.icon}</div>
                <div className="text-on-gradient" style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em", marginBottom: 5 }}>{f.label}</div>
                <div className="text-on-gradient-secondary" style={{ fontSize: 13, lineHeight: 1.6, fontWeight: 400 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* CTA */}
      <section className="border-on-gradient" style={{ padding: "80px 24px", borderTop: "1px solid", textAlign: "center" }}>
        <div className="container-sm">
          <h2 className="text-on-gradient" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 14, textShadow }}>
            Ready to stand out?
          </h2>
          <p className="text-on-gradient-secondary" style={{ fontSize: 20, marginBottom: 32, fontWeight: 400, textShadow }}>
            Create a professional portfolio, personalise it with beautiful themes, and publish it instantly.
          </p>
          <Link to="/register" className="btn btn-glass-white btn-xl" style={{ textDecoration: "none" }}>
            Build Your Portfolio →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-on-gradient-tertiary border-on-gradient" style={{ textAlign: "center", padding: "24px", borderTop: "1px solid", fontSize: 12, textShadow }}>
        
      </footer>
    </div>
    </div>
  );
};

export default LandingPage;
