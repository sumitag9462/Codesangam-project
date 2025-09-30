import React from 'react';
import { Bell, Search, LogOut } from 'lucide-react';

const Topbar = ({ user, onLogout }) => (
    <div className="h-16 bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 flex items-center justify-between px-6">
        <div className="flex items-center">
             <div className="relative w-full max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="text-gray-400" size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>
        </div>
        <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white">
                <Bell size={22} />
            </button>
            <div className="flex items-center space-x-2">
                <img
                    className="h-9 w-9 rounded-full object-cover"
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`}
                    alt="User"
                />
                <div>
                     <span className="text-white font-medium">{user?.name}</span>
                     <p className="text-xs text-gray-400">Patient</p>
                </div>
            </div>
             <button onClick={onLogout} className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700">
                <LogOut size={22} />
            </button>
        </div>
    </div>
);

export default Topbar;
