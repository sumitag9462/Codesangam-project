import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pill } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';

// --- THIS LAYOUT COMPONENT WAS MISSING ---
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
                    Remember your password?{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate(page); }} className="text-purple-400 hover:underline font-semibold">
                        {linkText}
                    </a>
                </p>
            </motion.div>
        </div>
    );
};
// --- END OF LAYOUT COMPONENT ---


const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1); // 1 for email, 2 for OTP
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Step 1: Request OTP
    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');
        try {
            const res = await apiClient.post('/auth/request-password-reset-otp', { email });
            setMessage(res.data.message);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify OTP and Redirect
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await apiClient.post('/auth/verify-password-reset-otp', { email, otp });
            if (res.data.success) {
                // If OTP is correct, navigate to the reset page with the temporary token
                navigate(`/reset-password/${res.data.resetToken}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'OTP verification failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthPageLayout title="Reset Password" subtitle="Enter your email to receive a verification code." page="/login" linkText="Back to Login">
            {step === 1 && (
                <form onSubmit={handleRequestOtp} className="space-y-6">
                    <div>
                        <label className="text-sm font-bold text-gray-300 block mb-2">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white" />
                    </div>
                    {error && <p className="text-center text-red-400 py-2">{error}</p>}
                    {message && <p className="text-center text-green-400 py-2">{message}</p>}
                    <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 disabled:opacity-50">
                        {isLoading ? 'Sending...' : 'Send Verification Code'}
                    </button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <p className="text-center text-gray-300">A 6-digit code was sent to <span className="font-bold text-white">{email}</span>.</p>
                    <div>
                        <label className="text-sm font-bold text-gray-300 block mb-2">Verification Code</label>
                        <input type="text" value={otp} onChange={e => setOtp(e.target.value)} required maxLength="6" className="w-full bg-gray-700 rounded-lg p-3 text-white text-center text-2xl tracking-[.5em]" />
                    </div>
                    {error && <p className="text-center text-red-400 py-2">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 disabled:opacity-50">
                        {isLoading ? 'Verifying...' : 'Verify Code'}
                    </button>
                    <button type="button" onClick={() => setStep(1)} className="w-full text-center text-gray-400 mt-2 hover:text-white" disabled={isLoading}>Back</button>
                </form>
            )}
        </AuthPageLayout>
    );
};

export default ForgotPasswordPage;