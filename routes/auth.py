from flask import Blueprint, request, jsonify
from models.user import User
from utils.auth import (
    generate_token, 
    validate_email, 
    validate_password, 
    validate_name,
    success_response,
    error_response
)

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# ========================
# REGISTER ENDPOINT
# ========================

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Register a new user
    
    Request body:
    {
        "name": "John Doe",
        "email": "john@example.com",
        "password": "SecurePass123"
    }
    """
    try:
        data = request.get_json()
        
        # Validate input
        if not data:
            return error_response("Request body is required")
        
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        # Name validation
        if not validate_name(name):
            return error_response("Name must be at least 2 characters long")
        
        # Email validation
        if not email or not validate_email(email):
            return error_response("Invalid email format")
        
        # Password validation
        is_valid, message = validate_password(password)
        if not is_valid:
            return error_response(message)
        
        # Check if user already exists
        if User.email_exists(email):
            return error_response("Email already registered", 409)
        
        # Create user
        user = User.create(name, email, password)
        
        return success_response(
            "User registered successfully",
            {
                "user": user
            },
            201
        )
    
    except Exception as e:
        return error_response(f"Registration error: {str(e)}", 500)

# ========================
# LOGIN ENDPOINT
# ========================

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Login user
    
    Request body:
    {
        "email": "john@example.com",
        "password": "SecurePass123"
    }
    """
    try:
        data = request.get_json()
        
        # Validate input
        if not data:
            return error_response("Request body is required")
        
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        # Email validation
        if not email or not validate_email(email):
            return error_response("Invalid email format")
        
        if not password:
            return error_response("Password is required")
        
        # Verify credentials
        user = User.verify_credentials(email, password)
        if not user:
            return error_response("Invalid email or password", 401)
        
        # Generate token
        token = generate_token(str(user['_id']), user['email'])
        
        return success_response(
            "Login successful",
            {
                "token": token,
                "user": {
                    "id": str(user['_id']),
                    "name": user.get('name'),
                    "email": user.get('email')
                }
            }
        )
    
    except Exception as e:
        return error_response(f"Login error: {str(e)}", 500)

# ========================
# GET CURRENT USER (Protected Route Example)
# ========================

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """Get current user info - requires authentication"""
    from utils.auth import token_required
    
    @token_required
    def _get_current_user():
        user_info = User.get_user_info(request.user_id)
        if not user_info:
            return error_response("User not found", 404)
        
        return success_response(
            "User info retrieved",
            {"user": user_info}
        )
    
    return _get_current_user()
