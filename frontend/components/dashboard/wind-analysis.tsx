"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wind, TrendingUp, Navigation, Waves, AlertTriangle } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

export default function WindAnalysis() {
  const [selectedRegion, setSelectedRegion] = useState("North Atlantic")

  const windData = [
    {
      region: "North Atlantic",
      speed: 15,
      direction: "NE",
      prediction: "Moderate spread",
      humidity: 72,
      pressure: 1013,
    },
    {
      region: "Bay of Bengal",
      speed: 22,
      direction: "SW",
      prediction: "High accumulation",
      humidity: 85,
      pressure: 1009,
    },
    { region: "Mediterranean", speed: 8, direction: "E", prediction: "Low movement", humidity: 65, pressure: 1015 },
    {
      region: "Pacific Coast",
      speed: 18,
      direction: "W",
      prediction: "Rapid dispersion",
      humidity: 78,
      pressure: 1012,
    },
  ]

  const historicalData = [
    { time: "00:00", speed: 12, currents: 1.2 },
    { time: "04:00", speed: 14, currents: 1.5 },
    { time: "08:00", speed: 16, currents: 1.8 },
    { time: "12:00", speed: 15, currents: 2.1 },
    { time: "16:00", speed: 18, currents: 1.9 },
    { time: "20:00", speed: 20, currents: 2.3 },
    { time: "24:00", speed: 22, currents: 2.5 },
  ]

  const selected = windData.find((d) => d.region === selectedRegion)

  return (
    <div className="space-y-6 py-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">Wind Analytics</h1>
        <p className="text-muted-foreground">
          Real-time wind and ocean current analysis to predict waste movement and accumulation
        </p>
      </div>

      <div className="bg-accent/10 border border-accent/30 rounded-lg p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Waves className="w-5 h-5 text-accent" />
          <h3 className="font-semibold">Real-time Environmental Monitoring</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Advanced wind and ocean current analysis powered by satellite data to predict debris and oil spill movement
          patterns in real-time.
        </p>
      </div>

      {/* Regional Wind Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {windData.map((data, idx) => (
          <Card
            key={idx}
            className={`border transition cursor-pointer ${
              selectedRegion === data.region
                ? "border-accent bg-accent/5"
                : "border-border/50 bg-card hover:border-accent/50"
            }`}
            onClick={() => setSelectedRegion(data.region)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{data.region}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Wind Speed</p>
                  <p className="text-lg font-bold">{data.speed} km/h</p>
                </div>
                <Wind className="w-6 h-6 text-muted-foreground/50" />
              </div>
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-medium">{data.direction}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Region Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Charts and Metrics */}
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-accent" />
              Wind Speed Trend - {selectedRegion}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={historicalData}>
                <defs>
                  <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="time" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="speed"
                  stroke="hsl(var(--accent))"
                  fillOpacity={1}
                  fill="url(#colorSpeed)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ocean Currents Analysis */}
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waves className="w-5 h-5 text-primary" />
              Ocean Currents - {selectedRegion}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="time" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="currents"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics for Selected Region */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-border/50 bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Wind className="w-4 h-4" />
              Current Speed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{selected?.speed} km/h</p>
            <p className="text-xs text-muted-foreground mt-1">Wind direction: {selected?.direction}</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Waves className="w-4 h-4" />
              Humidity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{selected?.humidity}%</p>
            <p className="text-xs text-muted-foreground mt-1">Moisture level</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Pressure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{selected?.pressure} mb</p>
            <p className="text-xs text-muted-foreground mt-1">Atmospheric</p>
          </CardContent>
        </Card>
      </div>

      {/* Prediction Alert */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm">Movement Prediction</p>
          <p className="text-sm text-muted-foreground mt-1">{selected?.prediction}</p>
        </div>
      </div>
    </div>
  )
}
