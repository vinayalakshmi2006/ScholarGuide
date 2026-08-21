import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useScholarships } from "../context/ScholarshipContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LogIn, UserPlus, Shield, GraduationCap, CheckCircle2 } from "lucide-react";

export default function AuthPage() {
  const { login, register, loading } = useAuth();
  const { addToast } = useScholarships();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(searchParams.get("tab") === "register" ? "register" : "login");
  const [role, setRole] = useState("student"); // 'student' | 'admin'

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    if (activeTab === "login") {
      await login(email, password, role);
      addToast(`Logged in successfully as ${role === "admin" ? "Admin" : "Student"}!`, "success");
      navigate(role === "admin" ? "/admin" : "/dashboard");
    } else {
      await register(email, password, name, role);
      addToast("Account created successfully!", "success");
      navigate("/eligibility");
    }
  };

  const handleDemoFill = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === "admin") {
      setEmail("admin.scholarship@smartscholar.edu");
      setPassword("admin123456");
      setName("System Administrator");
    } else {
      setEmail("aarav.sharma@student.edu");
      setPassword("student123456");
      setName("Aarav Sharma");
    }
  };

  return (
    <div className="auth-page-container section-padding">
      <div className="auth-card-box">
        <div className="auth-header text-center">
          <div className="brand-icon-wrapper mx-auto mb-2">
            <GraduationCap className="brand-icon" size={32} />
          </div>
          <h2 className="auth-title">Welcome to SmartScholar</h2>
          <p className="auth-subtitle">Scholarship Discovery & Eligibility Recommendation System</p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs-row">
          <button 
            className={`auth-tab-btn ${activeTab === "login" ? "active" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            <LogIn size={16} /> Sign In
          </button>
          <button 
            className={`auth-tab-btn ${activeTab === "register" ? "active" : ""}`}
            onClick={() => setActiveTab("register")}
          >
            <UserPlus size={16} /> Register
          </button>
        </div>

        {/* Role Selector */}
        <div className="role-selector-box mb-3">
          <span className="role-label">Select Access Role:</span>
          <div className="role-buttons">
            <button 
              type="button"
              className={`role-btn ${role === "student" ? "active" : ""}`}
              onClick={() => handleDemoFill("student")}
            >
              <GraduationCap size={16} /> Student
            </button>
            <button 
              type="button"
              className={`role-btn ${role === "admin" ? "active admin" : ""}`}
              onClick={() => handleDemoFill("admin")}
            >
              <Shield size={16} /> Admin Demo
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {activeTab === "register" && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Aarav Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-control"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              placeholder="e.g. student@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary-block mt-3">
            {loading ? "Processing..." : (activeTab === "login" ? "Sign In to Account" : "Create Student Account")}
          </button>
        </form>

        <div className="auth-demo-hint mt-4 text-center">
          <p className="text-xs text-muted">
            💡 <strong>Quick Demo Tip:</strong> Click the "Student" or "Admin Demo" button above to auto-fill sample credentials.
          </p>
        </div>
      </div>
    </div>
  );
}
