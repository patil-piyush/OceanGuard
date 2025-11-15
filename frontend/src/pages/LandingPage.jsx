"use client"

import { useNavigate } from "react-router-dom"
import "../styles/landing.css"

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="nav-brand">
          <span className="logo-icon">🌊</span>
          <h1>OceanGuard</h1>
        </div>
        <div className="nav-buttons">
          <button onClick={() => navigate("/signin")} className="btn-secondary">
            Sign In
          </button>
          <button onClick={() => navigate("/signup")} className="btn-primary">
            Get Started
          </button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Protect Our Oceans</h1>
          <p className="hero-subtitle">Real-time debris and oil spillage detection powered by AI</p>
          <div className="hero-features">
            <div className="feature-item">
              <span className="feature-icon">📍</span>
              <h3>Real-time Detection</h3>
              <p>Detect debris and oil spillage instantly with AI-powered image analysis</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🗺️</span>
              <h3>Trajectory Mapping</h3>
              <p>Visualize debris movement and predict future positions using ocean data</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📢</span>
              <h3>Alert Authorities</h3>
              <p>Instantly notify nearby environmental authorities with detailed reports</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <h3>Analytics & History</h3>
              <p>Track detection history and view comprehensive monthly analytics</p>
            </div>
          </div>
          <button onClick={() => navigate("/signup")} className="btn-large">
            Start Protecting Now
          </button>
        </div>
      </section>

      <section className="stats-section">
        <div className="stat-card">
          <h3>50K+</h3>
          <p>Debris Detections</p>
        </div>
        <div className="stat-card">
          <h3>200+</h3>
          <p>Authorities Alerted</p>
        </div>
        <div className="stat-card">
          <h3>100+</h3>
          <p>Clean-up Operations</p>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2025 OceanGuard. Protecting marine ecosystems worldwide.</p>
      </footer>
    </div>
  )
}
