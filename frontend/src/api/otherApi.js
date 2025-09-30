export const otherApi = {
    getAnalyticsData: async () => ({
        adherence: [
            { name: 'Mon', adherence: 90 }, { name: 'Tue', adherence: 80 }, { name: 'Wed', adherence: 85 },
            { name: 'Thu', adherence: 95 }, { name: 'Fri', adherence: 100 }, { name: 'Sat', adherence: 70 },
            { name: 'Sun', adherence: 92 },
        ],
        missedByHour: [
            { hour: 'Morning (6-11am)', missed: 3 }, { hour: 'Afternoon (12-5pm)', missed: 1 },
            { hour: 'Evening (6-11pm)', missed: 5 }, { hour: 'Night (12-5am)', missed: 0 },
        ],
        streak: 14,
    }),
    askChatbot: async (message) => {
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes("next dose")) {
            return "Your next dose is Metformin (500mg) at 8:00 PM tonight.";
        } else if (lowerMessage.includes("missed any")) {
            return "You missed one dose of Lisinopril yesterday morning.";
        } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
            return "Hello! I'm your wellness assistant. How can I help you today?";
        }
        return "I'm not sure how to answer that. You can ask me about your next dose or if you've missed any medications.";
    },
};
