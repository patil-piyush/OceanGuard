from database.mongo import mongo
from datetime import datetime
from bson import ObjectId

class ReportModel:

    @staticmethod
    def get_collection():
        return mongo.db.reports

    # ✅ Include ml_output param
    @staticmethod
    def create_report(user_id, image_url, report_type, lat, lng, predicted_path, weather_data, notified_authorities, ml_output=None):
        report = {
            "user_id": ObjectId(user_id) if isinstance(user_id, str) else user_id,
            "image_url": image_url,
            "type": report_type,  # "oil_spill" or "debris"
            "location": {"lat": float(lat), "lng": float(lng)},
            "predicted_path": predicted_path,  # list of {"lat","lng","eta"}
            "weather_data": weather_data,
            "notified_authorities": notified_authorities or [],
            "assigned_authority": None,
            "status": "pending",  # pending | accepted | in_progress | cleaned | completed
            "ml_output": ml_output or {},  # ✅ NEW FIELD
            "history": [
                {
                    "status": "pending",
                    "timestamp": datetime.utcnow(),
                    "by": None,
                    "remarks": "Report created",
                }
            ],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }

        result = ReportModel.get_collection().insert_one(report)
        return result.inserted_id

    @staticmethod
    def add_history_entry(report_id, status, by=None, remarks=None):
        """Append status updates to history with timestamp"""
        return ReportModel.get_collection().update_one(
            {"_id": ObjectId(report_id)},
            {
                "$push": {
                    "history": {
                        "status": status,
                        "timestamp": datetime.utcnow(),
                        "by": by,
                        "remarks": remarks,
                    }
                },
                "$set": {"status": status, "updated_at": datetime.utcnow()},
            },
        )

    @staticmethod
    def find_by_user(user_id):
        """Fetch all reports for a given user"""
        return list(
            ReportModel.get_collection()
            .find({"user_id": ObjectId(user_id)})
            .sort("created_at", -1)
        )

    @staticmethod
    def find_by_id(report_id):
        return ReportModel.get_collection().find_one({"_id": ObjectId(report_id)})

    @staticmethod
    def get_pending_for_authority(authority_id):
        """Pending reports in which this authority was notified but not yet assigned"""
        return list(
            ReportModel.get_collection()
            .find({
                "status": "pending",
                "notified_authorities": {"$in": [ObjectId(authority_id)]},
                "assigned_authority": None,
            })
            .sort("created_at", -1)
        )
