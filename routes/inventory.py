from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required
from bson.objectid import ObjectId
from datetime import datetime
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Blueprint setup for inventory routes
inventory_bp = Blueprint('inventory', __name__)

# Helper function to validate ObjectId
def is_valid_objectid(id_str):
    try:
        ObjectId(id_str)
        return True
    except:
        return False

# Helper function to safely convert to integer
def safe_int(value, default=0):
    try:
        return int(value)
    except (ValueError, TypeError):
        return default

# Helper function to safely convert to float
def safe_float(value, default=0.0):
    try:
        return float(value)
    except (ValueError, TypeError):
        return default

# ============================
# Inventory Check Route
# ============================
# ============================
# Inventory Check Route
# ============================
@inventory_bp.route('/check_inventory', methods=['GET'])
@jwt_required()
def check_inventory():
    try:
        mongo = current_app.mongo
        products_cursor = mongo.db.products.find()  # Fetch all products
        products = []

        for product in products_cursor:
            # Fetch attributes (including price and quantity)
            attributes = product.get('attributes', {})
            price = safe_float(attributes.get('price', 0))  # Price is in attributes
            current_quantity = safe_int(attributes.get('quantity', 0))  # Quantity is in attributes
            previous_quantity = safe_int(product.get('previous_quantity', 0))  # Previous quantity at root level

            # Append the product details including price, quantity, and previous_quantity
            products.append({
                'id': str(product['_id']),
                'name': product['name'],
                'price': price,
                'quantity': current_quantity,  # Current quantity from attributes
                'previous_quantity': previous_quantity,  # Previous quantity from root level
                'used_today': safe_int(product.get('used_today', 0)),
                'image': product.get('image', ''),
                'min_quantity': safe_int(attributes.get('min_quantity', 0)),
            })

        return jsonify(products), 200

    except Exception as e:
        logging.error(f"Error checking inventory: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500


@inventory_bp.route('/save_inventory_check', methods=['POST'])
@jwt_required()
def save_inventory_check():
    try:
        data = request.get_json()
        inventory_results = data.get('inventory', [])
        mongo = current_app.mongo

        for item in inventory_results:
            product_id = item.get('product_id')
            quantity_used = safe_int(item.get('used_today', 0))

            if not is_valid_objectid(product_id):
                return jsonify({'message': f"Invalid product ID: {product_id}"}), 400

            product = mongo.db.products.find_one({'_id': ObjectId(product_id)})
            if not product:
                return jsonify({'message': f"Product with ID {product_id} not found"}), 404

            # Access quantity from attributes
            attributes = product.get('attributes', {})
            current_quantity = safe_int(attributes.get('quantity', 0))
            previous_quantity = current_quantity  # Save the current quantity as previous before updating
            new_quantity = current_quantity - quantity_used  # Update the current quantity

            # Ensure quantity doesn't go negative
            if new_quantity < 0:
                new_quantity = 0

            # Update attributes with the new quantity
            attributes['quantity'] = new_quantity

            # Update the product with both the new current and previous quantities
            mongo.db.products.update_one(
                {'_id': ObjectId(product_id)},
                {'$set': {
                    'attributes': attributes,
                    'used_today': quantity_used,
                    'previous_quantity': previous_quantity  # Save current as previous
                }}
            )

        return jsonify({'message': 'Inventory check saved successfully'}), 200

    except Exception as e:
        logging.error(f"Error saving inventory check: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500
