/**
 * Authentication service
 * Handles all authentication-related API calls
 */

import api from '@/lib/api';
import type {
    LoginFormData,
    RegisterFormData,
    AuthResponse,
    User
} from '@/lib/types';

/**
 * Login user
 */
export const login = async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
};

/**
 * Register new user
 */
export const register = async (data: RegisterFormData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
};

/**
 * Logout current user
 */
export const logout = async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/logout');
    return response.data;
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): Promise<{ user: User }> => {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data;
};
