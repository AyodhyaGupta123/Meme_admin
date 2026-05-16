import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  LogOut 
} from 'lucide-react';

export default function Navbar({ onLogout }) {
  const location = useLocation();

  // Dynamic Page Title
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
      case '/dashboard':
        return "Dashboard";
      case '/payments':
        return "Payment Verification";
      case '/user-info':
        return "User Management";
      case '/account':
        return "Account Settings";
      case '/transactions':
        return "All Transactions";
      case '/verification':
        return "KYC Verification";
      default:
        return "Admin Panel";
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 h-16 flex items-center z-50 shadow-sm">
      <div className="flex-1 px-6 flex items-center justify-between">
        
        {/* Left - Page Title */}
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            {getPageTitle()}
          </h1>
        </div>

        {/* Center - Search Bar */}
        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search transactions, users, UPI ID..."
              className="w-full bg-gray-100 border border-gray-300 rounded-full pl-11 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <Search className="absolute left-4 top-3 text-gray-400" size={20} />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5">
          
          {/* Notifications */}
          <button className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
            <Bell size={22} className="text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-medium flex items-center justify-center rounded-full ring-2 ring-white">
              3
            </span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">Admin User</p>
              <p className="text-xs text-gray-500">admin@upipay.com</p>
            </div>
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold shadow">
              A
            </div>
          </div>

          {/* Logout Button */}
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-5 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all hover:text-red-700 font-medium"
          >
            <LogOut size={20} />
            <span className="hidden sm:inline">Logout</span>
          </button>

        </div>
      </div>
    </nav>
  );
}