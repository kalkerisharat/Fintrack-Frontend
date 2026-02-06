import api from './api';

const expenseService = {
    getAll: async () => {
        const response = await api.get('/expenses');
        return response.data;
    },

    add: async (expenseData) => {
        const response = await api.post('/expenses', expenseData);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`/expenses/${id}`);
    },

    update: async (id, expenseData) => {
        const response = await api.put(`/expenses/${id}`, expenseData);
        return response.data;
    }
};

export default expenseService;
