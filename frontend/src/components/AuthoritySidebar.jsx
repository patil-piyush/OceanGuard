"use client"

import "../styles/sidebar.css"

export default function AuthoritySidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, user, onLogout }) {
  return (
    <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <div className="logo">🌊 OceanGuard</div>
        <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? "✕" : "☰"}
        </button>
      </div>

      <nav className="sidebar-nav">
        <button className={`nav-item ${activeTab === "home" ? "active" : ""}`} onClick={() => setActiveTab("home")}>
          <span className="icon">🏠</span>
          {sidebarOpen && <span>Home</span>}
        </button>

        <button className={`nav-item ${activeTab === "debris" ? "active" : ""}`} onClick={() => setActiveTab("debris")}>
          <span className="icon">🚨</span>
          {sidebarOpen && <span>Debris Alerts</span>}
        </button>

        <button className={`nav-item ${activeTab === "oil" ? "active" : ""}`} onClick={() => setActiveTab("oil")}>
          <span className="icon">⚠️</span>
          {sidebarOpen && <span>Oil Spillage Alerts</span>}
        </button>
      </nav>

      <div className="sidebar-footer">
        {sidebarOpen && (
          <div className="user-info">
            <p className="user-name">{user?.name}</p>
            <p className="user-role">{user?.organization}</p>
          </div>
        )}
        <button className="logout-btn" onClick={onLogout}>
          <span className="icon">🚪</span>
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  )
}
