import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '@/types/api';

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5195/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from sessionStorage (where Zustand persist stores it)
    const authStorage = sessionStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        const token = state?.token;
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      // Handle 401 Unauthorized - clear session and redirect to login
      if (error.response.status === 401) {
        sessionStorage.removeItem('auth-storage');
        window.location.href = '/login';
      }

      // Extract error message
      const apiError: ApiError = {
        message: error.response.data?.message || 'An error occurred',
        errors: error.response.data?.errors,
        statusCode: error.response.status,
      };

      return Promise.reject(apiError);
    }

    // Network error or no response
    const networkError: ApiError = {
      message: error.message || 'Network error occurred',
      statusCode: 0,
    };

    return Promise.reject(networkError);
  }
);

export default apiClient;
