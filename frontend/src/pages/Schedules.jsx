import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { medicineApi } from '../api/medicineApi';
import { dateUtils } from '../utils/dateUtils';
import { Plus, MoreVertical } from 'lucide-react';

const SchedulesPage = () => {
    const [schedules, setSchedules] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);

    useEffect(() => {
        medicineApi.getSchedules().then(setSchedules);
    }, []);

    const handleSave = (schedule) => {
        if (editingSchedule) {
            setSchedules(schedules.map(s => s.id === schedule.id ? schedule : s));
        } else {
            setSchedules([...schedules, { ...schedule, id: Date.now() }]);
        }
        setIsModalOpen(false);
        setEditingSchedule(null);
    };

    const handleEdit = (schedule) => {
        setEditingSchedule(schedule);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        setSchedules(schedules.filter(s => s.id !== id));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">My Medication Schedules</h1>
                <button onClick={() => { setEditingSchedule(null); setIsModalOpen(true); }} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <Plus size={18} className="mr-2" /> Add Medicine
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schedules.map(schedule => (
                    <motion.div 
                        key={schedule.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex justify-between items-start">
                                <h2 className="text-xl font-bold text-white mb-2">{schedule.name}</h2>
                                <div className="relative">
                                    <button className="text-gray-400 hover:text-white">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-purple-300 font-semibold">{schedule.dosage}</p>
                            <p className="text-gray-400 mt-2">{schedule.frequency}</p>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {schedule.times.map(time => (
                                    <span key={time} className="bg-gray-700 text-gray-200 text-sm px-3 py-1 rounded-full">
                                        {dateUtils.formatTime(time)}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center text-sm text-gray-500">
                             <div>
                                <p>Start: {dateUtils.formatDate(schedule.startDate)}</p>
                                <p>End: {dateUtils.formatDate(schedule.endDate) || 'Ongoing'}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button onClick={() => handleEdit(schedule)} className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white">Edit</button>
                                <button onClick={() => handleDelete(schedule.id)} className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white">Delete</button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-gray-800 rounded-2xl p-8 w-full max-w-lg border border-gray-700"
                        >
                           <h2 className="text-2xl font-bold text-white mb-6">{editingSchedule ? 'Edit Schedule' : 'Add New Medicine'}</h2>
                            {/* Form Component Would Go Here */}
                            <p className="text-gray-300">Form to add/edit schedule details would be here.</p>
                            <div className="mt-6 flex justify-end space-x-4">
                                <button onClick={() => setIsModalOpen(false)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
                                <button onClick={() => handleSave({id: editingSchedule?.id, name: 'Dummy', dosage:'10mg', times:[], frequency: 'Daily'})} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg">Save</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SchedulesPage;
