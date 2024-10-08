from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_pymongo import PyMongo

admin_bp = Blueprint('admin', __name__)
mongo = PyMongo()

# Protected Route (Admin only)
@admin_bp.route('/admin', methods=['GET'])
@jwt_required()
def admin():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Access forbidden'}), 403

    users = mongo.db.users.find()
    return jsonify([user['email'] for user in users]), 200
