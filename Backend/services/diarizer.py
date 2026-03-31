def diarize_audio(audio_path: str, transcript_data: dict) -> list:
    segments = transcript_data.get("segments", [])
    return _heuristic_speakers(segments)

def _heuristic_speakers(segments: list) -> list:
    SPEAKER_NAMES = ["Aryan", "Priya", "Rahul", "Divya"]
    GAP_THRESHOLD = 1.5
    result = []
    current_idx = 0
    prev_end = 0.0

    for seg in segments:
        if seg["start"] - prev_end > GAP_THRESHOLD:
            current_idx = (current_idx + 1) % len(SPEAKER_NAMES)
        result.append({
            "speaker": SPEAKER_NAMES[current_idx],
            "start":   seg["start"],
            "end":     seg["end"],
            "text":    seg["text"],
        })
        prev_end = seg["end"]

    return result
