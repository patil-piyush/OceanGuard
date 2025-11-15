"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function SignUp({ onLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    organization: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return { strength: 0, label: "", color: "" };
    if (password.length < 6)
      return { strength: 25, label: "Weak", color: "#dc2626" };
    if (password.length < 10)
      return { strength: 50, label: "Fair", color: "#f59e0b" };
    if (password.length < 14)
      return { strength: 75, label: "Good", color: "#3b82f6" };
    return { strength: 100, label: "Strong", color: "#10b981" };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (formData.role === "authority" && !formData.organization) {
      setError("Organization name is required for authorities");
      return;
    }

    if (!acceptTerms) {
      setError("Please accept the terms and conditions");
      return;
    }

    // Simulate signup - in real app, this would call an API
    console.log("Signup:", formData);
    onLogin(formData.role);
    navigate("/dashboard");
  };

  const passwordStrength = getPasswordStrength();

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
            <h1>Create Account</h1>
            <p>Join OceanGuard and start protecting our oceans</p>
          </div>

          <div className="role-selector">
            <div
              className={`role-option ${
                formData.role === "user" ? "active" : ""
              }`}
              onClick={() => handleRoleChange("user")}
            >
              <div className="role-icon">👤</div>
              <div className="role-details">
                <h3>Environmental Monitor</h3>
                <p>Detect and report debris</p>
              </div>
              <div className="role-radio">
                {formData.role === "user" && (
                  <span className="radio-dot"></span>
                )}
              </div>
            </div>
            <div
              className={`role-option ${
                formData.role === "authority" ? "active" : ""
              }`}
              onClick={() => handleRoleChange("authority")}
            >
              <div className="role-icon">🛡️</div>
              <div className="role-details">
                <h3>Environmental Authority</h3>
                <p>Manage and coordinate cleanup</p>
              </div>
              <div className="role-radio">
                {formData.role === "authority" && (
                  <span className="radio-dot"></span>
                )}
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
              <label htmlFor="name">
                <span className="label-icon">👤</span>
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <span className="label-icon">✉️</span>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {formData.role === "authority" && (
              <div className="form-group">
                <label htmlFor="organization">
                  <span className="label-icon">🏢</span>
                  Organization Name
                </label>
                <input
                  id="organization"
                  name="organization"
                  type="text"
                  placeholder="Environmental Agency Name"
                  value={formData.organization}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password">
                <span className="label-icon">🔒</span>
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
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
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{
                        width: `${passwordStrength.strength}%`,
                        backgroundColor: passwordStrength.color,
                      }}
                    ></div>
                  </div>
                  <span
                    className="strength-label"
                    style={{ color: passwordStrength.color }}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <span className="label-icon">🔒</span>
                Confirm Password
              </label>
              <div className="password-input-wrapper">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {formData.confirmPassword &&
                formData.password === formData.confirmPassword && (
                  <div className="password-match">
                    <span className="match-icon">✓</span>
                    Passwords match
                  </div>
                )}
            </div>

            <div className="terms-group">
              <label className="terms-checkbox">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                <span>
                  I agree to the{" "}
                  <a href="#terms" className="terms-link">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#privacy" className="terms-link">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            <button type="submit" className="btn-primary-large">
              Create Account
              <span className="btn-arrow">→</span>
            </button>
          </form>

          <div className="auth-divider">
            <span>or sign up with</span>
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
              Already have an account?{" "}
              <span onClick={() => navigate("/signin")} className="link">
                Sign In
              </span>
            </p>
          </div>
        </div>

        <div className="auth-sidebar">
          <div className="sidebar-content">
            <div className="sidebar-icon">🌍</div>
            <h2>Start Making a Difference</h2>
            <p>
              Join thousands of environmental advocates using OceanGuard to
              detect, track, and prevent ocean pollution worldwide.
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
                <span>Free account with full features</span>
              </div>
              <div className="sidebar-feature">
                <span className="feature-check">✓</span>
                <span>AI-powered detection tools</span>
              </div>
              <div className="sidebar-feature">
                <span className="feature-check">✓</span>
                <span>Real-time alerts and notifications</span>
              </div>
              <div className="sidebar-feature">
                <span className="feature-check">✓</span>
                <span>Comprehensive analytics dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
