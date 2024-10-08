from flask import Flask
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from config import Config
from routes.auth import auth_bp
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS and set the allowed origin for the frontend (React)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Change origin to frontend port

# Load configuration from config.py
app.config.from_object(Config)

mongo = PyMongo(app)  # Initialize PyMongo with the app
jwt = JWTManager(app)  # Initialize JWTManager

# Register the auth blueprint
app.register_blueprint(auth_bp)

if __name__ == '__main__':
    app.run(debug=True)
