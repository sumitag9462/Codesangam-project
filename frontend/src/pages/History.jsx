import React, { useState, useEffect } from 'react';
import { medicineApi } from '../api/medicineApi';

const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        medicineApi.getDoseHistory().then(setHistory);
    }, []);
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Dose History</h1>
                <input 
                    type="date" 
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                />
            </div>

            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-700/50">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-300">Medication</th>
                            <th className="p-4 text-sm font-semibold text-gray-300">Dosage</th>
                            <th className="p-4 text-sm font-semibold text-gray-300">Time</th>
                            <th className="p-4 text-sm font-semibold text-gray-300">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map(item => (
                            <tr key={item.id} className="border-b border-gray-700 last:border-b-0">
                                <td className="p-4 text-white">{item.medicineName}</td>
                                <td className="p-4 text-gray-400">{item.dosage}</td>
                                <td className="p-4 text-gray-400">{new Date(item.time).toLocaleString()}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                        item.status === 'taken' ? 'bg-green-500/20 text-green-300' : 
                                        item.status === 'missed' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'
                                    }`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistoryPage;
