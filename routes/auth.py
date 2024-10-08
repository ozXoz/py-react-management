from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from flask_pymongo import PyMongo
from flask_cors import cross_origin
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)

auth_bp = Blueprint('auth', __name__)

# Registration Route
@auth_bp.route('/register', methods=['POST'])
@cross_origin(origin='http://localhost:3000')  # Allow CORS for your frontend
def register():
    mongo = PyMongo(current_app)  # Initialize PyMongo with the current_app context
    data = request.get_json()

    # Validate input data
    if 'email' not in data or 'password' not in data:
        return jsonify({'message': 'Email and password are required'}), 400

    hashed_password = generate_password_hash(data['password'])
    user_role = data.get('role', 'user')  # Default role is 'user'

    # Check if the user already exists
    existing_user = mongo.db.users.find_one({'email': data['email']})
    if existing_user:
        return jsonify({'message': 'Email already registered'}), 409  # Conflict status code

    # Add user to the database
    try:
        mongo.db.users.insert_one({
            'email': data['email'],
            'password': hashed_password,
            'role': user_role
        })
        logging.info(f"User {data['email']} registered successfully")
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        logging.error(f'Error registering user: {e}')
        return jsonify({'message': f'Error registering user: {str(e)}'}), 500


# Login Route
@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
@cross_origin(origin='http://localhost:3000')  # Allow CORS for your frontend
def login():
    if request.method == 'OPTIONS':
        return jsonify({'message': 'Preflight request'}), 200  # Return OK for preflight requests

    # Handle POST request for login
    mongo = PyMongo(current_app)
    data = request.get_json()

    # Validate input data
    if 'email' not in data or 'password' not in data:
        return jsonify({'message': 'Email and password are required'}), 400

    # Find the user by email
    user = mongo.db.users.find_one({'email': data['email']})

    # Validate password and issue JWT token
    if user and check_password_hash(user['password'], data['password']):
        access_token = create_access_token(identity={'email': user['email'], 'role': user['role']})
        logging.info(f"User {data['email']} logged in successfully")
        return jsonify(access_token=access_token, role=user['role']), 200
    else:
        logging.warning(f"Login attempt failed for email: {data['email']}")
        return jsonify({'message': 'Invalid credentials'}), 401
