import axios from 'axios';

const API_BASE_URL = import.meta.env.MODE === 'production' 
    ? 'https://fintech-expense-tracker-0n35.onrender.com'  // Your Render URL
    : 'http://localhost:8080/api/v1';                     // Local development

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Request interceptor – attach JWT safely
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token && token !== 'undefined') {
            console.log('Attaching token:', token);
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn('No valid token found in localStorage');
            delete config.headers.Authorization;
        }

        return config;
    },
    (error) => Promise.reject(error)
);


export default api;
