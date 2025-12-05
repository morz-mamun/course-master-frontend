/**
 * API configuration and axios instance setup
 */

import axios, { AxiosError, AxiosInstance } from 'axios';
import { tokenStorage } from './tokenStorage';

// Get API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Create axios instance with default configuration
 */
const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request interceptor
 * Adds Bearer token from localStorage to Authorization header
 */
api.interceptors.request.use(
    (config) => {
        const token = tokenStorage.getToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor
 * Handles errors globally and auto-logout on 401
 */
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        // Handle specific error cases
        if (error.response) {
            // Server responded with error status
            const status = error.response.status;

            if (status === 401) {
                // Unauthorized - token invalid or expired
                console.error('Unauthorized access - please login');

                // Clear token and redirect to login
                tokenStorage.removeToken();

                // Only redirect if not already on login page
                if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            } else if (status === 403) {
                // Forbidden - insufficient permissions
                console.error('Access forbidden - insufficient permissions');
            } else if (status === 404) {
                // Not found
                console.error('Resource not found');
            } else if (status >= 500) {
                // Server error
                console.error('Server error - please try again later');
            }
        } else if (error.request) {
            // Request made but no response received
            console.error('Network error - please check your connection');
        } else {
            // Something else happened
            console.error('An error occurred:', error.message);
        }

        return Promise.reject(error);
    }
);

export default api;
