"use client";

import { useState } from "react";
import OilAnalysis from "./OilAnalysis";
import "../styles/detection.css";
import { formatLatLng, getIpLocation } from "../utils/geolocation";

export default function OilSpillageDetection({ userRole }) {
  // Use the image named `doil.jpg` from the public assets folder
  const HARDCODED_OIL_IMAGE = "/assets/doil.jpg";
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [locationMode, setLocationMode] = useState("current");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitudeNum, setLatitudeNum] = useState(null);
  const [longitudeNum, setLongitudeNum] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [detectionHistory, setDetectionHistory] = useState([
    {
      id: 1,
      severity: "High",
      date: "2025-11-09",
      location: "45.123°N, 120.456°W",
      area: "2.5 km²",
    },
    {
      id: 2,
      severity: "Medium",
      date: "2025-11-07",
      location: "45.234°N, 120.567°W",
      area: "1.2 km²",
    },
  ]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetCurrentLocation = () => {
    setGettingLocation(true);
    import("../utils/geolocation")
      .then(({ getLocationWithFallback }) =>
        getLocationWithFallback({ timeout: 12000, fallback: true })
      )
      .then((result) => {
        const lat = result.latitude;
        const lng = result.longitude;
        setLatitudeNum(lat);
        setLongitudeNum(lng);
        setLatitude(lat.toFixed(6));
        setLongitude(lng.toFixed(6));
        if (result._fallbackNotice) {
          alert("Location obtained via IP-based fallback (less accurate).");
        }
      })
      .catch((err) => {
        console.error("Error obtaining location:", err);
        if (err && err.code === 1) {
          alert(
            "Permission denied. Please allow location access in your browser and try again."
          );
        } else if (err && err.message) {
          alert("Error getting location: " + err.message);
        } else {
          alert("Unable to retrieve location");
        }
      })
      .finally(() => setGettingLocation(false));
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please select an image");
      return;
    }

    if (!latitude || !longitude) {
      alert("Please provide location coordinates");
      return;
    }

    setIsAnalyzing(true);

    // Simulate API call for oil spillage analysis
    setTimeout(() => {
      const latForFormat = latitudeNum != null ? latitudeNum : Number(latitude);
      const lngForFormat =
        longitudeNum != null ? longitudeNum : Number(longitude);
      const coordsFormatted = formatLatLng(latForFormat, lngForFormat).combined;

      const mockResult = {
        spillageType: "Crude Oil",
        severity: Math.random() > 0.5 ? "High" : "Medium",
        affectedArea: (Math.random() * 3).toFixed(2) + " km²",
        confidence: Math.floor(Math.random() * 15) + 85,
        coordinates: coordsFormatted,
        timestamp: new Date().toLocaleString(),
        // Use the doil.jpg image from the public assets folder
        imageUrl: HARDCODED_OIL_IMAGE,
        environmentalImpact: "High - Marine life affected",
        suggestions: [
          "Deploy containment booms immediately",
          "Activate hazmat team response",
          "Notify coastal authorities",
          "Monitor water quality parameters",
        ],
      };

      setAnalysisResult(mockResult);

      // Add to history
      const severity = mockResult.severity;
      setDetectionHistory((prev) => [
        {
          id: prev.length + 1,
          severity: severity,
          date: new Date().toISOString().split("T")[0],
          location: mockResult.coordinates,
          area: mockResult.affectedArea,
        },
        ...prev,
      ]);

      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="detection-container">
      <div className="detection-layout">
        {/* Left Panel - Detection Input */}
        <div className="detection-panel">
          <h2>Oil Spillage Detection</h2>

          <form onSubmit={handleAnalyze} className="detection-form">
            {/* Info Text */}
            <div className="form-section info-section">
              <p className="info-text">
                Upload satellite or drone imagery to detect and analyze oil
                spills in real-time.
              </p>
            </div>

            {/* Image Upload */}
            <div className="form-section">
              <label className="section-title">Upload Image</label>
              <div className="image-upload">
                {imagePreview ? (
                  <div className="image-preview">
                    <a
                      href={imagePreview}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                      />
                    </a>
                    <button
                      type="button"
                      className="btn-remove-image"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="upload-box">
                    <span className="upload-icon">🛰️</span>
                    <span className="upload-text">
                      Click to upload satellite/drone image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      hidden
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Location Input */}
            <div className="form-section">
              <label className="section-title">Location</label>
              <div className="location-mode">
                <label>
                  <input
                    type="radio"
                    name="locationMode"
                    value="current"
                    checked={locationMode === "current"}
                    onChange={(e) => setLocationMode(e.target.value)}
                  />
                  Current Location (GPS)
                </label>
                <label>
                  <input
                    type="radio"
                    name="locationMode"
                    value="manual"
                    checked={locationMode === "manual"}
                    onChange={(e) => setLocationMode(e.target.value)}
                  />
                  Manual Input
                </label>
              </div>

              {locationMode === "current" ? (
                <button
                  type="button"
                  className="btn-get-location"
                  onClick={handleGetCurrentLocation}
                  disabled={gettingLocation}
                >
                  {gettingLocation
                    ? "⏳ Getting location..."
                    : "📍 Get Current Location"}
                </button>
              ) : null}

              <div className="coord-inputs">
                <div className="coord-input">
                  <label htmlFor="latitude-oil">Latitude</label>
                  <input
                    id="latitude-oil"
                    type="text"
                    placeholder="45.123456"
                    value={
                      locationMode === "current" && latitudeNum != null
                        ? formatLatLng(latitudeNum, longitudeNum).latStr
                        : latitude
                    }
                    onChange={(e) => setLatitude(e.target.value)}
                    readOnly={locationMode === "current"}
                  />
                </div>
                <div className="coord-input">
                  <label htmlFor="longitude-oil">Longitude</label>
                  <input
                    id="longitude-oil"
                    type="text"
                    placeholder="120.456789"
                    value={
                      locationMode === "current" && longitudeNum != null
                        ? formatLatLng(latitudeNum, longitudeNum).lngStr
                        : longitude
                    }
                    onChange={(e) => setLongitude(e.target.value)}
                    readOnly={locationMode === "current"}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-analyze"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? "🔄 Analyzing..." : "🔍 Analyze Image"}
            </button>
          </form>
        </div>

        {/* Right Panel - Analysis Result */}
        {isAnalyzing && !analysisResult ? (
          <div className="analysis-loading" role="status" aria-live="polite">
            <div className="spinner" aria-hidden="true"></div>
            <div className="loading-text">Analyzing image…</div>
          </div>
        ) : null}

        {analysisResult && (
          <OilAnalysis
            result={analysisResult}
            userRole={userRole}
            onClose={() => setAnalysisResult(null)}
          />
        )}
      </div>

      {/* History Section */}
      <div className="history-section">
        <h3>Oil Spillage Detection History</h3>
        <div className="history-table">
          <div className="table-header">
            <div className="col-severity">Severity</div>
            <div className="col-area">Affected Area</div>
            <div className="col-location">Location</div>
            <div className="col-date">Date</div>
          </div>
          <div className="table-body">
            {detectionHistory.map((item) => (
              <div key={item.id} className="table-row">
                <div className="col-severity">
                  <span
                    className={`severity-badge ${item.severity.toLowerCase()}`}
                  >
                    {item.severity}
                  </span>
                </div>
                <div className="col-area">{item.area}</div>
                <div className="col-location">{item.location}</div>
                <div className="col-date">{item.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
