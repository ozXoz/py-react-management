# routes/user_products.py

from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import logging
from datetime import datetime
from bson.objectid import ObjectId

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Blueprint setup
user_products_bp = Blueprint('user_products', __name__)

# Helper function to validate ObjectId
def is_valid_objectid(id_str):
    try:
        ObjectId(id_str)
        return True
    except:
        return False

# Route to add a product (user)
@user_products_bp.route('/user/products', methods=['POST'])
@jwt_required()
def add_product():
    try:
        current_user = get_jwt_identity()
        email = current_user['email']

        # Check if the user has permission to add products
        mongo = current_app.mongo
        user = mongo.db.users.find_one({'email': email})
        if not user.get('permissions', {}).get('add_product', False):
            return jsonify({'message': 'Permission denied'}), 403

        # Get product data from the request
        data = request.get_json()
        name = data.get('name')
        description = data.get('description')
        category = data.get('category')
        attributes = data.get('attributes', {})

        if not all([name, description, category]):
            return jsonify({'message': 'All fields are required'}), 400

        # Check if the category exists
        existing_category = mongo.db.categories.find_one({'name': category})
        if not existing_category:
            return jsonify({'message': 'Category does not exist'}), 400

        # Create product document
        product = {
            'name': name,
            'description': description,
            'category': category,
            'attributes': attributes,
            'added_by': email,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }

        # Insert into MongoDB
        result = mongo.db.products.insert_one(product)
        logging.info(f"Product {name} added by {email}")

        return jsonify({'message': 'Product added successfully', 'product_id': str(result.inserted_id)}), 201

    except Exception as e:
        logging.error(f"Error adding product: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500

# Route to get user's products
@user_products_bp.route('/user/products', methods=['GET'])
@jwt_required()
def get_user_products():
    try:
        current_user = get_jwt_identity()
        email = current_user['email']

        # Access MongoDB
        mongo = current_app.mongo

        # Fetch products added by the user
        products_cursor = mongo.db.products.find({'added_by': email})
        products = []
        for product in products_cursor:
            products.append({
                'id': str(product['_id']),
                'name': product['name'],
                'description': product['description'],
                'category': product['category'],
                'attributes': product.get('attributes', {}),
                'created_at': product.get('created_at'),
                'updated_at': product.get('updated_at')
            })

        return jsonify(products), 200

    except Exception as e:
        logging.error(f"Error fetching user's products: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500

# Route to update a product (user)
@user_products_bp.route('/user/products/<product_id>', methods=['PUT'])
@jwt_required()
def update_user_product(product_id):
    try:
        current_user = get_jwt_identity()
        email = current_user['email']

        # Check if the user has permission to update products
        mongo = current_app.mongo
        user = mongo.db.users.find_one({'email': email})
        if not user.get('permissions', {}).get('update_product', False):
            return jsonify({'message': 'Permission denied'}), 403

        if not is_valid_objectid(product_id):
            return jsonify({'message': 'Invalid product ID'}), 400

        # Get the existing product
        existing_product = mongo.db.products.find_one({'_id': ObjectId(product_id), 'added_by': email})
        if not existing_product:
            return jsonify({'message': 'Product not found or access denied'}), 404

        # Get update data
        data = request.get_json()
        name = data.get('name')
        description = data.get('description')
        category = data.get('category')
        attributes = data.get('attributes', {})

        # Prepare update fields
        update_fields = {'updated_at': datetime.utcnow()}
        if name:
            update_fields['name'] = name
        if description:
            update_fields['description'] = description
        if category:
            # Check if the category exists
            existing_category = mongo.db.categories.find_one({'name': category})
            if not existing_category:
                return jsonify({'message': 'Category does not exist'}), 400
            update_fields['category'] = category
        if attributes is not None:
            update_fields['attributes'] = attributes

        # Update the product
        result = mongo.db.products.update_one(
            {'_id': ObjectId(product_id)},
            {'$set': update_fields}
        )

        logging.info(f"Product {product_id} updated by {email}")
        return jsonify({'message': 'Product updated successfully'}), 200

    except Exception as e:
        logging.error(f"Error updating product: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500

# Route to delete a product (user)
@user_products_bp.route('/user/products/<product_id>', methods=['DELETE'])
@jwt_required()
def delete_user_product(product_id):
    try:
        current_user = get_jwt_identity()
        email = current_user['email']

        # Check if the user has permission to delete products
        mongo = current_app.mongo
        user = mongo.db.users.find_one({'email': email})
        if not user.get('permissions', {}).get('delete_product', False):
            return jsonify({'message': 'Permission denied'}), 403

        if not is_valid_objectid(product_id):
            return jsonify({'message': 'Invalid product ID'}), 400

        # Delete the product
        result = mongo.db.products.delete_one({'_id': ObjectId(product_id), 'added_by': email})

        if result.deleted_count == 0:
            return jsonify({'message': 'Product not found or access denied'}), 404

        logging.info(f"Product {product_id} deleted by {email}")
        return jsonify({'message': 'Product deleted successfully'}), 200

    except Exception as e:
        logging.error(f"Error deleting product: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500
