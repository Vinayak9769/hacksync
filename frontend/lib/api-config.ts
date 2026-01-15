// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://toucan-driven-admittedly.ngrok-free.app';

// API Endpoints
export const API_ENDPOINTS = {
  twitter: {
    status: API_URL + '/api/twitter/status',
    auth: API_URL + '/api/twitter/auth',
    post: API_URL + '/api/twitter/post',
    disconnect: API_URL + '/api/twitter/disconnect',
  },
  health: API_URL + '/api/health',
};

// Default fetch options to bypass ngrok warning
export const API_FETCH_OPTIONS: RequestInit = {
  credentials: 'include',
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
};

export { API_URL };
