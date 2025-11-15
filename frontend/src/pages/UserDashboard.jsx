"use client";

import { useState, useEffect } from "react";
import UserSidebar from "../components/UserSidebar";
import UserHome from "../components/UserHome";
import DebrisDetection from "../components/DebrisDetection";
import OilSpillageDetection from "../components/OilSpillageDetection";
import UserHistory from "../components/UserHistory";
import SentReports from "../components/SentReports";
import "../styles/dashboard.css";

export default function UserDashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [detections, setDetections] = useState([]);

  // Load detections from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("allDetections");
    if (stored) {
      setDetections(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  const handleDetectionSubmit = (detection) => {
    // ensure reports include sensible default images when none provided
    const detectionWithImage = { ...detection };
    // Oil spillage uses the sample oil image
    if (
      detectionWithImage.type === "Oil Spillage" &&
      !detectionWithImage.image
    ) {
      detectionWithImage.image = "/assets/doil.jpg";
    }
    // Debris reports use a different sample image so reports look distinct
    if (
      (detectionWithImage.type === "Plastic Debris" ||
        detectionWithImage.type === "Mixed Debris") &&
      !detectionWithImage.image
    ) {
      detectionWithImage.image = "/assets/debris.svg";
    }

    const newDetection = {
      ...detectionWithImage,
      id: Date.now(),
      reportedBy: user.name,
      reportedByEmail: user.email,
      reportedAt: new Date().toLocaleString(),
      status: "pending",
    };

    const updated = [...detections, newDetection];
    setDetections(updated);
    localStorage.setItem("allDetections", JSON.stringify(updated));

    // Add to user history
    const history = JSON.parse(localStorage.getItem("userHistory") || "[]");
    history.push({
      id: Date.now(),
      action: `Reported ${detection.type}`,
      timestamp: new Date().toLocaleString(),
      userId: user.id,
    });
    localStorage.setItem("userHistory", JSON.stringify(history));
  };

  return (
    <div className="dashboard-container">
      <UserSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        detections={detections}
        onLogout={handleLogout}
      />

      <div className="dashboard-main">
        {/* Top nav so critical tabs are always reachable (even with collapsed sidebar) */}
        <div className="dashboard-nav">
          <div className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === "home" ? "active" : ""}`}
              onClick={() => setActiveTab("home")}
            >
              <span className="tab-icon">🏠</span>
              Home
            </button>

            <button
              className={`nav-tab ${activeTab === "debris" ? "active" : ""}`}
              onClick={() => setActiveTab("debris")}
            >
              <span className="tab-icon">🗑️</span>
              Report Debris
            </button>

            <button
              className={`nav-tab ${activeTab === "oil" ? "active" : ""}`}
              onClick={() => setActiveTab("oil")}
            >
              <span className="tab-icon">⚠️</span>
              Report Oil
            </button>

            <button
              className={`nav-tab ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              <span className="tab-icon">📋</span>
              My Reports
            </button>

            <button
              className={`nav-tab ${activeTab === "sent" ? "active" : ""}`}
              onClick={() => setActiveTab("sent")}
            >
              <span className="tab-icon">📤</span>
              Sent Reports
            </button>
          </div>
        </div>
        {activeTab === "home" && (
          <UserHome user={user} detections={detections} />
        )}
        {activeTab === "debris" && (
          <DebrisDetection onSubmit={handleDetectionSubmit} />
        )}
        {activeTab === "oil" && (
          <OilSpillageDetection onSubmit={handleDetectionSubmit} />
        )}
        {activeTab === "history" && <UserHistory detections={detections} />}
        {activeTab === "sent" && (
          <SentReports user={user} detections={detections} />
        )}
      </div>
    </div>
  );
}
