from flask import Blueprint, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

user_chat_bp = Blueprint('user_chat', __name__)

# Fetch emails based on the role of the logged-in user
@user_chat_bp.route('/emails', methods=['GET'])
@jwt_required()
def get_all_emails():
    current_user = get_jwt_identity()
    mongo = current_app.mongo

    # Assuming the 'role' field differentiates between users and admins
    if current_user['role'] == 'admin':
        # If admin, fetch all user emails
        users_cursor = mongo.db.users.find({'role': 'user'}, {'email': 1})
        emails = [user['email'] for user in users_cursor]
    else:
        # If a regular user, fetch only the admin emails
        users_cursor = mongo.db.users.find({'role': 'admin'}, {'email': 1})
        emails = [user['email'] for user in users_cursor]

    return jsonify(emails), 200
