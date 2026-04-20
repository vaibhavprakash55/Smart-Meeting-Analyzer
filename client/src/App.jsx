import { useState } from "react";
import Recorder from "./components/Recorder";
import Result from "./components/Result";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 selection:bg-indigo-500/30">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-emerald-600/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            IntelliMinutes
          </h1>
          <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto">
            Transform your voice into structured meeting intelligence using Whisper & Groq Llama-3.
          </p>
        </motion.div>

        <section className="w-full max-w-2xl">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
            <Recorder setResult={setResult} />
          </div>
        </section>

        <AnimatePresence>
          {result && (
            <motion.section 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full mt-12"
            >
              <Result data={result} />
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;