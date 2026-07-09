"""
Authentication routes
"""
from flask import Blueprint, request, jsonify
from auth import AuthService, require_auth
from supabase_client import DatabaseService

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """Sign up new user"""
    try:
        data = request.get_json()
        
        # Validate input
        required_fields = ['email', 'password', 'username']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        auth_service = AuthService()
        result = auth_service.sign_up(
            email=data['email'],
            password=data['password'],
            user_profile={
                'username': data['username'],
                'full_name': data.get('full_name', ''),
                'profile_photo': data.get('profile_photo', None)
            }
        )
        
        if result['success']:
            return jsonify(result), 201
        else:
            return jsonify(result), 400
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/signin', methods=['POST'])
def signin():
    """Sign in user"""
    try:
        data = request.get_json()
        
        if 'email' not in data or 'password' not in data:
            return jsonify({'error': 'Email and password required'}), 400
        
        auth_service = AuthService()
        result = auth_service.sign_in(
            email=data['email'],
            password=data['password']
        )
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 401
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/signout', methods=['POST'])
@require_auth
def signout(user_id):
    """Sign out user"""
    try:
        auth_service = AuthService()
        result = auth_service.sign_out(user_id)
        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@require_auth
def get_profile(user_id):
    """Get user profile"""
    try:
        db = DatabaseService()
        result = db.get_user(user_id)
        
        if result['success']:
            return jsonify(result['data']), 200
        else:
            return jsonify({'error': result['error']}), 404
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['PUT'])
@require_auth
def update_profile(user_id):
    """Update user profile"""
    try:
        data = request.get_json()
        db = DatabaseService()
        
        result = db.update_user(user_id, data)
        
        if result['success']:
            return jsonify(result['data']), 200
        else:
            return jsonify({'error': result['error']}), 400
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
