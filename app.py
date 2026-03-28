from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import whisper
from groq import Groq  # Naya import

app = Flask(__name__)
CORS(app)

# 1. GROQ API SETUP
# Apni Groq API Key yahan dalein
GROQ_API_KEY = "Own APi key"
client = Groq(api_key=GROQ_API_KEY)

# Whisper model load ho raha hai
print("Loading Whisper model...")
model_whisper = whisper.load_model("base")

UPLOAD_FOLDER = 'recordings'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/upload', methods=['POST'])
def upload_audio():
    if 'audio_data' not in request.files:
        return jsonify({"error": "No audio file found"}), 400
    
    audio_file = request.files['audio_data']
    file_path = os.path.join(UPLOAD_FOLDER, "meeting_audio.wav")
    audio_file.save(file_path)
    
    print("Audio saved. Transcribing...")
    
    try:
        # STEP 1: Transcription (Whisper)
        result = model_whisper.transcribe(file_path, fp16=False)
        transcribed_text = result['text']
        print(f"Transcription Done.")
        
        # STEP 2: Memo Generation (Groq - No Quota Error)
        print("Creating Memo with Groq...")
        
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile", # High quality model
            messages=[
                {
                    "role": "user",
                    "content": f"Analyze this meeting transcription and create a structured Meeting Memo with Summary, Key Points, and Action Items. Text: {transcribed_text}"
                }
            ]
        )
        
        meeting_memo = completion.choices[0].message.content
        print("Memo Generated Successfully!")

        return jsonify({
            "message": "Success",
            "transcription": transcribed_text,
            "memo": meeting_memo
        }), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)