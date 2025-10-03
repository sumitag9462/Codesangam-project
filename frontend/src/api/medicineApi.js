import { db } from './mockDb';

const simulateApiCall = (data, delay = 200) => new Promise(resolve => setTimeout(() => resolve(data), delay));

export const medicineApi = {
    getSchedules: () => simulateApiCall(db.getSchedules()),
    addSchedule: (formData) => simulateApiCall(db.createSchedule(formData)),
    updateSchedule: (scheduleId, formData) => simulateApiCall(db.updateSchedule(scheduleId, formData)),
    deleteSchedule: (scheduleId) => simulateApiCall(db.deleteSchedule(scheduleId)),
    createDoseLog: (logData) => simulateApiCall(db.createDoseLog(logData)),
    getDoseLogs: () => simulateApiCall(db.getDoseLogs()),
};