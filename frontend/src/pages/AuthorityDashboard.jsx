"use client"

import { useState, useEffect } from "react"
import AuthoritySidebar from "../components/AuthoritySidebar"
import AuthorityHome from "../components/AuthorityHome"
import DebrisAlerts from "../components/DebrisAlerts"
import OilSpillageAlerts from "../components/OilSpillageAlerts"
import AlertReport from "../components/AlertReport"
import "../styles/dashboard.css"

export default function AuthorityDashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState("home")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [detections, setDetections] = useState([])
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [showReport, setShowReport] = useState(false)

  // Load detections from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("allDetections")
    if (stored) {
      setDetections(JSON.parse(stored))
    }

    // Refresh detections every 5 seconds to get new alerts
    const interval = setInterval(() => {
      const updated = localStorage.getItem("allDetections")
      if (updated) {
        setDetections(JSON.parse(updated))
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    setUser(null)
  }

  const handleMarkAsClean = (detectionId, response) => {
    const updated = detections.map((d) =>
      d.id === detectionId
        ? {
            ...d,
            status: "cleaned",
            cleanedBy: user.name,
            cleanedAt: new Date().toLocaleString(),
            authorityResponse: response,
          }
        : d,
    )
    setDetections(updated)
    localStorage.setItem("allDetections", JSON.stringify(updated))

    // Add to authority history
    const history = JSON.parse(localStorage.getItem("authorityHistory") || "[]")
    history.push({
      id: Date.now(),
      action: `Marked ${selectedAlert.type} as cleaned`,
      timestamp: new Date().toLocaleString(),
      authorityId: user.id,
    })
    localStorage.setItem("authorityHistory", JSON.stringify(history))

    setShowReport(false)
    setSelectedAlert(null)
  }

  const handleViewReport = (alert) => {
    setSelectedAlert(alert)
    setShowReport(true)
  }

  return (
    <div className="dashboard-container">
      <AuthoritySidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        onLogout={handleLogout}
      />

      <div className="dashboard-main">
        {activeTab === "home" && <AuthorityHome user={user} detections={detections} />}
        {activeTab === "debris" && (
          <DebrisAlerts
            detections={detections.filter((d) => d.type === "Plastic Debris" || d.type === "Mixed Debris")}
            onViewReport={handleViewReport}
          />
        )}
        {activeTab === "oil" && (
          <OilSpillageAlerts
            detections={detections.filter((d) => d.type === "Oil Spillage")}
            onViewReport={handleViewReport}
          />
        )}
      </div>

      {showReport && selectedAlert && (
        <AlertReport
          alert={selectedAlert}
          user={user}
          onClose={() => setShowReport(false)}
          onMarkAsClean={handleMarkAsClean}
        />
      )}
    </div>
  )
}
