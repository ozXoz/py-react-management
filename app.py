from flask import Flask
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from flask_uploads import UploadSet, configure_uploads, IMAGES, UploadNotAllowed




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
app.config['UPLOADED_IMAGES_DEST'] = 'uploads/images'  # Directory to store uploaded images


# Initialize PyMongo (ensure this is done after the configuration is loaded)
mongo = PyMongo(app)

# Attach mongo to app
app.mongo = mongo

# Initialize JWT for token authentication
jwt = JWTManager(app)

# Configure image uploading via Flask-Uploads
images = UploadSet('images', IMAGES)
configure_uploads(app, images)
app.images = images  # Attach the UploadSet to the app instance




# Import and register blueprints
from routes.auth import auth_bp
from routes.admin import admin_bp
from routes.user_products import user_products_bp
from routes.products import products_bp  # Import the products blueprint
from routes.reports import reports_bp  # Import the reports blueprint
app.register_blueprint(auth_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(products_bp)      # Register the products blueprint
app.register_blueprint(user_products_bp)
app.register_blueprint(reports_bp)  # Register the reports blueprint
# Start the Flask application
if __name__ == '__main__':
    app.run(debug=True)
