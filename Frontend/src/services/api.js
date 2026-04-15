import axios from 'axios';

// Bedel URL-kan marka aad leedahay Backend dhab ah
const API_URL = 'https://api.syada.org/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Waxay si toos ah ugu daraysaa Token-ka haddii uu jiro (Authorization)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const memberService = {
  getAll: () => api.get('/members'),
  getById: (id) => api.get(`/members/${id}`),
  create: (data) => api.post('/members', data),
};

export const financeService = {
  getOverview: () => api.get('/finance/overview'),
  getTransactions: () => api.get('/finance/transactions'),
};

export default api;