from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
import tempfile
import shutil

from services.transcriber import transcribe_audio
from services.diarizer    import diarize_audio
from services.summarizer  import summarize_transcript

app = FastAPI(title="EchoBrief API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process")
async def process_audio(file: UploadFile = File(...)):
    suffix = os.path.splitext(file.filename)[-1] or ".webm"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name
    try:
        print(f"[1/3] Transcribing {file.filename} ...")
        transcript_data = transcribe_audio(tmp_path)
        print("[2/3] Diarizing speakers ...")
        diarized = diarize_audio(tmp_path, transcript_data)
        print("[3/3] Summarizing ...")
        summary = summarize_transcript(diarized)
        return JSONResponse({
            "success":    True,
            "transcript": diarized,
            "summary":    summary,
            "duration":   transcript_data.get("duration", 0),
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        os.unlink(tmp_path)

@app.get("/health")
def health():
    return {"status": "ok", "service": "EchoBrief API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
