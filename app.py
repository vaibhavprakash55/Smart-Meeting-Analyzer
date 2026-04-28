from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
from groq import Groq
from dotenv import load_dotenv
from config import CORS_ORIGINS, get_db
from routes.auth import auth_bp
from utils.auth import token_required
from config import CORS_ORIGINS, get_db, GROQ_API_KEY

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
# UPLOAD API
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

        # unique filename
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

        return jsonify({
            "success": True,
            "transcript": transcribed_text,
            "summary": meeting_summary,
            "user_id": user_id
        }), 200

    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({"error": str(e)}), 500

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