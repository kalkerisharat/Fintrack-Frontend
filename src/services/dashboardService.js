import api from './api';

const dashboardService = {

    getTotalExpenses: async (month, year) => {
        const res = await api.get('/analytics/expenses/total', {
            params: { month, year }
        });
        return res.data;
    },

    getTotalIncome: async (month, year) => {
        const res = await api.get('/analytics/income/total', {
            params: { month, year }
        });
        return res.data;
    },

    getExpensesByCategory: async (month, year) => {
        const res = await api.get('/analytics/expenses/by-category', {
            params: { month, year }
        });
        return res.data;
    },

    getMonthlyHistory: async () => {
        const res = await api.get('/analytics/monthly-history');
        return res.data;
    }
};

export default dashboardService;
