import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AppShell = ({ user, onLogout, navigate, currentPage, children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    
    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
            <Sidebar navigate={navigate} currentPage={currentPage} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar user={user} onLogout={onLogout} />
                <main className="flex-1 overflow-y-auto p-6 bg-black/10">
                    <motion.div
                        key={currentPage}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default AppShell;

