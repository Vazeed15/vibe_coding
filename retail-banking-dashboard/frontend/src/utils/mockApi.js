// Mock API for GitHub Pages deployment (no backend)
export const mockData = {
  customers: [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+1-555-0101",
      account_type: "savings",
      balance: 15750.50,
      credit_score: 720,
      income: 65000,
      employment_type: "employed"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@email.com",
      phone: "+1-555-0102",
      account_type: "checking",
      balance: 8200.75,
      credit_score: 680,
      income: 52000,
      employment_type: "employed"
    }
  ],
  
  transactions: [
    {
      id: 1,
      customer_id: 1,
      amount: 3000.00,
      transaction_type: "credit",
      category: "salary",
      description: "Monthly Salary",
      date: "2024-01-15T09:00:00"
    },
    {
      id: 2,
      customer_id: 1,
      amount: 85.50,
      transaction_type: "debit",
      category: "food",
      description: "Grocery Store",
      date: "2024-01-16T14:30:00"
    },
    {
      id: 3,
      customer_id: 1,
      amount: 1200.00,
      transaction_type: "debit",
      category: "bills",
      description: "Rent Payment",
      date: "2024-01-01T10:00:00"
    }
  ],
  
  analytics: [
    { category: "food", total_amount: 450.75, transaction_count: 8 },
    { category: "bills", total_amount: 1200.00, transaction_count: 3 },
    { category: "shopping", total_amount: 320.50, transaction_count: 5 },
    { category: "emi", total_amount: 800.00, transaction_count: 2 }
  ]
};

// Mock API functions
export const mockAPI = {
  // Customer API
  getCustomers: () => Promise.resolve({ data: mockData.customers }),
  getCustomer: (id) => Promise.resolve({ 
    data: mockData.customers.find(c => c.id === parseInt(id)) 
  }),
  
  // Transaction API
  getTransactions: (customerId, params = {}) => {
    const customerTransactions = mockData.transactions.filter(
      t => t.customer_id === parseInt(customerId)
    );
    return Promise.resolve({ data: customerTransactions });
  },
  
  addTransaction: (transaction) => {
    const newTransaction = {
      id: mockData.transactions.length + 1,
      ...transaction,
      date: new Date().toISOString()
    };
    mockData.transactions.push(newTransaction);
    return Promise.resolve({ data: newTransaction });
  },
  
  getAnalytics: (customerId) => Promise.resolve({ data: mockData.analytics }),
  
  // Loan API
  predictLoan: (request) => {
    // Simple mock prediction logic
    const { income, credit_score, employment_type } = request;
    
    let score = 0;
    if (income >= 50000) score += 0.4;
    if (credit_score >= 700) score += 0.4;
    if (employment_type === 'employed') score += 0.2;
    
    const approved = score >= 0.6;
    const probability = Math.min(0.95, Math.max(0.05, score + (Math.random() - 0.5) * 0.2));
    
    const reasoning = `Mock prediction: Income $${income.toLocaleString()}, Credit Score ${credit_score}, Employment: ${employment_type}. ${approved ? 'Approved' : 'Rejected'} with ${(probability * 100).toFixed(1)}% confidence.`;
    
    return Promise.resolve({
      data: {
        approved,
        probability,
        reasoning
      }
    });
  },
  
  getModelInfo: () => Promise.resolve({
    data: {
      model_type: "Mock Logistic Regression",
      features: ["income", "credit_score", "employment_type_encoded"],
      accuracy: 0.85,
      description: "Demo prediction model for GitHub Pages deployment"
    }
  })
};

// Check if we should use mock data
export const shouldUseMockData = () => {
  return process.env.REACT_APP_USE_MOCK_DATA === 'true' || 
         process.env.NODE_ENV === 'production' && !process.env.REACT_APP_API_URL;
};