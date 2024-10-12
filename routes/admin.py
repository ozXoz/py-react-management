# routes/admin.py

from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Blueprint setup
admin_bp = Blueprint('admin', __name__)

# Helper function to validate ObjectId
def is_valid_objectid(id_str):
    try:
        ObjectId(id_str)
        return True
    except:
        return False

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

        # Fetch all users, excluding their passwords
        users_cursor = mongo.db.users.find({}, {'password': 0})  # Exclude password for security reasons
        user_list = []
        for user in users_cursor:
            user_info = {
                'id': str(user['_id']),
                'email': user['email'],
                'role': user['role'],
                'permissions': user.get('permissions', {}),
                'registration_time': user.get('registration_time'),
                'last_seen': user.get('last_seen'),
                'online_duration': user.get('online_duration', 0)
            }
            user_list.append(user_info)

        return jsonify(user_list), 200

    except Exception as e:
        logging.error(f"Error fetching users: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500

# Route to update user permissions (admin only)
@admin_bp.route('/admin/users/<user_id>/permissions', methods=['PUT'])
@jwt_required()
def update_user_permissions(user_id):
    try:
        current_user = get_jwt_identity()
        if current_user['role'] != 'admin':
            return jsonify({'message': 'Access forbidden'}), 403

        data = request.get_json()
        permission_type = data.get('permissionType')
        value = data.get('value')

        if permission_type not in ['add_product', 'update_product', 'delete_product']:
            return jsonify({'message': 'Invalid permission type'}), 400

        # Access MongoDB
        mongo = current_app.mongo

        # Update the user's permissions
        result = mongo.db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {f'permissions.{permission_type}': value}}
        )

        if result.matched_count == 0:
            return jsonify({'message': 'User not found'}), 404

        return jsonify({'message': 'Permissions updated successfully'}), 200

    except Exception as e:
        logging.error(f"Error updating user permissions: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500

# Route to delete a user (admin only)
@admin_bp.route('/admin/users/<user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    try:
        # Get the identity of the current user
        current_user = get_jwt_identity()

        # Only admins can delete users
        if current_user['role'] != 'admin':
            logging.warning(f"Unauthorized deletion attempt by {current_user['email']}")
            return jsonify({'message': 'Access forbidden'}), 403

        if not is_valid_objectid(user_id):
            return jsonify({'message': 'Invalid user ID'}), 400

        # Access MongoDB via current_app
        mongo = current_app.mongo

        # Find and delete the user by ID
        result = mongo.db.users.delete_one({'_id': ObjectId(user_id)})

        if result.deleted_count == 1:
            logging.info(f"User {user_id} deleted successfully")
            return jsonify({'message': f'User deleted successfully'}), 200
        else:
            logging.warning(f"User {user_id} not found")
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

# Route to delete a category (admin only)
@admin_bp.route('/admin/categories/<category_name>', methods=['DELETE'])
@jwt_required()
def delete_category(category_name):
    try:
        logging.info(f"Accessing /admin/categories/{category_name} endpoint")

        current_user = get_jwt_identity()

        # Ensure the user is an admin
        if current_user['role'] != 'admin':
            logging.warning(f"Unauthorized access attempt by {current_user['email']}")
            return jsonify({'message': 'Access forbidden'}), 403

        # Access MongoDB via current_app
        mongo = current_app.mongo

        # Delete the category
        result = mongo.db.categories.delete_one({'name': category_name})

        if result.deleted_count == 1:
            logging.info(f"Category {category_name} deleted successfully")
            return jsonify({'message': 'Category deleted successfully'}), 200
        else:
            logging.warning(f"Category {category_name} not found")
            return jsonify({'message': 'Category not found'}), 404

    except Exception as e:
        logging.error(f"Error deleting category: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500

# Route to get all products (admin only)
@admin_bp.route('/admin/products', methods=['GET'])
@jwt_required()
def get_all_products():
    try:
        current_user = get_jwt_identity()
        if current_user['role'] != 'admin':
            return jsonify({'message': 'Access forbidden'}), 403

        # Access MongoDB
        mongo = current_app.mongo

        # Fetch all products
        products_cursor = mongo.db.products.find()
        products = []
        for product in products_cursor:
            products.append({
                'id': str(product['_id']),
                'name': product['name'],
                'category': product['category'],
                'attributes': product.get('attributes', {}),
                'description': product.get('description', ''),
                'added_by': product.get('added_by'),
                'created_at': product.get('created_at'),
                'updated_at': product.get('updated_at')
            })

        return jsonify(products), 200

    except Exception as e:
        logging.error(f"Error fetching all products: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500
