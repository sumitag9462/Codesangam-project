import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './Context/AuthContext';

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

const AppRouter = () => {
    const [currentPage, setCurrentPage] = useState('landing');
    const { user, isAuthenticated, logout } = useAuth();

    const navigate = (page) => {
        setCurrentPage(page);
    };

    // If user becomes authenticated, navigate to dashboard
    useEffect(() => {
        if (isAuthenticated) {
            navigate('dashboard');
        } else {
            // Allow access only to auth pages if not authenticated
            const authPages = ['landing', 'login', 'register', 'forgot-password'];
            if (!authPages.includes(currentPage)) {
                 navigate('landing');
            }
        }
    }, [isAuthenticated, currentPage]);
    
    const handleLogout = () => {
        logout();
        navigate('landing');
    }

    const renderPage = () => {
        if (!isAuthenticated) {
            switch (currentPage) {
                case 'login':
                    return <LoginPage navigate={navigate} />;
                case 'register':
                    return <RegisterPage navigate={navigate} />;
                case 'forgot-password':
                    return <ForgotPasswordPage navigate={navigate} />;
                case 'landing':
                default:
                    return <LandingPage navigate={navigate} />;
            }
        }
        
        // Authenticated routes
        return (
            <AppShell user={user} onLogout={handleLogout} navigate={navigate} currentPage={currentPage}>
                <Chatbot />
                {(() => {
                    switch (currentPage) {
                        case 'dashboard':
                            return <DashboardPage />;
                        case 'schedules':
                            return <SchedulesPage />;
                        case 'history':
                            return <HistoryPage />;
                        case 'analytics':
                            return <AnalyticsPage />;
                        case 'settings':
                            return <SettingsPage />;
                        default:
                            return <DashboardPage />;
                    }
                })()}
            </AppShell>
        );
    };

     return (
        <div className="font-sans">
             <AnimatePresence mode="wait">
                <motion.div
                    key={currentPage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {renderPage()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

// Wrap the main router with the AuthProvider
export default function App() {
    return (
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    );
}
