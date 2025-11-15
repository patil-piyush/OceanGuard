"use client";

import { useState } from "react";
import "../styles/authority.css";

export default function AuthorityPanel() {
  const [pendingAlerts] = useState([
    {
      id: 1,
      type: "Plastic Debris",
      location: "45.123°N, 120.456°W",
      severity: "High",
      confidence: 92,
      detectedAt: "2025-11-11 14:30",
      reporter: "john.monitor@ocean.com",
    },
    {
      id: 2,
      type: "Oil Spill",
      location: "45.234°N, 120.567°W",
      severity: "Critical",
      confidence: 88,
      detectedAt: "2025-11-14 13:15",
      reporter: "jhondoe@edu.com",
    },
  ]);

  const [completedCleanups] = useState([
    {
      id: 1,
      type: "Plastic Debris",
      location: "45.012°N, 120.345°W",
      completedAt: "2025-11-10 18:30",
      team: "Cleanup Team A",
      quantity: "150 kg",
    },
    {
      id: 2,
      type: "Mixed Debris",
      location: "45.045°N, 120.378°W",
      completedAt: "2025-11-09 16:45",
      team: "Cleanup Team C",
      quantity: "240 kg",
    },
  ]);

  const handleCleanupComplete = (alertId) => {
    alert(
      `Marked cleanup for alert #${alertId} as complete. Report submitted.`
    );
  };

  return (
    <div className="authority-panel">
      <h3>Authority Management Dashboard</h3>

      <div className="panel-grid">
        {/* Pending Alerts */}
        <section className="panel-section">
          <h4>Pending Alerts</h4>
          <div className="alerts-list">
            {pendingAlerts.map((alert) => (
              <div key={alert.id} className="alert-card">
                <div className="alert-header">
                  <h5>{alert.type}</h5>
                  <span
                    className={`severity-badge ${alert.severity.toLowerCase()}`}
                  >
                    {alert.severity}
                  </span>
                </div>
                <div className="alert-details">
                  <p>
                    <strong>Location:</strong> {alert.location}
                  </p>
                  <p>
                    <strong>Confidence:</strong> {alert.confidence}%
                  </p>
                  <p>
                    <strong>Detected:</strong> {alert.detectedAt}
                  </p>
                  <p>
                    <strong>Reporter:</strong> {alert.reporter}
                  </p>
                </div>
                <div className="alert-actions">
                  <button className="btn-action btn-dispatch">
                    Dispatch Team
                  </button>
                  <button
                    className="btn-action btn-complete"
                    onClick={() => handleCleanupComplete(alert.id)}
                  >
                    Mark Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Completed Cleanups */}
        <section className="panel-section">
          <h4>Completed Cleanups (This Month)</h4>
          <div className="cleanups-list">
            {completedCleanups.map((cleanup) => (
              <div key={cleanup.id} className="cleanup-card">
                <div className="cleanup-header">
                  <h5>{cleanup.type}</h5>
                  <span className="cleanup-quantity">{cleanup.quantity}</span>
                </div>
                <div className="cleanup-details">
                  <p>
                    <strong>Location:</strong> {cleanup.location}
                  </p>
                  <p>
                    <strong>Team:</strong> {cleanup.team}
                  </p>
                  <p>
                    <strong>Completed:</strong> {cleanup.completedAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="stat-card">
          <div className="stat-label">Alerts This Month</div>
          <div className="stat-value">
            {pendingAlerts.length + completedCleanups.length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Cleaned</div>
          <div className="stat-value">390 kg</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Teams</div>
          <div className="stat-value">5</div>
        </div>
      </div>
    </div>
  );
}
