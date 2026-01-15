// API Configuration
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3000/api";

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

// Helper function to get API URL (BACKEND_URL already includes /api)
const getApiUrl = (path: string) => {
  if (USE_PROXY) {
    // Use local proxy endpoint
    return PROXY_URL + path;
  }
  return BACKEND_URL + path;
};

// API Endpoints (paths are relative to /api which is already in BACKEND_URL)
export const API_ENDPOINTS = {
  twitter: {
    status: getApiUrl("/twitter/status"),
    // Auth must use direct backend URL for OAuth redirect
    auth: BACKEND_URL + "/twitter/auth",
    post: getApiUrl("/twitter/post"),
    disconnect: getApiUrl("/twitter/disconnect"),
  },
  veo: {
    tune: getApiUrl("/veo/tune"),
    generate: getApiUrl("/veo/generate"),
  },
  health: getApiUrl("/health"),
};

// Default fetch options
export const API_FETCH_OPTIONS: RequestInit = {
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};

export { BACKEND_URL as API_URL, FRONTEND_URL, getFrontendUrl };
