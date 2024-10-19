from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from datetime import datetime

messages_bp = Blueprint('messages', __name__)

# Send a message
@messages_bp.route('/send', methods=['POST'])
@jwt_required()
def send_message():
    current_user = get_jwt_identity()
    data = request.get_json()
    receiver_email = data.get('receiver_email')
    message_text = data.get('message')

    if not receiver_email or not message_text:
        return jsonify({'message': 'Receiver and message content are required'}), 400

    # Check if the receiver exists
    mongo = current_app.mongo
    receiver = mongo.db.users.find_one({'email': receiver_email})
    if not receiver:
        return jsonify({'message': 'Receiver not found'}), 404

    # Save the message in the database
    message = {
        'sender_id': current_user['id'],
        'sender_email': current_user['email'],
        'receiver_id': str(receiver['_id']),
        'receiver_email': receiver_email,
        'message': message_text,
        'seen': False,
        'edited': False,
        'deleted': False,
        'timestamp': datetime.utcnow()
    }
    mongo.db.messages.insert_one(message)
    return jsonify({'message': 'Message sent successfully'}), 201

# Fetch messages for the inbox
@messages_bp.route('/inbox', methods=['GET'])
@jwt_required()
def get_inbox():
    current_user = get_jwt_identity()
    mongo = current_app.mongo
    messages = mongo.db.messages.find({'receiver_email': current_user['email']})
    message_list = []
    for message in messages:
        message_list.append({
            'id': str(message['_id']),
            'sender_email': message['sender_email'],
            'message': message['message'],
            'seen': message['seen'],
            'edited': message['edited'],
            'timestamp': message['timestamp']
        })
    return jsonify(message_list), 200


# Edit a message
@messages_bp.route('/edit/<message_id>', methods=['PUT'])
@jwt_required()
def edit_message(message_id):
    current_user = get_jwt_identity()
    mongo = current_app.mongo
    data = request.get_json()

    message_text = data.get('message')
    if not message_text:
        return jsonify({'message': 'Message content is required'}), 400

    message = mongo.db.messages.find_one({'_id': ObjectId(message_id)})
    
    if not message or message['sender_id'] != current_user['id']:
        return jsonify({'message': 'Permission denied or message not found'}), 403

    mongo.db.messages.update_one(
        {'_id': ObjectId(message_id)},
        {'$set': {'message': message_text, 'edited': True}}
    )
    return jsonify({'message': 'Message updated successfully'}), 200

# Delete a message
@messages_bp.route('/delete/<message_id>', methods=['DELETE'])
@jwt_required()
def delete_message(message_id):
    current_user = get_jwt_identity()
    mongo = current_app.mongo

    message = mongo.db.messages.find_one({'_id': ObjectId(message_id)})
    
    if not message or message['sender_id'] != current_user['id']:
        return jsonify({'message': 'Permission denied or message not found'}), 403

    mongo.db.messages.update_one(
        {'_id': ObjectId(message_id)},
        {'$set': {'deleted': True, 'message': '[Message deleted]'}}
    )
    return jsonify({'message': 'Message deleted successfully'}), 200



# Fetch sent messages
@messages_bp.route('/sent', methods=['GET'])
@jwt_required()
def get_sent_messages():
    current_user = get_jwt_identity()
    mongo = current_app.mongo
    messages = mongo.db.messages.find({'sender_id': current_user['id'], 'deleted': {'$ne': True}})
    message_list = []
    for message in messages:
        message_list.append({
            'id': str(message['_id']),
            'receiver_email': message['receiver_email'],
            'message': message['message'],
            'deleted': message.get('deleted', False),
            'timestamp': message['timestamp']
        })
    return jsonify(message_list), 200
