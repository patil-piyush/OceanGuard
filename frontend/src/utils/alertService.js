// Service for handling alerts and email/PDF generation
export const sendAlertToAuthorities = async (alertData) => {
  // In production, this would integrate with:
  // - Email service (SendGrid, Mailgun, AWS SES)
  // - PDF generation (jsPDF, pdfkit)
  // - Location service to find nearby authorities

  const emailPayload = {
    to: generateNearbyAuthorities(alertData.latitude, alertData.longitude),
    subject: `URGENT: ${alertData.type} Detection Alert - ${alertData.coordinates}`,
    body: `
      ENVIRONMENTAL ALERT
      ==================
      Type: ${alertData.type}
      Location: ${alertData.coordinates}
      Severity: ${alertData.severity}
      Confidence: ${alertData.confidence}%
      Timestamp: ${new Date().toLocaleString()}
      
      Image: [Attached]
      Predicted Trajectory: [Attached]
      
      Please respond immediately.
    `,
    attachments: [
      { filename: "detection-image.jpg", data: alertData.imageData },
      { filename: "trajectory.pdf", data: alertData.trajectoryPDF },
    ],
  }

  console.log("Alert would be sent to:", emailPayload.to)
  return emailPayload
}

export const generateNearbyAuthorities = (latitude, longitude) => {
  // In production, this would query a database for authorities
  // within a certain radius and return their email addresses

  return ["coastal-authority@env.gov", "maritime-patrol@ocean.gov", "emergency-response@disaster-mgmt.gov"]
}

export const generatePDFReport = (detectionData) => {
  // In production, this would use jsPDF to generate a detailed PDF report
  const report = {
    title: `${detectionData.type} Detection Report`,
    timestamp: new Date().toLocaleString(),
    location: detectionData.coordinates,
    severity: detectionData.severity,
    confidence: detectionData.confidence,
    image: detectionData.imageUrl,
    trajectory: detectionData.trajectory,
  }

  return report
}

export const logUserAction = (action, userId, details) => {
  // Log all user actions for audit trail and history
  const actionLog = {
    timestamp: new Date().toISOString(),
    userId,
    action,
    details,
    ipAddress: "client-ip", // Would be captured on backend
  }

  // In production, this would be stored in a database
  console.log("Action logged:", actionLog)
  return actionLog
}

export const getHistoryByUser = (userId) => {
  // In production, this would query the database for user's action history
  return [
    {
      id: 1,
      action: "DETECTION_COMPLETED",
      type: "plastic",
      location: "45.123°N, 120.456°W",
      timestamp: "2025-11-11 14:30",
      result: "success",
    },
    {
      id: 2,
      action: "ALERT_SENT",
      type: "debris",
      location: "45.123°N, 120.456°W",
      authorities: 3,
      timestamp: "2025-11-11 14:32",
      result: "success",
    },
  ]
}

export const getCleanupStatus = (alertId) => {
  // Track cleanup status for authorities
  return {
    alertId,
    status: "in-progress", // pending, in-progress, completed
    startedAt: "2025-11-11 15:00",
    expectedCompletion: "2025-11-12 18:00",
    cleanupTeam: "Maritime Cleanup Division A",
    progress: 65,
  }
}
