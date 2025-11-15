"use client";

import { useState } from "react";
import "../styles/components.css";
import TrajectoryMap from "./TrajectoryMap";

export default function DashboardHome({ userRole }) {
  const [stats, setStats] = useState({
    debrisDetected: 45,
    oilSpillages: 8,
    alertsSent: 12,
    cleanupCompleted: 5,
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: "debris",
      message: "Plastic debris detected in coastal area",
      timestamp: "2 hours ago",
      location: "Gulf Coast",
      severity: "high",
    },
    {
      id: 2,
      type: "oil",
      message: "Oil spillage alert sent to authorities",
      timestamp: "4 hours ago",
      location: "Atlantic Waters",
      severity: "critical",
    },
    {
      id: 3,
      type: "debris",
      message: "Mixed debris identified near shore",
      timestamp: "6 hours ago",
      location: "Pacific Region",
      severity: "medium",
    },
    {
      id: 4,
      type: "cleanup",
      message: "Cleanup operation marked complete",
      timestamp: "8 hours ago",
      location: "Caribbean Zone",
      severity: "success",
    },
  ]);

  const getActivityIcon = (type) => {
    switch (type) {
      case "debris":
        return "🗑️";
      case "oil":
        return "🛢️";
      case "cleanup":
        return "✅";
      default:
        return "📌";
    }
  };

  const getSeverityClass = (severity) => {
    return `severity-${severity}`;
  };

  return (
    <div className="dashboard-home">
      {/* Welcome Banner */}
      <section className="welcome-banner">
        <div className="welcome-content">
          <h1 className="welcome-title">
            Welcome back, {userRole === "authority" ? "Authority" : "Monitor"}!
            
          </h1>
          <p className="welcome-subtitle">
            Here's what's happening with ocean monitoring today
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="stats-grid">
        <div className="stat-card debris-card">
          <div className="stat-content">
            <p className="stat-label">Debris Detected</p>
            <h3 className="stat-number">{stats.debrisDetected}</h3>
            
          </div>
          <div className="stat-decoration"></div>
        </div>

        <div className="stat-card oil-card">
          <div className="stat-content">
            <p className="stat-label">Oil Spillages</p>
            <h3 className="stat-number">{stats.oilSpillages}</h3>
            
          </div>
          <div className="stat-decoration"></div>
        </div>

        <div className="stat-card alert-card">
          <div className="stat-content">
            <p className="stat-label">Alerts Sent</p>
            <h3 className="stat-number">{stats.alertsSent}</h3>
  
          </div>
          <div className="stat-decoration"></div>
        </div>

        <div className="stat-card cleanup-card">
          <div className="stat-content">
            <p className="stat-label">Cleanups Done</p>
            <h3 className="stat-number">{stats.cleanupCompleted}</h3>
          </div>
          <div className="stat-decoration"></div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="content-grid">
        <div className="content-card map-container">
          <div className="card-header">
            <div className="card-title-section">
              <h2 className="card-title">Ocean Conditions Map</h2>
              <p className="card-subtitle">
                Real-time wind, current and wave direction for monitored areas
              </p>
            </div>
            <button className="btn-icon" title="Fullscreen">
              <span>⛶</span>
            </button>
          </div>
          <div className="card-body">
            <div className="map-wrapper">
              <TrajectoryMap
                latitude={45.1234}
                longitude={-120.4567}
                type="debris"
              />
            </div>
            <div className="map-legend">
              <div className="legend-item">
                <span className="legend-icon wind">→</span>
                <span>Wind Direction</span>
              </div>
              <div className="legend-item">
                <span className="legend-icon current">~</span>
                <span>Ocean Current</span>
              </div>
              <div className="legend-item">
                <span className="legend-icon wave">≈</span>
                <span>Wave Direction</span>
              </div>
            </div>
          </div>
        </div>

        <div className="content-card activity-container">
          <div className="card-header">
            <div className="card-title-section">
              <h2 className="card-title">Recent Activity</h2>
              <p className="card-subtitle">Latest detections and updates</p>
            </div>
            <button className="btn-link">View All</button>
          </div>
          <div className="card-body">
            <div className="activity-list">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className={`activity-item ${getSeverityClass(
                    activity.severity
                  )}`}
                >
                  <div className="activity-icon-wrapper">
                    <span className="activity-icon">
                      {getActivityIcon(activity.type)}
                    </span>
                  </div>
                  <div className="activity-details">
                    <p className="activity-message">{activity.message}</p>
                    <div className="activity-meta">
                      <span className="activity-location">
                        📍 {activity.location}
                      </span>
                      <span className="activity-time">
                        🕒 {activity.timestamp}
                      </span>
                    </div>
                  </div>
                  <div className="activity-arrow">→</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

  

      {/* Monitor Section */}
      {userRole !== "authority" && (
        <section className="monitor-section">
          <div className="content-card quick-actions-card">
            <div className="card-header">
              <div className="card-title-section">
                <h2 className="card-title">Quick Actions</h2>
                <p className="card-subtitle">
                  Start monitoring ocean conditions
                </p>
              </div>
            </div>
            <div className="card-body">
              <div className="quick-actions-grid">
                <button className="quick-action-btn debris-action">
                  <span className="action-icon">🗑️</span>
                  <span className="action-label">Detect Debris</span>
                  <span className="action-arrow">→</span>
                </button>
                <button className="quick-action-btn oil-action">
                  <span className="action-icon">🛢️</span>
                  <span className="action-label">Detect Oil Spillage</span>
                  <span className="action-arrow">→</span>
                </button>
                <button className="quick-action-btn report-action">
                  <span className="action-icon">📊</span>
                  <span className="action-label">View Reports</span>
                  <span className="action-arrow">→</span>
                </button>
                <button className="quick-action-btn history-action">
                  <span className="action-icon">📜</span>
                  <span className="action-label">Detection History</span>
                  <span className="action-arrow">→</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
