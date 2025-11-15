"use client";

import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { calculateTrajectory, getOceanDataByLocation } from "../utils/mapUtils";
import "../styles/map.css";

export default function TrajectoryMap({ latitude, longitude, type }) {
  const [trajectory, setTrajectory] = useState([]);
  const [oceanData, setOceanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getOceanDataByLocation(latitude, longitude);
        setOceanData(data);

        const traj = calculateTrajectory(latitude, longitude, data);
        setTrajectory(traj);
      } catch (error) {
        console.error("Error fetching trajectory data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [latitude, longitude]);

  useEffect(() => {
    if (!latitude || !longitude) return;
    if (loading) return;
    if (!containerRef.current) return;

    setMapError(null);
    const lat = Number(latitude);
    const lon = Number(longitude);

    if (mapRef.current) {
      try {
        mapRef.current.remove();
      } catch (e) {
        /* ignore */
      }
      mapRef.current = null;
    }

    if (containerRef.current && containerRef.current._leaflet_id) {
      try {
        delete containerRef.current._leaflet_id;
      } catch (e) {
        /* ignore */
      }
    }

    let createdMap = null;
    try {
      if (!L || typeof L.map !== "function") {
        throw new Error("Leaflet is not available in this environment");
      }

      const map = L.map(containerRef.current, {
        center: [lat, lon],
        zoom: 11,
        zoomControl: true,
      });
      mapRef.current = map;
      createdMap = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      // Helper to parse wind direction
      const parseWindDeg = (wd) => {
        if (wd === null || wd === undefined) return 0;
        if (typeof wd === "number") return wd;
        const n = parseFloat(String(wd).replace("°", ""));
        if (!isNaN(n)) return n;
        const cardinalMap = {
          N: 0,
          NNE: 22.5,
          NE: 45,
          ENE: 67.5,
          E: 90,
          ESE: 112.5,
          SE: 135,
          SSE: 157.5,
          S: 180,
          SSW: 202.5,
          SW: 225,
          WSW: 247.5,
          W: 270,
          WNW: 292.5,
          NW: 315,
          NNW: 337.5,
        };
        const key = String(wd).toUpperCase().trim();
        return cardinalMap[key] ?? 0;
      };

      const windDeg = parseWindDeg(
        oceanData?.windDirection ?? oceanData?.windDirectionDeg ?? 45
      );
      const windSpeed = oceanData?.windSpeed || 12;

      // Create trajectory prediction points (hardcoded for demo)
      const trajectoryPoints = [
        { time: "Now", lat: lat, lon: lon, label: "Current Position" },
        { time: "1h", lat: lat + 0.01, lon: lon + 0.005, label: "1 Hour" },
        { time: "3h", lat: lat + 0.03, lon: lon + 0.015, label: "3 Hours" },
        { time: "6h", lat: lat + 0.06, lon: lon + 0.03, label: "6 Hours" },
        { time: "12h", lat: lat + 0.12, lon: lon + 0.06, label: "12 Hours" },
        { time: "24h", lat: lat + 0.24, lon: lon + 0.12, label: "24 Hours" },
      ];

      // Draw trajectory line
      const trajectoryLine = trajectoryPoints.map((p) => [p.lat, p.lon]);
      L.polyline(trajectoryLine, {
        color: "#0891b2",
        weight: 3,
        opacity: 0.7,
        dashArray: "10, 10",
      }).addTo(map);

      // Add markers for each trajectory point
      trajectoryPoints.forEach((point, index) => {
        const isCurrentPosition = index === 0;
        const isFinalPosition = index === trajectoryPoints.length - 1;

        let markerColor = "#06b6d4";
        let markerSize = 12;

        if (isCurrentPosition) {
          markerColor = "#10b981";
          markerSize = 16;
        } else if (isFinalPosition) {
          markerColor = "#f59e0b";
          markerSize = 14;
        }

        const markerHtml = `
          <div style="
            width: ${markerSize}px;
            height: ${markerSize}px;
            background: ${markerColor};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          "></div>
        `;

        const icon = L.divIcon({
          className: "trajectory-point",
          html: markerHtml,
          iconSize: [markerSize, markerSize],
        });

        const marker = L.marker([point.lat, point.lon], { icon }).addTo(map);

        const popupContent = `
          <div class="trajectory-popup">
            <div class="popup-header">${point.label}</div>
            <div class="popup-body">
              <div class="popup-row">
                <span class="popup-label">Time:</span>
                <span class="popup-value">${point.time}</span>
              </div>
              <div class="popup-row">
                <span class="popup-label">Lat:</span>
                <span class="popup-value">${point.lat.toFixed(4)}°</span>
              </div>
              <div class="popup-row">
                <span class="popup-label">Lon:</span>
                <span class="popup-value">${point.lon.toFixed(4)}°</span>
              </div>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);

        if (isCurrentPosition) {
          marker.openPopup();
        }
      });

      // Add wind direction arrow at current position
      const windArrowSvg = `
        <svg width="80" height="48" viewBox="0 0 80 48" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(40,24) rotate(${windDeg})">
            <line x1="-30" y1="0" x2="20" y2="0" stroke="#0891b2" stroke-width="3" stroke-linecap="round" />
            <polygon points="20,0 14,-6 14,6" fill="#0891b2" />
          </g>
        </svg>
      `;

      const windIcon = L.divIcon({
        className: "wind-icon",
        html: windArrowSvg,
        iconSize: [80, 48],
      });

      const windMarker = L.marker([lat, lon], { icon: windIcon }).addTo(map);

      const wdText =
        typeof oceanData?.windDirection === "number"
          ? `${oceanData.windDirection}°`
          : oceanData?.windDirection ?? `${windDeg}°`;

      const windPopupContent = `
        <div class="wind-popup">
          <div class="popup-header">Wind Conditions</div>
          <div class="popup-body">
            <div class="popup-row">
              <span class="popup-label">Direction:</span>
              <span class="popup-value">${wdText}</span>
            </div>
            <div class="popup-row">
              <span class="popup-label">Speed:</span>
              <span class="popup-value">${windSpeed} km/h</span>
            </div>
          </div>
        </div>
      `;

      windMarker.bindPopup(windPopupContent);

      // Fit map bounds to show all trajectory points
      const bounds = L.latLngBounds(trajectoryLine);
      map.fitBounds(bounds, { padding: [50, 50] });
    } catch (err) {
      console.error("Error initializing map:", err);
      setMapError(err?.message || String(err));
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (e) {
          /* ignore */
        }
        mapRef.current = null;
      }
    }

    return () => {
      if (createdMap) {
        try {
          createdMap.remove();
        } catch (e) {
          /* ignore */
        }
      }
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (e) {
          /* ignore */
        }
        mapRef.current = null;
      }
      if (containerRef.current && containerRef.current._leaflet_id) {
        try {
          delete containerRef.current._leaflet_id;
        } catch (e) {
          /* ignore */
        }
      }
    };
  }, [latitude, longitude, oceanData, loading]);

  if (loading) {
    return (
      <div className="map-container">
        <div className="map-loading">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading trajectory map...</p>
          <p className="loading-subtext">
            Analyzing ocean currents and wind patterns
          </p>
        </div>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="map-container">
        <div className="map-error">
          <div className="error-icon">⚠️</div>
          <h4 className="error-title">Map Loading Failed</h4>
          <p className="error-message">{String(mapError)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trajectory-map">
      <div className="map-header">
        <div className="map-title-section">
          <span className="map-icon">{type === "debris" ? "🗑️" : "🛢️"}</span>
          <div className="map-title-text">
            <h4>
              {type === "debris"
                ? "Debris Movement Forecast"
                : "Oil Spill Drift Forecast"}
            </h4>
            <p>24-hour predicted trajectory based on ocean conditions</p>
          </div>
        </div>
      </div>

      <div className="map-wrapper">
        <div ref={containerRef} className="map-container-inner" />
      </div>

      {oceanData && (
        <div className="ocean-data-panel">
          <div className="data-header">
            <span className="data-icon">🌊</span>
            <h5>Ocean Conditions</h5>
          </div>
          <div className="data-grid">
            <div className="data-item">
              <span className="data-label">Wind Direction</span>
              <span className="data-value">
                {oceanData.windDirection || "NE"}{" "}
                {oceanData.windDirectionDeg
                  ? `(${oceanData.windDirectionDeg}°)`
                  : "(45°)"}
              </span>
            </div>
            <div className="data-item">
              <span className="data-label">Wind Speed</span>
              <span className="data-value">
                {oceanData.windSpeed || "12"} km/h
              </span>
            </div>
            <div className="data-item">
              <span className="data-label">Current Direction</span>
              <span className="data-value">
                {oceanData.currentDirection || "Northeast"}
              </span>
            </div>
            <div className="data-item">
              <span className="data-label">Current Speed</span>
              <span className="data-value">
                {oceanData.currentSpeed || "0.8"} m/s
              </span>
            </div>
            <div className="data-item">
              <span className="data-label">Wave Height</span>
              <span className="data-value">
                {oceanData.waveHeight || "1.2"} m
              </span>
            </div>
            <div className="data-item">
              <span className="data-label">Temperature</span>
              <span className="data-value">
                {oceanData.temperature || "18"} °C
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="map-legend">
        <div className="legend-header">
          <span className="legend-icon">ℹ️</span>
          <h5>Map Legend</h5>
        </div>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-marker current"></span>
            <span className="legend-label">Current Position</span>
          </div>
          <div className="legend-item">
            <span className="legend-marker prediction"></span>
            <span className="legend-label">Predicted Positions</span>
          </div>
          <div className="legend-item">
            <span className="legend-marker final"></span>
            <span className="legend-label">24-Hour Position</span>
          </div>
          <div className="legend-item">
            <div className="legend-line"></div>
            <span className="legend-label">Predicted Path</span>
          </div>
          <div className="legend-item">
            <svg
              width="40"
              height="20"
              viewBox="0 0 40 20"
              className="legend-arrow"
            >
              <g transform="translate(20,10)">
                <line
                  x1="-15"
                  y1="0"
                  x2="10"
                  y2="0"
                  stroke="#0891b2"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <polygon points="10,0 6,-3 6,3" fill="#0891b2" />
              </g>
            </svg>
            <span className="legend-label">Wind Direction</span>
          </div>
        </div>
      </div>
    </div>
  );
}
