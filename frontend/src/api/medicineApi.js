// This combines medicine and dose APIs for simplicity in the mock version.

export const medicineApi = {
    // Return empty array to simulate a new user
    getSchedules: async () => [],

    // Return empty array to simulate a new user
    getUpcomingDoses: async () => [],

    // Return empty array to simulate a new user
    getDoseHistory: async (dateFilter = null) => {
        const allHistory = [
            // Example data is kept here but initially an empty array is returned.
            // In a real app, this data would be fetched from a database for the specific user.
            // { id: 201, medicineName: 'Metformin', dosage: '500mg', time: '2023-10-25T08:00:00', status: 'taken' },
        ];
        if(dateFilter) return allHistory.filter(d => new Date(d.time).toDateString() === new Date(dateFilter).toDateString());
        return []; // Return empty by default
    },
};