from database.mongo import mongo
from flask_bcrypt import generate_password_hash, check_password_hash

class UserModel:

    @staticmethod
    def get_collection():
        # Safely access the collection after Flask initializes mongo
        return mongo.db.users

    @staticmethod
    def create_user(name, email, password, role="user"):
        hashed_pw = generate_password_hash(password).decode('utf-8')

        user_id = UserModel.get_collection().insert_one({
            "name": name,
            "email": email,
            "password": hashed_pw,
            "role": role
        }).inserted_id

        return user_id

    @staticmethod
    def find_by_email(email):
        return UserModel.get_collection().find_one({"email": email})

    @staticmethod
    def verify_password(hashed_password, password):
        return check_password_hash(hashed_password, password)
