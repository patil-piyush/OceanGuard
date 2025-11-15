"use client"

import "../styles/alerts.css"

export default function OilSpillageAlerts({ detections, onViewReport }) {
  const groupedByDate = detections.reduce((acc, detection) => {
    const date = detection.reportedAt.split(",")[0]
    if (!acc[date]) acc[date] = []
    acc[date].push(detection)
    return acc
  }, {})

  return (
    <div className="alerts-container">
      <h1>Oil Spillage Alerts</h1>

      <div className="alerts-summary">
        <div className="summary-stat critical">
          <span className="label">Critical Alerts:</span>
          <span className="value">{detections.length}</span>
        </div>
        <div className="summary-stat">
          <span className="label">Pending:</span>
          <span className="value">{detections.filter((d) => d.status === "pending").length}</span>
        </div>
        <div className="summary-stat">
          <span className="label">Resolved:</span>
          <span className="value">{detections.filter((d) => d.status === "cleaned").length}</span>
        </div>
      </div>

      {detections.length > 0 ? (
        <div className="alerts-list">
          {Object.entries(groupedByDate)
            .reverse()
            .map(([date, dayDetections]) => (
              <div key={date} className="alerts-group">
                <h3 className="date-header critical">{date}</h3>
                {dayDetections.map((detection) => (
                  <div key={detection.id} className={`alert-card status-${detection.status} oil-spillage`}>
                    <div className="alert-header">
                      <div className="alert-info">
                        <h4>⚠️ {detection.type}</h4>
                        <p className="alert-meta">
                          {detection.reportedAt} | By: {detection.reportedBy}
                        </p>
                      </div>
                      <div className={`status-badge status-${detection.status}`}>{detection.status}</div>
                    </div>

                    <div className="alert-details">
                      <div className="detail-item">
                        <span className="label">Confidence:</span>
                        <span className="value">{detection.confidence}%</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Severity:</span>
                        <span className={`value severity-${detection.severity.toLowerCase()}`}>
                          {detection.severity}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Location:</span>
                        <span className="value">
                          {detection.location.latitude.toFixed(4)}, {detection.location.longitude.toFixed(4)}
                        </span>
                      </div>
                    </div>

                    <button className="view-report-btn critical" onClick={() => onViewReport(detection)}>
                      View Full Report & Respond
                    </button>
                  </div>
                ))}
              </div>
            ))}
        </div>
      ) : (
        <div className="no-alerts">
          <p>No oil spillage alerts at the moment</p>
        </div>
      )}
    </div>
  )
}
