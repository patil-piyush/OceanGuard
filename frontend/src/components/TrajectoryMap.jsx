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
    // initialize Leaflet map when we have coordinates and the container is mounted
    if (!latitude || !longitude) return;
    if (loading) return;
    if (!containerRef.current) return;

    // reset any previous error
    setMapError(null);
    const lat = Number(latitude);
    const lon = Number(longitude);

    // remove previous map if any
    if (mapRef.current) {
      try {
        mapRef.current.remove();
      } catch (e) {
        /* ignore */
      }
      mapRef.current = null;
    }

    // If a previous Leaflet instance left a marker on the DOM container
    // (happens in strict/dev double-mounts), remove the flag so Leaflet
    // can re-initialize the map without throwing "already initialized".
    if (containerRef.current && containerRef.current._leaflet_id) {
      try {
        // deleting the internal id is a safe way to allow re-initialization
        // (Leaflet stores a numeric id on the DOM node when a map is attached).
        // eslint-disable-next-line no-param-reassign
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
        zoom: 10,
        zoomControl: true,
      });
      mapRef.current = map;
      createdMap = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      // draw a simple wind arrow at the center using a DivIcon with SVG
      // helper to parse wind direction (supports degrees or cardinal like 'N', 'NE')
      const parseWindDeg = (wd) => {
        if (wd === null || wd === undefined) return 0;
        if (typeof wd === "number") return wd;
        const n = parseFloat(String(wd).replace("°", ""));
        if (!isNaN(n)) return n;
        // basic cardinal to degrees mapping
        const map = {
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
        return map[key] ?? 0;
      };

      const windDeg = parseWindDeg(
        oceanData?.windDirection ?? oceanData?.windDirectionDeg
      );
      const windSpeed = (oceanData && oceanData.windSpeed) || 0;

      const svg = `
        <svg width="80" height="48" viewBox="0 0 80 48" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(40,24) rotate(${windDeg})">
            <line x1="-30" y1="0" x2="20" y2="0" stroke="#0ec5ff" stroke-width="3" stroke-linecap="round" />
            <polygon points="20,0 14,-6 14,6" fill="#0ec5ff" />
          </g>
        </svg>
      `;

      const icon = L.divIcon({
        className: "wind-icon",
        html: svg,
        iconSize: [80, 48],
      });
      const marker = L.marker([lat, lon], { icon }).addTo(map);

      // add a small popup with wind info
      if (oceanData) {
        const wdText =
          typeof oceanData.windDirection === "number"
            ? `${oceanData.windDirection}°`
            : oceanData.windDirection ?? `${windDeg}°`;
        marker
          .bindPopup(
            `<b>Wind</b>: ${wdText} ${oceanData.windSpeed ?? "—"} km/h`
          )
          .openPopup();
      }
    } catch (err) {
      console.error("Error initializing map:", err);
      setMapError(err?.message || String(err));
      // cleanup any partially created map
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (e) {
          /* ignore */
        }
        mapRef.current = null;
      }
    }

    // always return a cleanup function to remove the map and clear DOM flags
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
          // eslint-disable-next-line no-param-reassign
          delete containerRef.current._leaflet_id;
        } catch (e) {
          /* ignore */
        }
      }
    };
  }, [latitude, longitude, oceanData]);

  if (loading) return <div className="map-loading">Loading map...</div>;
  if (mapError)
    return (
      <div className="map-error">Map failed to load: {String(mapError)}</div>
    );

  return (
    <div className="trajectory-map">
      <h4>
        {type === "debris"
          ? "Debris Movement Forecast"
          : "Oil Spill Drift Forecast"}
      </h4>
      <div ref={containerRef} style={{ width: "100%", height: 420 }} />
    </div>
  );
}
