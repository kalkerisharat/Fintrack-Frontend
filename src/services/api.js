import axios from 'axios';

// 🚀 SYNCED BASE URL: Both local and production now use /api/v1
const API_BASE_URL = import.meta.env.MODE === 'production' 
    ? 'https://fintech-expense-tracker-0n35.onrender.com/api/v1' 
    : 'http://localhost:8080/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Request interceptor – attach JWT safely
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        // Added 'null' check to prevent malformed headers
        if (token && token !== 'undefined' && token !== 'null') {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            // No token? No problem (likely Login or Register)
            delete config.headers.Authorization;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;