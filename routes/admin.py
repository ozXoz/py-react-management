from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Blueprint setup
admin_bp = Blueprint('admin', __name__)

# Route to fetch all users (admin only)
@admin_bp.route('/admin/users', methods=['GET'])
@jwt_required()
def get_users():
    try:
        # Get the identity of the current user
        current_user = get_jwt_identity()

        # Check if the user is an admin
        if current_user['role'] != 'admin':
            logging.warning(f"Unauthorized access attempt by {current_user['email']}")
            return jsonify({'message': 'Access forbidden'}), 403

        # Access MongoDB via current_app
        mongo = current_app.mongo

        if not mongo:
            logging.error("PyMongo is not initialized or found in current_app")
            return jsonify({'message': 'Server error: PyMongo not initialized'}), 500

        # Fetch all users, excluding their passwords
        users = mongo.db.users.find({}, {'password': 0})  # Exclude password for security reasons
        user_list = []
        for user in users:
            user_info = {
                'email': user['email'],
                'role': user['role'],
                'registration_time': user.get('registration_time'),
                'last_seen': user.get('last_seen'),
                'online_duration': user.get('online_duration', 0)
            }
            user_list.append(user_info)

        return jsonify(user_list), 200

    except Exception as e:
        logging.error(f"Error fetching users: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500


# Route to delete a user (admin only)
@admin_bp.route('/admin/users/<email>', methods=['DELETE'])
@jwt_required()
def delete_user(email):
    try:
        # Get the identity of the current user
        current_user = get_jwt_identity()

        # Only admins can delete users
        if current_user['role'] != 'admin':
            logging.warning(f"Unauthorized deletion attempt by {current_user['email']}")
            return jsonify({'message': 'Access forbidden'}), 403

        # Access MongoDB via current_app
        mongo = current_app.mongo

        if not mongo:
            logging.error("PyMongo is not initialized or found in current_app")
            return jsonify({'message': 'Server error: PyMongo not initialized'}), 500

        # Find and delete the user by email
        result = mongo.db.users.delete_one({'email': email})

        if result.deleted_count == 1:
            logging.info(f"User {email} deleted successfully")
            return jsonify({'message': f'User {email} deleted successfully'}), 200
        else:
            logging.warning(f"User {email} not found")
            return jsonify({'message': 'User not found'}), 404

    except Exception as e:
        logging.error(f"Error deleting user: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500


# Route to get all categories (open to everyone)
@admin_bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        logging.info("Accessing /categories endpoint")

        # Access MongoDB via current_app
        mongo = current_app.mongo

        if not mongo:
            logging.error("PyMongo is not initialized or found in current_app")
            return jsonify({'message': 'Server error: PyMongo not initialized'}), 500

        # Fetch all categories
        categories = mongo.db.categories.find()
        category_list = [category['name'] for category in categories]

        logging.info(f"Fetched categories: {category_list}")

        return jsonify(category_list), 200

    except Exception as e:
        logging.error(f"Error fetching categories: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500


# Route to add a category (admin only)
@admin_bp.route('/admin/categories', methods=['POST'])
@jwt_required()
def add_category():
    try:
        logging.info("Accessing /admin/categories endpoint")

        current_user = get_jwt_identity()

        # Ensure the user is an admin
        if current_user['role'] != 'admin':
            logging.warning(f"Unauthorized access attempt by {current_user['email']}")
            return jsonify({'message': 'Access forbidden'}), 403

        logging.info(f"Admin {current_user['email']} is adding a category")

        # Get category data from the request
        data = request.get_json()
        category_name = data.get('category')

        if not category_name:
            logging.warning("Category name not provided in the request")
            return jsonify({'message': 'Category name is required'}), 400

        # Access MongoDB via current_app
        mongo = current_app.mongo

        if not mongo:
            logging.error("PyMongo is not initialized or found in current_app")
            return jsonify({'message': 'Server error: PyMongo not initialized'}), 500

        logging.info(f"Checking if category {category_name} already exists")

        # Check if the category already exists
        existing_category = mongo.db.categories.find_one({'name': category_name})

        if existing_category:
            logging.warning(f"Category {category_name} already exists")
            return jsonify({'message': 'Category already exists'}), 409

        # Insert the new category into MongoDB
        mongo.db.categories.insert_one({'name': category_name})
        logging.info(f"Category {category_name} added successfully")

        return jsonify({'message': 'Category added successfully'}), 201

    except Exception as e:
        logging.error(f"Error adding category: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500
