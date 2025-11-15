"use client";

import "../styles/alerts.css";

export default function DebrisAlerts({ detections, onViewReport }) {
  const groupedByDate = detections.reduce((acc, detection) => {
    const date = detection.reportedAt.split(",")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(detection);
    return acc;
  }, {});

  return (
    <div className="alerts-container">
      <div className="alerts-header">
        <div className="header-content">
          <h1 className="alerts-title">
            Debris Alerts
          </h1>
          <p className="alerts-subtitle">
            Monitor and manage debris detection alerts from environmental
            monitors
          </p>
        </div>
      </div>

      <div className="alerts-summary">
        <div className="summary-card total-card">
          
          <div className="summary-content">
            <span className="summary-label">Total Alerts</span>
            <span className="summary-value">{detections.length}</span>
          </div>
        </div>
        <div className="summary-card pending-card">
          
          <div className="summary-content">
            <span className="summary-label">Pending</span>
            <span className="summary-value">
              {detections.filter((d) => d.status === "pending").length}
            </span>
          </div>
        </div>
        <div className="summary-card resolved-card">
          
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
                <div className="date-header">
                  <h3 className="date-title">{date}</h3>
                  <span className="date-count">
                    {dayDetections.length} alerts
                  </span>
                </div>
                <div className="alerts-grid">
                  {dayDetections.map((detection) => (
                    <div
                      key={detection.id}
                      className={`alert-card status-${detection.status}`}
                    >
                      <div className="alert-header">
                        <div className="alert-type">
                          <h4 className="type-name">{detection.type}</h4>
                        </div>
                        <div
                          className={`status-badge status-${detection.status}`}
                        >
                          <span className="status-dot"></span>
                          {detection.status}
                        </div>
                      </div>

                      <div className="alert-meta">
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

                      <div className="alert-details">
                        <div className="detail-item">
                          <span className="detail-label">
                            Confidence
                          </span>
                          <div className="confidence-display">
                            <div className="confidence-bar">
                              <div
                                className="confidence-fill"
                                style={{ width: `${detection.confidence}%` }}
                              ></div>
                            </div>
                            <span className="confidence-value">
                              {detection.confidence}%
                            </span>
                          </div>
                        </div>

                        <div className="detail-item">
                          <span className="detail-label">
                            Severity
                          </span>
                          <span
                            className={`severity-badge severity-${detection.severity.toLowerCase()}`}
                          >
                            {detection.severity}
                          </span>
                        </div>

                        <div className="detail-item">
                          <span className="detail-label">
                            Location
                          </span>
                          <span className="location-value">
                            20.104000°N,{" "}
                            74.402700°W
                          </span>
                        </div>
                      </div>

                      <button
                        className="view-report-btn"
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
        <div className="no-alerts">
          <div className="no-alerts-icon">🔍</div>
          <h3 className="no-alerts-title">No Debris Alerts</h3>
          <p className="no-alerts-text">
            There are no debris alerts at the moment. New detections will appear
            here.
          </p>
        </div>
      )}
    </div>
  );
}
