import React from 'react';

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex items-center space-x-4 border border-gray-700">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-white text-2xl font-bold">{value}</p>
        </div>
    </div>
);

export default StatCard;
