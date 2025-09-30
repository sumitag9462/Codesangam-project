import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, children }) => (
    <motion.div 
        className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 hover:border-purple-500 transition-all duration-300"
        whileHover={{ y: -5 }}
    >
        <div className="text-purple-400 mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{children}</p>
    </motion.div>
);

export default FeatureCard;
