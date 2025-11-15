"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function SignIn({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Simulate login - in real app, this would call an API
    console.log("Login attempt:", { email, role });
    onLogin(role);
    navigate("/dashboard");
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-wave wave1"></div>
        <div className="auth-wave wave2"></div>
        <div className="auth-wave wave3"></div>
      </div>

      <button className="back-to-home" onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <span className="logo-icon">🌊</span>
            </div>
            <h1>Welcome Back</h1>
            <p>Sign in to continue protecting our oceans</p>
          </div>

          <div className="role-selector">
            <div
              className={`role-option ${role === "user" ? "active" : ""}`}
              onClick={() => setRole("user")}
            >
              <div className="role-icon">👤</div>
              <div className="role-details">
                <h3>Environmental Monitor</h3>
                <p>Detect and report debris</p>
              </div>
              <div className="role-radio">
                {role === "user" && <span className="radio-dot"></span>}
              </div>
            </div>
            <div
              className={`role-option ${role === "authority" ? "active" : ""}`}
              onClick={() => setRole("authority")}
            >
              <div className="role-icon">🛡️</div>
              <div className="role-details">
                <h3>Environmental Authority</h3>
                <p>Manage and coordinate cleanup</p>
              </div>
              <div className="role-radio">
                {role === "authority" && <span className="radio-dot"></span>}
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">
                
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="forgot-password">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="btn-primary-large">
              Sign In
              <span className="btn-arrow">→</span>
            </button>
          </form>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <div className="social-login">
            <button className="social-btn">
              <span className="social-icon">G</span>
              Google
            </button>
            <button className="social-btn">
              <span className="social-icon">M</span>
              Microsoft
            </button>
          </div>

          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <span onClick={() => navigate("/signup")} className="link">
                Sign Up
              </span>
            </p>
          </div>
        </div>

        <div className="auth-sidebar">
          <div className="sidebar-content">
            <div className="sidebar-icon">🌍</div>
            <h2>Join the Mission</h2>
            <p>
              Be part of a global community dedicated to protecting our oceans
              through advanced AI-powered monitoring and detection.
            </p>
            <div className="sidebar-stats">
              <div className="sidebar-stat">
                <strong>50K+</strong>
                <span>Active Users</span>
              </div>
              <div className="sidebar-stat">
                <strong>200+</strong>
                <span>Countries</span>
              </div>
              <div className="sidebar-stat">
                <strong>24/7</strong>
                <span>Monitoring</span>
              </div>
            </div>
            <div className="sidebar-features">
              <div className="sidebar-feature">
                <span className="feature-check">✓</span>
                <span>Real-time debris detection</span>
              </div>
              <div className="sidebar-feature">
                <span className="feature-check">✓</span>
                <span>AI-powered analytics</span>
              </div>
              <div className="sidebar-feature">
                <span className="feature-check">✓</span>
                <span>Instant alert system</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
