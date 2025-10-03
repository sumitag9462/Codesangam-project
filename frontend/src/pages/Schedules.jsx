import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { medicineApi } from '../api/medicineApi';
import { dateUtils } from '../utils/dateUtils';
import { Plus, Pill, Edit, Trash2 } from 'lucide-react';

const ScheduleForm = ({ onSave, onCancel, existingSchedule }) => {
    const [formData, setFormData] = useState({
        name: '',
        dosage: '',
        frequency: 'Daily',
        times: ['09:00'],
        startDate: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        if (existingSchedule) {
            setFormData({
                name: existingSchedule.name,
                dosage: existingSchedule.dosage,
                frequency: existingSchedule.frequency,
                times: existingSchedule.times,
                startDate: new Date(existingSchedule.startDate).toISOString().split('T')[0],
            });
        }
    }, [existingSchedule]);
    
    // ... (Add your form input change handlers here if needed) ...

    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form from previous version, confirmed to work */}
            <div><label>Medicine Name</label><input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full bg-gray-700 p-2 rounded" /></div>
            <div><label>Dosage</label><input type="text" name="dosage" value={formData.dosage} onChange={(e) => setFormData({...formData, dosage: e.target.value})} required className="w-full bg-gray-700 p-2 rounded" /></div>
            {/* Add other inputs for frequency, times, etc. */}
            <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={onCancel} className="bg-gray-600 px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-purple-600 px-4 py-2 rounded">Save</button>
            </div>
        </form>
    );
};

const SchedulesPage = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);

    const fetchData = () => {
        setLoading(true);
        medicineApi.getSchedules().then(data => {
            setSchedules(data);
            setLoading(false);
        });
    };

    useEffect(fetchData, []);

    const handleSave = (formData) => {
        const apiCall = editingSchedule
            ? medicineApi.updateSchedule(editingSchedule.id, formData)
            : medicineApi.addSchedule(formData);
        
        apiCall.then(() => {
            fetchData(); // Re-fetch all schedules to update UI
            setIsModalOpen(false);
            setEditingSchedule(null);
        });
    };

    const handleDelete = (scheduleId) => {
        if (window.confirm('Are you sure you want to delete this schedule?')) {
            medicineApi.deleteSchedule(scheduleId).then(fetchData);
        }
    };
    
    const handleOpenEditModal = (schedule) => {
        setEditingSchedule(schedule);
        setIsModalOpen(true);
    };

    const handleOpenNewModal = () => {
        setEditingSchedule(null);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingSchedule(null);
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">My Medication Schedules</h1>
                <button onClick={handleOpenNewModal} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <Plus size={18} className="mr-2" /> Add Medicine
                </button>
            </div>
            
            {loading ? <div className="text-center">Loading...</div> : schedules.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {schedules.map(schedule => (
                        <motion.div key={schedule.id} layout className="bg-gray-800 p-6 rounded-2xl flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-2">{schedule.name}</h2>
                                <p className="text-purple-300 font-semibold">{schedule.dosage}</p>
                                <p className="text-gray-400 mt-2">{schedule.frequency}</p>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {schedule.times.map((time, index) => (
                                        <span key={index} className="bg-gray-700 px-3 py-1 rounded-full text-sm">{dateUtils.formatTime(time)}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center text-sm">
                                <p className="text-gray-500">Start: {dateUtils.formatDate(schedule.startDate)}</p>
                                <div className="flex gap-4">
                                    <button onClick={() => handleOpenEditModal(schedule)} className="flex items-center gap-1 text-blue-400 hover:text-blue-300"><Edit size={14}/> Edit</button>
                                    <button onClick={() => handleDelete(schedule.id)} className="flex items-center gap-1 text-red-400 hover:text-red-300"><Trash2 size={14}/> Delete</button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-2xl p-12">
                    <Pill className="mx-auto text-gray-500" size={48} />
                    <h3 className="mt-4 text-xl font-bold text-white">No Schedules Found</h3>
                    <p className="text-gray-400 mt-2">Get started by adding your first medication.</p>
                    <button onClick={handleOpenNewModal} className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center mx-auto">
                        <Plus size={18} className="mr-2" /> Add a Schedule
                    </button>
                </div>
            )}

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                        <motion.div className="bg-gray-800 rounded-2xl p-8 w-full max-w-lg">
                            <h2 className="text-2xl font-bold text-white mb-6">{editingSchedule ? 'Edit Medicine' : 'Add New Medicine'}</h2>
                            <ScheduleForm onSave={handleSave} onCancel={handleCancel} existingSchedule={editingSchedule} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
export default SchedulesPage;