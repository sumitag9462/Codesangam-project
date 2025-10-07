const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const DoseLog = require('../models/DoseLog');
const { protect } = require('../middleware/authMiddleware');

// GET /api/dashboard/summary - A single endpoint to get all dashboard data
router.get('/summary', protect, async (req, res) => {
    try {
        const userId = req.user._id;
        const today = new Date();
        const startOfToday = new Date(new Date().setHours(0, 0, 0, 0));

        // Get active schedules and all dose logs in parallel for efficiency
        const [schedules, doseLogs] = await Promise.all([
            Schedule.find({ user: userId, isActive: true }),
            DoseLog.find({ user: userId })
        ]);

        // 1. Calculate Upcoming Doses
        const now = new Date();
        const upcomingDoses = schedules.flatMap(s => 
            s.times.map(time => {
                const [hour, minute] = time.split(':');
                const doseTime = new Date(startOfToday);
                doseTime.setHours(parseInt(hour), parseInt(minute));
                if (doseTime > now) {
                    return { scheduleId: s._id, medicationName: `${s.name} ${s.dosage}`, time };
                }
                return null;
            }).filter(Boolean)
        ).sort((a, b) => a.time.localeCompare(b.time));

        // 2. Get Recent Activity
        const recentActivity = doseLogs.sort((a, b) => b.actionTime - a.actionTime).slice(0, 5);

        // 3. Calculate 7-day Adherence
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const weekLogs = doseLogs.filter(log => log.actionTime > sevenDaysAgo && (log.status === 'Taken' || log.status === 'Skipped'));
        const takenInWeek = weekLogs.filter(l => l.status === 'Taken').length;
        const adherenceWeekly = weekLogs.length > 0 ? Math.round((takenInWeek / weekLogs.length) * 100) : 0;

        // 4. Calculate Current Streak
        let currentStreak = 0;
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (i + 1));
            const dayStart = new Date(date.setHours(0, 0, 0, 0));
            const dayEnd = new Date(date.setHours(23, 59, 59, 999));
            
            const schedulesForDay = schedules.filter(s => s.startDate <= dayStart);
            if (schedulesForDay.length === 0) continue;

            const totalDosesScheduled = schedulesForDay.reduce((acc, s) => acc + s.times.length, 0);
            
            const logsForDay = doseLogs.filter(log => log.actionTime >= dayStart && log.actionTime <= dayEnd);
            const takenLogsForDay = logsForDay.filter(l => l.status === 'Taken');
            
            if (totalDosesScheduled > 0 && takenLogsForDay.length >= totalDosesScheduled) {
                currentStreak++;
            } else if (totalDosesScheduled > 0) {
                break;
            }
        }

        res.json({
            kpis: { adherenceWeekly, currentStreak, upcomingToday: upcomingDoses.length },
            upcomingDoses,
            recentActivity,
        });

    } catch (error) {
        console.error("Dashboard Summary Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;