from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
from datetime import datetime
from groq import Groq
from dotenv import load_dotenv
from config import CORS_ORIGINS, get_db, get_collection, MEETINGS_COLLECTION, GROQ_API_KEY
from routes.auth import auth_bp
from utils.auth import token_required

# ========================
# LOAD ENV
# ========================
load_dotenv()

# ========================
# INIT APP
# ========================
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": CORS_ORIGINS}})
app.register_blueprint(auth_bp)

# ========================
# GROQ CLIENT
# ========================
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("❌ GROQ_API_KEY not set in environment variables")

client = Groq(api_key=GROQ_API_KEY)

# ========================
# UPLOAD FOLDER
# ========================
UPLOAD_FOLDER = "recordings"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ========================
# HEALTH CHECK
# ========================
@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        db = get_db()
        if db is not None:
            return jsonify({"status": "healthy"}), 200
        return jsonify({"status": "degraded"}), 200
    except Exception as e:
        return jsonify({"status": "unhealthy", "error": str(e)}), 500

# ========================
# UPLOAD & PROCESS AUDIO
# ========================
@app.route('/api/upload', methods=['POST'])
@token_required
def upload_audio():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No audio file"}), 400
        
        audio_file = request.files['file']

        if audio_file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        user_id = request.user_id

        # Unique filename
        filename = f"{user_id}_{uuid.uuid4()}.webm"
        file_path = os.path.join(UPLOAD_FOLDER, filename)

        audio_file.save(file_path)
        print(f"[{user_id}] File saved: {filename}")

        # ========================
        # STEP 1: TRANSCRIPTION (GROQ WHISPER API)
        # ========================
        with open(file_path, "rb") as file:
            transcription = client.audio.transcriptions.create(
                file=file,
                model="whisper-large-v3"
            )

        transcribed_text = transcription.text
        print(f"[{user_id}] Transcription done")

        # ========================
        # STEP 2: SUMMARY (LLAMA)
        # ========================
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": f"""
Analyze this meeting transcription and generate:

1. Short Summary
2. Key Points (bullet format)
3. Action Items

Text:
{transcribed_text}
"""
                }
            ]
        )

        meeting_summary = completion.choices[0].message.content

        # ========================
        # STEP 3: SAVE TO MONGODB (USER PRIVATE HISTORY)
        # ========================
        meetings_collection = get_collection(MEETINGS_COLLECTION)
        meeting_doc = {
            "user_id": user_id,
            "transcript": transcribed_text,
            "summary": meeting_summary,
            "filename": filename,
            "createdAt": datetime.utcnow()
        }
        
        result = meetings_collection.insert_one(meeting_doc)
        meeting_id = str(result.inserted_id)

        # Cleanup local audio file if needed
        if os.path.exists(file_path):
            os.remove(file_path)

        return jsonify({
            "success": True,
            "id": meeting_id,
            "transcript": transcribed_text,
            "summary": meeting_summary,
            "user_id": user_id
        }), 200

    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({"error": str(e)}), 500

# ========================
# GET USER-SPECIFIC HISTORY
# ========================
@app.route('/api/history', methods=['GET'])
@token_required
def get_user_history():
    try:
        user_id = request.user_id
        meetings_collection = get_collection(MEETINGS_COLLECTION)
        
        # Sirf current user ki meetings fetch karo (Sorted by newest first)
        user_meetings = list(meetings_collection.find({"user_id": user_id}).sort("createdAt", -1))

        # ObjectId & Datetime JSON conversion
        formatted_meetings = []
        for m in user_meetings:
            formatted_meetings.append({
                "id": str(m["_id"]),
                "transcript": m.get("transcript", ""),
                "summary": m.get("summary", ""),
                "createdAt": m.get("createdAt").isoformat() if m.get("createdAt") else None
            })

        return jsonify({
            "success": True,
            "history": formatted_meetings
        }), 200

    except Exception as e:
        print(f"❌ Error fetching history: {e}")
        return jsonify({"error": "Failed to fetch user history"}), 500

# ========================
# ERROR HANDLING
# ========================
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({"error": "Server error"}), 500

# ========================
# RUN (LOCAL ONLY)
# ========================
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    print(f"🚀 Server running on port {port}")
    app.run(host="0.0.0.0", port=port)