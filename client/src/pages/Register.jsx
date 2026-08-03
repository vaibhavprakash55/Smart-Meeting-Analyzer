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
    <div className="min-h-screen bg-[#030712] text-slate-200 flex items-center justify-center p-6 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-emerald-500/15 rounded-full blur-[120px]" />
      </div>

      {/* Expanded Container Width: max-w-5xl */}
      <div className="w-full max-w-5xl bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center shadow-2xl z-10">
        
        {/* LEFT PANEL (7 cols) */}
        <div className="md:col-span-7 space-y-7">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span>✨ Start Free Workspace</span>
          </div>

          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">IntelliMinutes</h1>
            <p className="mt-3 text-slate-400 text-base leading-relaxed">
              Join top engineering teams turning spoken ideas into actionable sprint tasks instantly.
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-slate-300 text-sm font-medium">Zero Setup Required &amp; Fast Audio Transcribe</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-slate-300 text-sm font-medium">Structured Executive Summaries &amp; Action Items</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-slate-300 text-sm font-medium">Local History Storage &amp; PDF Export Suite</span>
            </div>
          </div>

          {/* Metric Highlight Card */}
          <div className="flex items-center gap-4 p-4 bg-slate-800/40 border border-white/10 rounded-xl backdrop-blur-md">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 text-sm font-bold">🚀</div>
            <div>
              <div className="text-sm font-bold text-white">Enterprise Ready SaaS</div>
              <div className="text-xs text-slate-400">Built with React, Tailwind &amp; Groq Llama-3</div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL (5 cols) - Scaled Spacing */}
        <div className="md:col-span-5 bg-slate-800/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 sm:p-9 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Create an account</h2>
            <p className="text-xs text-slate-400 mt-1 mb-6">Get started with your free workspace</p>

            {error && (
              <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Vaibhav Prakash"
                  className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vaibhav@example.com"
                  className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg text-sm transition-all shadow-lg shadow-emerald-600/25 active:scale-[0.98]"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </div>

          <p className="text-xs text-center text-slate-400 mt-6">
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