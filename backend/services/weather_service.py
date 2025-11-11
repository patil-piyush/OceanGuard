import requests
from datetime import datetime

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"
OPEN_METEO_MARINE_URL = "https://marine-api.open-meteo.com/v1/marine"

def fetch_weather_data(lat, lng):
    """
    Fetch both wind and ocean current data from Open-Meteo APIs.
    Returns a dictionary with wind_speed, wind_direction,
    current_speed, current_direction, and timestamp.
    """

    weather = {
        "timestamp": datetime.utcnow().isoformat(),
        "wind_speed": None,
        "wind_direction": None,
        "current_speed": None,
        "current_direction": None
    }

    # --- 1️⃣ Fetch wind data ---
    try:
        params_wind = {
            "latitude": lat,
            "longitude": lng,
            "hourly": "winddirection_10m,windspeed_10m",
            "timezone": "UTC"
        }
        resp_wind = requests.get(OPEN_METEO_URL, params=params_wind, timeout=10)
        data_wind = resp_wind.json()
        hourly = data_wind.get("hourly", {})
        wind_speeds = hourly.get("windspeed_10m", [])
        wind_dirs = hourly.get("winddirection_10m", [])
        timestamps = hourly.get("time", [])
        if wind_speeds and wind_dirs:
            weather["wind_speed"] = wind_speeds[0]
            weather["wind_direction"] = wind_dirs[0]
            weather["timestamp"] = timestamps[0] if timestamps else weather["timestamp"]
    except Exception as e:
        print("⚠️ Wind data fetch failed:", e)

    # --- 2️⃣ Fetch ocean current data ---
    try:
        params_curr = {
            "latitude": lat,
            "longitude": lng,
            "hourly": "current_speed,current_direction",
            "timezone": "UTC"
        }
        resp_curr = requests.get(OPEN_METEO_MARINE_URL, params=params_curr, timeout=10)
        data_curr = resp_curr.json()
        hourly = data_curr.get("hourly", {})
        curr_speeds = hourly.get("current_speed", [])
        curr_dirs = hourly.get("current_direction", [])
        if curr_speeds and curr_dirs:
            weather["current_speed"] = curr_speeds[0]
            weather["current_direction"] = curr_dirs[0]
    except Exception as e:
        print("⚠️ Ocean current data fetch failed:", e)

    # Add raw API results (optional)
    weather["raw"] = {
        "wind_api": data_wind if 'data_wind' in locals() else None,
        "curr_api": data_curr if 'data_curr' in locals() else None
    }

    return weather
