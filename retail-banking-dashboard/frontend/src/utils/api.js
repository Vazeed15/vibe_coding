import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const DEMO_MODE = process.env.REACT_APP_DEMO_MODE === 'true';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for demo mode
const mockCustomers = [
  {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@email.com",
    phone: "+1-555-0123",
    address: "123 Main St, New York, NY 10001",
    date_of_birth: "1985-06-15",
    account_type: "Premium",
    balance: 15750.25,
    credit_score: 785,
    income: 85000,
    employment_status: "Employed"
  }
];

const mockTransactions = [
  {
    id: 1,
    customer_id: 1,
    type: "debit",
    amount: -45.99,
    category: "Food & Dining",
    description: "Restaurant Bill",
    date: "2024-01-15",
    merchant: "Italian Bistro"
  },
  {
    id: 2,
    customer_id: 1,
    type: "credit",
    amount: 2500.00,
    category: "Income",
    description: "Salary Deposit",
    date: "2024-01-14",
    merchant: "Employer Inc"
  },
  {
    id: 3,
    customer_id: 1,
    type: "debit",
    amount: -120.00,
    category: "Bills & Utilities",
    description: "Electric Bill",
    date: "2024-01-13",
    merchant: "Power Company"
  },
  {
    id: 4,
    customer_id: 1,
    type: "debit",
    amount: -89.99,
    category: "Shopping",
    description: "Online Purchase",
    date: "2024-01-12",
    merchant: "E-commerce Store"
  },
  {
    id: 5,
    customer_id: 1,
    type: "debit",
    amount: -850.00,
    category: "EMI",
    description: "Car Loan EMI",
    date: "2024-01-10",
    merchant: "Auto Finance"
  }
];

const mockAnalytics = {
  monthly_spending: [
    { month: "Jan", amount: 2850 },
    { month: "Feb", amount: 3200 },
    { month: "Mar", amount: 2950 },
    { month: "Apr", amount: 3400 },
    { month: "May", amount: 2800 },
    { month: "Jun", amount: 3100 }
  ],
  category_breakdown: [
    { category: "Food & Dining", amount: 450, percentage: 15.8 },
    { category: "Bills & Utilities", amount: 680, percentage: 23.9 },
    { category: "Shopping", amount: 320, percentage: 11.2 },
    { category: "EMI", amount: 850, percentage: 29.8 },
    { category: "Transportation", amount: 280, percentage: 9.8 },
    { category: "Others", amount: 270, percentage: 9.5 }
  ]
};

// Helper function to simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Customer API calls
export const customerAPI = {
  getAll: async () => {
    if (DEMO_MODE) {
      await delay();
      return { data: mockCustomers };
    }
    return api.get('/customers/');
  },
  getById: async (id) => {
    if (DEMO_MODE) {
      await delay();
      const customer = mockCustomers.find(c => c.id === parseInt(id));
      return { data: customer };
    }
    return api.get(`/customers/${id}`);
  },
};

// Transaction API calls
export const transactionAPI = {
  getByCustomerId: async (customerId, params = {}) => {
    if (DEMO_MODE) {
      await delay();
      let transactions = mockTransactions.filter(t => t.customer_id === parseInt(customerId));
      
      // Apply filters if provided
      if (params.transaction_type && params.transaction_type !== 'all') {
        transactions = transactions.filter(t => t.type === params.transaction_type);
      }
      if (params.category && params.category !== 'all') {
        transactions = transactions.filter(t => t.category === params.category);
      }
      
      return { data: transactions };
    }
    return api.get(`/transactions/${customerId}`, { params });
  },
  add: async (transaction) => {
    if (DEMO_MODE) {
      await delay();
      const newTransaction = {
        ...transaction,
        id: mockTransactions.length + 1,
        date: new Date().toISOString().split('T')[0]
      };
      mockTransactions.unshift(newTransaction);
      return { data: newTransaction };
    }
    return api.post('/transactions/add', transaction);
  },
  getAnalytics: async (customerId) => {
    if (DEMO_MODE) {
      await delay();
      return { data: mockAnalytics };
    }
    return api.get(`/transactions/${customerId}/analytics`);
  },
};

// Loan API calls
export const loanAPI = {
  predict: async (loanRequest) => {
    if (DEMO_MODE) {
      await delay(1000); // Longer delay to simulate ML processing
      
      // Simple demo prediction logic
      const { income, credit_score, loan_amount, employment_status } = loanRequest;
      const debt_to_income = (loan_amount * 0.1) / (income / 12); // Rough monthly payment estimate
      
      let approved = true;
      let confidence = 0.85;
      let reasons = [];
      let suggestions = [];
      
      if (credit_score < 650) {
        approved = false;
        confidence = 0.75;
        reasons.push("Credit score below minimum threshold");
        suggestions.push("Improve credit score by paying bills on time");
      }
      
      if (debt_to_income > 0.4) {
        approved = false;
        confidence = 0.70;
        reasons.push("Debt-to-income ratio too high");
        suggestions.push("Consider a smaller loan amount or increase income");
      }
      
      if (employment_status === "Unemployed") {
        approved = false;
        confidence = 0.90;
        reasons.push("Employment verification required");
        suggestions.push("Provide proof of stable employment");
      }
      
      if (approved) {
        reasons.push("Good credit score", "Stable income", "Low debt-to-income ratio");
      }
      
      return {
        data: {
          approved,
          confidence: Math.round(confidence * 100),
          reasons,
          suggestions: approved ? ["Consider our premium loan products"] : suggestions,
          loan_amount,
          recommended_amount: approved ? loan_amount : Math.round(loan_amount * 0.7)
        }
      };
    }
    return api.post('/loan/predict', loanRequest);
  },
  getModelInfo: async () => {
    if (DEMO_MODE) {
      await delay();
      return {
        data: {
          model_type: "Logistic Regression (Demo)",
          accuracy: 0.87,
          features: ["income", "credit_score", "employment_status", "debt_to_income"],
          last_trained: "2024-01-01",
          version: "1.0.0-demo"
        }
      };
    }
    return api.get('/loan/model-info');
  },
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