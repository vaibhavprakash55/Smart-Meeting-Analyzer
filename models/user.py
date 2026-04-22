from datetime import datetime
from bson.objectid import ObjectId
from config import get_collection, USERS_COLLECTION
from utils.auth import hash_password, verify_password

class User:
    """User model for database operations"""
    
    @staticmethod
    def create(name: str, email: str, password: str) -> dict:
        """Create a new user"""
        users_collection = get_collection(USERS_COLLECTION)
        
        # Hash password
        hashed_password = hash_password(password)
        
        user_doc = {
            "name": name,
            "email": email,
            "password": hashed_password,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        
        result = users_collection.insert_one(user_doc)
        
        return {
            "id": str(result.inserted_id),
            "name": name,
            "email": email,
            "createdAt": user_doc["createdAt"]
        }
    
    @staticmethod
    def find_by_email(email: str) -> dict:
        """Find user by email"""
        users_collection = get_collection(USERS_COLLECTION)
        user = users_collection.find_one({"email": email})
        return user
    
    @staticmethod
    def find_by_id(user_id: str) -> dict:
        """Find user by ID"""
        users_collection = get_collection(USERS_COLLECTION)
        try:
            user = users_collection.find_one({"_id": ObjectId(user_id)})
            return user
        except:
            return None
    
    @staticmethod
    def email_exists(email: str) -> bool:
        """Check if email already exists"""
        users_collection = get_collection(USERS_COLLECTION)
        return users_collection.find_one({"email": email}) is not None
    
    @staticmethod
    def verify_credentials(email: str, password: str) -> dict:
        """Verify user credentials"""
        user = User.find_by_email(email)
        if not user:
            return None
        
        if verify_password(password, user.get("password", "")):
            return user
        
        return None
    
    @staticmethod
    def get_user_info(user_id: str) -> dict:
        """Get user info for response (without password)"""
        user = User.find_by_id(user_id)
        if not user:
            return None
        
        return {
            "id": str(user["_id"]),
            "name": user.get("name"),
            "email": user.get("email"),
            "createdAt": user.get("createdAt")
        }
