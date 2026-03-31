import os
import whisper

_local_model = None

def transcribe_audio(audio_path: str) -> dict:
    global _local_model
    if _local_model is None:
        print("[Whisper] Loading model... (first time is slow)")
        _local_model = whisper.load_model("base")

    result = _local_model.transcribe(audio_path, verbose=False)

    segments = [
        {
            "start": round(seg["start"], 2),
            "end":   round(seg["end"],   2),
            "text":  seg["text"].strip(),
        }
        for seg in result["segments"]
    ]

    duration = segments[-1]["end"] if segments else 0

    return {
        "text":     result["text"],
        "segments": segments,
        "duration": duration,
    }
