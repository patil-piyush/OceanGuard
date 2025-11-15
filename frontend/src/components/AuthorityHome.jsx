import "../styles/home.css"

export default function AuthorityHome({ user, detections }) {
  const pendingAlerts = detections.filter((d) => d.status === "pending").length
  const cleanedAlerts = detections.filter((d) => d.status === "cleaned").length
  const debrisAlerts = detections.filter((d) => d.type === "Plastic Debris" || d.type === "Mixed Debris").length
  const oilAlerts = detections.filter((d) => d.type === "Oil Spillage").length

  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1>Authority Dashboard - {user?.name} 🏛️</h1>
        <p>Monitor and manage environmental alerts from your organization</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🚨</div>
          <div className="stat-content">
            <div className="stat-number">{pendingAlerts}</div>
            <div className="stat-label">Pending Alerts</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🗑️</div>
          <div className="stat-content">
            <div className="stat-number">{debrisAlerts}</div>
            <div className="stat-label">Debris Alerts</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-number">{oilAlerts}</div>
            <div className="stat-label">Oil Spillage Alerts</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">{cleanedAlerts}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>
      </div>

      <div className="alert-summary">
        <h2>Alert Summary</h2>
        <div className="summary-content">
          <p>
            You have <strong>{pendingAlerts}</strong> pending alerts requiring immediate attention.
          </p>
          <p>Navigate to the Debris Alerts or Oil Spillage Alerts sections to review and respond to detections.</p>
        </div>
      </div>
    </div>
  )
}
