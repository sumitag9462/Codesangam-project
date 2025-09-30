export const authApi = {
    login: async (email, password) => {
        console.log("Attempting login for:", email);
        // Replace with actual API call: axios.post('/api/auth/login', { email, password });
        if (email === "user@medwell.com" && password === "password123") {
            return {
                success: true,
                token: "fake-jwt-token",
                user: {
                    id: "user123",
                    name: "Alex Doe",
                    email: "user@medwell.com",
                    preferences: { notifications: "push" }
                }
            };
        }
        return { success: false, message: "Invalid credentials" };
    },
    register: async (name, email, password) => {
        console.log("Registering:", name, email);
        // Replace with actual API call: axios.post('/api/auth/register', { name, email, password });
        return {
            success: true,
            user: { id: "user124", name, email, preferences: { notifications: "push" } }
        };
    },
};