import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Pitch Shortcut: Ctrl + Shift + D autofills demo credentials
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        setEmail("vaibhav321@gmail.com");
        setPassword("demo1234");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Pass single object matching api.js expectations
      await authService.login({ email, password });
      navigate("/");
    } catch (err) {
      console.error("Login Error:", err);
      const backendError = err?.message || err?.error || "Invalid credentials. Please try again.";
      setError(backendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 flex items-center justify-center p-6 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-5xl bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center shadow-2xl z-10">
        
        {/* LEFT PANEL */}
        <div className="md:col-span-7 space-y-7">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <span>✨ Enterprise Edition v1.0</span>
          </div>

          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">IntelliMinutes</h1>
            <p className="mt-3 text-slate-400 text-base leading-relaxed">
              Transform spoken meetings into structured intelligence using Whisper &amp; Groq Llama-3.
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-slate-300 text-sm font-medium">Groq Llama-3 Powered AI Insights</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-slate-300 text-sm font-medium">Automated Action Items &amp; Task Extraction</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-slate-300 text-sm font-medium">Instant Professional PDF Export Suite</span>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-slate-800/40 border border-white/10 rounded-xl backdrop-blur-md">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 text-sm font-bold">⚡</div>
            <div>
              <div className="text-sm font-bold text-white">10x Faster Sprint Summaries</div>
              <div className="text-xs text-slate-400">High-precision MOM generation</div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="md:col-span-5 bg-slate-800/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 sm:p-9 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="text-xs text-slate-400 mt-1 mb-6">Please enter your credentials to continue</p>

            {error && (
              <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vaibhav321@gmail.com"
                  className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
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
                  className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg text-sm transition-all shadow-lg shadow-indigo-600/25 active:scale-[0.98]"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          </div>

          <p className="text-xs text-center text-slate-400 mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-400 font-semibold hover:underline">
              Create account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;