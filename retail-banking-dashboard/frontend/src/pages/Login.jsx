import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';
import { Building2, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const demoCredentials = {
      customer: { email: 'john.doe@email.com', password: 'demo123' },
      staff: { email: 'staff@bank.com', password: 'staff123' }
    };
    
    setCredentials(demoCredentials[role]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-banking-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-xl bg-primary-600">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-banking-900">
            Smart Banking Dashboard
          </h2>
          <p className="mt-2 text-center text-sm text-banking-600">
            Sign in to access your banking dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-banking-300 placeholder-banking-500 text-banking-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-banking-300 placeholder-banking-500 text-banking-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-banking-400" />
                ) : (
                  <Eye className="h-4 w-4 text-banking-400" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-banking-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-banking-50 text-banking-500">Demo Accounts</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleDemoLogin('customer')}
                className="w-full inline-flex justify-center py-2 px-4 border border-banking-300 rounded-md shadow-sm bg-white text-sm font-medium text-banking-500 hover:bg-banking-50"
              >
                Customer Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('staff')}
                className="w-full inline-flex justify-center py-2 px-4 border border-banking-300 rounded-md shadow-sm bg-white text-sm font-medium text-banking-500 hover:bg-banking-50"
              >
                Staff Demo
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;