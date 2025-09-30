import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { medicineApi } from '../api/medicineApi';
import StatCard from '../Components/Cards/StatCard';
import { Clock, BarChart2, History as HistoryIcon } from 'lucide-react';
import { dateUtils } from '../utils/dateUtils';

const DashboardPage = () => {
    const { user } = useAuth();
    const [upcomingDoses, setUpcomingDoses] = useState([]);
    const [doseHistory, setDoseHistory] = useState([]);
    
    useEffect(() => {
        medicineApi.getUpcomingDoses().then(setUpcomingDoses);
        medicineApi.getDoseHistory().then(history => setDoseHistory(history.slice(0, 5))); // show recent 5
    }, []);
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name.split(' ')[0]}!</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Upcoming Doses Today" value={upcomingDoses.length} icon={<Clock size={24} />} color="bg-blue-500/20 text-blue-300" />
                <StatCard title="Adherence This Week" value="92%" icon={<BarChart2 size={24} />} color="bg-green-500/20 text-green-300" />
                <StatCard title="Current Streak" value="14 Days" icon={<HistoryIcon size={24} />} color="bg-yellow-500/20 text-yellow-300" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Doses */}
                <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-4">Upcoming Doses</h2>
                    <div className="space-y-4">
                        {upcomingDoses.map(dose => (
                            <div key={dose.id} className="bg-gray-700/50 p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-white">{dose.medicineName}</p>
                                    <p className="text-sm text-gray-400">{dose.dosage}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg text-purple-400">{dateUtils.formatTime(dose.time)}</p>
                                    <div className="flex space-x-2 mt-1">
                                         <button className="bg-green-500/20 text-green-300 text-xs px-3 py-1 rounded-full hover:bg-green-500/40">Take</button>
                                        <button className="bg-yellow-500/20 text-yellow-300 text-xs px-3 py-1 rounded-full hover:bg-yellow-500/40">Snooze</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                         {upcomingDoses.length === 0 && <p className="text-gray-400">No more doses scheduled for today.</p>}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
                    <ul className="space-y-3">
                        {doseHistory.map(dose => (
                            <li key={dose.id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center">
                                    <span className={`w-2.5 h-2.5 rounded-full mr-3 ${dose.status === 'taken' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                                    <div>
                                        <span className="font-medium text-white">{dose.medicineName}</span>
                                        <span className="text-gray-400 ml-2">{dose.dosage}</span>
                                    </div>
                                </div>
                                <span className="text-gray-500">{new Date(dose.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
