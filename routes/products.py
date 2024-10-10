# routes/products.py

from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import CORS
import logging
from datetime import datetime
from bson.objectid import ObjectId

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Blueprint setup
products_bp = Blueprint('products', __name__)

# Apply CORS to the products blueprint
CORS(
    products_bp,
    resources={r"/*": {"origins": "http://localhost:3000"}},
    supports_credentials=True
)

# Helper function to validate ObjectId
def is_valid_objectid(id_str):
    try:
        ObjectId(id_str)
        return True
    except:
        return False

# Route to add a product (admin only)
@products_bp.route('/admin/products', methods=['POST'])
@jwt_required()
def add_product():
    try:
        current_user = get_jwt_identity()

        # Ensure the user is an admin
        if current_user['role'] != 'admin':
            logging.warning(f"Unauthorized product addition attempt by {current_user['email']}")
            return jsonify({'message': 'Access forbidden'}), 403

        # Get product data from the request
        data = request.get_json()
        name = data.get('name')
        category = data.get('category')
        attributes = data.get('attributes', {})

        if not name or not category:
            return jsonify({'message': 'Product name and category are required'}), 400

        # Access MongoDB
        mongo = current_app.mongo

        # Check if the category exists
        existing_category = mongo.db.categories.find_one({'name': category})
        if not existing_category:
            return jsonify({'message': 'Category does not exist'}), 400

        # Create product document
        product = {
            'name': name,
            'category': category,
            'attributes': attributes,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }

        # Insert into MongoDB
        result = mongo.db.products.insert_one(product)
        logging.info(f"Product {name} added by {current_user['email']}")

        return jsonify({'message': 'Product added successfully', 'product_id': str(result.inserted_id)}), 201

    except Exception as e:
        logging.error(f"Error adding product: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500

# Route to list all products
@products_bp.route('/products', methods=['GET'])
def list_products():
    try:
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
                'attributes': product['attributes'],
                'created_at': product['created_at'],
                'updated_at': product['updated_at']
            })

        return jsonify(products), 200

    except Exception as e:
        logging.error(f"Error fetching products: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500

# Route to update a product (admin only)
@products_bp.route('/admin/products/<product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    try:
        current_user = get_jwt_identity()

        # Ensure the user is an admin
        if current_user['role'] != 'admin':
            logging.warning(f"Unauthorized product update attempt by {current_user['email']}")
            return jsonify({'message': 'Access forbidden'}), 403

        if not is_valid_objectid(product_id):
            return jsonify({'message': 'Invalid product ID'}), 400

        # Access MongoDB
        mongo = current_app.mongo

        # Get the existing product
        existing_product = mongo.db.products.find_one({'_id': ObjectId(product_id)})
        if not existing_product:
            return jsonify({'message': 'Product not found'}), 404

        # Get update data
        data = request.get_json()
        name = data.get('name')
        category = data.get('category')
        attributes = data.get('attributes', {})
        remove_attributes = data.get('remove_attributes', [])

        # Prepare update fields
        update_fields = {'updated_at': datetime.utcnow()}
        if name:
            update_fields['name'] = name
        if category:
            # Check if the category exists
            existing_category = mongo.db.categories.find_one({'name': category})
            if not existing_category:
                return jsonify({'message': 'Category does not exist'}), 400
            update_fields['category'] = category

        # Handle attributes
        existing_attributes = existing_product.get('attributes', {})
        if attributes:
            # Update or add attributes
            existing_attributes.update(attributes)
        if remove_attributes:
            # Remove specified attributes
            for attr in remove_attributes:
                existing_attributes.pop(attr, None)
        update_fields['attributes'] = existing_attributes

        # Update the product
        result = mongo.db.products.update_one(
            {'_id': ObjectId(product_id)},
            {'$set': update_fields}
        )

        logging.info(f"Product {product_id} updated by {current_user['email']}")
        return jsonify({'message': 'Product updated successfully'}), 200

    except Exception as e:
        logging.error(f"Error updating product: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500

    try:
        current_user = get_jwt_identity()

        # Ensure the user is an admin
        if current_user['role'] != 'admin':
            logging.warning(f"Unauthorized product update attempt by {current_user['email']}")
            return jsonify({'message': 'Access forbidden'}), 403

        if not is_valid_objectid(product_id):
            return jsonify({'message': 'Invalid product ID'}), 400

        # Get update data
        data = request.get_json()
        name = data.get('name')
        category = data.get('category')
        attributes = data.get('attributes')

        # Prepare update fields
        update_fields = {'updated_at': datetime.utcnow()}
        if name:
            update_fields['name'] = name
        if category:
            # Check if the category exists
            mongo = current_app.mongo
            existing_category = mongo.db.categories.find_one({'name': category})
            if not existing_category:
                return jsonify({'message': 'Category does not exist'}), 400
            update_fields['category'] = category
        if attributes is not None:
            update_fields['attributes'] = attributes

        # Access MongoDB
        mongo = current_app.mongo

        # Update the product
        result = mongo.db.products.update_one(
            {'_id': ObjectId(product_id)},
            {'$set': update_fields}
        )

        if result.matched_count == 0:
            return jsonify({'message': 'Product not found'}), 404

        logging.info(f"Product {product_id} updated by {current_user['email']}")
        return jsonify({'message': 'Product updated successfully'}), 200

    except Exception as e:
        logging.error(f"Error updating product: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500

# Route to delete a product (admin only)
@products_bp.route('/admin/products/<product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    try:
        current_user = get_jwt_identity()

        # Ensure the user is an admin
        if current_user['role'] != 'admin':
            logging.warning(f"Unauthorized product deletion attempt by {current_user['email']}")
            return jsonify({'message': 'Access forbidden'}), 403

        if not is_valid_objectid(product_id):
            return jsonify({'message': 'Invalid product ID'}), 400

        # Access MongoDB
        mongo = current_app.mongo

        # Delete the product
        result = mongo.db.products.delete_one({'_id': ObjectId(product_id)})

        if result.deleted_count == 0:
            return jsonify({'message': 'Product not found'}), 404

        logging.info(f"Product {product_id} deleted by {current_user['email']}")
        return jsonify({'message': 'Product deleted successfully'}), 200

    except Exception as e:
        logging.error(f"Error deleting product: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500
