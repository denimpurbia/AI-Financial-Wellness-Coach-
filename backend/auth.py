"""
Authentication utilities using Supabase
"""
from functools import wraps
from typing import Optional, Dict, Tuple, Any
from flask import request, jsonify
import jwt
from config import Config
from supabase_client import get_supabase_client, DatabaseService

class AuthService:
    """Service for authentication operations"""
    
    def __init__(self):
        self.supabase = get_supabase_client()
        self.db = DatabaseService()
    
    def sign_up(self, email: str, password: str, user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Sign up a new user"""
        try:
            # Create user in Supabase Auth
            result = self.supabase.auth.sign_up({
                'email': email,
                'password': password,
            })
            
            if result.user:
                user_id = result.user.id
                
                # Create user profile in database
                user_data = {
                    'id': user_id,
                    'email': email,
                    'username': user_profile.get('username', email.split('@')[0]),
                    'full_name': user_profile.get('full_name', ''),
                    'profile_photo': user_profile.get('profile_photo', None),
                    'financial_health_score': 50,  # Default score
                    'created_at': 'now()',
                }
                
                db_result = self.db.create_user(user_data)
                
                if db_result['success']:
                    return {
                        'success': True,
                        'user_id': user_id,
                        'email': email,
                        'session': result.session,
                        'message': 'User created successfully'
                    }
                else:
                    return {
                        'success': False,
                        'error': 'Failed to create user profile',
                        'details': db_result.get('error')
                    }
            else:
                return {
                    'success': False,
                    'error': 'Failed to create auth user'
                }
        
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def sign_in(self, email: str, password: str) -> Dict[str, Any]:
        """Sign in user"""
        try:
            result = self.supabase.auth.sign_in_with_password({
                'email': email,
                'password': password,
            })
            
            if result.session:
                return {
                    'success': True,
                    'user_id': result.user.id,
                    'email': email,
                    'session': result.session,
                    'access_token': result.session.access_token,
                }
            else:
                return {
                    'success': False,
                    'error': 'Invalid credentials'
                }
        
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def verify_token(self, token: str) -> Optional[str]:
        """Verify JWT token and return user_id"""
        try:
            decoded = jwt.decode(
                token,
                Config.SUPABASE_ANON_KEY,
                algorithms=['HS256']
            )
            return decoded.get('sub')  # 'sub' contains user_id
        except jwt.InvalidTokenError:
            return None
    
    def sign_out(self, user_id: str) -> Dict[str, Any]:
        """Sign out user"""
        try:
            self.supabase.auth.sign_out()
            return {
                'success': True,
                'message': 'User signed out successfully'
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

def extract_token_from_header() -> Optional[Tuple[str, str]]:
    """Extract auth token from Authorization header"""
    auth_header = request.headers.get('Authorization', '')
    
    if not auth_header:
        return None
    
    parts = auth_header.split()
    
    if len(parts) != 2 or parts[0].lower() != 'bearer':
        return None
    
    return parts[1]

def require_auth(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = extract_token_from_header()
        
        if not token:
            return jsonify({'error': 'Missing authorization token'}), 401
        
        auth_service = AuthService()
        user_id = auth_service.verify_token(token)
        
        if not user_id:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        return f(user_id, *args, **kwargs)
    
    return decorated_function

# Singleton instance
_auth_service = None

def get_auth_service() -> AuthService:
    """Get auth service instance"""
    global _auth_service
    if _auth_service is None:
        _auth_service = AuthService()
    return _auth_service
