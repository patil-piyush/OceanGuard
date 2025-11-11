from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from bson import ObjectId
from datetime import timedelta
from models.user_model import UserModel
from database.mongo import mongo
from flask_bcrypt import generate_password_hash

auth_bp = Blueprint('auth_bp', __name__)

def serialize_user(user):
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "role": user["role"]
    }

# 🧩 Register
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.data_dict
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "user")  # default role

    if not all([name, email, password]):
        return jsonify({"error": "All fields are required"}), 400

    if UserModel.find_by_email(email):
        return jsonify({"error": "Email already exists"}), 400

    user_id = UserModel.create_user(name, email, password, role)
    return jsonify({
        "message": "User registered successfully",
        "user": {"id": str(user_id), "name": name, "email": email, "role": role}
    }), 201


# 🧩 Login
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.data_dict
    email = data.get("email")
    password = data.get("password")

    user = UserModel.find_by_email(email)
    if not user or not UserModel.verify_password(user["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    # JWT includes user id and role
    token = create_access_token(
        identity=str(user["_id"]),               # ✅ must be a string
        additional_claims={"role": user["role"]}, # ✅ store role here
        expires_delta=timedelta(hours=3)
    )


    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": serialize_user(user)
    }), 200


# 🧩 Get Current User
@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_user():
    user_id = get_jwt_identity()  # this is now a string
    claims = get_jwt()            # this includes role info
    role = claims.get("role")

    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "role": role
    }), 200


# Edit profile route
@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def edit_profile():
    user_id = get_jwt_identity()
    data = request.data_dict

    update_data = {}

    # Update name if provided
    if "name" in data and data["name"].strip():
        update_data["name"] = data["name"].strip()

    # Update email if provided
    if "email" in data and data["email"].strip():
        update_data["email"] = data["email"].strip()

    # Update password if provided
    if "password" in data and data["password"].strip():
        hashed_pw = generate_password_hash(data["password"]).decode('utf-8')
        update_data["password"] = hashed_pw

    # No valid fields?
    if not update_data:
        return jsonify({"error": "No valid fields to update"}), 400

    # Perform the update in MongoDB
    mongo.db.users.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})

    # Fetch the updated user
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})

    # Helper to format the response
    def serialize_user(user):
        return {
            "id": str(user["_id"]),
            "name": user.get("name"),
            "email": user.get("email"),
            "role": user.get("role", "user")
        }

    return jsonify({
        "message": "Profile updated successfully",
        "user": serialize_user(user)
    }), 200
