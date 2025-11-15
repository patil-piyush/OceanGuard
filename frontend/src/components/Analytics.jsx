"use client"

import { useState } from "react"
import "../styles/analytics.css"

export default function Analytics() {
  const [monthlyData] = useState([
    { month: "January", debris: 12, oil: 2, alerts: 5 },
    { month: "February", debris: 15, oil: 3, alerts: 7 },
    { month: "March", debris: 10, oil: 1, alerts: 3 },
    { month: "April", debris: 18, oil: 4, alerts: 9 },
    { month: "May", debris: 14, oil: 2, alerts: 6 },
    { month: "June", debris: 20, oil: 5, alerts: 11 },
    { month: "July", debris: 25, oil: 6, alerts: 14 },
    { month: "August", debris: 22, oil: 4, alerts: 12 },
    { month: "September", debris: 18, oil: 3, alerts: 8 },
    { month: "October", debris: 16, oil: 2, alerts: 7 },
    { month: "November", debris: 23, oil: 5, alerts: 13 },
  ])

  const maxDebris = Math.max(...monthlyData.map((d) => d.debris))
  const maxOil = Math.max(...monthlyData.map((d) => d.oil))

  return (
    <div className="analytics-container">
      <h3>Detection Analytics - Monthly Trends</h3>

      <div className="chart-container">
        <div className="chart-title">Debris Detected vs Oil Spillage Alerts</div>

        <div className="chart">
          {monthlyData.map((data, idx) => (
            <div key={idx} className="chart-bar-group">
              <div className="bar-column">
                <div className="bar-stack">
                  <div
                    className="bar bar-debris"
                    style={{ height: (data.debris / maxDebris) * 200 }}
                    title={`${data.month}: ${data.debris} debris detected`}
                  />
                </div>
                <div className="bar-stack">
                  <div
                    className="bar bar-oil"
                    style={{ height: (data.oil / maxOil) * 200 }}
                    title={`${data.month}: ${data.oil} oil spills`}
                  />
                </div>
              </div>
              <span className="month-label">{data.month.slice(0, 3)}</span>
            </div>
          ))}
        </div>

        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-box debris" />
            <span>Debris Detected</span>
          </div>
          <div className="legend-item">
            <span className="legend-box oil" />
            <span>Oil Spillage</span>
          </div>
          <div className="legend-item">
            <span className="legend-box alert" />
            <span>Alerts Sent</span>
          </div>
        </div>
      </div>

      <div className="summary-stats">
        <div className="stat">
          <div className="stat-number">{monthlyData.reduce((a, b) => a + b.debris, 0)}</div>
          <div className="stat-label">Total Debris Detected</div>
        </div>
        <div className="stat">
          <div className="stat-number">{monthlyData.reduce((a, b) => a + b.oil, 0)}</div>
          <div className="stat-label">Total Oil Spills</div>
        </div>
        <div className="stat">
          <div className="stat-number">{monthlyData.reduce((a, b) => a + b.alerts, 0)}</div>
          <div className="stat-label">Total Alerts Sent</div>
        </div>
      </div>
    </div>
  )
}
