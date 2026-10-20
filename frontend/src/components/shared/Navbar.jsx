import React, { useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Logo from "./Logo";

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate(), { pathname } = useLocation(), menu = useRef(null);
  const building = pathname.startsWith("/builder"), authenticating = ["/login", "/register", "/recover"].includes(pathname);
  useEffect(() => { if (menu.current) menu.current.open = false; }, [pathname]);
  useEffect(() => {
    const close = event => { if (menu.current && !menu.current.contains(event.target)) menu.current.open = false; };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  return <header className="navbar"><Link to={isLoggedIn ? "/dashboard" : "/"} className="navbar-brand" aria-label="Porty home"><Logo size={28} /><span>Porty<span className="brand-period">.</span></span></Link>
    {building && <span className="nav-context">Portfolio studio</span>}
    <nav className="navbar-actions" aria-label="Main navigation">
      {isLoggedIn ? <><Link to="/dashboard" className="btn btn-ghost btn-sm" aria-current={pathname === "/dashboard" ? "page" : undefined}>My portfolios</Link><details ref={menu} className="account-menu" onKeyDown={event => { if (event.key === "Escape") { event.currentTarget.open = false; event.currentTarget.querySelector("summary").focus(); } }}><summary aria-label="Account and appearance">{user?.name?.slice(0, 1).toUpperCase() || "P"}</summary><div className="account-options"><span>{user?.name || "Your account"}</span><button type="button" className="btn btn-ghost btn-sm" onClick={toggle}>Use {theme === "dark" ? "light" : "dark"} appearance</button><button type="button" className="btn btn-ghost btn-sm" onClick={() => { logout(); navigate("/login"); }}>Sign out</button></div></details></> : <>
        {!authenticating && <Link to="/showcase" className="nav-community">Made with Porty</Link>}
        {pathname !== "/login" && <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>}
        {!authenticating && pathname !== "/try" && <Link to="/try" className="btn btn-primary btn-sm">Start creating <span aria-hidden="true">↗</span></Link>}
      </>}
    </nav></header>;
}
