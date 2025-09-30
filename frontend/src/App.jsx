import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import Pages
import LandingPage from './pages/Landing';
import LoginPage from './pages/Auth/Login';
import RegisterPage from './pages/Auth/Register';
import ForgotPasswordPage from './pages/Auth/ForgotPassword';
import DashboardPage from './pages/Dashboard';
import SchedulesPage from './pages/Schedules';
import HistoryPage from './pages/History';
import AnalyticsPage from './pages/Analytics';
import SettingsPage from './pages/Settings';

// Import Layout
import AppShell from './components/layout/AppShell';
import Chatbot from './components/chatbot/Chatbot';

// This component protects routes that require authentication.
const PrivateRoute = () => {
    const { isAuthenticated } = useAuth();
    // If the user is authenticated, render the nested routes (children).
    // Otherwise, redirect them to the login page.
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// This component handles the main application layout for authenticated users.
const AppLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Extract the current page name from the URL path (e.g., "/dashboard" -> "dashboard")
    const currentPage = location.pathname.substring(1);

    const handleLogout = () => {
        logout();
        navigate('/'); // Navigate to landing page on logout
    };

    return (
        <AppShell user={user} onLogout={handleLogout} navigate={navigate} currentPage={currentPage}>
            <Chatbot />
            {/* The Outlet component renders the matched child route component */}
            <Outlet />
        </AppShell>
    );
};

// Main App Component with all the routes
function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="font-sans">
                    {/* AnimatePresence can be removed if it causes issues with routing animations */}
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                        {/* Private Routes Layout */}
                        <Route element={<PrivateRoute />}>
                            <Route element={<AppLayout />}>
                                <Route path="/dashboard" element={<DashboardPage />} />
                                <Route path="/schedules" element={<SchedulesPage />} />
                                <Route path="/history" element={<HistoryPage />} />
                                <Route path="/analytics" element={<AnalyticsPage />} />
                                <Route path="/settings" element={<SettingsPage />} />
                                {/* Add a default redirect for authenticated users */}
                                <Route path="*" element={<Navigate to="/dashboard" replace />} />
                            </Route>
                        </Route>
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;

