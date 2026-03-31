def summarize_transcript(diarized: list) -> dict:
    if not diarized:
        return _empty()

    ACTION_KW   = ["will ", "i'll ", "going to", "should ", "let's ", "we'll ", "assigned"]
    DECISION_KW = ["decided", "confirmed", "agreed", "locked", "approved", "moving forward"]
    FOLLOWUP_KW = ["next meeting", "follow up", "schedule", "by friday", "by monday", "revisit"]

    action_items  = []
    key_decisions = []
    follow_ups    = []
    speakers      = list({s["speaker"] for s in diarized})
    total_words   = sum(len(s["text"].split()) for s in diarized)

    for seg in diarized:
        t = seg["text"].lower()
        line = f"{seg['speaker']}: {seg['text']}"
        if any(k in t for k in ACTION_KW):   action_items.append(line)
        if any(k in t for k in DECISION_KW): key_decisions.append(line)
        if any(k in t for k in FOLLOWUP_KW): follow_ups.append(line)

    return {
        "short_summary": (
            f"Meeting with {len(speakers)} speaker(s), "
            f"{total_words} words. "
            f"Add OPENAI_API_KEY to .env for GPT-4o summaries."
        ),
        "key_decisions": key_decisions[:5] or ["No decisions detected."],
        "action_items":  action_items[:5]  or ["No action items detected."],
        "follow_ups":    follow_ups[:3]    or ["No follow-ups detected."],
    }

def _empty() -> dict:
    return {
        "short_summary": "No transcript to summarize.",
        "key_decisions": [],
        "action_items":  [],
        "follow_ups":    [],
    }
