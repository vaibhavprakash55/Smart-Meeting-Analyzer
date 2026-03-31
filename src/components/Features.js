import './Features.css';
export default function Features() {
  return (
    <div className="features-grid" id="features">
      <div className="card card-sm card-glow-l">
        <div className="feat-icon fi-l"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c8f135" strokeWidth="2"><path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10a7 7 0 0 1-14 0"/><line x1="12" y1="17" x2="12" y2="21"/><line x1="8" y1="21" x2="16" y2="21"/></svg></div>
        <div className="feat-title">Live Recording</div>
        <div className="feat-desc">Capture multi-speaker meetings in real time with high-quality acquisition.</div>
      </div>
      <div className="card card-sm card-glow-v">
        <div className="feat-icon fi-v"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a89cf7" strokeWidth="2"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
        <div className="feat-title">Speaker Diarization</div>
        <div className="feat-desc">Pyannote.audio identifies and separates every speaker automatically.</div>
      </div>
      <div className="card card-sm card-glow-t">
        <div className="feat-icon fi-t"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38e8c8" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
        <div className="feat-title">AI Transcription</div>
        <div className="feat-desc">Whisper converts speech to text with near-human accuracy.</div>
      </div>
      <div className="card card-wide card-glow-v feat-wide">
        <div style={{flex:1}}>
          <div className="feat-icon fi-l" style={{marginBottom:12}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c8f135" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div>
          <div className="feat-title">Smart Summarization</div>
          <div className="feat-desc">GPT-4o extracts key decisions, action items and follow-ups in seconds.</div>
        </div>
        <div className="feat-tags">
          <div className="pill pill-l">PDF Export</div>
          <div className="pill pill-v">Share Link</div>
          <div className="pill pill-t">Calendar</div>
        </div>
      </div>
    </div>
  );
}
