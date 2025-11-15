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
      <div className="dashboard-background">
        <div className="dashboard-wave wave1"></div>
        <div className="dashboard-wave wave2"></div>
      </div>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        userRole={userRole}
        onLogout={handleLogout}
      />

      <div
        className={`dashboard-main ${
          sidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <header className="dashboard-header">
          <div className="header-left">
            <button
              className="toggle-sidebar"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className={`hamburger ${sidebarOpen ? "open" : ""}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>

            <div className="header-brand">
              <span className="brand-icon">🌊</span>
              <div className="brand-text">
                <h1>OceanGuard</h1>
                <p>Dashboard</p>
              </div>
            </div>
          </div>

          <div className="header-right">
            <div className="user-menu">
              <div className="user-info">
                <div className="user-avatar">
                  {userRole === "authority" ? "🛡️" : "👤"}
                </div>
                <div className="user-details">
                  <span className="user-name">
                    {userRole === "authority" ? "Authority" : "Monitor"}
                  </span>
                  <span className="user-role">
                    {userRole === "authority"
                      ? "Environmental Authority"
                      : "Environmental Monitor"}
                  </span>
                </div>
              </div>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="dashboard-nav">
          <nav className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === "home" ? "active" : ""}`}
              onClick={() => setActiveTab("home")}
            >
              <span className="tab-label">Dashboard</span>
              {activeTab === "home" && <span className="tab-indicator"></span>}
            </button>
            <button
              className={`nav-tab ${activeTab === "debris" ? "active" : ""}`}
              onClick={() => setActiveTab("debris")}
            >
              <span className="tab-label">
                {userRole === "authority"
                  ? "Debris Alerts"
                  : "Debris Detection"}
              </span>
              {activeTab === "debris" && (
                <span className="tab-indicator"></span>
              )}
            </button>
            <button
              className={`nav-tab ${activeTab === "oil" ? "active" : ""}`}
              onClick={() => setActiveTab("oil")}
            >
              <span className="tab-label">
                {userRole === "authority"
                  ? "Oil Spillage Alerts"
                  : "Oil Spillage Detection"}
              </span>
              {activeTab === "oil" && <span className="tab-indicator"></span>}
            </button>
          </nav>
        </div>

        <main className="dashboard-content">{renderContent()}</main>

        {selectedAlert && (
          <AlertReport
            alert={selectedAlert}
            onClose={handleCloseReport}
            onMarkAsClean={handleMarkAsClean}
            userRole={userRole}
          />
        )}
      </div>
    </div>
  );
}
