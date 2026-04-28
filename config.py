import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# ========================
# ENV VARIABLES
# ========================
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "meetingDB")

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_EXPIRY_HOURS = int(os.getenv("JWT_EXPIRY_HOURS", "24"))

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:3000"
).split(",")

# ========================
# MONGODB CONNECTION
# ========================
db = None

try:
    if not MONGO_URI:
        raise ValueError("❌ MONGO_URI not set")

    mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    mongo_client.admin.command('ping')

    db = mongo_client[DB_NAME]
    print("✅ MongoDB connected successfully")

except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")

# ========================
# COLLECTIONS
# ========================
USERS_COLLECTION = "users"
MEETINGS_COLLECTION = "meetings"

# ========================
# HELPERS
# ========================
def get_db():
    return db

def get_collection(collection_name):
    if db is None:
        raise Exception("Database not connected")
    return db[collection_name]