"use client";

import { useNavigate } from "react-router-dom";
import "../styles/landing.css";

export default function LandingPage() {
  const navigate = useNavigate();

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
        <div className="hero-background">
          <div className="wave wave1"></div>
          <div className="wave wave2"></div>
          <div className="wave wave3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span>🌍</span>
            <span>AI-Powered Ocean Conservation</span>
          </div>
          <h1 className="hero-title">
            Protect Our Oceans
            <span className="gradient-text"> With Technology</span>
          </h1>
          <p className="hero-subtitle">
            Real-time debris and oil spillage detection powered by advanced AI
            and satellite imagery. Join the global movement to preserve marine
            ecosystems.
          </p>
          <div className="hero-cta">
            <button onClick={() => navigate("/signup")} className="btn-large">
              Start Protecting Now
              <span className="btn-arrow">→</span>
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="btn-outline"
            >
              Learn More
            </button>
          </div>
          <div className="trust-indicators">
            <div className="trust-item">
              <span className="trust-icon">✓</span>
              <span>Real-time Monitoring</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">✓</span>
              <span>99% Accuracy</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">✓</span>
              <span>Global Coverage</span>
            </div>
          </div>
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
        <div className="stat-card">
          <h3>2M+</h3>
          <p>Tons Prevented</p>
        </div>
      </section>

      <section className="features-section" id="how-it-works">
        <div className="section-header">
          <h2>How OceanGuard Works</h2>
          <p>Four powerful features to protect our marine ecosystems</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">📍</span>
            </div>
            <h3>Real-time Detection</h3>
            <p>
              Advanced AI algorithms analyze satellite and drone imagery to
              detect debris and oil spillage instantly, ensuring no threat goes
              unnoticed.
            </p>
            <ul className="feature-list">
              <li>AI-powered image recognition</li>
              <li>Satellite & drone integration</li>
              <li>Instant notification system</li>
            </ul>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">🗺️</span>
            </div>
            <h3>Trajectory Mapping</h3>
            <p>
              Visualize debris movement patterns and predict future positions
              using real-time ocean current data and weather patterns.
            </p>
            <ul className="feature-list">
              <li>Ocean current analysis</li>
              <li>Movement prediction models</li>
              <li>Interactive map visualization</li>
            </ul>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">📢</span>
            </div>
            <h3>Alert Authorities</h3>
            <p>
              Automatically notify nearby environmental authorities and cleanup
              crews with detailed reports including location, size, and
              severity.
            </p>
            <ul className="feature-list">
              <li>Automated alert system</li>
              <li>Detailed incident reports</li>
              <li>Multi-agency coordination</li>
            </ul>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">📊</span>
            </div>
            <h3>Analytics & History</h3>
            <p>
              Access comprehensive analytics, track detection history, and
              monitor cleanup progress with intuitive dashboards and reports.
            </p>
            <ul className="feature-list">
              <li>Monthly trend analysis</li>
              <li>Historical data tracking</li>
              <li>Custom report generation</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="impact-section">
        <div className="impact-content">
          <div className="impact-text">
            <h2>Making a Real Impact</h2>
            <p>
              Every detection counts. Our technology has helped prevent
              thousands of tons of debris from damaging marine ecosystems and
              has facilitated rapid response to oil spill incidents worldwide.
            </p>
            <div className="impact-stats">
              <div className="impact-stat">
                <strong>85%</strong>
                <span>Faster Response Time</span>
              </div>
              <div className="impact-stat">
                <strong>92%</strong>
                <span>Detection Accuracy</span>
              </div>
              <div className="impact-stat">
                <strong>24/7</strong>
                <span>Monitoring Coverage</span>
              </div>
            </div>
          </div>
          <div className="impact-visual">
            <div className="impact-image">
              <div className="impact-badge">
                <span>🌍</span>
                <p>Global Ocean Protection</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Make a Difference?</h2>
          <p>
            Join thousands of environmental advocates using OceanGuard to
            protect our oceans
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="btn-large btn-cta"
          >
            Get Started Free
            <span className="btn-arrow">→</span>
          </button>
          <p className="cta-note">
            No credit card required • Setup in 2 minutes
          </p>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-column">
            <div className="footer-brand">
              <span className="logo-icon">🌊</span>
              <h3>OceanGuard</h3>
            </div>
            <p>
              Protecting marine ecosystems worldwide through advanced AI-powered
              detection and monitoring.
            </p>
          </div>
          <div className="footer-column">
            <h4>Product</h4>
            <ul>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#pricing">Pricing</a>
              </li>
              <li>
                <a href="#api">API</a>
              </li>
              <li>
                <a href="#docs">Documentation</a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li>
                <a href="#about">About Us</a>
              </li>
              <li>
                <a href="#blog">Blog</a>
              </li>
              <li>
                <a href="#careers">Careers</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li>
                <a href="#help">Help Center</a>
              </li>
              <li>
                <a href="#community">Community</a>
              </li>
              <li>
                <a href="#privacy">Privacy Policy</a>
              </li>
              <li>
                <a href="#terms">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 OceanGuard. All rights reserved.</p>
          <div className="footer-social">
            <a href="#twitter">Twitter</a>
            <a href="#linkedin">LinkedIn</a>
            <a href="#github">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
