import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Corrected import path casing
import { medicineApi } from '../api/medicineApi';
import StatCard from '../components/cards/StatCard';
import { Clock, BarChart2, History as HistoryIcon, Plus } from 'lucide-react';
import { dateUtils } from '../utils/dateUtils';

const DashboardPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [upcomingDoses, setUpcomingDoses] = useState([]);
    const [doseHistory, setDoseHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [upcoming, history] = await Promise.all([
                    medicineApi.getUpcomingDoses(),
                    medicineApi.getDoseHistory()
                ]);
                setUpcomingDoses(upcoming || []);
                setDoseHistory(history ? history.slice(0, 5) : []);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
                // Optionally set an error state here to show a message to the user
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="text-center p-10">Loading Dashboard...</div>;
    }
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name.split(' ')[0]}!</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Upcoming Doses Today" value={upcomingDoses.length} icon={<Clock size={24} />} color="bg-blue-500/20 text-blue-300" />
                <StatCard title="Adherence This Week" value="N/A" icon={<BarChart2 size={24} />} color="bg-green-500/20 text-green-300" />
                <StatCard title="Current Streak" value="N/A" icon={<HistoryIcon size={24} />} color="bg-yellow-500/20 text-yellow-300" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Doses */}
                <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-4">Upcoming Doses</h2>
                    <div className="space-y-4">
                        {upcomingDoses.length > 0 ? (
                            upcomingDoses.map(dose => (
                                <div key={dose.id} className="bg-gray-700/50 p-4 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-white">{dose.medicineName}</p>
                                        <p className="text-sm text-gray-400">{dose.dosage}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg text-purple-400">{dateUtils.formatTime(dose.time)}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                <p>No upcoming doses for today.</p>
                                <button 
                                    onClick={() => navigate('/schedules')} 
                                    className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center mx-auto"
                                >
                                    <Plus size={18} className="mr-2" /> Add a Schedule
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
                    {doseHistory.length > 0 ? (
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
                    ) : (
                         <div className="text-center py-8 text-gray-400">
                            <p>No recent activity to show.</p>
                            <p className="text-sm mt-2">Doses you take or miss will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;

