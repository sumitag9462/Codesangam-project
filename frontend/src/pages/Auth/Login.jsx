import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pill } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';

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

const LoginPage = ({ navigate }) => {
    const [email, setEmail] = useState('user@medwell.com');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await login(email, password);
        if (!success) {
            setError('Invalid email or password. Please try again.');
        } else {
            navigate('dashboard');
        }
    };
    
    return (
       <AuthPageLayout title="Welcome Back!" subtitle="Log in to manage your wellness journey." navigate={navigate} page="register" linkText="Sign Up">
            <form onSubmit={handleSubmit} className="space-y-6">
                 {error && <p className="text-red-400 text-sm">{error}</p>}
                <div>
                    <label className="text-sm font-bold text-gray-300 block mb-2">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                    <label className="text-sm font-bold text-gray-300 block mb-2">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div className="text-right">
                    <a href="#" onClick={e => {e.preventDefault(); navigate('forgot-password')}} className="text-sm text-purple-400 hover:underline">Forgot Password?</a>
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity">
                    Login
                </button>
            </form>
        </AuthPageLayout>
    );
};

export default LoginPage;
