import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pill } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';


const AuthPageLayout = ({ children, title, subtitle, page, linkText }) => {
    const navigate = useNavigate();
    return (
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
                    {page === '/login' ? "Don't have an account?" : "Already have an account?"}{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate(page); }} className="text-purple-400 hover:underline font-semibold">
                        {linkText}
                    </a>
                </p>
            </motion.div>
        </div>
    );
};


const RegisterPage = () => {
    // Updated state for new fields
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [place, setPlace] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const fullName = `${firstName} ${middleName} ${lastName}`.replace(/\s+/g, ' ').trim();
        // The mock register function now only needs the full name, but in a real app
        // you would send all the new fields to your backend.
        const success = await register(fullName, email, password);
        if (success) {
            navigate('/dashboard');
        }
    };
    
    return (
        <AuthPageLayout title="Create Your Account" subtitle="Start your path to better health today." page="/login" linkText="Login">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label className="text-sm font-bold text-gray-300 block mb-2">First Name</label>
                        <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Alex" className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                    </div>
                     <div className="w-1/2">
                        <label className="text-sm font-bold text-gray-300 block mb-2">Last Name</label>
                        <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe" className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                    </div>
                </div>
                 <div>
                    <label className="text-sm font-bold text-gray-300 block mb-2">Middle Name (Optional)</label>
                    <input type="text" value={middleName} onChange={e => setMiddleName(e.target.value)} placeholder="J." className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                 <div>
                    <label className="text-sm font-bold text-gray-300 block mb-2">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                </div>
                 <div>
                    <label className="text-sm font-bold text-gray-300 block mb-2">Mobile Number</label>
                    <input type="tel" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="+91 00000 00000" className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                </div>
                 <div>
                    <label className="text-sm font-bold text-gray-300 block mb-2">Your Location</label>
                    <input type="text" value={place} onChange={e => setPlace(e.target.value)} placeholder="e.g., New York, USA" className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                </div>
                <div>
                    <label className="text-sm font-bold text-gray-300 block mb-2">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Choose a strong password" className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity mt-4">
                    Create Account
                </button>
            </form>
        </AuthPageLayout>
    );
};

export default RegisterPage;