from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import whisper
from groq import Groq
from dotenv import load_dotenv
from config import CORS_ORIGINS, get_db, GROQ_API_KEY
from routes.auth import auth_bp
from utils.auth import token_required

# Load environment variables
load_dotenv()

# Initialize Flask App
app = Flask(__name__)

# Configure CORS
CORS(app, resources={r"/api/*": {"origins": CORS_ORIGINS}})

# Register blueprints
app.register_blueprint(auth_bp)

# ========================
# GROQ API SETUP
# ========================

client = Groq(api_key=GROQ_API_KEY)

# Load Whisper model
print("Loading Whisper model...")
model_whisper = whisper.load_model("base")

# Setup upload folder
UPLOAD_FOLDER = 'recordings'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# ========================
# HEALTH CHECK ENDPOINT
# ========================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        db = get_db()
        if db:
            return jsonify({"status": "healthy", "database": "connected"}), 200
        else:
            return jsonify({"status": "degraded", "database": "disconnected"}), 200
    except Exception as e:
        return jsonify({"status": "unhealthy", "error": str(e)}), 500

# ========================
# PROTECTED UPLOAD ENDPOINT
# ========================

@app.route('/api/upload', methods=['POST'])
@token_required
def upload_audio():
    """
    Upload and process audio file - Protected endpoint (requires JWT token)
    Only authenticated users can upload
    """
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No audio file found"}), 400
        
        audio_file = request.files['file']
        if audio_file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Save file with user ID in filename for tracking
        user_id = request.user_id
        file_path = os.path.join(UPLOAD_FOLDER, f"meeting_audio_{user_id}.webm")
        audio_file.save(file_path)
        
        print(f"[{user_id}] Audio saved. Transcribing...")
        
        # STEP 1: Transcription (Whisper)
        result = model_whisper.transcribe(file_path, fp16=False)
        transcribed_text = result['text']
        print(f"[{user_id}] Transcription Done.")
        
        # STEP 2: Memo Generation (Groq)
        print(f"[{user_id}] Creating Memo with Groq...")
        
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": f"Analyze this meeting transcription and create a structured Meeting Memo with Summary, Key Points, and Action Items. Text: {transcribed_text}"
                }
            ]
        )
        
        meeting_memo = completion.choices[0].message.content
        print(f"[{user_id}] Memo Generated Successfully!")
        
        return jsonify({
            "success": True,
            "transcript": transcribed_text,
            "summary": meeting_memo,
            "duration": 0,
            "user_id": user_id
        }), 200
    
    except Exception as e:
        print(f"[{request.user_id}] Error: {e}")
        return jsonify({"error": str(e)}), 500

# ========================
# ERROR HANDLERS
# ========================

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"status": "unhealthy", "error": "Internal server error"}), 500

# ========================
# RUN APP
# ========================

if __name__ == '__main__':
    print("Starting AI Meeting Summarizer Backend...")
    print("Available endpoints:")
    print("  - POST /api/auth/register (public)")
    print("  - POST /api/auth/login (public)")
    print("  - GET /api/auth/me (protected)")
    print("  - POST /api/upload (protected)")
    print("  - GET /api/health (public)")
    print()
    app.run(debug=True, port=5000)

# Initialize Flask App
app = Flask(__name__)

# Configure CORS
CORS(app, resources={r"/api/*": {"origins": CORS_ORIGINS}})

# Register blueprints
app.register_blueprint(auth_bp)

# ========================
# GROQ API SETUP
# ========================

client = Groq(api_key=GROQ_API_KEY)

# Load Whisper model
print("Loading Whisper model...")
model_whisper = whisper.load_model("base")

# Setup upload folder
UPLOAD_FOLDER = 'recordings'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# ========================
# HEALTH CHECK ENDPOINT
# ========================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        db = get_db()
        if db:
            return jsonify({"status": "healthy", "database": "connected"}), 200
        else:
            return jsonify({"status": "degraded", "database": "disconnected"}), 200
    except Exception as e:
        return jsonify({"status": "unhealthy", "error": str(e)}), 500

# ========================
# PROTECTED UPLOAD ENDPOINT
# ========================

@app.route('/api/upload', methods=['POST'])
@token_required
def upload_audio():
    """
    Upload and process audio file - Protected endpoint (requires JWT token)
    Only authenticated users can upload
    """
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No audio file found"}), 400
        
        audio_file = request.files['file']
        if audio_file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Save file with user ID in filename for tracking
        user_id = request.user_id
        file_path = os.path.join(UPLOAD_FOLDER, f"meeting_audio_{user_id}.webm")
        audio_file.save(file_path)
        
        print(f"[{user_id}] Audio saved. Transcribing...")
        
        # STEP 1: Transcription (Whisper)
        result = model_whisper.transcribe(file_path, fp16=False)
        transcribed_text = result['text']
        print(f"[{user_id}] Transcription Done.")
        
        # STEP 2: Memo Generation (Groq)
        print(f"[{user_id}] Creating Memo with Groq...")
        
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": f"Analyze this meeting transcription and create a structured Meeting Memo with Summary, Key Points, and Action Items. Text: {transcribed_text}"
                }
            ]
        )
        
        meeting_memo = completion.choices[0].message.content
        print(f"[{user_id}] Memo Generated Successfully!")

        return jsonify({
            "success": True,
            "transcript": transcribed_text,
            "summary": meeting_memo,
            "duration": 0,
            "user_id": user_id
        }), 200
    
    except Exception as e:
        print(f"[{request.user_id}] Error: {e}")
        return jsonify({"error": str(e)}), 500

# ========================
# ERROR HANDLERS
# ========================

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

# ========================
# RUN APP
# ========================

if __name__ == '__main__':
    print("Starting AI Meeting Summarizer Backend...")
    print("Available endpoints:")
    print("  - POST /api/auth/register (public)")
    print("  - POST /api/auth/login (public)")
    print("  - GET /api/auth/me (protected)")
    print("  - POST /api/upload (protected)")
    print("  - GET /api/health (public)")
    print()
    app.run(debug=True, port=5000)