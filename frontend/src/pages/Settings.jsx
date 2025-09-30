import React from 'react';
import { useAuth } from '../Context/AuthContext';

const SettingsPage = () => {
    const { user } = useAuth();
    
    return (
    <div>
        <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>

        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>
            <form className="space-y-4">
                 <div>
                    <label className="text-sm font-bold text-gray-300 block mb-2">Full Name</label>
                    <input type="text" defaultValue={user?.name} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                 <div>
                    <label className="text-sm font-bold text-gray-300 block mb-2">Email</label>
                    <input type="email" defaultValue={user?.email} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                
                 <h2 className="text-xl font-bold text-white pt-6 mb-2">Notification Settings</h2>
                 <div className="flex items-center space-x-4">
                    <label className="text-gray-300">Notification Type:</label>
                    <select className="bg-gray-700 border border-gray-600 rounded-lg p-2 text-white">
                        <option>Push Notifications</option>
                        <option>Email</option>
                        <option>Both</option>
                    </select>
                </div>

                <div className="pt-6 flex justify-end">
                    <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    </div>
    )
};

export default SettingsPage;
