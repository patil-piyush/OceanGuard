"use client";

import "../styles/sidebar.css";

export default function Sidebar({
  activeTab,
  setActiveTab,
  isOpen,
  userRole,
  onLogout,
}) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-logo">
            <span className="sidebar-logo">🌊</span>
          </div>
          {isOpen && (
            <div className="brand-info">
              <h2>OceanGuard</h2>
              <p>Protect Our Oceans</p>
            </div>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          {isOpen && <p className="section-label">MAIN</p>}
          <button
            className={`nav-item ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
            title="Dashboard Home"
          >
            {isOpen && <span className="nav-text">Dashboard</span>}
            {activeTab === "home" && <span className="active-indicator"></span>}
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
            {isOpen && (
              <span className="nav-text">
                {userRole === "authority"
                  ? "Debris Alerts"
                  : "Debris Detection"}
              </span>
            )}
            {activeTab === "debris" && (
              <span className="active-indicator"></span>
            )}
          </button>
          <button
            className={`nav-item ${activeTab === "oil" ? "active" : ""}`}
            onClick={() => setActiveTab("oil")}
            title={
              userRole === "authority"
                ? "Oil Spillage Alerts"
                : "Oil Spillage Detection"
            }
          >
            {isOpen && (
              <span className="nav-text">
                {userRole === "authority" ? "Oil Spillage" : "Oil Detection"}
              </span>
            )}
            {activeTab === "oil" && <span className="active-indicator"></span>}
          </button>
        </div>

        <div className="nav-section">
          {isOpen && <p className="section-label">ANALYTICS</p>}
          <button className="nav-item" title="Reports">
            {isOpen && <span className="nav-text">Reports</span>}
          </button>
          <button className="nav-item" title="History">
            {isOpen && <span className="nav-text">History</span>}
          </button>
        </div>

        <div className="nav-section">
          {isOpen && <p className="section-label">SETTINGS</p>}
          <button className="nav-item" title="Settings">
            {isOpen && <span className="nav-text">Settings</span>}
          </button>
          <button className="nav-item" title="Help & Support">
            {isOpen && <span className="nav-text">Help</span>}
          </button>
        </div>
      </nav>

      <div className="sidebar-footer">
        {isOpen ? (
          <div className="user-profile">
            <div className="profile-avatar">
              {userRole === "authority" ? "🛡️" : "👤"}
            </div>
            <div className="profile-info">
              <p className="profile-name">
                {userRole === "authority" ? "Authority" : "Monitor"}
              </p>
              <p className="profile-status">
                <span className="status-dot"></span>
                Active
              </p>
            </div>
          </div>
        ) : (
          <div className="profile-avatar-mini">
            {userRole === "authority" ? "🛡️" : "👤"}
          </div>
        )}
      </div>
    </aside>
  );
}
