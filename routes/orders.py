from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
import logging
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Blueprint setup for orders routes
orders_bp = Blueprint('orders', __name__)

# Helper function to validate ObjectId
def is_valid_objectid(id_str):
    try:
        ObjectId(id_str)
        return True
    except:
        return False

# ============================
# Place an Order Route
# ============================
@orders_bp.route('/place_order', methods=['POST'])
@jwt_required()
def place_order():
    try:
        current_user = get_jwt_identity()
        data = request.get_json()
        product_id = data.get('product_id')
        order_quantity = int(data.get('order_quantity', 0))

        if not product_id or order_quantity <= 0:
            return jsonify({'message': 'Invalid product ID or quantity'}), 400

        mongo = current_app.mongo
        product = mongo.db.products.find_one({'_id': ObjectId(product_id)})

        if not product:
            return jsonify({'message': 'Product not found'}), 404

        # Insert the order into the orders collection with pending status (but don't change quantity yet)
        mongo.db.orders.insert_one({
            'product_id': product_id,
            'order_quantity': order_quantity,
            'status': 'pending',
            'created_at': datetime.utcnow()
        })

        return jsonify({'message': 'Order placed successfully'}), 200

    except Exception as e:
        logging.error(f"Error placing order: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500
# ============================
# Get All Pending Orders (Admin Only)
# ============================
# ============================
# Get All Pending Orders (Admin Only)
# ============================
@orders_bp.route('/admin/orders', methods=['GET'])
@jwt_required()
def get_pending_orders():
    try:
        current_user = get_jwt_identity()
        if current_user['role'] != 'admin':
            return jsonify({'message': 'Access forbidden'}), 403

        mongo = current_app.mongo
        orders_cursor = mongo.db.orders.find({'status': 'pending'})  # Fetch only pending orders
        orders = []
        for order in orders_cursor:
            product = mongo.db.products.find_one({'_id': ObjectId(order['product_id'])})
            product_name = product['name'] if product else 'Unknown'
            orders.append({
                'id': str(order['_id']),
                'product_id': order['product_id'],
                'product_name': product_name,
                'order_quantity': order['order_quantity'],
                'status': order.get('status', 'pending'),  # Ensure status is fetched and default to 'pending'
                'created_at': order['created_at']
            })

        return jsonify(orders), 200

    except Exception as e:
        logging.error(f"Error fetching pending orders: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500


# ============================
# Receive an Order and Update Product Quantity
# ============================
# ============================
# Receive an Order and Update Product Quantity
# ============================
# ============================
# Receive an Order and Update Product Quantity
# ============================
# Receive an Order and Update Product Quantity
# ============================
# ============================
# Receive an Order and Update Product Quantity
# ============================
# ============================
# Receive an Order and Update Product Quantity
# ============================
@orders_bp.route('/admin/orders/receive/<order_id>', methods=['POST'])
@jwt_required()
def receive_order(order_id):
    try:
        current_user = get_jwt_identity()

        if current_user['role'] != 'admin':
            return jsonify({'message': 'Access forbidden'}), 403

        mongo = current_app.mongo
        order = mongo.db.orders.find_one({'_id': ObjectId(order_id)})

        if not order:
            return jsonify({'message': 'Order not found'}), 404

        product_id = order.get('product_id')
        order_quantity = int(order.get('order_quantity', 0))

        product = mongo.db.products.find_one({'_id': ObjectId(product_id)})

        if not product:
            return jsonify({'message': 'Product not found'}), 404

        # Access quantity from attributes
        attributes = product.get('attributes', {})
        current_quantity = int(attributes.get('quantity', 0))
        new_quantity = current_quantity + order_quantity

        # Update quantity within attributes
        attributes['quantity'] = new_quantity

        # Update the product's attributes in the database
        mongo.db.products.update_one(
            {'_id': ObjectId(product_id)},
            {'$set': {
                'attributes': attributes,
                'previous_quantity': current_quantity,
                'used_today': 0  # Reset 'used_today' after receiving the order
            }}
        )

        # Mark the order as received in the orders collection
        mongo.db.orders.update_one(
            {'_id': ObjectId(order_id)},
            {'$set': {'status': 'received'}}
        )

        return jsonify({'message': 'Order received and product quantity updated'}), 200

    except Exception as e:
        logging.error(f"Error receiving order: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500


@orders_bp.route('/admin/orders', methods=['GET'])
@jwt_required()
def get_all_orders():
    try:
        current_user = get_jwt_identity()
        if current_user['role'] != 'admin':
            return jsonify({'message': 'Access forbidden'}), 403

        mongo = current_app.mongo
        orders_cursor = mongo.db.orders.find()  # Fetch all orders
        orders = []
        for order in orders_cursor:
            product = mongo.db.products.find_one({'_id': ObjectId(order['product_id'])})
            product_name = product['name'] if product else 'Unknown'
            orders.append({
                'id': str(order['_id']),
                'product_id': order['product_id'],
                'product_name': product_name,
                'order_quantity': order['order_quantity'],
                'status': order.get('status', 'pending'),  # Ensure status is fetched and default to 'pending'
                'created_at': order['created_at']
            })

        return jsonify(orders), 200

    except Exception as e:
        logging.error(f"Error fetching orders: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500
