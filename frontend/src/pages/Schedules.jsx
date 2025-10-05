import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { medicineApi } from '../api/medicineApi';
import { dateUtils } from '../utils/dateUtils';
import { Plus, Pill, Edit, Trash2 } from 'lucide-react';
import { googleCalendarApi } from '../services/googleCalendarApi';

// The ScheduleForm component remains the same as the previous version.
const ScheduleForm = ({ onSave, onCancel, existingSchedule }) => {
    // ... (no changes needed in this component)
    const [formData, setFormData] = useState({
        name: '',
        dosage: '',
        times: ['09:00'],
        startDate: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        if (existingSchedule) {
            setFormData({
                name: existingSchedule.name,
                dosage: existingSchedule.dosage,
                times: existingSchedule.times,
                startDate: new Date(existingSchedule.startDate).toISOString().split('T')[0],
            });
        }
    }, [existingSchedule]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTimeChange = (index, value) => {
        const newTimes = [...formData.times];
        newTimes[index] = value;
        setFormData(prev => ({ ...prev, times: newTimes.sort() }));
    };

    const addTime = () => {
        setFormData(prev => ({ ...prev, times: [...prev.times, '17:00'].sort() }));
    };

    const removeTime = (index) => {
        const newTimes = formData.times.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, times: newTimes }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-sm font-bold text-gray-300 block mb-2">Medicine Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., Ibuprofen" />
            </div>
             <div>
                <label className="text-sm font-bold text-gray-300 block mb-2">Dosage</label>
                <input type="text" name="dosage" value={formData.dosage} onChange={handleInputChange} required className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., 200mg" />
            </div>
            <div>
                 <label className="text-sm font-bold text-gray-300 block mb-2">Dose Times</label>
                 <div className="space-y-2">
                    {formData.times.map((time, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input type="time" value={time} onChange={(e) => handleTimeChange(index, e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            {formData.times.length > 1 && (
                                 <button type="button" onClick={() => removeTime(index)} className="text-red-400 hover:text-red-300 p-2"><Trash2 size={18}/></button>
                            )}
                        </div>
                    ))}
                 </div>
                 <button type="button" onClick={addTime} className="mt-2 text-purple-400 hover:text-purple-300 text-sm font-semibold">
                    + Add another time
                 </button>
            </div>
            <div>
                <label className="text-sm font-bold text-gray-300 block mb-2">Start Date</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} required className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg">Save Schedule</button>
            </div>
        </form>
    );
};


const SchedulesPage = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    const fetchData = useCallback(() => {
        setLoading(true);
        medicineApi.getSchedules().then(data => {
            setSchedules(data);
            setLoading(false);
        }).catch(error => {
            console.error("Failed to fetch schedules:", error);
            setLoading(false);
        });
    }, []);

    useEffect(fetchData, [fetchData]);

    const handleSave = async (formData) => {
        setIsModalOpen(false);
        
        // If we are editing, first delete the old calendar events
        if (editingSchedule && editingSchedule.googleEventIds) {
            await googleCalendarApi.deleteScheduleFromCalendar(editingSchedule.googleEventIds);
        }

        const scheduleData = editingSchedule 
            ? { ...editingSchedule, ...formData } 
            : formData;
            
        const savedSchedule = editingSchedule
            ? await medicineApi.updateSchedule(editingSchedule.id, scheduleData)
            : await medicineApi.addSchedule(scheduleData);
        
        // Add new events to calendar and get their IDs
        const newEventIds = await googleCalendarApi.addScheduleToCalendar(savedSchedule);

        // Save the new event IDs back to our database
        if (newEventIds && newEventIds.length > 0) {
            await medicineApi.updateSchedule(savedSchedule.id, { ...savedSchedule, googleEventIds: newEventIds });
        }
        
        setEditingSchedule(null);
        fetchData();
    };

    const confirmDelete = async () => {
        if (showDeleteConfirm) {
            const scheduleToDelete = schedules.find(s => s.id === showDeleteConfirm);
            
            // Delete from Google Calendar first
            if (scheduleToDelete && scheduleToDelete.googleEventIds) {
                await googleCalendarApi.deleteScheduleFromCalendar(scheduleToDelete.googleEventIds);
            }
            
            // Then delete from our database
            await medicineApi.deleteSchedule(showDeleteConfirm);

            setShowDeleteConfirm(null);
            fetchData();
        }
    };

    // Other handlers (handleDelete, handleOpenEditModal, etc.) remain the same
    const handleDelete = (scheduleId) => setShowDeleteConfirm(scheduleId);
    const handleOpenEditModal = (schedule) => { setEditingSchedule(schedule); setIsModalOpen(true); };
    const handleOpenNewModal = () => { setEditingSchedule(null); setIsModalOpen(true); };
    const handleCancel = () => { setIsModalOpen(false); setEditingSchedule(null); };

    return (
        <div>
            {/* The JSX for the page layout remains the same */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">My Medication Schedules</h1>
                <button onClick={handleOpenNewModal} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <Plus size={18} className="mr-2" /> Add Medicine
                </button>
            </div>
            
            {loading ? <div className="text-center p-10">Loading Schedules...</div> : schedules.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {schedules.map(schedule => (
                        <motion.div key={schedule.id} layout className="bg-gray-800 p-6 rounded-2xl flex flex-col justify-between border border-gray-700 hover:border-purple-500 transition-colors">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-2">{schedule.name}</h2>
                                <p className="text-purple-300 font-semibold">{schedule.dosage}</p>
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
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-gray-800 rounded-2xl p-8 w-full max-w-lg border border-gray-700">
                            <h2 className="text-2xl font-bold text-white mb-6">{editingSchedule ? 'Edit Medicine' : 'Add New Medicine'}</h2>
                            <ScheduleForm onSave={handleSave} onCancel={handleCancel} existingSchedule={editingSchedule} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showDeleteConfirm && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-gray-800 rounded-2xl p-8 w-full max-w-sm border border-gray-700 text-center">
                            <h3 className="text-lg font-bold text-white">Are you sure?</h3>
                            <p className="text-gray-400 my-4">This action will permanently delete the schedule. This cannot be undone.</p>
                            <div className="flex justify-center gap-4">
                                <button onClick={() => setShowDeleteConfirm(null)} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
                                <button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">Delete</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
export default SchedulesPage;