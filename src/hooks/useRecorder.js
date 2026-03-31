import { useState, useRef, useCallback } from 'react';

const API_URL = 'http://localhost:8000';

export function useRecorder() {
  const [status, setStatus]         = useState('idle');
  const [transcript, setTranscript] = useState([]);
  const [summary, setSummary]       = useState(null);
  const [error, setError]           = useState('');
  const [duration, setDuration]     = useState(0);

  const mediaRef  = useRef(null);
  const chunksRef = useRef([]);
  const startRef  = useRef(null);

  const startRecording = useCallback(async () => {
    setError('');
    setTranscript([]);
    setSummary(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/ogg',
        ''
      ].find(type => type === '' || MediaRecorder.isTypeSupported(type));
      
      const options = mimeType ? { mimeType } : {};
      const recorder = new MediaRecorder(stream, options);
      mediaRef.current  = recorder;
      chunksRef.current = [];
      startRef.current  = Date.now();
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: mimeType || 'audio/webm' });
        console.log('Blob size:', blob.size);
        await sendToBackend(blob, 'recording.webm');
      };

      recorder.onerror = (e) => {
        setError('Recording failed: ' + e.message);
        setStatus('error');
      };
      recorder.start();
      setStatus('recording');
      console.log('Recording started:', mimeType);

    } catch (err) {
      console.error('Mic error:', err);
      setError('Microphone error: ' + err.message);
      setStatus('error');
    }
  }, []);
  const stopRecording = useCallback(() => {
    if (mediaRef.current && mediaRef.current.state !== 'inactive') {
      setDuration(Math.round((Date.now() - startRef.current) / 1000));
      mediaRef.current.stop();
      setStatus('processing');
    }
  }, []);

  const uploadFile = useCallback(async (file) => {
    setError('');
    setTranscript([]);
    setSummary(null);
    setStatus('processing');
    await sendToBackend(file, file.name);
  }, []);

  async function sendToBackend(blob, filename) {
    try {
      setStatus('processing');
      const formData = new FormData();
      formData.append('file', blob, filename);
      const res = await fetch(`${API_URL}/process`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Server error');
      }
      const data = await res.json();
      setTranscript(data.transcript || []);
      setSummary(data.summary || null);
      setDuration(data.duration || 0);
      setStatus('done');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
      setStatus('error');
    }
  }

  const reset = () => {
    setStatus('idle');
    setTranscript([]);
    setSummary(null);
    setError('');
    setDuration(0);
  };

  return {
    status, transcript, summary, error, duration,
    startRecording, stopRecording, uploadFile, reset,
  };
}
