"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, MapPin, Upload, Send, CheckCircle } from "lucide-react"

export default function OilSpillDetection() {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [location, setLocation] = useState({ lat: "", lng: "" })
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setUseCurrentLocation(true)
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
        })
      })
    }
  }

  const handleSubmit = async () => {
    if (!image || (!useCurrentLocation && (!location.lat || !location.lng))) {
      alert("Please upload an image and provide location")
      return
    }

    setIsAnalyzing(true)

    // Simulate AI analysis
    setTimeout(() => {
      setResult({
        spillType: "Crude Oil",
        confidence: 88,
        severity: "Critical",
        estimatedVolume: "500-1000 barrels",
        spreadRate: "2.5 km/day",
        coordinates: useCurrentLocation ? location : location,
        recommendations: [
          "Activate Emergency Response Team immediately",
          "Deploy containment booms within 1 hour",
          "Evacuate nearby coastal areas",
          "Coordinate with environmental agencies",
        ],
      })
      setIsAnalyzing(false)
    }, 2000)
  }

  const handleReportToAuthority = () => {
    setSubmitted(true)
    setTimeout(() => {
      alert("Critical alert sent to maritime authorities!")
      setSubmitted(false)
      setResult(null)
      setImage(null)
      setPreview("")
      setLocation({ lat: "", lng: "" })
    }, 1500)
  }

  return (
    <div className="space-y-6 py-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">Oil Spill Detection</h1>
        <p className="text-muted-foreground">Real-time detection and tracking of oil spills from satellite imagery</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card className="border-border/50 bg-card md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Image
            </CardTitle>
            <CardDescription>Select satellite image for oil spill analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onClick={() => document.getElementById("imageInput")?.click()}
              className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center cursor-pointer hover:border-accent/50 transition"
            >
              {preview ? (
                <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-auto rounded" />
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                  <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                </div>
              )}
            </div>
            <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

            {/* Location Section */}
            <div className="space-y-3 pt-4 border-t border-border">
              <h3 className="font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </h3>
              <Button
                onClick={handleGetLocation}
                variant="outline"
                className="w-full border-border hover:bg-card bg-transparent"
              >
                Use Current Location
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Latitude"
                  value={location.lat}
                  onChange={(e) => setLocation((prev) => ({ ...prev, lat: e.target.value }))}
                  className="bg-background border-border text-sm"
                />
                <Input
                  placeholder="Longitude"
                  value={location.lng}
                  onChange={(e) => setLocation((prev) => ({ ...prev, lng: e.target.value }))}
                  className="bg-background border-border text-sm"
                />
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isAnalyzing || !image}
              className="w-full bg-accent hover:bg-accent/90 gap-2"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Image"}
              <AlertCircle className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="border-border/50 bg-card md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent" />
              Analysis Results
            </CardTitle>
            <CardDescription>AI-powered oil spill detection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background/50 rounded-lg p-3 space-y-1">
                    <p className="text-xs text-muted-foreground">Spill Type</p>
                    <p className="font-semibold text-sm">{result.spillType}</p>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 space-y-1">
                    <p className="text-xs text-muted-foreground">Confidence</p>
                    <p className="font-semibold text-sm text-accent">{result.confidence}%</p>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 space-y-1">
                    <p className="text-xs text-muted-foreground">Severity</p>
                    <p
                      className={`font-semibold text-sm ${result.severity === "Critical" ? "text-red-600" : "text-orange-500"}`}
                    >
                      {result.severity}
                    </p>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 space-y-1">
                    <p className="text-xs text-muted-foreground">Volume Est.</p>
                    <p className="font-semibold text-sm">{result.estimatedVolume}</p>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 space-y-1">
                    <p className="text-xs text-muted-foreground">Spread Rate</p>
                    <p className="font-semibold text-sm">{result.spreadRate}</p>
                  </div>
                </div>

                <div className="bg-background/50 rounded-lg p-4 space-y-2">
                  <p className="font-medium text-sm">Coordinates</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {result.coordinates.lat}, {result.coordinates.lng}
                  </p>
                </div>

                <div className="bg-background/50 rounded-lg p-4 space-y-3">
                  <p className="font-medium text-sm">Critical Actions Required</p>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-red-500">!</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={handleReportToAuthority}
                  disabled={submitted}
                  className="w-full bg-red-600 hover:bg-red-700 gap-2"
                >
                  {submitted ? "Alerting..." : "Alert Authorities Immediately"}
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Upload an image and click "Analyze Image" to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
