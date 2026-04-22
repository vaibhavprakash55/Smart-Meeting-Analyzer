import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService, handleApiError } from "../services/api";
import { Mail, Lock, AlertCircle, Loader, Eye, EyeOff } from "lucide-react";

/* Fonts */
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap";
fontLink.rel = "stylesheet";
if (!document.head.querySelector('[href*="DM+Serif"]'))
  document.head.appendChild(fontLink);

/* CSS */
const css = `
:root {
  --bg: #020617;
  --surface: #0b1224;
  --border: #1b2a4a;
  --primary: #4f46e5;
  --primary-light: #6366f1;
  --text: #e2e8f0;
  --muted: #94a3b8;
  --error: #ef4444;
  --error-bg: #2a0f0f;
}

.lp-root {
  min-height: 100vh;
  background: radial-gradient(circle at top, #0b1224, #020617);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'DM Sans', sans-serif;
}

.lp-wrap {
  width: 100%;
  max-width: 420px;
}

.lp-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}

.lp-logo {
  width: 36px;
  height: 36px;
  background: var(--primary);
  border-radius: 8px;
  display: grid;
  place-items: center;
}

.lp-logo-dot {
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
}

.lp-brand-name {
  font-family: 'DM Serif Display', serif;
  color: var(--text);
  font-size: 18px;
}

.lp-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 32px;
  box-shadow:
    0 0 40px rgba(79,70,229,.15),
    0 24px 48px rgba(0,0,0,.6);
}

.lp-heading {
  font-size: 28px;
  color: var(--text);
}

.lp-subtext {
  color: var(--muted);
  margin-bottom: 20px;
}

.lp-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.lp-input-wrap {
  position: relative;
}

.lp-input {
  width: 100%;
  padding: 12px 40px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: #020617;
  color: var(--text);
}

.lp-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(79,70,229,.3);
}

.lp-input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted);
}

.lp-btn {
  margin-top: 10px;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  cursor: pointer;
  font-weight: 600;
}

.lp-btn:hover {
  transform: translateY(-1px);
}

.lp-error {
  background: var(--error-bg);
  color: var(--error);
  padding: 10px;
  border-radius: 8px;
}

.lp-footer {
  margin-top: 20px;
  text-align: center;
}

.lp-footer a {
  color: var(--primary-light);
}
`;

let injected = false;
function injectStyles() {
  if (injected) return;
  const s = document.createElement("style");
  s.innerHTML = css;
  document.head.appendChild(s);
  injected = true;
}

export default function Login() {
  injectStyles();

  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authService.login(formData);
      if (res.success) {
        navigate("/");
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp-root">
      <div className="lp-wrap">
        <div className="lp-brand">
          <div className="lp-logo">
            <div className="lp-logo-dot"></div>
          </div>
          <span className="lp-brand-name">IntelliMinutes</span>
        </div>

        <div className="lp-card">
          <h2 className="lp-heading">Welcome back</h2>
          <p className="lp-subtext">Login to continue</p>

          {error && <div className="lp-error">{error}</div>}

          <form onSubmit={handleSubmit} className="lp-form">
            <div className="lp-input-wrap">
              <Mail className="lp-input-icon" size={16} />
              <input
                type="email"
                placeholder="Email"
                className="lp-input"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="lp-input-wrap">
              <Lock className="lp-input-icon" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="lp-input"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button className="lp-btn" disabled={loading}>
              {loading ? <Loader className="animate-spin" size={16} /> : "Sign In"}
            </button>
          </form>

          <div className="lp-footer">
            <p>
              Don’t have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}