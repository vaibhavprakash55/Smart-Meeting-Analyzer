import { useRef } from 'react';
import './Hero.css';
import { useRecorder } from '../hooks/useRecorder';
import ResultModal from './ResultModal';

const WH = [8,14,22,18,32,22,12,36,28,16,12,30,22,10,20,34,16,26,12,22,32];

const MicIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
    <path d="M19 10a7 7 0 0 1-14 0H3a9 9 0 0 0 8 8.94V21H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-2.06A9 9 0 0 0 21 10z" />
  </svg>
);

const UploadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export default function Hero() {
  const fileRef = useRef(null);
  const {
    status, transcript, summary, error, duration,
    startRecording, stopRecording, uploadFile, reset,
  } = useRecorder();

  const isRecording = status === 'recording';
  const isBusy      = status === 'processing';

  function handleUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
    e.target.value = '';
  }

  function handleRecordClick() {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  function handleUploadClick() {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }

  return (
    <>
      <section className="hero-card" id="hero">
        <div className="hero-card-glow" />
        <div className="hero-text">
          <div className="hero-eyebrow">AI-Powered Meeting Intelligence</div>
          <h1 className="hero-h1">
            Transform Your<br />Meetings into<br />
            <span className="accent">Actionable</span>{' '}
            <span className="dim">Insights</span>
          </h1>
          <p className="hero-sub">
            Record or upload meetings and let AI generate structured
            summaries, key decisions, and action items instantly.
          </p>

          <div className="hero-btns">
            <button
              className={isRecording ? 'btn-primary btn-recording' : 'btn-primary'}
              onClick={handleRecordClick}
              disabled={isBusy}
            >
              {isRecording
                ? <><div className="rec-pulse" />&nbsp;Stop Recording</>
                : <><MicIcon />&nbsp;{isBusy ? 'Processing...' : 'Start Recording'}</>
              }
            </button>

            <button
              className="btn-secondary"
              onClick={handleUploadClick}
              disabled={isBusy || isRecording}
            >
              <UploadIcon />&nbsp;Upload File
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="audio/mp3,audio/wav,audio/m4a,audio/ogg,audio/webm,audio/*"
              style={{ display: 'none' }}
              onChange={handleUpload}
            />
          </div>

          {isRecording && (
            <div className="hero-status">
              <div className="hs-dot" />
              &nbsp;Recording — click Stop when done
            </div>
          )}
        </div>

        <div className="hero-wave-wrap">
          {WH.map((h, i) => (
            <div
              key={i}
              className={isRecording ? 'hw hw-active' : 'hw'}
              style={{
                height: h,
                animationDelay: (i * 0.06).toFixed(2) + 's'
              }}
            />
          ))}
        </div>
      </section>

      <ResultModal
        status={status}
        transcript={transcript}
        summary={summary}
        error={error}
        duration={duration}
        onClose={reset}
        onReset={reset}
      />
    </>
  );
}