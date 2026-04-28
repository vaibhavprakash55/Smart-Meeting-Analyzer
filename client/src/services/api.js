import axios from "axios";

// Configure base URL for API calls
const API_BASE_URL = "https://smart-meeting-analyzer-3.onrender.com/api";
// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Add response interceptor to handle token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// ========================
// AUTH SERVICE
// ========================

export const authService = {
  /**
   * Register a new user
   */
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Registration failed" };
    }
  },

  /**
   * Login user
   */
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", {
        email: credentials.email,
        password: credentials.password,
      });

      // Store token and user info
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Login failed" };
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  /**
   * Get current user info
   */
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  /**
   * Get auth token
   */
  getToken: () => {
    return localStorage.getItem("token");
  },

  /**
   * Get user info from server
   */
  getMe: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch user info" };
    }
  },
};

// ========================
// UPLOAD SERVICE (Protected)
// ========================

export const uploadService = {
  /**
   * Upload audio file for transcription
   */
  uploadAudio: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Upload failed" };
    }
  },
};

// ========================
// API HELPER FUNCTIONS
// ========================

/**
 * Handle API errors
 */
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data.error || "An error occurred";
  } else if (error.request) {
    // Request was made but no response
    return "No response from server";
  } else {
    // Error in request setup
    return error.message || "An error occurred";
  }
};

export default api;
