"use client";

import "../styles/sidebar.css";

export default function Sidebar({ activeTab, setActiveTab, isOpen, userRole }) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <span className="sidebar-logo">🌊</span>
        {isOpen && <h2>OceanGuard</h2>}
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          {isOpen && <p className="section-label">MAIN</p>}
          <button
            className={`nav-item ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
            title="Dashboard Home"
          >
            <span className="nav-icon">📊</span>
            {isOpen && <span>Dashboard</span>}
          </button>
        </div>

        <div className="nav-section">
          {isOpen && <p className="section-label">MONITORING</p>}
          <button
            className={`nav-item ${activeTab === "debris" ? "active" : ""}`}
            onClick={() => setActiveTab("debris")}
            title={
              userRole === "authority" ? "Debris Alerts" : "Debris Detection"
            }
          >
            <span className="nav-icon">🗑️</span>
            {isOpen && (
              <span>
                {userRole === "authority"
                  ? "Debris Alerts"
                  : "Debris Detection"}
              </span>
            )}
          </button>
          <button
            className={`nav-item ${activeTab === "oil" ? "active" : ""}`}
            onClick={() => setActiveTab("oil")}
            title={
              userRole === "authority" ? "Oil Spillage Alerts" : "Oil Spillage"
            }
          >
            <span className="nav-icon">🛢️</span>
            {isOpen && (
              <span>
                {userRole === "authority"
                  ? "Oil Spillage Alerts"
                  : "Oil Spillage"}
              </span>
            )}
          </button>
        </div>

        <div className="nav-section">
          {isOpen && <p className="section-label">SETTINGS</p>}
          <button className="nav-item" title="Settings">
            <span className="nav-icon">⚙️</span>
            {isOpen && <span>Settings</span>}
          </button>
          <button className="nav-item" title="Help">
            <span className="nav-icon">❓</span>
            {isOpen && <span>Help</span>}
          </button>
        </div>
      </nav>

      <div className="sidebar-footer">
        {isOpen && (
          <p className="role-badge">
            {userRole === "authority" ? "Authority" : "Monitor"}
          </p>
        )}
      </div>
    </aside>
  );
}
