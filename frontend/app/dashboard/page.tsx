"use client"

import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import DashboardNav from "@/components/dashboard/dashboard-nav"
import DebrisDetection from "@/components/dashboard/debris-detection"
import OilSpillDetection from "@/components/dashboard/oil-spill-detection"
import WindAnalysis from "@/components/dashboard/wind-analysis"
import DashboardMetrics from "@/components/dashboard/dashboard-metrics"
import DetectionHistory from "@/components/dashboard/detection-history"

type TabType = "debris" | "oil-spills" | "wind"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("debris")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      redirect("/auth/signin")
    }
    setIsAuthenticated(true)
  }, [])

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="pt-20 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <DashboardMetrics debrisCount={12} oilSpillCount={3} alertsSent={48} averageResponseTime="2.5 hrs" />

          {/* Tab Content */}
          <div className="grid lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              {activeTab === "debris" && <DebrisDetection />}
              {activeTab === "oil-spills" && <OilSpillDetection />}
              {activeTab === "wind" && <WindAnalysis />}
            </div>

            {/* Detection history in sidebar */}
            <div className="lg:col-span-1">
              <DetectionHistory />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
