"use client";

import { useState } from "react";
import "../styles/analysis.css";

export default function DebrisAnalysis({ result, userRole, onClose }) {
  const [alertSent, setAlertSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSendAlert = () => {
    setIsSending(true);
    // Simulate sending alert to authorities
    setTimeout(() => {
      setAlertSent(true);
      setIsSending(false);
      console.log("Alert sent to nearby authorities:", {
        image: result.imageUrl,
        location: result.coordinates,
        severity: result.severity,
        type: result.debrisType,
      });
    }, 1500);
  };

  return (
    <div className="analysis-panel">
      <div className="analysis-header">
        <div className="analysis-title-section">
          
          <div className="analysis-title-text">
            <h3>Analysis Result</h3>
            <p>AI-powered debris detection complete</p>
          </div>
        </div>
        <button
          className="btn-close"
          onClick={onClose}
          aria-label="Close analysis"
        >
          <span className="close-icon">✕</span>
        </button>
      </div>

      <div className="analysis-content">
        {/* Image Display */}
        <div className="analysis-section">
          <div className="section-label">
            Analyzed Image
          </div>
          <div className="analysis-image">
            <img src={"/assets/dd.jpg"} alt="Analyzed debris" />
            <div className="image-overlay">
              <span className="overlay-badge">
                <span className="badge-icon">✓</span>
                Analyzed
              </span>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="analysis-section">
          <div className="section-label">
            Detection Summary
          </div>
          <div className="results-summary">
            <div className="result-card">
              
              <div className="result-details">
                <span className="result-label">Debris Type</span>
                <span className="result-value">{result.debrisType}</span>
              </div>
            </div>

            <div className="result-card">
              
              <div className="result-details">
                <span className="result-label">Confidence Level</span>
                <div className="confidence-display">
                  <div className="confidence-bar-analysis">
                    <div
                      className={`confidence-fill-analysis confidence-${
                        result.confidence > 90 ? "high" : "medium"
                      }`}
                      style={{ width: `${result.confidence}%` }}
                    ></div>
                  </div>
                  <span
                    className={`confidence-value-analysis confidence-${
                      result.confidence > 90 ? "high" : "medium"
                    }`}
                  >
                    {result.confidence}%
                  </span>
                </div>
              </div>
            </div>

            <div className="result-card">
              
              <div className="result-details">
                <span className="result-label">Location</span>
                <span className="result-value location-value">
                  {result.coordinates}
                </span>
              </div>
            </div>

            <div className="result-card">
              
              <div className="result-details">
                <span className="result-label">Severity Level</span>
                <span
                  className={`severity-badge-analysis severity-${result.severity.toLowerCase()}`}
                >
                  <span className="severity-dot"></span>
                  {result.severity}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="analysis-section">
          <div className="section-label">
            Recommended Next Steps
          </div>
          <div className="suggestions">
            <ul className="suggestions-list">
              {result.suggestions.map((suggestion, idx) => (
                <li key={idx} className="suggestion-item">
                  <span className="suggestion-icon">→</span>
                  <span className="suggestion-text">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="analysis-section">
          <div className="action-buttons">
            <button
              className={`btn-alert ${alertSent ? "alert-sent" : ""} ${
                isSending ? "sending" : ""
              }`}
              onClick={handleSendAlert}
              disabled={alertSent || isSending}
            >
              {isSending ? (
                <>
                  <span className="btn-spinner"></span>
                  Sending Alert...
                </>
              ) : alertSent ? (
                <>
                  <span className="btn-icon">✓</span>
                  Alert Sent Successfully
                </>
              ) : (
                <>
                  Alert Authorities
                </>
              )}
            </button>
          </div>
        </div>

        {/* Alert Confirmation */}
        {alertSent && (
          <div className="alert-confirmation">
            <div className="confirmation-header">
              <div className="confirmation-icon-wrapper">
                <span className="confirmation-icon">✓</span>
              </div>
              <h4>Alert Successfully Sent</h4>
            </div>
            <p className="confirmation-message">
              Nearby environmental authorities have been notified with the
              following information:
            </p>
            <ul className="confirmation-list">
              <li>
                <span className="list-icon">📸</span>
                <span>Debris image and AI analysis results</span>
              </li>
              <li>
                <span className="list-icon">📍</span>
                <span>Exact location coordinates</span>
              </li>
              <li>
                <span className="list-icon">🗺️</span>
                <span>Predicted movement trajectory</span>
              </li>
              <li>
                <span className="list-icon">⚠️</span>
                <span>Severity assessment and recommendations</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
