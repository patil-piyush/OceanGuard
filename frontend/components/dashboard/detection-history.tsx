"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Droplet, Trash2, Clock, MapPin, CheckCircle } from "lucide-react"

interface DetectionRecord {
  id: string
  type: "debris" | "oil-spill"
  location: string
  coordinates: { lat: string; lng: string }
  timestamp: string
  severity: "Low" | "Medium" | "High" | "Critical"
  status: "Reported" | "Investigating" | "Resolved"
  confidence: number
}

export default function DetectionHistory() {
  const detections: DetectionRecord[] = [
    {
      id: "DET-001",
      type: "oil-spill",
      location: "North Atlantic, Coast Guard Zone 5",
      coordinates: { lat: "40.7128", lng: "-74.0060" },
      timestamp: "2025-01-06 14:32",
      severity: "Critical",
      status: "Reported",
      confidence: 95,
    },
    {
      id: "DET-002",
      type: "debris",
      location: "Bay of Bengal, Maritime District 3",
      coordinates: { lat: "21.5922", lng: "88.6629" },
      timestamp: "2025-01-06 12:15",
      severity: "High",
      status: "Investigating",
      confidence: 88,
    },
    {
      id: "DET-003",
      type: "debris",
      location: "Mediterranean Sea, EU Sector 2",
      coordinates: { lat: "36.7372", lng: "15.5873" },
      timestamp: "2025-01-06 09:45",
      severity: "Medium",
      status: "Investigating",
      confidence: 82,
    },
    {
      id: "DET-004",
      type: "oil-spill",
      location: "Pacific Coast, US EEZ",
      coordinates: { lat: "34.0522", lng: "-118.2437" },
      timestamp: "2025-01-06 07:20",
      severity: "High",
      status: "Resolved",
      confidence: 91,
    },
    {
      id: "DET-005",
      type: "debris",
      location: "North Sea, NATO Waters",
      coordinates: { lat: "56.0", lng: "2.0" },
      timestamp: "2025-01-05 22:10",
      severity: "Low",
      status: "Resolved",
      confidence: 75,
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500/10 text-red-700 border-red-500/30"
      case "High":
        return "bg-orange-500/10 text-orange-700 border-orange-500/30"
      case "Medium":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/30"
      case "Low":
        return "bg-green-500/10 text-green-700 border-green-500/30"
      default:
        return "bg-muted"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Reported":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case "Investigating":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "Resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return null
    }
  }

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Detection History</CardTitle>
            <CardDescription>Recent detections and authority reports</CardDescription>
          </div>
          <Badge variant="secondary">Last 24 Hours</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {detections.map((detection) => (
            <div
              key={detection.id}
              className="border border-border/50 rounded-lg p-4 hover:bg-background/30 transition space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3 flex-1">
                  {/* Type Icon */}
                  <div className="w-10 h-10 rounded-lg bg-card border border-border/50 flex items-center justify-center flex-shrink-0">
                    {detection.type === "oil-spill" ? (
                      <Droplet className="w-5 h-5 text-red-500" />
                    ) : (
                      <Trash2 className="w-5 h-5 text-cyan-500" />
                    )}
                  </div>

                  {/* Detection Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">
                        {detection.type === "oil-spill" ? "Oil Spill" : "Debris"} - {detection.id}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {detection.confidence}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {detection.location}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {detection.timestamp}
                    </p>
                  </div>
                </div>

                {/* Status and Severity */}
                <div className="flex flex-col gap-2 text-right flex-shrink-0">
                  <div
                    className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(detection.severity)}`}
                  >
                    {detection.severity}
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    {getStatusIcon(detection.status)}
                    <span className="text-xs font-medium text-muted-foreground">{detection.status}</span>
                  </div>
                </div>
              </div>

              {/* Coordinates */}
              <div className="bg-background/50 rounded px-2 py-1 text-xs text-muted-foreground font-mono">
                {detection.coordinates.lat}, {detection.coordinates.lng}
              </div>
            </div>
          ))}
        </div>

        {/* View More */}
        <div className="pt-4 text-center border-t border-border">
          <button className="text-sm text-accent hover:text-accent/80 font-medium">View All Detections</button>
        </div>
      </CardContent>
    </Card>
  )
}
