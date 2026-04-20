import { useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Recorder({ setResult }) {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Ready to record");

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", blob, "recording.webm");

      try {
        setLoading(true);
        setStatus("AI is analyzing your meeting...");
        const res = await axios.post("http://localhost:5000/upload", formData);
        setResult(res.data);
        setStatus("Analysis Complete");
      } catch (err) {
        setStatus("Connection failed. Check backend.");
      } finally {
        setLoading(false);
      }
    };

    mediaRecorder.start();
    setRecording(true);
    setStatus("Listening...");
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative">
        {recording && (
          <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
        )}
        <div className={`h-24 w-24 rounded-full flex items-center justify-center border-2 transition-colors ${recording ? 'border-red-500 bg-red-500/10' : 'border-indigo-500/50 bg-indigo-500/5'}`}>
          <div className={`h-4 w-4 rounded-full ${recording ? 'bg-red-500' : 'bg-indigo-500'}`} />
        </div>
      </div>

      <p className="text-sm font-medium tracking-widest uppercase text-slate-500">
        {status}
      </p>

      <div className="flex gap-4">
        {!recording ? (
          <button
            onClick={startRecording}
            disabled={loading}
            className="group relative px-8 py-3 bg-white text-black font-bold rounded-xl overflow-hidden hover:scale-105 transition-transform disabled:opacity-50"
          >
            Start Session
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all"
          >
            End & Generate
          </button>
        )}
      </div>
    </div>
  );
}