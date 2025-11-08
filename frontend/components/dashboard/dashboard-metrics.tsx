"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Zap, TrendingUp, Clock } from "lucide-react"

interface DashboardMetricsProps {
  debrisCount?: number
  oilSpillCount?: number
  alertsSent?: number
  averageResponseTime?: string
}

export default function DashboardMetrics({
  debrisCount = 12,
  oilSpillCount = 3,
  alertsSent = 48,
  averageResponseTime = "2.5 hrs",
}: DashboardMetricsProps) {
  const metrics = [
    {
      title: "Debris Detected",
      value: debrisCount,
      icon: AlertCircle,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      title: "Oil Spills",
      value: oilSpillCount,
      icon: Zap,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      title: "Alerts Sent",
      value: alertsSent,
      icon: TrendingUp,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Avg Response Time",
      value: averageResponseTime,
      icon: Clock,
      color: "text-secondary",
      bg: "bg-secondary/10",
      isTime: true,
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 py-6">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon
        return (
          <Card key={idx} className="border-border/50 bg-card hover:border-border transition">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>{metric.title}</span>
                <div className={`${metric.bg} p-2 rounded-lg`}>
                  <Icon className={`w-4 h-4 ${metric.color}`} />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${metric.color}`}>{metric.value}</p>
              <p className="text-xs text-muted-foreground mt-2">This month</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
