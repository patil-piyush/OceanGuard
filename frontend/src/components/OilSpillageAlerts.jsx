"use client";

import "../styles/alerts.css";

export default function OilSpillageAlerts({ detections, onViewReport }) {
  const groupedByDate = detections.reduce((acc, detection) => {
    const date = detection.reportedAt.split(",")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(detection);
    return acc;
  }, {});

  return (
    <div className="alerts-container">
      <div className="alerts-header oil-alerts-header">
        <div className="header-content">
          <h1 className="alerts-title">Oil Spillage Alerts</h1>
          <p className="alerts-subtitle">
            Monitor and manage oil spillage detection alerts from environmental
            monitors
          </p>
        </div>
      </div>

      <div className="alerts-summary">
        <div className="summary-card total-card oil-total-card">
          <div className="summary-content">
            <span className="summary-label">Total Alerts</span>
            <span className="summary-value">{detections.length}</span>
          </div>
        </div>
        <div className="summary-card pending-card oil-pending-card">
          <div className="summary-content">
            <span className="summary-label">Pending</span>
            <span className="summary-value">
              {detections.filter((d) => d.status === "pending").length}
            </span>
          </div>
        </div>
        <div className="summary-card resolved-card oil-resolved-card">
          <div className="summary-content">
            <span className="summary-label">Resolved</span>
            <span className="summary-value">
              {detections.filter((d) => d.status === "cleaned").length}
            </span>
          </div>
        </div>
      </div>

      {detections.length > 0 ? (
        <div className="alerts-list">
          {Object.entries(groupedByDate)
            .reverse()
            .map(([date, dayDetections]) => (
              <div key={date} className="alerts-group">
                <div className="date-header oil-date-header">
                  <h3 className="date-title">{date}</h3>
                  <span className="date-count oil-date-count">
                    {dayDetections.length} alerts
                  </span>
                </div>
                <div className="alerts-grid">
                  {dayDetections.map((detection) => (
                    <div
                      key={detection.id}
                      className={`alert-card oil-alert-card status-${detection.status}`}
                    >
                      <div className="alert-header">
                        <div className="alert-type">
                          <h4 className="type-name">{detection.type}</h4>
                        </div>
                        <div
                          className={`status-badge oil-status-badge status-${detection.status}`}
                        >
                          <span className="status-dot"></span>
                          {detection.status}
                        </div>
                      </div>

                      <div className="alert-meta oil-alert-meta">
                        <div className="meta-item">
                          <span className="meta-icon">🕒</span>
                          <span className="meta-text">
                            {detection.reportedAt}
                          </span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-icon">👤</span>
                          <span className="meta-text">
                            {detection.reportedBy}
                          </span>
                        </div>
                      </div>

                      <div className="alert-details oil-alert-details">
                        <div className="detail-item">
                          <span className="detail-label">Confidence</span>
                          <div className="confidence-display">
                            <div className="confidence-bar">
                              <div
                                className="confidence-fill oil-confidence-fill"
                                style={{ width: `${detection.confidence}%` }}
                              ></div>
                            </div>
                            <span className="confidence-value">
                              {detection.confidence}%
                            </span>
                          </div>
                        </div>

                        <div className="detail-item">
                          <span className="detail-label">Severity</span>
                          <span
                            className={`severity-badge oil-severity-badge severity-${detection.severity.toLowerCase()}`}
                          >
                            <span className="severity-icon">
                              {detection.severity === "Critical"
                                ? "🔴"
                                : detection.severity === "High"
                                ? "🟠"
                                : detection.severity === "Medium"
                                ? "🟡"
                                : "🟢"}
                            </span>
                            {detection.severity}
                          </span>
                        </div>

                        <div className="detail-item">
                          <span className="detail-label">Location</span>
                          <span className="location-value">
                            20.104000°N, 74.402700°W
                          </span>
                        </div>
                      </div>

                      <button
                        className="view-report-btn oil-view-report-btn"
                        onClick={() => onViewReport(detection)}
                      >
                        <span className="btn-icon">📄</span>
                        View Full Report
                        <span className="btn-arrow">→</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="no-alerts oil-no-alerts">
          <div className="no-alerts-icon">🔍</div>
          <h3 className="no-alerts-title">No Oil Spillage Alerts</h3>
          <p className="no-alerts-text">
            There are no oil spillage alerts at the moment. New detections will
            appear here.
          </p>
        </div>
      )}
    </div>
  );
}
