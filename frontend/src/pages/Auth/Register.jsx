import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pill } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';

// Re-using the layout from Login page for consistency.
const AuthPageLayout = ({ children, title, subtitle, navigate, page, linkText }) => (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
        >
            <div className="text-center mb-8">
                 <div className="inline-flex items-center justify-center">
                    <Pill size={36} className="text-purple-400" />
                    <h1 className="text-4xl font-bold ml-2 text-white">MedWell</h1>
                </div>
                <h2 className="text-2xl font-bold text-white mt-4">{title}</h2>
                <p className="text-gray-400">{subtitle}</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
                {children}
            </div>
             <p className="text-center mt-6 text-gray-400">
                {page === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigate(page); }} className="text-purple-400 hover:underline font-semibold">
                    {linkText}
                </a>
            </p>
        </motion.div>
    </div>
);


const RegisterPage = ({ navigate }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await register(name, email, password);
        if (success) {
            navigate('dashboard');
        }
    };
    
    return (
        <AuthPageLayout title="Create Your Account" subtitle="Start your path to better health today." navigate={navigate} page="login" linkText="Login">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="text-sm font-bold text-gray-300 block mb-2">Full Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                </div>
                 <div>
                    <label className="text-sm font-bold text-gray-300 block mb-2">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                </div>
                <div>
                    <label className="text-sm font-bold text-gray-300 block mb-2">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity">
                    Create Account
                </button>
            </form>
        </AuthPageLayout>
    );
};

export default RegisterPage;
