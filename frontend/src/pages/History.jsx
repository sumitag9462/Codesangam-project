import React, { useState, useEffect } from 'react';
import { medicineApi } from '../api/medicineApi';
import { History as HistoryIcon, CheckCircle, XCircle } from 'lucide-react';
import { dateUtils } from '../utils/dateUtils';

const HistoryPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        medicineApi.getDoseLogs().then(data => {
            setLogs(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="text-center p-10">Loading History...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Dose History</h1>
                {/* Future: Add filter controls here */}
            </div>
            
            {logs.length > 0 ? (
                <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
                    <div className="divide-y divide-gray-700">
                        {logs.map(log => (
                            <div key={log.logId} className="flex items-center justify-between p-4 hover:bg-gray-700/50">
                                 <div className="flex items-center gap-4">
                                    {log.status === 'Taken' ? <CheckCircle size={24} className="text-green-400"/> : <XCircle size={24} className="text-red-400"/>}
                                    <div>
                                        <p className="font-semibold text-white">{log.medicationName}</p>
                                        <p className="text-sm text-gray-400">Scheduled for {dateUtils.formatTime(new Date(log.scheduledTime).toTimeString().slice(0,5))}</p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <p className={`font-semibold text-sm ${log.status === 'Taken' ? 'text-green-300' : 'text-red-300'}`}>{log.status}</p>
                                    <p className="text-xs text-gray-500">{new Date(log.actionTime).toLocaleString()}</p>
                                 </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-2xl p-12">
                    <HistoryIcon size={48} className="mx-auto text-gray-600"/>
                    <h3 className="mt-4 text-xl font-bold text-white">No History Yet</h3>
                    <p className="text-gray-400">Log your first dose from the dashboard to see your history here.</p>
                </div>
            )}
        </div>
    );
};
export default HistoryPage;