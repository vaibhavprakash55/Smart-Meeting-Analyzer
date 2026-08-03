import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (authService?.register) {
        await authService.register(name, email, password);
      } else {
        localStorage.setItem("user", JSON.stringify({ name, email }));
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 flex items-center justify-center p-4 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Main Split Container */}
      <div className="w-full max-w-4xl bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-2xl z-10">
        
        {/* LEFT PANEL */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span>✨ Start Free Workspace</span>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">IntelliMinutes</h1>
            <p className="mt-2 text-slate-400 text-sm leading-relaxed">
              Join top engineering teams turning spoken ideas into actionable sprint tasks instantly.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-slate-300 text-xs font-medium">Zero Setup Required &amp; Fast Audio Transcribe</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-slate-300 text-xs font-medium">Structured Executive Summaries &amp; Action Items</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-slate-300 text-xs font-medium">Local History Storage &amp; PDF Export Suite</span>
            </div>
          </div>

          {/* Metric Highlight Card */}
          <div className="flex items-center gap-3 p-3.5 bg-slate-800/40 border border-white/10 rounded-xl backdrop-blur-md">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 text-xs font-bold">🚀</div>
            <div>
              <div className="text-xs font-bold text-white">Enterprise Ready SaaS</div>
              <div className="text-[10px] text-slate-400">Built with React, Tailwind &amp; Groq Llama-3</div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-slate-800/60 backdrop-blur-2xl border border-white/10 rounded-xl p-6 sm:p-8 shadow-xl">
          <h2 className="text-xl font-bold text-white">Create an account</h2>
          <p className="text-xs text-slate-400 mt-1 mb-6">Get started with your free workspace</p>

          {error && (
            <div className="mb-4 p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Vaibhav Prakash"
                className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vaibhav@example.com"
                className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-all shadow-lg shadow-emerald-600/25 active:scale-[0.98]"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-xs text-center text-slate-400 mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;