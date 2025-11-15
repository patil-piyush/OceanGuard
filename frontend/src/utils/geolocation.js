export function getCurrentLocation({ timeout = 10000 } = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator || !navigator.geolocation) {
      return reject(new Error('Geolocation is not supported by this browser'))
    }

    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      reject(new Error('Timed out while retrieving location'))
    }, timeout)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (timedOut) return
        clearTimeout(timer)
        resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude })
      },
      (error) => {
        if (timedOut) return
        clearTimeout(timer)
        // Map common error codes to messages for clarity
        let err = error
        try {
          if (error && typeof error.code === 'number') {
            const code = error.code
            const msg =
              code === 1
                ? 'Permission denied'
                : code === 2
                ? 'Position unavailable'
                : code === 3
                ? 'Timeout while retrieving position'
                : 'Unknown geolocation error'
            err = new Error(msg)
            err.code = code
          }
        } catch {
          // fallback to original error
        }
        reject(err)
      },
      { enableHighAccuracy: true, timeout, maximumAge: 0 },
    )
  })
}

/**
 * Try navigator geolocation, but optionally fall back to IP-based lookup
 * (uses https://ipapi.co/json). Fallback is attempted only when the error
 * isn't a permission denied (code 1).
 */
export async function getLocationWithFallback({ timeout = 10000, fallback = true } = {}) {
  try {
    const loc = await getCurrentLocation({ timeout })
    return loc
  } catch (err) {
    // If permission denied, don't fallback automatically
    if (err && err.code === 1) {
      throw err
    }

    if (!fallback) throw err

    // Try IP-based geolocation as a fallback
    try {
      // Note: this is best-effort and less accurate than GPS
      const resp = await fetch('https://ipapi.co/json')
      if (!resp.ok) throw new Error('IP geolocation lookup failed')
      const data = await resp.json()
      const lat = parseFloat(data.latitude || data.lat || data.latitude)
      const lon = parseFloat(data.longitude || data.lon || data.longitude)
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        const fallbackErr = new Error('Used IP-based location fallback (less accurate)')
        fallbackErr.fallback = true
        fallbackErr.source = 'ipapi'
        return { latitude: lat, longitude: lon, _fallbackNotice: fallbackErr }
      }
      throw new Error('IP geolocation returned invalid coordinates')
    } catch (ipErr) {
      // attach original geolocation error for context
      const combined = new Error((err && err.message ? err.message + ' - ' : '') + (ipErr && ipErr.message ? ipErr.message : 'Fallback failed'))
      combined.original = err
      combined.fallbackError = ipErr
      throw combined
    }
  }
}

export function formatLatLng(lat, lng) {
  // lat, lng are numbers
  const latAbs = Math.abs(Number(lat))
  const lngAbs = Math.abs(Number(lng))
  const latHem = Number(lat) >= 0 ? "N" : "S"
  const lngHem = Number(lng) >= 0 ? "E" : "W"
  const latStr = `${latAbs.toFixed(6)}°${latHem}`
  const lngStr = `${lngAbs.toFixed(6)}°${lngHem}`
  const combined = `${latStr}, ${lngStr}`
  return { latStr, lngStr, combined }
}

export async function getIpLocation() {
  // Direct IP-based lookup (best-effort, less accurate than GPS)
  const resp = await fetch("https://ipapi.co/json")
  if (!resp.ok) throw new Error("IP geolocation lookup failed")
  const data = await resp.json()
  const lat = parseFloat(data.latitude || data.lat || data.latitude)
  const lon = parseFloat(data.longitude || data.lon || data.longitude)
  if (Number.isFinite(lat) && Number.isFinite(lon)) {
    return { latitude: lat, longitude: lon }
  }
  throw new Error("IP geolocation returned invalid coordinates")
}

