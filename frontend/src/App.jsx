import React, { useEffect } from 'react'; // Import useEffect
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { googleCalendarApi } from './services/googleCalendarApi'; // Import the google api

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

const PrivateRoute = () => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const AppLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const currentPage = location.pathname.substring(1);

    // --- THIS IS THE FIX ---
    // Load Google API scripts once when the main app layout is loaded.
    // This makes 'gapi' available on all authenticated pages.
    useEffect(() => {
        googleCalendarApi.loadGapiScripts();
    }, []);

    const handleLogout = () => {
        logout();
        // No need to navigate here if AuthProvider handles it
    };

    return (
        <AppShell user={user} onLogout={handleLogout} currentPage={currentPage}>
            <Chatbot />
            <Outlet />
        </AppShell>
    );
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="font-sans">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                        <Route element={<PrivateRoute />}>
                            <Route element={<AppLayout />}>
                                <Route path="/dashboard" element={<DashboardPage />} />
                                <Route path="/schedules" element={<SchedulesPage />} />
                                <Route path="/history" element={<HistoryPage />} />
                                <Route path="/analytics" element={<AnalyticsPage />} />
                                <Route path="/settings" element={<SettingsPage />} />
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