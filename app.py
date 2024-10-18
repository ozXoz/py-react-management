from flask import Flask
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from flask_cors import CORS
# from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_uploads import UploadSet, configure_uploads, IMAGES, UploadNotAllowed
from flask_jwt_extended import get_jwt_identity





# Initialize Flask app
app = Flask(__name__)

# Enable CORS for cross-origin requests
# Enable CORS for cross-origin requests with credentials support
CORS(
    app,
    resources={r"/*": {"origins": "http://localhost:3000"}},
    supports_credentials=True,
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

# Initialize SocketIO
# socketio = SocketIO(app, cors_allowed_origins="*")
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
from routes.orders import orders_bp
from routes.inventory import inventory_bp
app.register_blueprint(auth_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(products_bp)      # Register the products blueprint
app.register_blueprint(user_products_bp)
app.register_blueprint(reports_bp)  # Register the reports blueprint
app.register_blueprint(orders_bp)        # Register the orders blueprint
app.register_blueprint(inventory_bp)     # Register the inventory blueprint

# Live chat support backend
# clients = {}

# @socketio.on('connect')
# def handle_connect():
#     emit('connected', {'data': 'Connected to the server'})

# @socketio.on('join')
# def handle_join(data):
#     room = data.get('room')
#     join_room(room)
#     emit('room_joined', {'message': f'Joined room {room}'}, room=room)

# @socketio.on('send_message')
# def handle_message(data):
#     room = data.get('room')
#     message = data.get('message')
#     emit('receive_message', {'message': message, 'sender': 'user'}, room=room)

# @socketio.on('admin_message')
# def handle_admin_message(data):
#     room = data.get('room')
#     message = data.get('message')
#     emit('receive_message', {'message': message, 'sender': 'admin'}, room=room)


# # User initiates chat
# @socketio.on('initiate_chat')
# def handle_initiate_chat(data):
#     user_id = get_jwt_identity()  # Assuming you are using JWT for authentication
#     issue = data.get('issue')
    
#     # Notify admins about the incoming chat request
#     emit('support_request', {'user_id': user_id, 'issue': issue}, broadcast=True, room='admin')

# # Admin accepts chat
# @socketio.on('accept_chat')
# def handle_accept_chat(data):
#     user_id = data.get('user_id')
    
#     # Notify user that the admin accepted the chat
#     emit('chat_accepted', {'admin_id': get_jwt_identity()}, room=user_id)
    
#     # Join the room for real-time communication
#     join_room(user_id)    

# Start the Flask application with SocketIO
# if __name__ == '__main__':
#     socketio.run(app, debug=True, host='0.0.0.0', port=5000)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

