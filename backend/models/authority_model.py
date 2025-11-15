from database.mongo import mongo
from flask_bcrypt import generate_password_hash, check_password_hash
import math

def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371.0
    phi1 = math.radians(lat1); phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1); dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    return 2*R*math.asin(math.sqrt(a))
class AuthorityModel:

    @staticmethod
    def get_collection():
        # Access the Mongo collection safely AFTER Flask initializes Mongo
        return mongo.db.authorities

    @staticmethod
    def create_authority(name, email, password, station, lat, lng):
        hashed_pw = generate_password_hash(password).decode('utf-8')

        authority_id = AuthorityModel.get_collection().insert_one({
            "name": name,
            "email": email,
            "password": hashed_pw,
            "role": "authority",
            "station": station,
            "area": {"lat": lat, "lng": lng},
            "is_available": True
        }).inserted_id

        return authority_id

    @staticmethod
    def find_by_email(email):
        return AuthorityModel.get_collection().find_one({"email": email})

    @staticmethod
    def verify_password(hashed_password, password):
        return check_password_hash(hashed_password, password)

    @staticmethod
    def get_nearby_authorities(lat, lng, radius_km=10):
        """
        Returns list of authority documents within radius_km (based on area.lat/area.lng).
        Naive approach: fetch active authorities and filter by distance.
        """
        col = AuthorityModel.get_collection()
        # only pull available authorities to reduce load
        candidates = list(col.find({"is_available": True}))
        nearby = []
        for a in candidates:
            area = a.get("area") or {}
            a_lat = area.get("lat")
            a_lng = area.get("lng")
            if a_lat is None or a_lng is None:
                continue
            dist = haversine_km(lat, lng, float(a_lat), float(a_lng))
            if dist <= radius_km:
                a["_distance_km"] = dist
                nearby.append(a)
        # sort by distance ascending
        nearby.sort(key=lambda x: x["_distance_km"])
        return nearby
