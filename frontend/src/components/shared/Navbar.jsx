import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Logo from "./Logo";

const Navbar = () => {
  const { user, logout, isLoggedIn } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => { logout(); navigate("/login"); };
  const isPublicPage = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/register";

  return (
    <nav className="navbar">
      <Link to={isLoggedIn ? "/dashboard" : "/"} className="navbar-brand" style={{ textDecoration: "none" }}>
        <Logo size={28} />
        <span>Porty</span>
      </Link>

      <div className="navbar-actions">
        {!isPublicPage && (
          <button onClick={toggle} className="btn btn-ghost btn-sm" style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, border: "none", borderRadius: 8 }} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        )}
        {isLoggedIn && !isPublicPage ? (
          <>
            
            <Link to="/dashboard" className="btn btn-ghost btn-sm" style={{ textDecoration: "none" }}>
              Dashboard
            </Link>
            <Link to="/builder" className="btn btn-secondary btn-sm" style={{ textDecoration: "none" }}>
              <span className="navbar-new-long">+ New Portfolio</span><span className="navbar-new-short">+ New</span>
            </Link>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-sm" style={{ textDecoration: "none", border: "1px solid #fff", color: "#fff", background: "transparent", boxShadow: "none" }}>Sign in</Link>
            <Link to="/register" className="btn btn-sm" style={{ textDecoration: "none", border: "1px solid #fff", color: "#17172B", background: "#fff", boxShadow: "none" }}>Get started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
