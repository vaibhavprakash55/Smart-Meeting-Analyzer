import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Recorder from "./components/Recorder";
import Result from "./components/Result";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { authService } from "./services/api";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, History, X, Clock } from "lucide-react";

function HomePage() {
  const [result, setResult] = useState(null);
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const navigate = useNavigate();

  // User-specific localStorage key helper
  const getStorageKey = (currentUser) => {
    if (currentUser?.email) {
      return `meeting_history_${currentUser.email}`;
    }
    return "meeting_history_guest";
  };

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    const fetchHistory = async () => {
      const storageKey = getStorageKey(currentUser);

      try {
        // 1. Try fetching from Backend API first
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (data.success && Array.isArray(data.history)) {
          // Format DB items for frontend rendering
          const formatted = data.history.map((item) => ({
            id: item.id,
            timestamp: item.createdAt
              ? new Date(item.createdAt).toLocaleString()
              : "Past Session",
            data: {
              transcript: item.transcript,
              summary: item.summary,
            },
          }));
          setHistory(formatted);
          localStorage.setItem(storageKey, JSON.stringify(formatted));
          return;
        }
      } catch (err) {
        console.warn("Backend fetch failed, fallback to local storage", err);
      }

      // 2. Fallback: User-Isolated LocalStorage
      const savedHistory = JSON.parse(
        localStorage.getItem(storageKey) || "[]"
      );
      setHistory(savedHistory);
    };

    fetchHistory();
  }, []);

  const handleNewResult = (data) => {
    setResult(data);
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      data: data,
    };
    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);

    // Save only to current logged in user's key
    const currentUser = authService.getCurrentUser();
    const storageKey = getStorageKey(currentUser);
    localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
  };

  const handleLogout = () => {
    authService.logout();
    setHistory([]);
    setResult(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 selection:bg-indigo-500/30 relative">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-emerald-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-white/10 hover:border-indigo-500/50 rounded-lg text-xs text-slate-300 transition"
            >
              <History className="w-4 h-4 text-indigo-400" />
              History ({history.length})
            </button>
            <div>
              <h2 className="text-xl font-bold">IntelliMinutes</h2>
              {user && (
                <p className="text-xs text-slate-400">Welcome, {user.name}!</p>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/80 hover:bg-red-600 rounded-lg text-sm transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* History Drawer */}
      <AnimatePresence>
        {isHistoryOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHistoryOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-80 bg-slate-950 border-r border-white/10 p-6 z-50 overflow-y-auto flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-400" /> Past Sessions
                </h3>
                <button
                  onClick={() => setIsHistoryOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 flex-1">
                {history.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-8">
                    No past recorded sessions.
                  </p>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setResult(item.data);
                        setIsHistoryOpen(false);
                      }}
                      className="p-3 bg-slate-900/80 hover:bg-slate-900 border border-white/5 hover:border-indigo-500/40 rounded-xl cursor-pointer transition"
                    >
                      <p className="text-xs text-indigo-400 font-medium">
                        {item.timestamp}
                      </p>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                        {item.data?.transcript || "Audio Session"}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            IntelliMinutes
          </h1>
          <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto">
            Transform your voice into structured meeting intelligence using
            Whisper & Groq Llama-3.
          </p>
        </motion.div>

        <section className="w-full max-w-2xl">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
            <Recorder setResult={handleNewResult} />
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;