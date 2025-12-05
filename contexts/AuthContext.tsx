"use client"

/**
 * Authentication Context
 * Manages user authentication state and provides auth functions
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as loginService, register as registerService, logout as logoutService, getCurrentUser } from '@/services/auth.service';
import type { User, LoginFormData, RegisterFormData } from '@/lib/types';
import { tokenStorage } from '@/lib/tokenStorage';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: LoginFormData) => Promise<User>;
    register: (data: RegisterFormData) => Promise<User>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check if user is authenticated on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            // Check if token exists before making request
            if (!tokenStorage.hasToken()) {
                setUser(null);
                setLoading(false);
                return;
            }

            const response = await getCurrentUser();
            setUser(response.user);
        } catch (error) {
            // Token invalid or expired
            tokenStorage.removeToken();
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (data: LoginFormData) => {
        const response = await loginService(data);
        tokenStorage.setToken(response.token);
        setUser(response.user);
        return response.user;
    };

    const register = async (data: RegisterFormData) => {
        const response = await registerService(data);
        tokenStorage.setToken(response.token);
        setUser(response.user);
        return response.user;
    };

    const logout = async () => {
        await logoutService();
        tokenStorage.removeToken();
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isStudent: user?.role === 'student',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
