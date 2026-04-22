import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService, handleApiError } from "../services/api";
import {
  User,
  Mail,
  Lock,
  AlertCircle,
  Loader,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";

/* Inject CSS once */
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
  --success: #22c55e;
}

.r-root {
  min-height: 100vh;
  background: radial-gradient(circle at top, #0b1224, #020617);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: sans-serif;
}

.r-wrap {
  width: 100%;
  max-width: 420px;
}

.r-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 32px;
  box-shadow:
    0 0 40px rgba(79,70,229,.15),
    0 24px 48px rgba(0,0,0,.6);
}

.r-heading {
  font-size: 28px;
  color: var(--text);
}

.r-sub {
  color: var(--muted);
  margin-bottom: 20px;
}

.r-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.r-input-wrap {
  position: relative;
}

.r-input {
  width: 100%;
  padding: 12px 40px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: #020617;
  color: var(--text);
}

.r-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(79,70,229,.3);
}

.r-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted);
}

.r-btn {
  margin-top: 10px;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  cursor: pointer;
  font-weight: 600;
}

.r-error {
  background: #2a0f0f;
  color: var(--error);
  padding: 10px;
  border-radius: 8px;
}

.r-success {
  background: #052e16;
  color: var(--success);
  padding: 10px;
  border-radius: 8px;
}

.r-footer {
  margin-top: 20px;
  text-align: center;
}

.r-footer a {
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

export default function Register() {
  injectStyles();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      const res = await authService.register(formData);

      if (res.success) {
        setSuccess("Account created! Redirecting...");
        setTimeout(() => navigate("/login"), 1200);
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="r-root">
      <div className="r-wrap">
        <div className="r-card">
          <h2 className="r-heading">Create Account</h2>
          <p className="r-sub">Join IntelliMinutes</p>

          {error && <div className="r-error">{error}</div>}
          {success && <div className="r-success">{success}</div>}

          <form onSubmit={handleSubmit} className="r-form">
            <div className="r-input-wrap">
              <User className="r-icon" size={16} />
              <input
                type="text"
                placeholder="Full Name"
                className="r-input"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="r-input-wrap">
              <Mail className="r-icon" size={16} />
              <input
                type="email"
                placeholder="Email"
                className="r-input"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="r-input-wrap">
              <Lock className="r-icon" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="r-input"
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

            <div className="r-input-wrap">
              <Lock className="r-icon" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="r-input"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>

            <button className="r-btn" disabled={loading}>
              {loading ? (
                <Loader className="animate-spin" size={16} />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="r-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}