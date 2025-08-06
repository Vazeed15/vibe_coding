import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../utils/auth';
import { customerAPI, transactionAPI } from '../utils/api';
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Users,
  ArrowUpIcon,
  ArrowDownIcon 
} from 'lucide-react';

const Dashboard = () => {
  const { user, isStaff } = useAuth();
  const [customerData, setCustomerData] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isStaff) {
          // Staff view - get all customers
          const customersResponse = await customerAPI.getAll();
          setCustomerData({ customers: customersResponse.data });
        } else {
          // Customer view - get specific customer data
          const customerId = 1; // In real app, this would come from auth
          const [customerResponse, analyticsResponse, transactionsResponse] = await Promise.all([
            customerAPI.getById(customerId),
            transactionAPI.getAnalytics(customerId),
            transactionAPI.getByCustomerId(customerId, { limit: 5 })
          ]);
          
          setCustomerData(customerResponse.data);
          setAnalytics(analyticsResponse.data);
          setRecentTransactions(transactionsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isStaff]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const StaffDashboard = () => (
    <div>
      <h1 className="text-2xl font-bold text-banking-900 mb-6">Staff Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-banking-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-banking-500 truncate">
                    Total Customers
                  </dt>
                  <dd className="text-lg font-medium text-banking-900">
                    {customerData?.customers?.length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-banking-500 truncate">
                    Total Deposits
                  </dt>
                  <dd className="text-lg font-medium text-banking-900">
                    ${customerData?.customers?.reduce((sum, c) => sum + c.balance, 0).toLocaleString() || '0'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-primary-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-banking-500 truncate">
                    Avg Credit Score
                  </dt>
                  <dd className="text-lg font-medium text-banking-900">
                    {Math.round(customerData?.customers?.reduce((sum, c) => sum + c.credit_score, 0) / customerData?.customers?.length) || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-banking-500 truncate">
                    Account Types
                  </dt>
                  <dd className="text-lg font-medium text-banking-900">
                    {customerData?.customers?.length ? 
                      Object.values(customerData.customers.reduce((acc, c) => {
                        acc[c.account_type] = (acc[c.account_type] || 0) + 1;
                        return acc;
                      }, {})).join('/') : '0'
                    }
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-banking-900">
            Customer List
          </h3>
        </div>
        <ul className="divide-y divide-banking-200">
          {customerData?.customers?.map((customer) => (
            <li key={customer.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-700">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-banking-900">
                        {customer.name}
                      </div>
                      <div className="text-sm text-banking-500">
                        {customer.email}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-banking-900">
                      ${customer.balance.toLocaleString()}
                    </div>
                    <div className="text-sm text-banking-500">
                      {customer.account_type}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const CustomerDashboard = () => (
    <div>
      <h1 className="text-2xl font-bold text-banking-900 mb-6">Welcome back, {user?.name}!</h1>
      
      {/* Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-banking-500 truncate">
                    Account Balance
                  </dt>
                  <dd className="text-lg font-medium text-banking-900">
                    ${customerData?.balance?.toLocaleString() || '0'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-primary-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-banking-500 truncate">
                    Credit Score
                  </dt>
                  <dd className="text-lg font-medium text-banking-900">
                    {customerData?.credit_score || 'N/A'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-banking-500 truncate">
                    Account Type
                  </dt>
                  <dd className="text-lg font-medium text-banking-900 capitalize">
                    {customerData?.account_type || 'N/A'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending Analytics Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-banking-900 mb-4">Spending by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                <Bar dataKey="total_amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-banking-900 mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border border-banking-200 rounded-lg">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${
                    transaction.transaction_type === 'credit' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.transaction_type === 'credit' ? (
                      <ArrowUpIcon className="h-4 w-4" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-banking-900">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-banking-500 capitalize">
                      {transaction.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    transaction.transaction_type === 'credit' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {transaction.transaction_type === 'credit' ? '+' : '-'}${transaction.amount}
                  </p>
                  <p className="text-xs text-banking-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return isStaff ? <StaffDashboard /> : <CustomerDashboard />;
};

export default Dashboard;