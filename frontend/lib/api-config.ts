// API Configuration
const BACKEND_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

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
        // All Twitter endpoints use frontend API routes for proper session handling
        status: "/api/twitter/status",
        auth: "/api/twitter/auth",
        post: "/api/twitter/post",
        disconnect: "/api/twitter/disconnect",
    },
    reddit: {
        inbox: getApiUrl("/reddit/inbox"),
        reply: getApiUrl("/reddit/inbox/reply"),
    },
    social: {
        post: getApiUrl("/social/post"),
        health: getApiUrl("/social/health"),
        facebook: {
            validate: getApiUrl("/social/facebook/validate"),
            pageInfo: getApiUrl("/social/facebook/page-info"),
        },
    },
    socialListening: {
        keywords: getApiUrl("/social-listening/keywords"),
        mentions: getApiUrl("/social-listening/mentions"),
        trends: getApiUrl("/social-listening/trends"),
        alerts: getApiUrl("/social-listening/alerts"),
        competitors: getApiUrl("/social-listening/competitors"),
    },
    veo: {
        tune: getApiUrl("/veo/tune"),
        generate: getApiUrl("/veo/generate"),
    },
    health: getApiUrl("/health"),
};

// Default fetch options for API calls
export const API_FETCH_OPTIONS: RequestInit = {
    credentials: "include", // Important for session cookies
    headers: {
        "Content-Type": "application/json",
        // Add ngrok header to avoid warning page
        ...(BACKEND_URL.includes("ngrok") && {
            "ngrok-skip-browser-warning": "true",
        }),
    },
};

// Fetch options for form data (file uploads)
export const API_FETCH_OPTIONS_FORM: RequestInit = {
    credentials: "include",
    headers: {
        // Don't set Content-Type for FormData - browser will set it with boundary
        ...(BACKEND_URL.includes("ngrok") && {
            "ngrok-skip-browser-warning": "true",
        }),
    },
};

export { BACKEND_URL as API_URL, FRONTEND_URL, getFrontendUrl };
