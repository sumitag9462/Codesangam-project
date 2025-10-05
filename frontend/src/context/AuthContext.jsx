import React, { createContext, useState, useContext } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // This function runs once when the app starts to check for a logged-in user
    const getInitialState = () => {
        try {
            const storedAuthData = localStorage.getItem('medwell_auth');
            if (storedAuthData) {
                // If we find user data in storage, initialize the state with it
                return JSON.parse(storedAuthData);
            }
        } catch (error) {
            console.error("Could not parse stored auth data", error);
        }
        // Otherwise, the user is not logged in
        return { user: null, isAuthenticated: false, token: null };
    };

    const [authData, setAuthData] = useState(getInitialState);

    const login = async (email, password) => {
        const res = await authApi.login(email, password);
        if (res.success) {
            const newAuthData = { user: res.user, isAuthenticated: true, token: res.token };
            // Save the login state to localStorage
            localStorage.setItem('medwell_auth', JSON.stringify(newAuthData));
            setAuthData(newAuthData);
            return true;
        }
        return false;
    };

    const register = async (name, email, password) => {
        const res = await authApi.register(name, email, password);
        if (res.success) {
            const newAuthData = { user: res.user, isAuthenticated: true, token: 'fake-token' };
            // Save the login state to localStorage
            localStorage.setItem('medwell_auth', JSON.stringify(newAuthData));
            setAuthData(newAuthData);
            return true;
        }
        return false;
    };

    const logout = () => {
        // Remove the login state from localStorage
        localStorage.removeItem('medwell_auth');
        setAuthData({ user: null, isAuthenticated: false, token: null });
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