from flask import Flask
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for cross-origin requests
# Enable CORS for cross-origin requests with credentials support
CORS(
    app,
    resources={r"/*": {"origins": "http://localhost:3000"}},
    supports_credentials=True,
    intercept_exceptions=True
)

# Load config from config.py
app.config.from_object('config.Config')

# Initialize PyMongo (ensure this is done after the configuration is loaded)
mongo = PyMongo(app)

# Attach mongo to app
app.mongo = mongo

# Initialize JWT for token authentication
jwt = JWTManager(app)

# Import and register blueprints
from routes.auth import auth_bp
from routes.admin import admin_bp
from routes.user_products import user_products_bp
from routes.products import products_bp  # Import the products blueprint
app.register_blueprint(auth_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(products_bp)      # Register the products blueprint
app.register_blueprint(user_products_bp)

# Start the Flask application
if __name__ == '__main__':
    app.run(debug=True)
