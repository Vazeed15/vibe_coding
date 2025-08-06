import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/auth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LoanCheck from './pages/LoanCheck';
import './index.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Main App Router
const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login />
            )
          } 
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <div className="text-center py-12">
                  <h1 className="text-2xl font-bold text-banking-900">Profile Page</h1>
                  <p className="text-banking-600 mt-2">Profile management coming soon...</p>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Layout>
                <div className="text-center py-12">
                  <h1 className="text-2xl font-bold text-banking-900">Transactions</h1>
                  <p className="text-banking-600 mt-2">Transaction management coming soon...</p>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/loan-check"
          element={
            <ProtectedRoute>
              <Layout>
                <LoanCheck />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route 
          path="*" 
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-banking-900">404</h1>
                <p className="text-banking-600 mt-2">Page not found</p>
              </div>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
};

function App() {
  const isDemoMode = process.env.REACT_APP_DEMO_MODE === 'true';

  return (
    <AuthProvider>
      {isDemoMode && (
        <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-2 text-center">
          <p className="text-yellow-800 text-sm">
            🚀 <strong>Demo Mode:</strong> This is a demonstration version running with mock data. 
            Use <strong>john.doe@email.com / demo123</strong> to login.
          </p>
        </div>
      )}
      <AppRouter />
    </AuthProvider>
  );
}

export default App;