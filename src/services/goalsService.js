import api from './api'; 

export const goalsService = {
  getAll: async () => (await api.get('/savings-goals')).data,
  create: async (goal) => (await api.post('/savings-goals', goal)).data,
  addFunds: async (id, amount) => (await api.put(`/savings-goals/${id}/add-funds?amount=${amount}`)).data,
};