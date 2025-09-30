import React from 'react';
import { motion } from 'framer-motion';
import { Pill, Clock, BookOpen, BarChart2, ChevronsRight, Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import FeatureCard from '../../components/cards/FeatureCard';

const LandingPage = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <header className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <Pill size={28} className="text-purple-400" />
                    <h1 className="text-2xl font-bold ml-2">MedWell</h1>
                </div>
                <nav className="space-x-6">
                    <a href="#features" className="hover:text-purple-400">Features</a>
                    {/* Updated to use navigate with a URL path */}
                    <button onClick={() => navigate('/login')} className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold transition-colors">
                        Login / Sign Up
                    </button>
                </nav>
            </header>

            <main className="container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="py-32"
                >
                    <h2 className="text-5xl md:text-7xl font-extrabold leading-tight">
                        Your Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Wellness</span> Companion
                    </h2>
                    <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                        Never miss a dose again. Track your medications, monitor your health, and achieve your wellness goals with MedWell.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        // Updated to use navigate with a URL path
                        onClick={() => navigate('/register')}
                        className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-full shadow-lg text-lg"
                    >
                        Get Started for Free
                    </motion.button>
                </motion.div>

                <section id="features" className="py-20">
                    <h3 className="text-4xl font-bold mb-12">Why You'll Love MedWell</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard icon={<Clock size={32} />} title="Powerful Reminders">
                            Customizable alerts for every dose, ensuring you stay on track with your schedule.
                        </FeatureCard>
                        <FeatureCard icon={<BookOpen size={32} />} title="Simple Logging">
                            Log doses with a single tap. Keep a detailed history of taken and missed medications.
                        </FeatureCard>
                        <FeatureCard icon={<BarChart2 size={32} />} title="Wellness Dashboard">
                            Visualize your progress with insightful charts and track your health journey over time.
                        </FeatureCard>
                        <FeatureCard icon={<ChevronsRight size={32} />} title="AI Predictions">
                            Our smart system predicts potential adherence issues and helps you stay consistent.
                        </FeatureCard>
                        <FeatureCard icon={<Calendar size={32} />} title="Calendar Sync">
                            Integrate your medication schedule with your personal calendar for seamless planning.
                        </FeatureCard>
                        <FeatureCard icon={<User size={32} />} title="Natural Language Assistant">
                            Ask our AI chatbot anything about your schedule, just like talking to a real person.
                        </FeatureCard>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default LandingPage;

