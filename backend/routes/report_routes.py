from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId

# 🔧 Services
from services.detection_service import run_detection
from services.cloudinary_service import upload_image
from services.weather_service import fetch_weather_data
from services.prediction_service import predict_trajectory
from services.email_service import notify_authorities

# 🔧 Models
from models.authority_model import AuthorityModel
from models.report_model import ReportModel

report_bp = Blueprint("report_bp", __name__)


# Create new report (User)
@report_bp.route('/create', methods=['POST'])
@jwt_required()
def create_report():
    user_id = get_jwt_identity()
    data = request.data_dict

    # Input validation
    image_file = data.get("image")
    lat_val = data.get("lat")
    lng_val = data.get("lng") or data.get("long")

    if not all([image_file, lat_val, lng_val]):
        return jsonify({"error": "Image, latitude, and longitude are required"}), 400

    try:
        lat = float(lat_val)
        lng = float(lng_val)
    except (TypeError, ValueError):
        return jsonify({"error": "Latitude and Longitude must be numeric"}), 400

    # 1) Run ML detection (YOLO + optional debris model)
    try:
        processed_path, detected_type, confidences = run_detection(image_file)
    except Exception as e:
        print("Detection failed:", e)
        return jsonify({"error": "Failed to run ML models", "details": str(e)}), 500

    if detected_type == "none":
        return jsonify({"error": "No debris or oil spill detected in the image"}), 400

    report_type = detected_type

    # 2) Upload annotated image to Cloudinary
    try:
        with open(processed_path, "rb") as f:
            image_url = upload_image(f)
    except Exception as e:
        print("Cloudinary upload failed:", e)
        return jsonify({"error": "Failed to upload image", "details": str(e)}), 500

    # 3) Fetch weather and current data
    weather = fetch_weather_data(lat, lng)

    # 4) Predict debris/oil drift trajectory
    predicted_path = predict_trajectory(
        lat, lng, weather, report_type, steps=6, interval_minutes=30
    )

    # 5) Find authorities nearby (within 10 km)
    nearby_authorities = AuthorityModel.get_nearby_authorities(lat, lng, radius_km=10)
    notified_ids = [a["_id"] for a in nearby_authorities]

    # 6) Save report in MongoDB
    report_id = ReportModel.create_report(
        user_id=user_id,
        image_url=image_url,
        report_type=report_type,
        lat=lat,
        lng=lng,
        predicted_path=predicted_path,
        weather_data=weather,
        notified_authorities=notified_ids,
        ml_output={
            "debris_confidence": confidences.get("debris"),
            "oil_confidence": confidences.get("oil"),
        },
    )

    # 7) Notify nearby authorities by email
    try:
        notify_authorities(lat, lng, report_type, image_url, predicted_path, radius_km=10)
    except Exception as e:
        print("Email notification failed:", e)

    # 8) Send final response
    return jsonify({
        "message": f"{report_type.replace('_',' ').title()} detected and reported successfully",
        "report_id": str(report_id),
        "predicted_path": predicted_path,
        "confidences": confidences,
        "notified_authorities_count": len(notified_ids),
        "image_url": image_url,
    }), 201


# User Report History
@report_bp.route('/history', methods=['GET'])
@jwt_required()
def user_history():
    user_id = get_jwt_identity()
    reports = ReportModel.find_by_user(user_id)

    output = []
    for r in reports:
        output.append({
            "id": str(r["_id"]),
            "type": r.get("report_type"),
            "status": r.get("status", "pending"),
            "image_url": r.get("image_url"),
            "location": r.get("location"),
            "predicted_path": r.get("predicted_path", []),
            "created_at": r.get("created_at").isoformat() if r.get("created_at") else None,
        })

    return jsonify({"reports": output}), 200


# Authority: Assigned Reports (within their region)
@report_bp.route('/authority/assigned', methods=['GET'])
@jwt_required()
def authority_assigned_reports():
    authority_id = get_jwt_identity()
    assigned_reports = ReportModel.get_pending_for_authority(authority_id)

    output = []
    for r in assigned_reports:
        output.append({
            "id": str(r["_id"]),
            "type": r.get("report_type"),
            "status": r.get("status", "pending"),
            "image_url": r.get("image_url"),
            "location": r.get("location"),
            "predicted_path": r.get("predicted_path", []),
        })

    return jsonify({"reports": output}), 200