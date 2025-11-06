from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from bson import ObjectId
from database import mongo  # ✅ correct import
from app import bcrypt


auth_bp = Blueprint('auth_bp', __name__)

def serialize_user(user):
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"]
    }

# Register route
@auth_bp.route('/register', methods=['POST'])
def register():
    data = getattr(request, 'data_dict', request.form.to_dict())

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    if mongo.db.users.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    user_id = mongo.db.users.insert_one({
        "name": name,
        "email": email,
        "password": hashed_password
    }).inserted_id

    return jsonify({
        "message": "User registered successfully",
        "user": {"id": str(user_id), "name": name, "email": email}
    }), 201


# Login route
@auth_bp.route('/login', methods=['POST'])
def login():
    data = getattr(request, 'data_dict', request.form.to_dict())

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = mongo.db.users.find_one({"email": email})
    if not user or not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=str(user["_id"]), expires_delta=timedelta(hours=3))

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": serialize_user(user)
    }), 200


# Protected user route
@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_user():
    user_id = get_jwt_identity()
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(serialize_user(user)), 200
