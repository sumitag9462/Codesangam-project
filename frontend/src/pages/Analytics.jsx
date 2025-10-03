import React, { useState, useEffect } from 'react';
import { db } from '../api/mockDb'; // We'll do calculations here directly for simplicity
import AdherenceChart from '../Components/charts/AdherenceChart';
import MissedByHourChart from '../Components/charts/MissedByHourChart';
import StatCard from '../Components/cards/StatCard';
import { BarChart, CheckCircle, XCircle, Zap } from 'lucide-react';

const AnalyticsPage = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const doseLogs = db.getDoseLogs();
        if (doseLogs.length > 0) {
            const today = new Date();
            
            // KPIs
            const totalTaken = doseLogs.filter(l => l.status === 'Taken').length;
            const totalMissed = doseLogs.length - totalTaken;
            const overallAdherence = Math.round((totalTaken / doseLogs.length) * 100);

            // Weekly Adherence Chart
            const weeklyAdherence = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, dayIndex) => {
                const dayLogs = doseLogs.filter(d => new Date(d.actionTime).getDay() === dayIndex);
                if (dayLogs.length === 0) return { name: day, adherence: 0 };
                const takenCount = dayLogs.filter(d => d.status === 'taken').length;
                return { name: day, adherence: Math.round((takenCount / dayLogs.length) * 100) };
            });

            // Missed Doses by Time of Day Chart
            const missedByHour = [
                { hour: 'Morning (6-11am)', missed: 0 },
                { hour: 'Afternoon (12-5pm)', missed: 0 },
                { hour: 'Evening (6-11pm)', missed: 0 },
                { hour: 'Night (12-5am)', missed: 0 },
            ];
            doseLogs.filter(d => d.status === 'Skipped').forEach(d => {
                const hour = new Date(d.scheduledTime).getHours();
                if (hour >= 6 && hour < 12) missedByHour[0].missed++;
                else if (hour >= 12 && hour < 18) missedByHour[1].missed++;
                else if (hour >= 18 && hour < 24) missedByHour[2].missed++;
                else missedByHour[3].missed++;
            });
            
            setAnalyticsData({
                stats: { overallAdherence, totalTaken, totalMissed },
                weeklyAdherence,
                missedByHour,
            });
        }
        setLoading(false);
    }, []);

    if (loading) return <div className="text-center p-10">Calculating Analytics...</div>;

    if (!analyticsData) {
        return (
            <div className="text-center bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-2xl p-12">
                <BarChart className="mx-auto text-gray-500" size={48} />
                <h3 className="mt-4 text-xl font-bold text-white">Not Enough Data</h3>
                <p className="text-gray-400 mt-2">Log your first dose from the dashboard to generate analytics.</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Wellness Analytics</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                 <StatCard title="Overall Adherence" value={`${analyticsData.stats.overallAdherence}%`} icon={<BarChart size={24}/>} />
                 <StatCard title="Total Doses Taken" value={analyticsData.stats.totalTaken} icon={<CheckCircle size={24}/>} />
                 <StatCard title="Total Doses Missed" value={analyticsData.stats.totalMissed} icon={<XCircle size={24}/>} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AdherenceChart data={analyticsData.weeklyAdherence} />
                <MissedByHourChart data={analyticsData.missedByHour} />
            </div>
        </div>
    );
};
export default AnalyticsPage;