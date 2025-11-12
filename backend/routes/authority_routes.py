from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from bson import ObjectId
from models.authority_model import AuthorityModel
from database.mongo import mongo
from models.report_model import ReportModel



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





# Allowed status transitions (you can adjust as you want)
ALLOWED_STATUSES = ["accepted", "in_progress", "cleaned", "completed", "rejected"]


# Helper: Works with both JSON and multipart/form-data
def get_request_data():
    if request.is_json:
        return request.get_json() or {}
    elif request.form:
        return request.form.to_dict()
    else:
        return {}


# PATCH: authority decision (accept or reject)
@authority_bp.route('/decision', methods=['PATCH'])
@jwt_required()
def authority_decision():
    """
    Authority accepts or rejects a report.
    Body: { "report_id": "...", "decision": "accept"|"reject", "remarks": "optional" }
    """
    authority_id = get_jwt_identity()
    data = get_request_data()    
    report_id = data.get("report_id")
    decision = (data.get("decision") or "").lower()
    remarks = data.get("remarks")

    if not report_id or decision not in ["accept", "reject"]:
        return jsonify({"error": "report_id and decision ('accept'|'reject') required"}), 400

    # optionally fetch authority name for history
    authority = None
    try:
        authority = AuthorityModel.find_by_id(ObjectId(authority_id)) if isinstance(authority_id, str) else AuthorityModel.find_by_id(authority_id)
        authority_name = authority.get("name") if authority else str(authority_id)
    except Exception:
        authority_name = str(authority_id)

    if decision == "accept":
        res = ReportModel.assign_authority(report_id, authority_id, authority_name=authority_name, remarks=remarks)
        if res.matched_count == 0:
            return jsonify({"error": "Cannot accept: report may be already assigned, not pending, or you were not notified."}), 400
        return jsonify({"message": "Report accepted successfully", "status": "accepted"}), 200

    else:  # reject
        res = ReportModel.reject_report(report_id, authority_id, authority_name=authority_name, remarks=remarks)
        if res.matched_count == 0:
            return jsonify({"error": "Cannot reject: you were not notified about this report"}), 400
        return jsonify({"message": "Report rejected successfully", "status": "rejected"}), 200



# PATCH: authority updates status of an assigned report
@authority_bp.route('/update_status', methods=['PATCH'])
@jwt_required()
def authority_update_status():
    """
    Authority updates the status of an assigned report.
    Body: { "report_id": "...", "status": "in_progress"|"cleaned"|"completed", "remarks": "optional" }
    """
    authority_id = get_jwt_identity()
    data = get_request_data()
    report_id = data.get("report_id")
    new_status = (data.get("status") or "").lower()
    remarks = data.get("remarks")

    if not report_id or new_status not in ALLOWED_STATUSES:
        return jsonify({"error": f"report_id and valid status required. Allowed: {ALLOWED_STATUSES}"}), 400

    # ensure authority is assigned to this report
    report = ReportModel.find_by_id(report_id)
    if not report:
        return jsonify({"error": "Report not found"}), 404

    if not report.get("assigned_authority"):
        return jsonify({"error": "Report is not assigned to any authority"}), 400

    # assigned_authority stored as ObjectId
    assigned = str(report.get("assigned_authority"))
    if str(authority_id) != assigned:
        return jsonify({"error": "You are not the assigned authority for this report"}), 403

    # perform update
    authority_name = None
    try:
        authority_doc = AuthorityModel.find_by_id(ObjectId(authority_id))
        authority_name = authority_doc.get("name") if authority_doc else str(authority_id)
    except Exception:
        authority_name = str(authority_id)

    res = ReportModel.update_status(report_id, authority_id, new_status, remarks=remarks, authority_name=authority_name)

    if res.matched_count == 0:
        return jsonify({"error": "Status update failed (check permissions)"}), 400

    # Optionally: notify the user about status change (you can implement an email_service.notify_user)
    # e.g. notify_user(report['user_id'], f"Report status updated to {new_status}", ...)

    return jsonify({"message": "Status updated successfully", "current_status": new_status}), 200


# GET: authority history (completed reports for this authority)
@authority_bp.route('/history', methods=['GET'])
@jwt_required()
def authority_history():
    authority_id = get_jwt_identity()
    completed = ReportModel.get_completed_by_authority(authority_id)

    out = []
    for r in completed:
        out.append({
            "id": str(r["_id"]),
            "type": r.get("type"),
            "status": r.get("status"),
            "image_url": r.get("image_url"),
            "location": r.get("location"),
            "predicted_path": r.get("predicted_path", []),
            "created_at": r.get("created_at").isoformat() if r.get("created_at") else None,
            "updated_at": r.get("updated_at").isoformat() if r.get("updated_at") else None,
            "history": r.get("history", [])
        })

    return jsonify({"reports": out}), 200