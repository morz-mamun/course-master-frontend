/**
 * Token storage utilities
 * Manages JWT token in localStorage
 */

const TOKEN_KEY = 'auth_token';

export const tokenStorage = {
    /**
     * Get token from localStorage
     */
    getToken: (): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(TOKEN_KEY);
    },

    /**
     * Save token to localStorage
     */
    setToken: (token: string): void => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(TOKEN_KEY, token);
    },

    /**
     * Remove token from localStorage
     */
    removeToken: (): void => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(TOKEN_KEY);
    },

    /**
     * Check if token exists
     */
    hasToken: (): boolean => {
        return !!tokenStorage.getToken();
    },
};
