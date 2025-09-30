// This combines medicine and dose APIs for simplicity in the mock version.

export const medicineApi = {
    getSchedules: async () => [
        { id: 1, name: 'Metformin', dosage: '500mg', frequency: 'Daily', times: ['08:00', '20:00'], startDate: '2023-10-01', endDate: '2024-10-01' },
        { id: 2, name: 'Lisinopril', dosage: '10mg', frequency: 'Daily', times: ['09:00'], startDate: '2023-01-01', endDate: null },
        { id: 3, name: 'Atorvastatin', dosage: '20mg', frequency: 'Daily', times: ['21:00'], startDate: '2023-05-15', endDate: '2024-05-15' },
        { id: 4, name: 'Vitamin D3', dosage: '1000 IU', frequency: 'Weekly', times: ['12:00'], startDate: '2023-01-01', endDate: null },
    ],
    getUpcomingDoses: async () => [
        { id: 101, medicineName: 'Metformin', dosage: '500mg', time: '20:00', status: 'upcoming' },
        { id: 102, medicineName: 'Atorvastatin', dosage: '20mg', time: '21:00', status: 'upcoming' },
    ],
    getDoseHistory: async (dateFilter = null) => {
         const allHistory = [
            { id: 201, medicineName: 'Metformin', dosage: '500mg', time: '2023-10-25T08:00:00', status: 'taken' },
            { id: 202, medicineName: 'Lisinopril', dosage: '10mg', time: '2023-10-25T09:00:00', status: 'missed' },
            { id: 203, medicineName: 'Metformin', dosage: '500mg', time: '2023-10-25T20:00:00', status: 'taken' },
            { id: 204, medicineName: 'Metformin', dosage: '500mg', time: '2023-10-26T08:00:00', status: 'taken' },
            { id: 205, medicineName: 'Lisinopril', dosage: '10mg', time: '2023-10-26T09:00:00', status: 'taken' },
            { id: 206, medicineName: 'Atorvastatin', dosage: '20mg', time: '2023-10-26T21:00:00', status: 'upcoming' },
        ];
        if(dateFilter) return allHistory.filter(d => new Date(d.time).toDateString() === new Date(dateFilter).toDateString());
        return allHistory;
    },
};
