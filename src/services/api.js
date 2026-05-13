"use client";

import axios from 'axios';

// ─── Base Configuration ─────────────────────────────────────
// In development, Next.js rewrites proxy /api/* to the backend (see next.config.mjs).
// This means we use a relative '/api' path — no CORS issues.
// In production, set NEXT_PUBLIC_API_URL to your deployed backend if NOT using rewrites.
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60s timeout to handle cold starts
});

// Request Interceptor: Inject Authorization Token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Global Errors & Auth Expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized (Token expired or invalid)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Only redirect/clear if on admin routes
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
        localStorage.removeItem('admin_token');
      }
    }

    // Standardize error message extraction
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.error || 
      error.message || 
      'A network error occurred';
      
    // Log error for debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[API Error] ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}:`, errorMessage);
    }

    return Promise.reject({
      ...error,
      message: errorMessage,
      status: error.response?.status
    });
  }
);

/**
 * Helper for Multi-part Form Data (File Uploads)
 */
export const multipartConfig = {
  headers: {
    'Content-Type': 'multipart/form-data',
  }
};

export default api;
