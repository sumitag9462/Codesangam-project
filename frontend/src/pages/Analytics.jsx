import React, { useState, useEffect } from 'react';
import { otherApi } from '../api/otherApi';
import AdherenceChart from '../components/charts/AdherenceChart';
import MissedByHourChart from '../components/charts/MissedByHourChart';
import StatCard from '../Components/Cards/StatCard';
import { BarChart2, History as HistoryIcon, X } from 'lucide-react';


const AnalyticsPage = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        otherApi.getAnalyticsData().then(setData);
    }, []);

    if (!data) return <div className="text-center p-10">Loading analytics...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Wellness Analytics</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                 <StatCard title="Overall Adherence" value="88%" icon={<BarChart2 size={24} />} color="bg-green-500/20 text-green-300" />
                 <StatCard title="Current Streak" value={`${data.streak} Days`} icon={<HistoryIcon size={24} />} color="bg-yellow-500/20 text-yellow-300" />
                 <StatCard title="Missed Doses (Month)" value="12" icon={<X size={24} />} color="bg-red-500/20 text-red-300" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AdherenceChart data={data.adherence} />
                <MissedByHourChart data={data.missedByHour} />
            </div>
        </div>
    );
};

export default AnalyticsPage;
