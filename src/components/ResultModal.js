import './ResultModal.css';

const SPEAKER_COLORS = {
  'Aryan':    '#c8f135',
  'Priya':    '#7b6cfa',
  'Rahul':    '#38e8c8',
  'Divya':    '#fa8b6c',
  'Speaker 1':'#c8f135',
  'Speaker 2':'#7b6cfa',
  'Speaker 3':'#38e8c8',
  'Speaker 4':'#fa8b6c',
};

function getColor(speaker) {
  return SPEAKER_COLORS[speaker] || '#a89cf7';
}

function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function ResultModal({ status, transcript, summary, error, duration, onClose, onReset }) {
  if (status === 'idle') return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <div className="modal-title">
            <div className="modal-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#0b0b0f">
                <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
                <path d="M19 10a7 7 0 0 1-14 0H3a9 9 0 0 0 8 8.94V21H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-2.06A9 9 0 0 0 21 10z"/>
              </svg>
            </div>
            EchoBrief Result
            {duration > 0 && <span className="modal-dur">{formatTime(duration)}</span>}
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {status === 'processing' && (
          <div className="modal-processing">
            <div className="proc-spinner" />
            <div className="proc-steps">
              <div className="proc-step active">Transcribing with Whisper...</div>
              <div className="proc-step">Identifying speakers...</div>
              <div className="proc-step">Generating summary...</div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="modal-error">
            <div className="err-icon">⚠</div>
            <div className="err-text">{error}</div>
            <button className="btn-reset" onClick={onReset}>Try Again</button>
          </div>
        )}

        {status === 'done' && (
          <div className="modal-done">
            {summary && (
              <div className="result-section">
                <div className="rs-label">AI Summary</div>
                <div className="summary-box">
                  <p className="summary-text">{summary.short_summary}</p>
                  <div className="summary-cols">
                    <div className="sc">
                      <div className="sc-title">Key Decisions</div>
                      {summary.key_decisions?.map((d, i) => (
                        <div key={i} className="sc-item">
                          <div className="sc-dot lime" />{d}
                        </div>
                      ))}
                    </div>
                    <div className="sc">
                      <div className="sc-title">Action Items</div>
                      {summary.action_items?.map((a, i) => (
                        <div key={i} className="sc-item">
                          <div className="sc-dot violet" />{a}
                        </div>
                      ))}
                    </div>
                    <div className="sc">
                      <div className="sc-title">Follow-ups</div>
                      {summary.follow_ups?.map((f, i) => (
                        <div key={i} className="sc-item">
                          <div className="sc-dot teal" />{f}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {transcript?.length > 0 && (
              <div className="result-section">
                <div className="rs-label">Full Transcript</div>
                <div className="transcript-scroll">
                  {transcript.map((seg, i) => (
                    <div key={i} className="tr-seg">
                      <div className="tr-meta">
                        <span className="tr-speaker" style={{ color: getColor(seg.speaker) }}>
                          {seg.speaker}
                        </span>
                        <span className="tr-time">{formatTime(seg.start)}</span>
                      </div>
                      <div className="tr-text">{seg.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button className="btn-export" onClick={() => exportTXT(transcript, summary)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export
              </button>
              <button className="btn-reset" onClick={onReset}>New Recording</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function exportTXT(transcript, summary) {
  const lines = [
    'ECHOBRIEFING SUMMARY',
    '====================',
    '',
    summary?.short_summary || '',
    '',
    'KEY DECISIONS',
    ...(summary?.key_decisions || []).map(d => `• ${d}`),
    '',
    'ACTION ITEMS',
    ...(summary?.action_items || []).map(a => `• ${a}`),
    '',
    'FOLLOW-UPS',
    ...(summary?.follow_ups || []).map(f => `• ${f}`),
    '',
    'FULL TRANSCRIPT',
    ...(transcript || []).map(s => `[${s.speaker}] ${s.text}`),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'echobriefing.txt'; a.click();
  URL.revokeObjectURL(url);
}