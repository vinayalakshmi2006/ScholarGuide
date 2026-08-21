import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useScholarships } from "../context/ScholarshipContext";
import { 
  GraduationCap, Search, CheckCircle2, Sparkles, LayoutDashboard, 
  Bookmark, ClipboardList, Shield, LogIn, LogOut, Menu, X, User, Bell
} from "lucide-react";

export default function Navbar() {
  const { user, logout, toggleRole } = useAuth();
  const { savedIds, applications } = useScholarships();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon-wrapper">
            <GraduationCap className="brand-icon" size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-title">SmartScholar</span>
            <span className="brand-subtitle">Scholarship Finder</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <Link to="/" className={`nav-item ${isActive("/") ? "active" : ""}`}>
            Home
          </Link>
          <Link to="/scholarships" className={`nav-item ${isActive("/scholarships") ? "active" : ""}`}>
            <Search size={16} />
            <span>Search</span>
          </Link>
          <Link to="/eligibility" className={`nav-item ${isActive("/eligibility") ? "active" : ""}`}>
            <CheckCircle2 size={16} />
            <span>Eligibility</span>
          </Link>
          <Link to="/recommendations" className={`nav-item ${isActive("/recommendations") ? "active" : ""}`}>
            <Sparkles size={16} />
            <span>Recommended</span>
          </Link>

          {user && (
            <>
              <Link to="/dashboard" className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}>
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>
              <Link to="/saved" className={`nav-item ${isActive("/saved") ? "active" : ""}`}>
                <Bookmark size={16} />
                <span>Saved</span>
                {savedIds.length > 0 && <span className="nav-badge">{savedIds.length}</span>}
              </Link>
              <Link to="/tracker" className={`nav-item ${isActive("/tracker") ? "active" : ""}`}>
                <ClipboardList size={16} />
                <span>Tracker</span>
                {applications.length > 0 && <span className="nav-badge alt">{applications.length}</span>}
              </Link>
            </>
          )}

          <Link to="/about" className={`nav-item ${isActive("/about") ? "active" : ""}`}>
            About
          </Link>

          {user?.role === "admin" && (
            <Link to="/admin" className={`nav-item admin-link ${isActive("/admin") ? "active" : ""}`}>
              <Shield size={16} />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* Right Header Controls */}
        <div className="navbar-actions">
          {user ? (
            <div className="user-profile-menu">
              <button 
                className="user-avatar-button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <div className="avatar-circle">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="user-name-text">{user.name || "Student"}</span>
                <span className={`role-badge ${user.role}`}>{user.role}</span>
              </button>

              {userDropdownOpen && (
                <div className="dropdown-menu-card" onMouseLeave={() => setUserDropdownOpen(false)}>
                  <div className="dropdown-header">
                    <div className="dropdown-user-name">{user.name}</div>
                    <div className="dropdown-user-email">{user.email}</div>
                  </div>
                  <div className="dropdown-divider" />
                  <Link to="/dashboard" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                    <LayoutDashboard size={16} />
                    <span>My Dashboard</span>
                  </Link>
                  <Link to="/eligibility" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                    <User size={16} />
                    <span>Academic Profile</span>
                  </Link>
                  <button className="dropdown-item" onClick={toggleRole}>
                    <Shield size={16} />
                    <span>Switch to {user.role === "admin" ? "Student" : "Admin"} Mode</span>
                  </button>
                  <div className="dropdown-divider" />
                  <button 
                    className="dropdown-item text-danger"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                      navigate("/auth");
                    }}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons-group">
              <Link to="/auth" className="btn-secondary-sm">
                <LogIn size={16} />
                <span>Log In</span>
              </Link>
              <Link to="/auth?tab=register" className="btn-primary-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button 
            className="mobile-hamburger-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-menu">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/scholarships" onClick={() => setMobileMenuOpen(false)}>Find Scholarships</Link>
          <Link to="/eligibility" onClick={() => setMobileMenuOpen(false)}>Check Eligibility</Link>
          <Link to="/recommendations" onClick={() => setMobileMenuOpen(false)}>Recommended for You</Link>
          {user && (
            <>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>My Dashboard</Link>
              <Link to="/saved" onClick={() => setMobileMenuOpen(false)}>Saved ({savedIds.length})</Link>
              <Link to="/tracker" onClick={() => setMobileMenuOpen(false)}>Application Tracker ({applications.length})</Link>
            </>
          )}
          <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About & Contact</Link>
          {user?.role === "admin" && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin Panel</Link>
          )}
          <div className="mobile-menu-footer">
            {user ? (
              <button className="btn-danger-block" onClick={() => { setMobileMenuOpen(false); logout(); }}>
                <LogOut size={16} /> Sign Out
              </button>
            ) : (
              <Link to="/auth" className="btn-primary-block" onClick={() => setMobileMenuOpen(false)}>
                Get Started / Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
