"use client";

import { useState } from "react";
import OilAnalysis from "./OilAnalysis";
import "../styles/detection.css";
import { formatLatLng, getIpLocation } from "../utils/geolocation";

export default function OilSpillageDetection({ userRole }) {
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
      <div className="detection-header oil-header">
        <div className="header-content">
          <h1 className="page-title">
            Oil Spillage Detection
          </h1>
          <p className="page-subtitle">
            Upload satellite or drone imagery to detect and analyze oil spills
            using advanced AI
          </p>
        </div>
      </div>

      <div className="detection-layout">
        {/* Left Panel - Detection Input */}
        <div className="detection-panel">
          <div className="panel-card">
            <div className="card-header-detection oil-card-header">
              <h2>Upload & Analyze</h2>
              <span className="step-indicator oil-step">Step 1 of 2</span>
            </div>

            <form onSubmit={handleAnalyze} className="detection-form">
              

              {/* Image Upload */}
              <div className="form-section">
                <label className="section-title">
                  <span className="section-icon">🛰️</span>
                  Upload Satellite/Drone Image
                  <span className="required">*</span>
                </label>
                <div className="image-upload">
                  {imagePreview ? (
                    <div className="image-preview">
                      <a
                        href={imagePreview}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="preview-link"
                      >
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="preview-image"
                        />
                        <div className="preview-overlay">
                          <span className="preview-text">
                            Click to view full size
                          </span>
                        </div>
                      </a>
                      <button
                        type="button"
                        className="btn-remove-image"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                      >
                        <span className="remove-icon">✕</span>
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <label className="upload-box oil-upload">
                      <span className="upload-icon">🛰️</span>
                      <span className="upload-text">
                        Click to upload satellite/drone image
                      </span>
                      <span className="upload-hint">
                        Supports: JPG, PNG, GeoTIFF (Max 10MB)
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
                <label className="section-title">
                  Location
                  <span className="required">*</span>
                </label>

                <div className="location-mode">
                  <label
                    className={`mode-option ${
                      locationMode === "current" ? "active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="locationMode"
                      value="current"
                      checked={locationMode === "current"}
                      onChange={(e) => setLocationMode(e.target.value)}
                    />
                    <span className="mode-label">Current Location (GPS)</span>
                  </label>
                  <label
                    className={`mode-option ${
                      locationMode === "manual" ? "active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="locationMode"
                      value="manual"
                      checked={locationMode === "manual"}
                      onChange={(e) => setLocationMode(e.target.value)}
                    />
                    <span className="mode-label">Manual Input</span>
                  </label>
                </div>

                {locationMode === "current" && (
                  <button
                    type="button"
                    className="btn-get-location"
                    onClick={handleGetCurrentLocation}
                    disabled={gettingLocation}
                  >
                      {gettingLocation}
                    
                    {gettingLocation
                      ? "Getting location..."
                      : "Get Current Location"}
                  </button>
                )}

                <div className="coord-inputs">
                  <div className="coord-input">
                    <label htmlFor="latitude-oil">
                      Latitude
                    </label>
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
                      className="coord-input-field"
                    />
                  </div>
                  <div className="coord-input">
                    <label htmlFor="longitude-oil">
                      Longitude
                    </label>
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
                      className="coord-input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-analyze oil-analyze"
                disabled={isAnalyzing}
              >
                {isAnalyzing}
                {isAnalyzing ? "Analyzing..." : "Analyze Image"}
                {!isAnalyzing && <span className="btn-arrow">→</span>}
              </button>
            </form>
          </div>
        </div>

        {/* Right Panel - Analysis Result */}
        {isAnalyzing && !analysisResult ? (
          <div className="analysis-panel">
            <div className="analysis-loading" role="status" aria-live="polite">
              <div className="spinner-wrapper">
                <div className="spinner oil-spinner" aria-hidden="true"></div>
                <div className="spinner-glow oil-glow"></div>
              </div>
              <div className="loading-text">
                Analyzing oil spillage with AI...
              </div>
              <div className="loading-subtext">
                Detecting affected area and severity
              </div>
            </div>
          </div>
        ) : null}

        {analysisResult && (
          <div className="analysis-panel">
            <OilAnalysis
              result={analysisResult}
              userRole={userRole}
              onClose={() => setAnalysisResult(null)}
            />
          </div>
        )}
      </div>

      {/* History Section */}
      <div className="history-section">
        <div className="history-header">
          <div className="history-title-section">
            <h3 className="history-title">
              Oil Spillage Detection History
            </h3>
            <p className="history-subtitle">
              View your previous oil spillage detection results
            </p>
          </div>
          <button className="btn-export">
            <span className="export-icon">📥</span>
            Export Data
          </button>
        </div>

        <div className="history-table oil-history">
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
                    className={`severity-badge severity-${item.severity.toLowerCase()}`}
                  >
                    <span className="severity-icon">
                      {item.severity === "High"
                        ? "🔴"
                        : item.severity === "Medium"
                        ? "🟡"
                        : "🟢"}
                    </span>
                    {item.severity}
                  </span>
                </div>
                <div className="col-area">
                  <span className="area-text">📏 {item.area}</span>
                </div>
                <div className="col-location">
                  <span className="location-text">📍 {item.location}</span>
                </div>
                <div className="col-date">
                  <span className="date-text">🕒 {item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
