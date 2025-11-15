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
      lat: alert.location.latitude,
      lon: alert.location.longitude,
    },
    {
      time: "1 hour",
      lat: Number.parseFloat(alert.location.latitude) + 0.02,
      lon: Number.parseFloat(alert.location.longitude) + 0.01,
    },
    {
      time: "2 hours",
      lat: Number.parseFloat(alert.location.latitude) + 0.04,
      lon: Number.parseFloat(alert.location.longitude) + 0.02,
    },
    {
      time: "6 hours",
      lat: Number.parseFloat(alert.location.latitude) + 0.1,
      lon: Number.parseFloat(alert.location.longitude) + 0.05,
    },
    {
      time: "12 hours",
      lat: Number.parseFloat(alert.location.latitude) + 0.18,
      lon: Number.parseFloat(alert.location.longitude) + 0.1,
    },
    {
      time: "24 hours",
      lat: Number.parseFloat(alert.location.latitude) + 0.35,
      lon: Number.parseFloat(alert.location.longitude) + 0.2,
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
      // Fallback: log to console (caller can provide behavior)
      console.log("Show trajectory clicked for alert:", alert.id || alert);
    }
  };

  return (
    <div className="report-overlay">
      <div className="report-modal">
        <div className="report-header">
          <h2>{alert.type} - Detailed Report</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="report-content">
          <div className="report-section">
            <h3>Detection Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Detection Date:</span>
                <span className="value">{alert.detectionDate}</span>
              </div>
              <div className="info-item">
                <span className="label">Reported By:</span>
                <span className="value">
                  {alert.reportedBy} ({alert.reportedByEmail})
                </span>
              </div>
              <div className="info-item">
                <span className="label">User Score:</span>
                <span className="value">
                  {typeof alert.userScore !== "undefined" &&
                  alert.userScore !== null
                    ? alert.userScore
                    : "85%"}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Confidence Level:</span>
                <span className="value confidence">{alert.confidence}%</span>
              </div>
              <div className="info-item">
                <span className="label">Severity:</span>
                <span
                  className={`value severity-${alert.severity.toLowerCase()}`}
                >
                  {alert.severity}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Status:</span>
                <span className={`value status-${alert.status}`}>
                  {alert.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="report-section">
            <h3>Location Details</h3>
            <div className="location-info">
              <div className="coordinates">
                <p>
                  <strong>Latitude:</strong>{" "}
                  {alert.location.latitude.toFixed(6)}
                </p>
                <p>
                  <strong>Longitude:</strong>{" "}
                  {alert.location.longitude.toFixed(6)}
                </p>
              </div>
              <div className="map-placeholder">
                <p>
                  📍 Location: {alert.location.latitude.toFixed(4)}°,{" "}
                  {alert.location.longitude.toFixed(4)}°
                </p>
              </div>
            </div>
          </div>

          <div className="report-section">
            <h3>Captured Image</h3>
            <div className="image-container">
              {(() => {
                // Prefer dd.jpg for plastic debris reports
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

              {alert.description && (
                <p className="image-description">
                  <strong>Description:</strong> {alert.description}
                </p>
              )}
            </div>
          </div>

          <div className="report-section">
            <h3>Future Trajectory Prediction</h3>
            <button
              className="trajectory-toggle"
              onClick={() => setShowTrajectory(!showTrajectory)}
            >
              {showTrajectory ? "▼" : "▶"} Predicted Movement Path
            </button>

            {showTrajectory && (
              <div className="trajectory-data">
                <p className="trajectory-info">
                  Based on ocean currents, wind direction, and wave patterns
                </p>
                <div className="trajectory-table">
                  <div className="trajectory-header">
                    <div className="col">Time Frame</div>
                    <div className="col">Latitude</div>
                    <div className="col">Longitude</div>
                    <div className="col">Direction</div>
                  </div>
                  {trajectoryData.map((point, idx) => (
                    <div key={idx} className="trajectory-row">
                      <div className="col">{point.time}</div>
                      <div className="col">{point.lat.toFixed(4)}°</div>
                      <div className="col">{point.lon.toFixed(4)}°</div>
                      <div className="col">Northeast ↗</div>
                    </div>
                  ))}
                </div>
                <p className="trajectory-warning">
                  ⚠️ Predictions based on current ocean conditions. Update as
                  conditions change.
                </p>
              </div>
            )}

            <div style={{ marginTop: "0.75rem" }}>
              <button
                className="show-trajectory-btn"
                onClick={handleShowTrajectory}
              >
                Show trajectory
              </button>
            </div>
          </div>

          {alert.status === "pending" && (
            <div className="report-section">
              <h3>Authority Response & Cleanup Status</h3>
              <div className="response-form">
                <label>Send Response to Reporter:</label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Enter your response here. E.g., 'We have dispatched a cleanup team to the location. ETA: 2 hours' or 'Investigation in progress...'"
                  rows="4"
                />
                <p className="textarea-hint">
                  This message will be sent to {alert.reportedBy}
                </p>

                <div className="action-buttons">
                  <button
                    className="mark-clean-btn"
                    onClick={handleMarkAsClean}
                  >
                    Mark as Cleaned & Send Response
                  </button>
                  <button className="cancel-btn" onClick={onClose}>
                    Close Report
                  </button>
                </div>
              </div>
            </div>
          )}

          {alert.status === "cleaned" && (
            <div className="report-section cleaned-section">
              <h3>Cleanup Completed</h3>
              <div className="cleaned-info">
                <p>
                  <strong>Cleaned By:</strong> {alert.cleanedBy}
                </p>
                <p>
                  <strong>Date:</strong> {alert.cleanedAt}
                </p>
                <p>
                  <strong>Authority Response:</strong> {alert.authorityResponse}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
