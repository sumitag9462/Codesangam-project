// This file acts as our "database" using localStorage.

const initDB = () => {
    if (!localStorage.getItem('medwell_schedules')) {
        localStorage.setItem('medwell_schedules', JSON.stringify([]));
    }
    if (!localStorage.getItem('medwell_doseLogs')) {
        localStorage.setItem('medwell_doseLogs', JSON.stringify([]));
    }
};
initDB();

const getSchedules = () => JSON.parse(localStorage.getItem('medwell_schedules'));
const getDoseLogs = () => JSON.parse(localStorage.getItem('medwell_doseLogs'));

const saveSchedules = (schedules) => localStorage.setItem('medwell_schedules', JSON.stringify(schedules));
const saveDoseLogs = (logs) => localStorage.setItem('medwell_doseLogs', JSON.stringify(logs));

// The db object simulates our backend API calls
export const db = {
    getSchedules: () => getSchedules().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),

    createSchedule: (formData) => {
        const schedules = getSchedules();
        const newSchedule = {
            id: `sched_${Date.now()}`,
            ...formData,
            isActive: true,
            createdAt: new Date().toISOString()
        };
        saveSchedules([...schedules, newSchedule]);
        return newSchedule;
    },

    updateSchedule: (scheduleId, updatedData) => {
        let schedules = getSchedules();
        schedules = schedules.map(s => (s.id === scheduleId ? { ...s, ...updatedData, id: s.id } : s));
        saveSchedules(schedules);
    },

    deleteSchedule: (scheduleId) => {
        let schedules = getSchedules();
        saveSchedules(schedules.filter(s => s.id !== scheduleId));
    },

    getDoseLogs: () => getDoseLogs().sort((a, b) => new Date(b.actionTime) - new Date(a.actionTime)),

    createDoseLog: (logData) => {
        const logs = getDoseLogs();
        const newLog = { ...logData, logId: `log_${Date.now()}` };
        saveDoseLogs([...logs, newLog]);
        return newLog;
    }
};