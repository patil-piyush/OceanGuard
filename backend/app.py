from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from config import Config
from database.mongo import mongo

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
                request.data_dict = request.get_json()
            else:
                request.data_dict = request.form.to_dict()

    # Import and register routes
    from routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    @app.route('/')
    def home():
        return jsonify({"message": "OceanGuard backend running..."})

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
