"use client";

import { useState } from "react";
import "../styles/report.css";

export default function AlertReport({
  alert,
  onClose,
  onMarkAsClean,
  onShowTrajectory,
}) {
  const [responseText, setResponseText] = useState("");
  const [showTrajectory, setShowTrajectory] = useState(false);

  const HARDCODED_OIL_IMAGE = "/assets/doil.jpg";

  // Mock trajectory data for different time intervals
  const trajectoryData = [
    {
      time: "Now",
      lat: 20.104,
      lon: 74.4027,
    },
    {
      time: "1 hour",
      lat: 20.104 + 1.02,
      lon: 74.4027 + 1.01,
    },
    {
      time: "2 hours",
      lat: 20.104 + 2.04,
      lon: 74.4027 + 0.02,
    },
    {
      time: "6 hours",
      lat: 20.104 + 0.1,
      lon: 74.4027 + 0.05,
    },
    {
      time: "12 hours",
      lat: 20.104 + 1.18,
      lon: 74.4027 + 0.1,
    },
    {
      time: "24 hours",
      lat: 20.104 + 0.35,
      lon: 74.4027 + 2.2,
    },
  ];
  const handleMarkAsClean = () => {
    if (!responseText.trim()) {
      alert("Please enter a response before marking as clean");
      return;
    }
    onMarkAsClean(alert.id, responseText);
  };

  const handleShowTrajectory = () => {
    if (typeof onShowTrajectory === "function") {
      onShowTrajectory(alert);
    } else {
      console.log("Show trajectory clicked for alert:", alert.id || alert);
    }
  };

  // Determine icon based on type
  const getTypeIcon = () => {
    const typeString = (alert.type || alert.spillageType || "")
      .toString()
      .toLowerCase();
    if (typeString.includes("oil") || typeString.includes("slick")) {
      return "🛢️";
    }
    return "🗑️";
  };

  return (
    <div className="report-overlay">
      <div className="report-modal">
        <div className="report-header">
          <div className="header-content">
            <span className="header-icon">{getTypeIcon()}</span>
            <div className="header-text">
              <h2>{alert.type} - Detailed Report</h2>
              <span className={`status-pill status-${alert.status}`}>
                <span className="status-dot"></span>
                {alert.status.toUpperCase()}
              </span>
            </div>
          </div>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close report"
          >
            <span className="close-icon">✕</span>
          </button>
        </div>

        <div className="report-content">
          {/* Detection Information */}
          <div className="report-section">
            <div className="section-header">
              <h3>Detection Information</h3>
            </div>
            <div className="info-grid">
              <div className="info-card">
                <div className="info-details">
                  <span className="info-label">Detection Date</span>
                  <span className="info-value">{alert.detectionDate}</span>
                </div>
              </div>
              <div className="info-card">
                <div className="info-details">
                  <span className="info-label">Reported By</span>
                  <span className="info-value">{alert.reportedBy}</span>
                  <span className="info-subvalue">{alert.reportedByEmail}</span>
                </div>
              </div>
              <div className="info-card">
                <div className="info-details">
                  <span className="info-label">User Score</span>
                  <span className="info-value">
                    {typeof alert.userScore !== "undefined" &&
                    alert.userScore !== null
                      ? alert.userScore
                      : "85%"}
                  </span>
                </div>
              </div>
              <div className="info-card">
                <div className="info-details">
                  <span className="info-label">Confidence Level</span>
                  <div className="confidence-display-report">
                    <div className="confidence-bar-report">
                      <div
                        className="confidence-fill-report"
                        style={{ width: `${alert.confidence}%` }}
                      ></div>
                    </div>
                    <span className="confidence-value-report">
                      {alert.confidence}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="info-card">
                <div className="info-details">
                  <span className="info-label">Severity</span>
                  <span
                    className={`severity-badge-report severity-${alert.severity.toLowerCase()}`}
                  >
                    <span className="severity-icon-report">
                      {alert.severity === "Critical"
                        ? "🔴"
                        : alert.severity === "High"
                        ? "🟠"
                        : alert.severity === "Medium"
                        ? "🟡"
                        : "🟢"}
                    </span>
                    {alert.severity}
                  </span>
                </div>
              </div>
              <div className="info-card">
                <div className="info-details">
                  <span className="info-label">Status</span>
                  <span
                    className={`status-badge-report status-${alert.status}`}
                  >
                    {alert.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="report-section">
            <div className="section-header">
              <h3>Location Details</h3>
            </div>
            <div className="location-card">
              <div className="coordinates-grid">
                <div className="coordinate-item">
                  <span className="coordinate-label">Latitude</span>
                  <span className="coordinate-value">
                    20.104000°N
                  </span>
                </div>
                <div className="coordinate-item">
                  <span className="coordinate-label">Longitude</span>
                  <span className="coordinate-value">
                    74.402700°W
                  </span>
                </div>
              </div>
              
            </div>
          </div>

          {/* Captured Image */}
          <div className="report-section">
            <div className="section-header">
              <h3>Captured Image</h3>
            </div>
            <div className="image-card">
              <div className="image-wrapper">
                {(() => {
                  const typeString = (
                    alert.type ||
                    alert.debrisType ||
                    alert.spillageType ||
                    ""
                  )
                    .toString()
                    .toLowerCase();
                  const debrisPlastic =
                    typeString.includes("plastic") ||
                    typeString.includes("debris");
                  const src = debrisPlastic
                    ? "/assets/dd.jpg"
                    : alert.image || HARDCODED_OIL_IMAGE;
                  return (
                    <img src={src} alt="Detection" className="report-image" />
                  );
                })()}
              </div>
              {alert.description && (
                <div className="image-description">
                  <p className="description-text">
                    <strong>Description:</strong> {alert.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Trajectory Prediction */}
          <div className="report-section">
            <div className="section-header">
              <h3>Future Trajectory Prediction</h3>
            </div>
            <div className="trajectory-section">
              <button
                className={`trajectory-toggle ${
                  showTrajectory ? "active" : ""
                }`}
                onClick={() => setShowTrajectory(!showTrajectory)}
              >
                <span className="toggle-icon">
                  {showTrajectory ? "▼" : "▶"}
                </span>
                <span className="toggle-text">Predicted Movement Path</span>
                <span className="toggle-badge">AI-Powered</span>
              </button>

              {showTrajectory && (
                <div className="trajectory-data">
                  <div className="trajectory-info-banner">
                    <p className="trajectory-info">
                      Based on ocean currents, wind direction, and wave patterns
                    </p>
                  </div>
                  <div className="trajectory-table-wrapper">
                    <table className="trajectory-table">
                      <thead>
                        <tr className="trajectory-header">
                          <th>Time Frame</th>
                          <th>Latitude</th>
                          <th>Longitude</th>
                          <th>Direction</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trajectoryData.map((point, idx) => (
                          <tr key={idx} className="trajectory-row">
                            <td className="time-cell">{point.time}</td>
                            <td className="coord-cell">
                              {point.lat.toFixed(4)}°
                            </td>
                            <td className="coord-cell">
                              {point.lon.toFixed(4)}°
                            </td>
                            <td className="direction-cell">
                              <span className="direction-badge">
                                <span className="direction-arrow">↗</span>
                                Northeast
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="trajectory-warning">
                    <p className="warning-text">
                      Predictions based on current ocean conditions. Update as
                      conditions change.
                    </p>
                  </div>
                </div>
              )}

              <button
                className="show-trajectory-btn"
                onClick={handleShowTrajectory}
              >
                Show Trajectory Map
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>

          {/* Authority Response */}
          {alert.status === "pending" && (
            <div className="report-section response-section">
              <div className="section-header">
                <h3>Authority Response & Cleanup Status</h3>
              </div>
              <div className="response-form">
                <label className="form-label">Send Response to Reporter</label>
                <textarea
                  className="response-textarea"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Enter your response here. E.g., 'We have dispatched a cleanup team to the location. ETA: 2 hours' or 'Investigation in progress...'"
                  rows="5"
                />
                <p className="textarea-hint">
                  This message will be sent to{" "}
                  <strong>{alert.reportedBy}</strong> at{" "}
                  <strong>{alert.reportedByEmail}</strong>
                </p>

                <div className="action-buttons">
                  <button
                    className="mark-clean-btn"
                    onClick={handleMarkAsClean}
                  >
                    <span className="btn-icon">✅</span>
                    Mark as Cleaned & Send Response
                  </button>
                  <button className="cancel-btn" onClick={onClose}>
                    <span className="btn-icon">✕</span>
                    Close Report
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Cleaned Section */}
          {alert.status === "cleaned" && (
            <div className="report-section cleaned-section">
              <div className="section-header">
                <h3>
                  <span className="section-icon">✅</span>
                  Cleanup Completed
                </h3>
              </div>
              <div className="cleaned-card">
                <div className="cleaned-icon-wrapper">
                  <span className="cleaned-icon">✅</span>
                </div>
                <div className="cleaned-details">
                  <div className="cleaned-item">
                    <span className="cleaned-label">
                      <span className="item-icon">👥</span>
                      Cleaned By
                    </span>
                    <span className="cleaned-value">{alert.cleanedBy}</span>
                  </div>
                  <div className="cleaned-item">
                    <span className="cleaned-label">
                      <span className="item-icon">📅</span>
                      Completion Date
                    </span>
                    <span className="cleaned-value">{alert.cleanedAt}</span>
                  </div>
                  <div className="cleaned-item full-width">
                    <span className="cleaned-label">
                      <span className="item-icon">💬</span>
                      Authority Response
                    </span>
                    <p className="cleaned-response">
                      {alert.authorityResponse}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
