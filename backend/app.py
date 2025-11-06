from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from config import Config
from database import mongo  # ✅ use centralized mongo

bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    mongo.init_app(app)   # ✅ initializes shared mongo
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Middleware for parsing form-data & JSON
    @app.before_request
    def parse_form_data():
        if request.method in ['POST', 'PUT', 'PATCH']:
            if request.content_type and 'application/x-www-form-urlencoded' in request.content_type:
                request.data_dict = request.form.to_dict()
            elif request.content_type and 'multipart/form-data' in request.content_type:
                request.data_dict = request.form.to_dict()
                request.data_dict.update({key: file for key, file in request.files.items()})
            elif request.is_json:
                request.data_dict = request.get_json()
            else:
                request.data_dict = {}

    from routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    @app.route('/')
    def home():
        return {"message": "OceanGuard backend running with MongoDB and JWT"}

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
