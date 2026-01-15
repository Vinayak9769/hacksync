// API Configuration
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3000";

// Detect the current frontend URL (dev tunnel, localhost, etc.)
const getFrontendUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_FRONTEND_URL || "";
};

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "";

// Use proxy for API calls to avoid CORS/cookie issues
const USE_PROXY = false;
const PROXY_URL = "/api/proxy";

// Helper function to get API URL
const getApiUrl = (path: string) => {
  if (USE_PROXY) {
    // Use local proxy endpoint
    return PROXY_URL + path.replace("/api", "");
  }
  return BACKEND_URL + path;
};

// API Endpoints
export const API_ENDPOINTS = {
  twitter: {
    status: getApiUrl("/api/twitter/status"),
    // Auth must use direct backend URL for OAuth redirect
    auth: BACKEND_URL + "/api/twitter/auth",
    post: getApiUrl("/api/twitter/post"),
    disconnect: getApiUrl("/api/twitter/disconnect"),
  },
  veo: {
    tune: getApiUrl("/api/veo/tune"),
    generate: getApiUrl("/api/veo/generate"),
  },
  health: getApiUrl("/api/health"),
};

// Default fetch options
export const API_FETCH_OPTIONS: RequestInit = {
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};

export { BACKEND_URL as API_URL, FRONTEND_URL, getFrontendUrl };
