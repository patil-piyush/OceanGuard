"use client"

import { useState } from "react"
import { getHistoryByUser } from "../utils/alertService"
import "../styles/history.css"

export default function UserHistory({ userId }) {
  const [historyData] = useState(getHistoryByUser(userId))
  const [filterType, setFilterType] = useState("all")

  const filteredHistory =
    filterType === "all" ? historyData : historyData.filter((item) => item.action.includes(filterType))

  const getActionIcon = (action) => {
    switch (action) {
      case "DETECTION_COMPLETED":
        return "✓"
      case "ALERT_SENT":
        return "📤"
      case "REPORT_GENERATED":
        return "📄"
      case "CLEANUP_MARKED":
        return "✅"
      default:
        return "•"
    }
  }

  return (
    <div className="history-container">
      <h3>Activity History</h3>

      <div className="filter-bar">
        <button className={`filter-btn ${filterType === "all" ? "active" : ""}`} onClick={() => setFilterType("all")}>
          All Activities
        </button>
        <button
          className={`filter-btn ${filterType === "DETECTION" ? "active" : ""}`}
          onClick={() => setFilterType("DETECTION")}
        >
          Detections
        </button>
        <button
          className={`filter-btn ${filterType === "ALERT" ? "active" : ""}`}
          onClick={() => setFilterType("ALERT")}
        >
          Alerts
        </button>
        <button
          className={`filter-btn ${filterType === "CLEANUP" ? "active" : ""}`}
          onClick={() => setFilterType("CLEANUP")}
        >
          Cleanup
        </button>
      </div>

      <div className="history-timeline">
        {filteredHistory.map((item, idx) => (
          <div key={item.id} className="history-item">
            <div className="item-marker">
              <span className="marker-icon">{getActionIcon(item.action)}</span>
              {idx < filteredHistory.length - 1 && <div className="marker-line" />}
            </div>
            <div className="item-content">
              <div className="item-header">
                <span className="action-type">{item.action.replace(/_/g, " ")}</span>
                <span className={`result-badge ${item.result}`}>{item.result.toUpperCase()}</span>
              </div>
              <p className="item-details">
                {item.type && `Type: ${item.type}`}
                {item.location && ` • Location: ${item.location}`}
                {item.authorities && ` • Authorities Notified: ${item.authorities}`}
              </p>
              <span className="item-timestamp">{item.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
