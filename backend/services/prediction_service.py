import math
from datetime import datetime, timedelta

EARTH_RADIUS_KM = 6371.0

def meters_to_deg_lat(m):
    return m / 111000.0

def meters_to_deg_lng(m, lat):
    return m / (111000.0 * math.cos(math.radians(lat)))

def vector_from_speed_dir(speed, direction_deg):
    """Convert (speed in m/s, direction in deg-from) to x/y components (east/north)."""
    if speed is None or direction_deg is None:
        return 0.0, 0.0
    theta_deg = (direction_deg + 180) % 360  # from → to
    theta_rad = math.radians(theta_deg)
    dx = speed * math.sin(theta_rad)   # east
    dy = speed * math.cos(theta_rad)   # north
    return dx, dy

def predict_trajectory(lat, lng, weather_data, report_type, steps=6, interval_minutes=30):
    """
    Predict future debris/oil drift based on both wind and ocean currents.
    Returns list of {"lat","lng","eta"}.
    """

    wind_speed = weather_data.get("wind_speed")
    wind_direction = weather_data.get("wind_direction")
    current_speed = weather_data.get("current_speed")
    current_direction = weather_data.get("current_direction")

    # Convert to drift components (in m/s)
    dx_wind, dy_wind = vector_from_speed_dir(wind_speed, wind_direction)
    dx_curr, dy_curr = vector_from_speed_dir(current_speed, current_direction)

    # Adjust coefficients (wind influence smaller for debris, larger for oil)
    if report_type == "debris":
        wind_factor = 0.03  # debris moves 3% of wind speed
    else:  # oil spill
        wind_factor = 0.06  # oil slick moves ~6% of wind speed

    # Combine wind + current
    dx_total = dx_curr + dx_wind * wind_factor
    dy_total = dy_curr + dy_wind * wind_factor

    points = []
    now = datetime.utcnow()
    current_lat = float(lat)
    current_lng = float(lng)

    for i in range(steps):
        seconds = interval_minutes * 60 * (i + 1)
        dist_east_m = dx_total * seconds
        dist_north_m = dy_total * seconds

        dlat = meters_to_deg_lat(dist_north_m)
        dlng = meters_to_deg_lng(dist_east_m, current_lat)

        points.append({
            "lat": current_lat + dlat,
            "lng": current_lng + dlng,
            "eta": (now + timedelta(minutes=interval_minutes * (i + 1))).isoformat() + "Z"
        })

    return points
