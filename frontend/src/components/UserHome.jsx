import "../styles/home.css"

export default function UserHome({ user, detections }) {
  const userDetections = detections.filter((d) => d.reportedBy === user?.name)
  const pendingCount = userDetections.filter((d) => d.status === "pending").length
  const cleanedCount = userDetections.filter((d) => d.status === "cleaned").length

  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1>Welcome back, {user?.name}! 👋</h1>
        <p>Help us protect the ocean by reporting debris and oil spillage</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📤</div>
          <div className="stat-content">
            <div className="stat-number">{userDetections.length}</div>
            <div className="stat-label">Total Reports</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-number">{pendingCount}</div>
            <div className="stat-label">Pending Review</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">{cleanedCount}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <div className="action-card">
            <div className="action-icon">🗑️</div>
            <h3>Report Debris</h3>
            <p>Spotted plastic or mixed debris? Report it now</p>
          </div>
          <div className="action-card">
            <div className="action-icon">⚠️</div>
            <h3>Report Oil Spillage</h3>
            <p>Detected an oil spillage? Alert authorities immediately</p>
          </div>
        </div>
      </div>

      <div className="recent-reports">
        <h2>Your Recent Reports</h2>
        {userDetections.length > 0 ? (
          <div className="reports-list">
            {userDetections
              .slice(-5)
              .reverse()
              .map((detection) => (
                <div key={detection.id} className="report-item">
                  <div className="report-type">{detection.type}</div>
                  <div className="report-time">{detection.reportedAt}</div>
                  <div className={`report-status status-${detection.status}`}>{detection.status}</div>
                </div>
              ))}
          </div>
        ) : (
          <p className="no-data">No reports yet. Start by reporting a detection!</p>
        )}
      </div>
    </div>
  )
}
