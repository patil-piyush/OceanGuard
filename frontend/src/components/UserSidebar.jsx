"use client";

import "../styles/sidebar.css";

export default function UserSidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  user,
  detections = [],
  onLogout,
}) {
  const sentCount = (() => {
    if (!detections || detections.length === 0 || !user) return 0;
    return detections.filter(
      (d) => d.reportedByEmail === user.email || d.reportedBy === user.name
    ).length;
  })();

  return (
    <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <div className="logo">🌊 OceanGuard</div>
        <button
          className="toggle-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "✕" : "☰"}
        </button>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${activeTab === "home" ? "active" : ""}`}
          onClick={() => setActiveTab("home")}
        >
          <span className="icon">🏠</span>
          {sidebarOpen && <span>Home</span>}
        </button>

        <button
          className={`nav-item ${activeTab === "debris" ? "active" : ""}`}
          onClick={() => setActiveTab("debris")}
        >
          <span className="icon">🗑️</span>
          {sidebarOpen && <span>Report Debris</span>}
        </button>

        <button
          className={`nav-item ${activeTab === "oil" ? "active" : ""}`}
          onClick={() => setActiveTab("oil")}
        >
          <span className="icon">⚠️</span>
          {sidebarOpen && <span>Report Oil Spillage</span>}
        </button>

        <button
          className={`nav-item ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          <span className="icon">📋</span>
          {sidebarOpen && <span>My Reports</span>}
        </button>

        <button
          className={`nav-item ${activeTab === "sent" ? "active" : ""}`}
          onClick={() => setActiveTab("sent")}
        >
          <span className="icon">📤</span>
          {sidebarOpen && (
            <>
              <span>Sent Reports</span>
              {sentCount > 0 && <span className="nav-badge">{sentCount}</span>}
            </>
          )}
        </button>
      </nav>

      <div className="sidebar-footer">
        {sidebarOpen && (
          <div className="user-info">
            <p className="user-name">{user?.name}</p>
            <p className="user-email">{user?.email}</p>
          </div>
        )}
        <button className="logout-btn" onClick={onLogout}>
          <span className="icon">🚪</span>
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
