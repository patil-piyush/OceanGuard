"use client";

import { useState } from "react";
import "../styles/analysis.css";

export default function DebrisAnalysis({ result, userRole, onClose }) {
  const [alertSent, setAlertSent] = useState(false);

  const handleSendAlert = () => {
    // Simulate sending alert to authorities
    setTimeout(() => {
      setAlertSent(true);
      console.log("Alert sent to nearby authorities:", {
        image: result.imageUrl,
        location: result.coordinates,
        severity: result.severity,
        type: result.debrisType,
      });
    }, 1000);
  };

  // report generation removed; only send alert is supported

  return (
    <div className="analysis-panel">
      <button className="btn-close" onClick={onClose}>
        ✕
      </button>

      <h3>Analysis Result</h3>

      {/* Image Display */}
      <div className="analysis-image">
        <img src={"/assets/dd.jpg"} alt="Analyzed debris" />
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <div className="result-item">
          <span className="result-label">Debris Type</span>
          <span className="result-value">{result.debrisType}</span>
        </div>
        <div className="result-item">
          <span className="result-label">Confidence</span>
          <span
            className={`result-value confidence-${
              result.confidence > 90 ? "high" : "medium"
            }`}
          >
            {result.confidence}%
          </span>
        </div>
        <div className="result-item">
          <span className="result-label">Location</span>
          <span className="result-value">{result.coordinates}</span>
        </div>
        <div className="result-item">
          <span className="result-label">Severity</span>
          <span
            className={`result-value severity-${result.severity.toLowerCase()}`}
          >
            {result.severity}
          </span>
        </div>
      </div>

      {/* Suggestions */}
      <div className="suggestions">
        <h4>Next Steps</h4>
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
          <p>✓ Alert has been sent to nearby environmental authorities with:</p>
          <ul>
            <li>Debris image and analysis</li>
            <li>Exact location coordinates</li>
            <li>Predicted movement trajectory</li>
            <li>Severity assessment</li>
          </ul>
        </div>
      )}
    </div>
  );
}
