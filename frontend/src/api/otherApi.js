import { db } from './mockDb';

const simulateApiCall = (data, delay = 400) => new Promise(resolve => setTimeout(() => resolve(data), delay));

export const otherApi = {
    // This function performs all calculations for the dashboard
    getDashboardSummary: () => {
        const schedules = db.getSchedules().filter(s => s.isActive);
        const doseLogs = db.getDoseLogs();
        const today = new Date();

        // Upcoming Doses for today
        const now = today.getHours() * 60 + today.getMinutes();
        const upcomingDoses = schedules.flatMap(s =>
            s.times.map(time => {
                const [hour, minute] = time.split(':');
                const doseTimeInMinutes = parseInt(hour) * 60 + parseInt(minute);
                if (doseTimeInMinutes >= now) {
                    return { scheduleId: s.id, medicationName: `${s.name} ${s.dosage}`, time };
                }
                return null;
            }).filter(Boolean)
        ).sort((a, b) => a.time.localeCompare(b.time));

        // Recent Activity (last 5 logs)
        const recentActivity = doseLogs.slice(0, 5);

        // Adherence for last 7 days
        const weekLogs = doseLogs.filter(log => new Date(log.actionTime) > new Date(new Date().setDate(today.getDate() - 7)));
        const adherenceWeekly = weekLogs.length > 0 ? Math.round(weekLogs.filter(l => l.status === 'Taken').length / weekLogs.length * 100) : 0;

        // Current Streak
        let currentStreak = 0;
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(today.getDate() - (i + 1)); // Start from yesterday and go back
            const schedulesForDay = schedules.filter(s => new Date(s.startDate) <= date && s.isActive);
            if (schedulesForDay.length === 0 && i === 0) continue; // No meds yesterday

            const totalDosesScheduled = schedulesForDay.reduce((acc, s) => acc + s.times.length, 0);
            const logsForDay = doseLogs.filter(log => new Date(log.actionTime).toDateString() === date.toDateString());
            const takenLogsForDay = logsForDay.filter(l => l.status === 'Taken');
            
            if (takenLogsForDay.length >= totalDosesScheduled && totalDosesScheduled > 0) {
                currentStreak++;
            } else {
                break; // Streak is broken
            }
        }

        const summary = {
            kpis: { adherenceWeekly, currentStreak, upcomingToday: upcomingDoses.length },
            upcomingDoses,
            recentActivity,
        };
        return simulateApiCall(summary);
    },
};