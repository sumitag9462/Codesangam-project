import React, { createContext, useState, useContext } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState({
        user: null,
        isAuthenticated: false,
        token: null
    });

    const login = async (email, password) => {
        const res = await authApi.login(email, password);
        if (res.success) {
            setAuthData({ user: res.user, isAuthenticated: true, token: res.token });
            // In a real app: localStorage.setItem('token', res.token);
            return true;
        }
        return false;
    };

    const register = async (name, email, password) => {
        const res = await authApi.register(name, email, password);
        if (res.success) {
            setAuthData({ user: res.user, isAuthenticated: true, token: 'fake-token' });
            return true;
        }
        return false;
    };

    const logout = () => {
        setAuthData({ user: null, isAuthenticated: false, token: null });
        // In a real app: localStorage.removeItem('token');
    };

    const value = { ...authData, login, register, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
