from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import CORS
from flask_uploads import UploadNotAllowed
import logging
from datetime import datetime
from bson.objectid import ObjectId
import os
import json

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Blueprint setup
products_bp = Blueprint('products', __name__)

# Apply CORS to the products blueprint
CORS(products_bp, resources={r"/*": {"origins": "http://localhost:5000"}}, supports_credentials=True)

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

        # Access MongoDB
        mongo = current_app.mongo

        # Get product data from the request
        name = request.form.get('name')
        category = request.form.get('category')
        attributes = request.form.get('attributes', '{}')
        image_url = request.form.get('image_url', '')
        image_file = request.files.get('image_file', None)

        if not name or not category:
            return jsonify({'message': 'Product name and category are required'}), 400

        # Process attributes
        attributes = json.loads(attributes) if attributes else {}

        # Check if the category exists
        existing_category = mongo.db.categories.find_one({'name': category})
        if not existing_category:
            return jsonify({'message': 'Category does not exist'}), 400

        # Handle image upload
        image_path = ''
        if image_file:
            images = current_app.images
            filename = images.save(image_file)
            image_path = os.path.join('/uploads/images/', filename)
        elif image_url:
            image_path = image_url  # Assuming the image_url is a valid URL

        # Create product document
        product = {
            'name': name,
            'category': category,
            'attributes': attributes,
            'image': image_path,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }

        # Insert into MongoDB
        result = mongo.db.products.insert_one(product)
        logging.info(f"Product {name} added by {current_user['email']}")

        return jsonify({'message': 'Product added successfully', 'product_id': str(result.inserted_id)}), 201

    except UploadNotAllowed:
        return jsonify({'message': 'File type not allowed'}), 400
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
                'attributes': product.get('attributes', {}),
                'image': product.get('image', ''),
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
        name = request.form.get('name')
        category = request.form.get('category')
        attributes = request.form.get('attributes', '{}')
        image_url = request.form.get('image_url', '')
        image_file = request.files.get('image_file', None)
        remove_attributes = request.form.get('remove_attributes', '[]')

        # Process attributes
        attributes = json.loads(attributes) if attributes else {}
        remove_attributes = json.loads(remove_attributes) if remove_attributes else []

        # Prepare update fields
        update_fields = {'updated_at': datetime.utcnow()}
        if name:
            update_fields['name'] = name
        if category:
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

        # Handle image upload
        if image_file:
            images = current_app.images
            filename = images.save(image_file)
            image_path = os.path.join('/uploads/images/', filename)
            update_fields['image'] = image_path
        elif image_url:
            update_fields['image'] = image_url

        # Update the product
        result = mongo.db.products.update_one(
            {'_id': ObjectId(product_id)},
            {'$set': update_fields}
        )

        logging.info(f"Product {product_id} updated by {current_user['email']}")
        return jsonify({'message': 'Product updated successfully'}), 200

    except UploadNotAllowed:
        return jsonify({'message': 'File type not allowed'}), 400
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
