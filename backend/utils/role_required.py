from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt

def role_required(allowed_roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            role = claims.get("role")
            if role not in allowed_roles:
                return jsonify({"error": "Access forbidden: insufficient role"}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator
