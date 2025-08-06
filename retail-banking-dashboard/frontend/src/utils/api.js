import axios from 'axios';
import { mockAPI, shouldUseMockData } from './mockApi';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Customer API calls
export const customerAPI = {
  getAll: () => shouldUseMockData() ? mockAPI.getCustomers() : api.get('/customers/'),
  getById: (id) => shouldUseMockData() ? mockAPI.getCustomer(id) : api.get(`/customers/${id}`),
};

// Transaction API calls
export const transactionAPI = {
  getByCustomerId: (customerId, params = {}) => shouldUseMockData() ? 
    mockAPI.getTransactions(customerId, params) : 
    api.get(`/transactions/${customerId}`, { params }),
  add: (transaction) => shouldUseMockData() ? 
    mockAPI.addTransaction(transaction) : 
    api.post('/transactions/add', transaction),
  getAnalytics: (customerId) => shouldUseMockData() ? 
    mockAPI.getAnalytics(customerId) : 
    api.get(`/transactions/${customerId}/analytics`),
};

// Loan API calls
export const loanAPI = {
  predict: (loanRequest) => shouldUseMockData() ? 
    mockAPI.predictLoan(loanRequest) : 
    api.post('/loan/predict', loanRequest),
  getModelInfo: () => shouldUseMockData() ? 
    mockAPI.getModelInfo() : 
    api.get('/loan/model-info'),
};

// Auth simulation
export const authAPI = {
  login: (credentials) => {
    // Simulate login - in real app, this would call backend
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email && credentials.password) {
          const user = {
            id: credentials.email === 'staff@bank.com' ? 0 : 1,
            email: credentials.email,
            role: credentials.email === 'staff@bank.com' ? 'staff' : 'customer',
            name: credentials.email === 'staff@bank.com' ? 'Bank Staff' : 'John Doe',
          };
          localStorage.setItem('user', JSON.stringify(user));
          resolve({ data: user });
        } else {
          reject({ message: 'Invalid credentials' });
        }
      }, 1000);
    });
  },
  
  logout: () => {
    localStorage.removeItem('user');
    return Promise.resolve();
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default api;