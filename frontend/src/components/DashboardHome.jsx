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
      message: "Plastic debris detected",
      timestamp: "2 hours ago",
      location: "Gulf Coast",
    },
    {
      id: 2,
      type: "oil",
      message: "Oil spillage alert sent",
      timestamp: "4 hours ago",
      location: "Atlantic Waters",
    },
    {
      id: 3,
      type: "debris",
      message: "Mixed debris identified",
      timestamp: "6 hours ago",
      location: "Pacific Region",
    },
    {
      id: 4,
      type: "cleanup",
      message: "Cleanup marked complete",
      timestamp: "8 hours ago",
      location: "Caribbean Zone",
    },
  ]);

  return (
    <div className="dashboard-home">
      <section className="stats-grid">
        <div className="stat-box">
          <div className="stat-icon debris-icon">🗑️</div>
          <div className="stat-content">
            <h3>Debris Detected</h3>
            <p className="stat-number">{stats.debrisDetected}</p>
            <small>This month</small>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon oil-icon">🛢️</div>
          <div className="stat-content">
            <h3>Oil Spillages</h3>
            <p className="stat-number">{stats.oilSpillages}</p>
            <small>This month</small>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon alert-icon">🚨</div>
          <div className="stat-content">
            <h3>Alerts Sent</h3>
            <p className="stat-number">{stats.alertsSent}</p>
            <small>This month</small>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon cleanup-icon">✅</div>
          <div className="stat-content">
            <h3>Cleanups Done</h3>
            <p className="stat-number">{stats.cleanupCompleted}</p>
            <small>This month</small>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="card">
          <h2>Ocean Conditions Map</h2>
          <p className="small">
            Wind, current and wave direction preview for the monitored area
          </p>
          <div className="map-card">
            {/* Provide a default location; in production this could be user-configurable */}
            <TrajectoryMap
              latitude={45.1234}
              longitude={-120.4567}
              type="debris"
            />
          </div>
        </div>

        <div className="card">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <span className="activity-icon">
                  {activity.type === "debris" && "🗑️"}
                  {activity.type === "oil" && "🛢️"}
                  {activity.type === "cleanup" && "✅"}
                </span>
                <div className="activity-details">
                  <p className="activity-message">{activity.message}</p>
                  <small className="activity-meta">
                    {activity.location} • {activity.timestamp}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {userRole === "authority" && (
        <section className="authority-section">
          <div className="card">
            <h2>Pending Cleanups</h2>
            <div className="cleanup-list">
              <div className="cleanup-item">
                <div className="cleanup-header">
                  <h4>Plastic Debris - Gulf Coast</h4>
                  <span className="status-badge pending">Pending</span>
                </div>
                <p className="cleanup-details">
                  Detected at 45.123°N, 120.456°W • Confidence: 94%
                </p>
                <div className="cleanup-actions">
                  <button className="btn-small btn-complete">
                    Mark as Complete
                  </button>
                  <button className="btn-small btn-dismiss">Dismiss</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
