import { motion } from "framer-motion";

export default function Result({ data }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Transcript - Left Side */}
      <div className="md:col-span-1 space-y-4">
        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider px-2">Raw Transcript</h3>
        <div className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl h-[400px] overflow-y-auto text-slate-400 leading-relaxed italic">
          "{data.transcript}"
        </div>
      </div>

      {/* AI Intelligence - Right Side */}
      <div className="md:col-span-2 space-y-4">
        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider px-2">AI Insights</h3>
        <div className="bg-gradient-to-br from-indigo-500/[0.07] to-emerald-500/[0.07] border border-white/10 p-8 rounded-2xl shadow-inner min-h-[400px]">
          <div className="prose prose-invert max-w-none">
             {/* Yahan hum whitespace-pre-wrap use kar rahe hain taaki Groq ka formatting maintain rahe */}
            <p className="whitespace-pre-wrap text-slate-200 font-sans text-lg leading-relaxed">
              {data.summary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}