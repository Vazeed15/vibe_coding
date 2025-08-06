import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/auth';
import { 
  Building2, 
  CreditCard, 
  BarChart3, 
  Calculator, 
  LogOut, 
  User 
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, roles: ['customer', 'staff'] },
    { name: 'Profile', href: '/profile', icon: User, roles: ['customer'] },
    { name: 'Transactions', href: '/transactions', icon: CreditCard, roles: ['customer', 'staff'] },
    { name: 'Loan Check', href: '/loan-check', icon: Calculator, roles: ['customer', 'staff'] },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role)
  );

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-banking-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-banking-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Building2 className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-xl font-bold text-banking-900">
                  Smart Banking
                </span>
              </div>

              {/* Navigation Links */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {filteredNavigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        isActive
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-banking-500 hover:border-banking-300 hover:text-banking-700'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* User menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-banking-700">
                <User className="h-4 w-4 mr-2" />
                <span>{user?.name}</span>
                <span className="ml-2 px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded-full">
                  {user?.role}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-banking-500 hover:text-banking-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'border-transparent text-banking-600 hover:bg-banking-50 hover:border-banking-300 hover:text-banking-800'
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                >
                  <div className="flex items-center">
                    <Icon className="h-4 w-4 mr-3" />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;