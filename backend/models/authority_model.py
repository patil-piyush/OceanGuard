from database.mongo import mongo
from flask_bcrypt import generate_password_hash, check_password_hash

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
