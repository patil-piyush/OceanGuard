"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardHome from "../components/DashboardHome";
import DebrisAlerts from "../components/DebrisAlerts";
import OilSpillageAlerts from "../components/OilSpillageAlerts";
import AlertReport from "../components/AlertReport";
import DebrisDetection from "../components/DebrisDetection";
import OilSpillageDetection from "../components/OilSpillageDetection";
import "../styles/dashboard.css";

export default function Dashboard({ userRole, onLogout }) {
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const [debrisDetections, setDebrisDetections] = useState(() => {
    const now = new Date().toLocaleString();
    return [
      {
        id: "d1",
        type: "Plastic Debris",
        reportedAt: now,
        reportedBy: "john.monitor",
        reportedByEmail: "john.monitor@ocean.com",
        detectionDate: now,
        confidence: 92,
        severity: "High",
        status: "pending",
        location: { latitude: 45.1234, longitude: -120.4567 },
        image: null,
        description: "Floating plastic bottles and fragments",
      },
    ];
  });

  const [oilDetections, setOilDetections] = useState(() => {
    const now = new Date().toLocaleString();
    return [
      {
        id: "o1",
        type: "Oil Slick",
        reportedAt: now,
        reportedBy: "jane.monitor",
        reportedByEmail: "jhondoe@edu.com",
        detectionDate: now,
        confidence: 88,
        severity: "Critical",
        status: "pending",
        location: { latitude: 45.234, longitude: -120.567 },
        image: null,
        description: "Thin oil sheen observed across 200m",
      },
    ];
  });

  const [selectedAlert, setSelectedAlert] = useState(null);

  const handleViewReport = (alert) => {
    setSelectedAlert(alert);
  };

  const handleCloseReport = () => {
    setSelectedAlert(null);
  };

  const handleMarkAsClean = (alertId, responseText) => {
    // Update in debrisDetections or oilDetections depending on which contains the id
    setDebrisDetections((prev) =>
      prev.map((d) => {
        if (d.id === alertId) {
          return {
            ...d,
            status: "cleaned",
            cleanedBy: "Authority Team",
            cleanedAt: new Date().toLocaleString(),
            authorityResponse: responseText,
          };
        }
        return d;
      })
    );

    setOilDetections((prev) =>
      prev.map((d) => {
        if (d.id === alertId) {
          return {
            ...d,
            status: "cleaned",
            cleanedBy: "Authority Team",
            cleanedAt: new Date().toLocaleString(),
            authorityResponse: responseText,
          };
        }
        return d;
      })
    );

    // In a real app, send responseText to reporter via API
    console.log(
      `Sent response to reporter for alert ${alertId}: ${responseText}`
    );
    setSelectedAlert((prev) =>
      prev && prev.id === alertId
        ? { ...prev, status: "cleaned", authorityResponse: responseText }
        : prev
    );
  };

  const renderContent = () => {
    // Authority users see Alerts dashboard; monitors see the detection UI (old dashboard)
    if (userRole === "authority") {
      switch (activeTab) {
        case "home":
          return <DashboardHome userRole={userRole} />;
        case "debris":
          return (
            <DebrisAlerts
              detections={debrisDetections}
              onViewReport={handleViewReport}
            />
          );
        case "oil":
          return (
            <OilSpillageAlerts
              detections={oilDetections}
              onViewReport={handleViewReport}
            />
          );
        default:
          return <DashboardHome userRole={userRole} />;
      }
    }

    // Environmental monitor (user) - show detection tools
    switch (activeTab) {
      case "home":
        return <DashboardHome userRole={userRole} />;
      case "debris":
        return <DebrisDetection userRole={userRole} />;
      case "oil":
        return <OilSpillageDetection userRole={userRole} />;
      default:
        return <DashboardHome userRole={userRole} />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        userRole={userRole}
      />

      <div
        className={`dashboard-main ${
          sidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <header className="dashboard-header">
          <button
            className="toggle-sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          <div className="header-title">
            <h1>OceanGuard Dashboard</h1>
          </div>

          <div className="header-actions">
            <div className="user-info">
              <span className="user-role">
                {userRole === "authority" ? "Authority" : "Monitor"}
              </span>
            </div>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </header>

        <div className="dashboard-nav">
          <nav className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === "home" ? "active" : ""}`}
              onClick={() => setActiveTab("home")}
            >
              <span className="tab-icon">📊</span>
              Dashboard
            </button>
            <button
              className={`nav-tab ${activeTab === "debris" ? "active" : ""}`}
              onClick={() => setActiveTab("debris")}
            >
              <span className="tab-icon">🗑️</span>
              Debris Alerts
            </button>
            <button
              className={`nav-tab ${activeTab === "oil" ? "active" : ""}`}
              onClick={() => setActiveTab("oil")}
            >
              <span className="tab-icon">🛢️</span>
              Oil Spillage Alerts
            </button>
          </nav>
        </div>

        <main className="dashboard-content">{renderContent()}</main>
        {selectedAlert && (
          <AlertReport
            alert={selectedAlert}
            onClose={handleCloseReport}
            onMarkAsClean={handleMarkAsClean}
          />
        )}
      </div>
    </div>
  );
}
