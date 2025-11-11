from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from bson import ObjectId
from models.authority_model import AuthorityModel
from database.mongo import mongo

authority_bp = Blueprint('authority_bp', __name__)

def serialize_authority(a):
    return {
        "id": str(a["_id"]),
        "name": a["name"],
        "email": a["email"],
        "station": a.get("station"),
        "area": a.get("area")
    }

# Register authority
@authority_bp.route('/register', methods=['POST'])
def register():
    data = request.data_dict
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    station = data.get("station")

    # Extract lat/lng safely
    lat_value = data.get("lat")
    lng_value = data.get("lng")

    try:
        lat = float(lat_value)
        lng = float(lng_value)
    except (TypeError, ValueError):
        return jsonify({"error": "Latitude and Longitude must be provided as numbers"}), 400

    if not all([name, email, password, station]):
        return jsonify({"error": "All fields are required"}), 400

    if AuthorityModel.find_by_email(email):
        return jsonify({"error": "Email already exists"}), 400

    authority_id = AuthorityModel.create_authority(name, email, password, station, lat, lng)

    return jsonify({
        "message": "Authority registered successfully",
        "authority": {"id": str(authority_id), "name": name, "email": email, "station": station}
    }), 201

# Login authority
@authority_bp.route('/login', methods=['POST'])
def login():
    data = request.data_dict
    email = data.get("email")
    password = data.get("password")

    authority = AuthorityModel.find_by_email(email)
    if not authority or not AuthorityModel.verify_password(authority["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(
        identity=str(authority["_id"]),
        additional_claims={"role": "authority"},
        expires_delta=timedelta(hours=3)
    )

    return jsonify({
        "message": "Login successful",
        "token": token,
        "authority": serialize_authority(authority)
    }), 200

# Get authority profile
@authority_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    authority_id = get_jwt_identity()
    authority = AuthorityModel.get_collection().find_one({"_id": ObjectId(authority_id)})

    if not authority:
        return jsonify({"error": "Authority not found"}), 404

    return jsonify({
        "authority": serialize_authority(authority)
    }), 200


# Update authority profile
@authority_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    authority_id = get_jwt_identity()
    data = request.data_dict

    update_data = {}
    if "name" in data:
        update_data["name"] = data["name"]
    if "station" in data:
        update_data["station"] = data["station"]
    if "lat" in data and "lng" in data:
        try:
            lat = float(data["lat"])
            lng = float(data["lng"])
            update_data["area"] = {"lat": lat, "lng": lng}
        except (TypeError, ValueError):
            return jsonify({"error": "Latitude and Longitude must be numbers"}), 400

    if not update_data:
        return jsonify({"error": "No valid fields to update"}), 400

    result = AuthorityModel.get_collection().update_one(
        {"_id": ObjectId(authority_id)},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Authority not found"}), 404

    authority = AuthorityModel.get_collection().find_one({"_id": ObjectId(authority_id)})

    return jsonify({
        "message": "Profile updated successfully",
        "authority": serialize_authority(authority)
    }), 200


# Update authority availability
@authority_bp.route('/availability', methods=['PUT'])
@jwt_required()
def update_availability():
    data = request.data_dict
    user_id = get_jwt_identity()

    raw_value = data.get("is_available")

    # Safely convert string to boolean
    if isinstance(raw_value, bool):
        is_available = raw_value
    elif isinstance(raw_value, str):
        if raw_value.lower() in ["true", "1", "yes"]:
            is_available = True
        elif raw_value.lower() in ["false", "0", "no"]:
            is_available = False
        else:
            return jsonify({"error": "Invalid boolean value for is_available"}), 400
    else:
        return jsonify({"error": "is_available must be provided"}), 400

    # Update in MongoDB
    mongo.db.authorities.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"is_available": is_available}}
    )

    return jsonify({
        "message": "Availability updated successfully",
        "is_available": is_available
    }), 200