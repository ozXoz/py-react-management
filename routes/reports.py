from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from datetime import datetime
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Blueprint setup
reports_bp = Blueprint('reports', __name__)

# Helper function to validate ObjectId
def is_valid_objectid(id_str):
    try:
        ObjectId(id_str)
        return True
    except:
        return False

# Route for users to submit a new report
@reports_bp.route('/user/reports', methods=['POST'])
@jwt_required()
def submit_report():
    try:
        current_user = get_jwt_identity()
        user_id = current_user['id']
        user_email = current_user['email']

        data = request.get_json()
        subject = data.get('subject')
        message = data.get('message')

        if not subject or not message:
            return jsonify({'message': 'Subject and message are required'}), 400

        # Access MongoDB
        mongo = current_app.mongo

        report = {
            'user_id': user_id,
            'user_email': user_email,
            'subject': subject,
            'message': message,
            'reply': '',
            'status': 'unread',  # Status can be 'unread', 'read', 'replied'
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }

        result = mongo.db.reports.insert_one(report)
        logging.info(f"Report submitted by {user_email}")

        return jsonify({'message': 'Report submitted successfully'}), 201

    except Exception as e:
        logging.error(f"Error submitting report: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500

# Route for users to get their reports
@reports_bp.route('/user/reports', methods=['GET'])
@jwt_required()
def get_user_reports():
    try:
        current_user = get_jwt_identity()
        user_id = current_user['id']

        # Access MongoDB
        mongo = current_app.mongo

        reports_cursor = mongo.db.reports.find({'user_id': user_id})
        reports = []
        for report in reports_cursor:
            reports.append({
                'id': str(report['_id']),
                'subject': report['subject'],
                'message': report['message'],
                'reply': report.get('reply', ''),
                'status': report.get('status', 'unread'),
                'created_at': report.get('created_at'),
                'updated_at': report.get('updated_at')
            })

        return jsonify(reports), 200

    except Exception as e:
        logging.error(f"Error fetching user reports: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500

# Route for admins to get all reports
@reports_bp.route('/admin/reports', methods=['GET'])
@jwt_required()
def get_all_reports():
    try:
        current_user = get_jwt_identity()
        if current_user['role'] != 'admin':
            return jsonify({'message': 'Access forbidden'}), 403

        # Access MongoDB
        mongo = current_app.mongo

        reports_cursor = mongo.db.reports.find()
        reports = []
        for report in reports_cursor:
            reports.append({
                'id': str(report['_id']),
                'user_email': report['user_email'],
                'subject': report['subject'],
                'message': report['message'],
                'reply': report.get('reply', ''),
                'status': report.get('status', 'unread'),
                'created_at': report.get('created_at'),
                'updated_at': report.get('updated_at')
            })

        return jsonify(reports), 200

    except Exception as e:
        logging.error(f"Error fetching all reports: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500

# Route for admins to get a specific report
@reports_bp.route('/admin/reports/<report_id>', methods=['GET'])
@jwt_required()
def get_report(report_id):
    try:
        current_user = get_jwt_identity()
        if current_user['role'] != 'admin':
            return jsonify({'message': 'Access forbidden'}), 403

        if not is_valid_objectid(report_id):
            return jsonify({'message': 'Invalid report ID'}), 400

        # Access MongoDB
        mongo = current_app.mongo

        report = mongo.db.reports.find_one({'_id': ObjectId(report_id)})
        if not report:
            return jsonify({'message': 'Report not found'}), 404

        # If the report is unread, mark it as read
        if report['status'] == 'unread':
            mongo.db.reports.update_one(
                {'_id': ObjectId(report_id)},
                {'$set': {'status': 'read', 'updated_at': datetime.utcnow()}}
            )
            report['status'] = 'read'

        report_data = {
            'id': str(report['_id']),
            'user_email': report['user_email'],
            'subject': report['subject'],
            'message': report['message'],
            'reply': report.get('reply', ''),
            'status': report.get('status', 'unread'),
            'created_at': report.get('created_at'),
            'updated_at': report.get('updated_at')
        }

        return jsonify(report_data), 200

    except Exception as e:
        logging.error(f"Error fetching report: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500

# Route for admins to reply to a report
@reports_bp.route('/admin/reports/<report_id>', methods=['PUT'])
@jwt_required()
def reply_to_report(report_id):
    try:
        current_user = get_jwt_identity()
        if current_user['role'] != 'admin':
            return jsonify({'message': 'Access forbidden'}), 403

        if not is_valid_objectid(report_id):
            return jsonify({'message': 'Invalid report ID'}), 400

        data = request.get_json()
        reply_message = data.get('reply')

        if not reply_message:
            return jsonify({'message': 'Reply message is required'}), 400

        # Access MongoDB
        mongo = current_app.mongo

        # Update the report with the reply
        result = mongo.db.reports.update_one(
            {'_id': ObjectId(report_id)},
            {'$set': {'reply': reply_message, 'status': 'replied', 'updated_at': datetime.utcnow()}}
        )

        if result.matched_count == 0:
            return jsonify({'message': 'Report not found'}), 404

        return jsonify({'message': 'Reply sent successfully'}), 200

    except Exception as e:
        logging.error(f"Error replying to report: {e}")
        return jsonify({'message': f"Server error: {str(e)}"}), 500





