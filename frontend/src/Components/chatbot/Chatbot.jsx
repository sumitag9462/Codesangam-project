import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronsRight, Send } from 'lucide-react';
import { otherApi } from '../../api/otherApi';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: 'ai', text: 'Hello! I am your MedWell assistant. How can I help?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMessage = { from: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const aiResponse = await otherApi.askChatbot(input);
        
        setTimeout(() => {
            setMessages(prev => [...prev, { from: 'ai', text: aiResponse }]);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-4 shadow-lg"
                >
                    <AnimatePresence>
                    {isOpen ? <X size={24} /> : <ChevronsRight size={24} />}
                    </AnimatePresence>
                </motion.button>
            </div>
            <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    className="fixed bottom-24 right-6 w-96 h-[32rem] bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 flex flex-col z-40 overflow-hidden"
                >
                    <div className="p-4 bg-gray-900 border-b border-gray-700">
                        <h3 className="text-lg font-bold text-white">Wellness Assistant</h3>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`px-4 py-2 rounded-2xl max-w-xs ${msg.from === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                         {isLoading && (
                             <div className="flex justify-start">
                                 <div className="px-4 py-2 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-none">
                                     <div className="flex items-center space-x-1">
                                         <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></span>
                                         <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                                         <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                                     </div>
                                 </div>
                             </div>
                         )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 border-t border-gray-700 flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask something..."
                            className="flex-1 bg-gray-700 border-gray-600 rounded-full py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button onClick={handleSend} className="ml-3 bg-purple-600 p-2 rounded-full text-white">
                            <Send size={18} />
                        </button>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
