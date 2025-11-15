"use client";

import { useMemo } from "react";
import "../styles/history.css";

export default function SentReports({ user, detections = [] }) {
  const myReports = useMemo(() => {
    if (!detections || detections.length === 0) return [];

    // Prefer reports explicitly attributed to the current user
    if (user) {
      const byUser = detections.filter(
        (d) => d.reportedByEmail === user.email || d.reportedBy === user.name
      );
      if (byUser.length > 0) return byUser;
    }

    // Fallback: show any detections that have a status or authority comment
    return detections.filter(
      (d) => d.status || d.authorityComment || d.reviewComment || d.note
    );
  }, [user, detections]);

  return (
    <div className="history-container">
      <h3>Sent Reports</h3>

      {myReports.length === 0 ? (
        <div className="history-item">
          <div className="item-content">
            <div className="item-header">
              <span className="action-type">No reports yet</span>
            </div>
            <p className="item-details">You haven't sent any reports yet.</p>
          </div>
        </div>
      ) : (
        <div className="history-timeline">
          {myReports.map((r) => {
            const statusRaw = (r.status || "pending").toString();
            const statusClass = statusRaw.toLowerCase().replace(/\s+/g, "-");

            return (
              <div key={r.id} className="history-item" aria-hidden>
                <div className="item-marker">
                  <span className="marker-icon">📤</span>
                </div>

                <div className="item-content">
                  <div className="item-header">
                    <span className="action-type">
                      {r.type || r.debrisType || r.spillageType || "Report"}
                    </span>
                    <span className={`result-badge ${statusClass}`}>
                      {statusRaw.toUpperCase()}
                    </span>
                  </div>

                  <p className="item-details">
                    <strong>Reported:</strong>{" "}
                    {r.reportedAt || r.timestamp || "-"}
                    {r.location && ` • ${r.location}`}
                  </p>

                  <p className="item-details">
                    <strong>Authority note:</strong>{" "}
                    {r.authorityComment || r.reviewComment || r.note || "-"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
