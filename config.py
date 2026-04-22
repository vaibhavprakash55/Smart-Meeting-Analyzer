import os
from datetime import timedelta
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# MongoDB Configuration
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

# Initialize MongoDB client
try:
    mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    # Verify connection
    mongo_client.admin.command('ping')
    db = mongo_client[DB_NAME]
    print("✓ MongoDB connected successfully")
except Exception as e:
    print(f"✗ MongoDB connection failed: {e}")
    db = None

# JWT Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_EXPIRY_HOURS = int(os.getenv("JWT_EXPIRY_HOURS", "24"))

# CORS Configuration
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

# API Keys
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Collections
USERS_COLLECTION = "users"
MEETINGS_COLLECTION = "meetings"

def get_db():
    """Get database instance"""
    return db

def get_collection(collection_name):
    """Get a collection from the database"""
    if db is None:
        raise Exception("Database not connected")
    return db[collection_name]
