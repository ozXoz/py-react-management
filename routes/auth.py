# routes/auth.py

from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import cross_origin
import logging
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.DEBUG)

auth_bp = Blueprint('auth', __name__)

# Registration Route
@auth_bp.route('/register', methods=['POST'])
@cross_origin(origin='http://localhost:3000')  # Allow CORS for your frontend
def register():
    data = request.get_json()

    # Validate input data
    if 'email' not in data or 'password' not in data:
        return jsonify({'message': 'Email and password are required'}), 400

    hashed_password = generate_password_hash(data['password'])
    user_role = data.get('role', 'user')  # Default role is 'user'

    # Access MongoDB via current_app
    mongo = current_app.mongo

    # Check if the user already exists
    existing_user = mongo.db.users.find_one({'email': data['email']})
    if existing_user:
        return jsonify({'message': 'Email already registered'}), 409  # Conflict status code

    # Add user to the database
    try:
        mongo.db.users.insert_one({
            'email': data['email'],
            'password': hashed_password,
            'role': user_role,
            'permissions': {
                'add_product': True,
                'update_product': True,
                'delete_product': True
            },
            'registration_time': datetime.utcnow(),  # Save registration time (UTC)
            'last_seen': datetime.utcnow(),          # Initial last seen time set at registration
            'online_duration': 0                     # Initial duration is 0
        })
        logging.info(f"User {data['email']} registered successfully")
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        logging.error(f'Error registering user: {e}')
        return jsonify({'message': f'Error registering user: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return jsonify({'message': 'Preflight request successful'}), 200  # Return OK for preflight requests

    # Handle POST request for login
    data = request.get_json()

    # Validate input data
    if 'email' not in data or 'password' not in data:
        return jsonify({'message': 'Email and password are required'}), 400

    # Access MongoDB via current_app
    mongo = current_app.mongo

    # Find the user by email
    user = mongo.db.users.find_one({'email': data['email']})

    # Validate password and issue JWT token
    if user and check_password_hash(user['password'], data['password']):
        access_token = create_access_token(identity={'email': user['email'], 'role': user['role']})
        # Update last seen time
        mongo.db.users.update_one(
            {'email': user['email']},
            {'$set': {
                'last_seen': datetime.utcnow(),
                'login_time': datetime.utcnow()  # Save login time
            }}
        )
        logging.info(f"User {data['email']} logged in successfully")
        return jsonify(access_token=access_token, role=user['role']), 200
    else:
        logging.warning(f"Login attempt failed for email: {data['email']}")
        return jsonify({'message': 'Invalid credentials'}), 401

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    try:
        current_user = get_jwt_identity()
        email = current_user['email']

        # Access MongoDB via current_app
        mongo = current_app.mongo

        # Get the login time from the database
        user = mongo.db.users.find_one({'email': email})
        if not user or 'login_time' not in user:
            return jsonify({'message': 'User login time not found'}), 400

        # Calculate the duration
        login_time = user['login_time']
        current_time = datetime.utcnow()
        duration = (current_time - login_time).total_seconds()  # Duration in seconds

        # Update the online_duration in the database
        mongo.db.users.update_one(
            {'email': email},
            {'$inc': {'online_duration': duration}}  # Increment the total duration
        )

        logging.info(f"User {email} logged out. Online duration: {duration} seconds")
        return jsonify({'message': 'Logged out successfully', 'duration': duration}), 200

    except Exception as e:
        logging.error(f"Error during logout: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500
