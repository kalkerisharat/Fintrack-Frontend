import api from './api';

const incomeService = {
    getAll: async () => {
        const response = await api.get('/income');
        return response.data;
    },

    add: async (incomeData) => {
        const response = await api.post('/income', incomeData);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`/income/${id}`);
    },

    update: async (id, incomeData) => {
        const response = await api.put(`/income/${id}`, incomeData);
        return response.data;
    }
};

export default incomeService;
