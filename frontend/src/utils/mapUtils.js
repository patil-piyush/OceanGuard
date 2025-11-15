// Utility functions for trajectory calculations based on ocean data
export const calculateTrajectory = (startLat, startLng, oceanData) => {
  // Simulates trajectory calculation based on:
  // - Ocean current direction and speed
  // - Wind direction and speed
  // - Wave patterns

  const trajectory = []
  let currentLat = Number.parseFloat(startLat)
  let currentLng = Number.parseFloat(startLng)

  // Calculate positions at different time intervals
  const timeIntervals = [0, 1, 2, 6, 12, 24] // hours

  timeIntervals.forEach((hours) => {
    if (hours === 0) {
      trajectory.push({
        time: "Current",
        lat: currentLat,
        lng: currentLng,
        distance: 0,
      })
      return
    }

    // Apply drift based on ocean current (simplified calculation)
    const currentDrift = (oceanData?.currentSpeed || 0.5) * hours * 0.01
    const windDrift = (oceanData?.windSpeed || 10) * hours * 0.005

    currentLat -= currentDrift * Math.cos(Math.random())
    currentLng += currentDrift * Math.sin(Math.random())

    trajectory.push({
      time: `${hours}h later`,
      lat: currentLat.toFixed(6),
      lng: currentLng.toFixed(6),
      distance: (currentDrift + windDrift).toFixed(2),
    })
  })

  return trajectory
}

export const getOceanDataByLocation = async (latitude, longitude) => {
  // Try fetching live weather/wind data from Open-Meteo (free, no API key)
  try {
    const lat = Number(latitude)
    const lon = Number(longitude)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`

    const res = await fetch(url)
    if (!res.ok) throw new Error(`Open-Meteo request failed: ${res.status}`)
    const data = await res.json()

    const cw = data.current_weather || {}

    return {
      // Open-Meteo does not provide ocean current data; keep as null for now
      currentDirection: null,
      currentSpeed: null,
      // wind values from Open-Meteo (windspeed in km/h, winddirection in degrees)
      windDirection: cw.winddirection !== undefined ? `${Math.round(cw.winddirection)}°` : null,
      windSpeed: cw.windspeed ?? null,
      waveHeight: null,
      temperature: cw.temperature ?? null,
      source: "Open-Meteo",
    }
  } catch (err) {
    console.error("Error fetching ocean data from Open-Meteo:", err)
    // Fallback to mocked ocean data
    return {
      currentDirection: "NE",
      currentSpeed: 1.2, // knots
      windDirection: "N",
      windSpeed: 15, // km/h
      waveHeight: 1.5, // meters
      temperature: 15, // Celsius
      source: "Simulated Ocean API",
    }
  }
}

export const formatCoordinates = (lat, lng) => {
  const latDir = lat >= 0 ? "N" : "S"
  const lngDir = lng >= 0 ? "E" : "W"
  return `${Math.abs(lat).toFixed(6)}°${latDir}, ${Math.abs(lng).toFixed(6)}°${lngDir}`
}

export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return (R * c).toFixed(2)
}
