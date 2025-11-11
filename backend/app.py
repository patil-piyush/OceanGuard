from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from config import Config
from database.mongo import mongo
from routes.authority_routes import authority_bp
from routes.user_routes import auth_bp
from routes.report_routes import report_bp

bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    CORS(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    mongo.init_app(app)

    # Middleware for parsing request data
    @app.before_request
    def parse_data():
        if request.method in ['POST', 'PUT', 'PATCH']:
            if request.is_json:
                # ✅ JSON payload
                request.data_dict = request.get_json()
            elif request.content_type and 'multipart/form-data' in request.content_type:
                # ✅ Form-data (for image uploads or file + text)
                form_data = request.form.to_dict()
                file_data = {key: file for key, file in request.files.items()}
                form_data.update(file_data)
                request.data_dict = form_data
            elif request.content_type and 'application/x-www-form-urlencoded' in request.content_type:
                # ✅ Regular HTML form submissions
                request.data_dict = request.form.to_dict()
            else:
                request.data_dict = {}


    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/user")
    app.register_blueprint(authority_bp, url_prefix="/api/authority")
    app.register_blueprint(report_bp, url_prefix="/api/report")



    @app.route('/')
    def home():
        return jsonify({"message": "OceanGuard backend running..."})

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
