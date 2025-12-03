/**
 * API configuration and axios instance setup
 */

import axios, { AxiosError, AxiosInstance } from 'axios';

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
    withCredentials: true, // Important: enables sending cookies with requests
});

/**
 * Request interceptor
 * Can be used to add auth tokens or modify requests
 */
api.interceptors.request.use(
    (config) => {
        // You can add custom headers here if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor
 * Handles errors globally
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
                // Unauthorized - could redirect to login
                console.error('Unauthorized access - please login');
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
