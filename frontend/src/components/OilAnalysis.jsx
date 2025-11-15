"use client";

import { useState } from "react";
import "../styles/analysis.css";

export default function OilAnalysis({ result, userRole, onClose }) {
  const [alertSent, setAlertSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSendAlert = () => {
    setIsSending(true);
    // Simulate sending alert to authorities
    setTimeout(() => {
      setAlertSent(true);
      setIsSending(false);
      console.log("Oil spillage alert sent to authorities:", {
        image: result.imageUrl,
        location: result.coordinates,
        severity: result.severity,
        area: result.affectedArea,
      });
    }, 1500);
  };

  return (
    <div className="analysis-panel">
      <div className="analysis-header">
        <div className="analysis-title-section">

          <div className="analysis-title-text">
            <h3>Oil Spillage Analysis</h3>
            <p>AI-powered oil spillage detection complete</p>
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
            Satellite Imagery
          </div>
          <div className="analysis-image">
            <a
              href={result.imageUrl || "/placeholder.svg"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={result.imageUrl || "/placeholder.svg"}
                alt="Oil spillage"
              />
            </a>
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
                <span className="result-label">Spillage Type</span>
                <span className="result-value">{result.spillageType}</span>
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

            <div className="result-card">
              <div className="result-icon-wrapper location-icon">
                <span className="result-icon">📏</span>
              </div>
              <div className="result-details">
                <span className="result-label">Affected Area</span>
                <span className="result-value">{result.affectedArea}</span>
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
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="analysis-section">
          <div className="section-label">
            Environmental Impact
          </div>
          <div className="impact-box">
            
            <p className="impact-text">{result.environmentalImpact}</p>
          </div>
        </div>

        {/* Suggestions */}
        <div className="analysis-section">
          <div className="section-label">
            Critical Action Items
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
                  Sending Emergency Alert...
                </>
              ) : alertSent ? (
                <>
                  <span className="btn-icon">✓</span>
                  Emergency Alert Sent
                </>
              ) : (
                <>
                  Send Emergency Alert
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
              <h4>Emergency Alert Sent Successfully</h4>
            </div>
            <p className="confirmation-message">
              Environmental authorities and hazmat teams have been notified with
              the following critical information:
            </p>
            <ul className="confirmation-list">
              <li>
                <span className="list-icon">🛰️</span>
                <span>High-resolution satellite imagery</span>
              </li>
              <li>
                <span className="list-icon">📍</span>
                <span>Precise geographic coordinates</span>
              </li>
              <li>
                <span className="list-icon">📏</span>
                <span>Severity assessment and affected area</span>
              </li>
              <li>
                <span className="list-icon">🗺️</span>
                <span>Predicted 24-hour spill trajectory</span>
              </li>
              <li>
                <span className="list-icon">🌊</span>
                <span>Environmental hazard evaluation</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
