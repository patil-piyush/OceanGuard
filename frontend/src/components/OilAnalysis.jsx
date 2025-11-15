"use client";

import { useState } from "react";
import "../styles/analysis.css";

export default function OilAnalysis({ result, userRole, onClose }) {
  const [alertSent, setAlertSent] = useState(false);

  const handleSendAlert = () => {
    // Simulate sending alert to authorities
    setTimeout(() => {
      setAlertSent(true);
      console.log("Oil spillage alert sent to authorities:", {
        image: result.imageUrl,
        location: result.coordinates,
        severity: result.severity,
        area: result.affectedArea,
      });
    }, 1000);
  };

  // report generation removed; only send alert is supported

  return (
    <div className="analysis-panel">
      <button className="btn-close" onClick={onClose}>
        ✕
      </button>

      <h3>Oil Spillage Analysis</h3>

      {/* Image Display */}
      <div className="analysis-image">
        <a
          href={result.imageUrl || "/placeholder.svg"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={result.imageUrl || "/placeholder.svg"} alt="Oil spillage" />
        </a>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <div className="result-item">
          <span className="result-label">Spillage Type</span>
          <span className="result-value">{result.spillageType}</span>
        </div>
        <div className="result-item">
          <span className="result-label">Severity</span>
          <span
            className={`result-value severity-${result.severity.toLowerCase()}`}
          >
            {result.severity}
          </span>
        </div>
        <div className="result-item">
          <span className="result-label">Affected Area</span>
          <span className="result-value">{result.affectedArea}</span>
        </div>
        <div className="result-item">
          <span className="result-label">Location</span>
          <span className="result-value">{result.coordinates}</span>
        </div>
        <div className="result-item">
          <span className="result-label">Confidence</span>
          <span className="result-value confidence-high">
            {result.confidence}%
          </span>
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="impact-box">
        <h4>Environmental Impact</h4>
        <p>{result.environmentalImpact}</p>
      </div>

      {/* Suggestions */}
      <div className="suggestions">
        <h4>Action Items</h4>
        <ul>
          {result.suggestions.map((suggestion, idx) => (
            <li key={idx}>{suggestion}</li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className="btn-alert"
          onClick={handleSendAlert}
          disabled={alertSent}
        >
          {alertSent ? "✓ Alert Sent" : "🚨 Alert Authorities"}
        </button>
      </div>

      {alertSent && (
        <div className="alert-confirmation">
          <p>✓ Emergency alert sent to environmental authorities with:</p>
          <ul>
            <li>High-resolution satellite imagery</li>
            <li>Precise geographic coordinates</li>
            <li>Severity assessment and affected area</li>
            <li>Predicted 24-hour spill trajectory</li>
            <li>Environmental hazard evaluation</li>
          </ul>
        </div>
      )}
    </div>
  );
}
