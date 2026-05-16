import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  UserCheck,
} from "lucide-react";

const Sidebar = ({ activePage, setActivePage }) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { 
      id: "dashboard", 
      label: "Dashboard", 
      icon: <LayoutDashboard size={20} />,
      path: "/" 
    },
    { 
      id: "payments", 
      label: "Payment Updates", 
      icon: <CreditCard size={20} />,
      path: "/payments" 
    },
    { 
      id: "users", 
      label: "User Management", 
      icon: <Users size={20} />,
      path: "/user-info" 
    },
    { 
      id: "transactions", 
      label: "All Transactions", 
      icon: <TrendingUp size={20} />,
      path: "/transactions" 
    },
    { 
      id: "verification", 
      label: "KYC Verification", 
      icon: <UserCheck size={20} />,
      path: "/verification" 
    },
  ];

  const handleMenuClick = (id, path) => {
    setActivePage(id);
    navigate(path);
    setIsMobileOpen(false); // Close mobile menu
  };

  const handleLogout = () => {
    // You can add logout logic here or pass as prop
    if (window.confirm("Are you sure you want to logout?")) {
      window.location.href = "/login"; // or use navigate('/login')
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden w-11 h-11 flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm text-slate-700"
      >
        <Menu size={22} />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen bg-white border-r border-slate-200 shadow-sm transition-all duration-300 flex flex-col
          ${isCollapsed ? "lg:w-20" : "lg:w-72"}
          ${isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo Header */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow">
              ₹
            </div>

            {!isCollapsed && (
              <div>
                <h1 className="text-2xl font-bold text-slate-900">UPI Pay</h1>
                <p className="text-xs text-slate-500 -mt-0.5">Admin Panel</p>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (window.innerWidth < 1024) {
                setIsMobileOpen(false);
              } else {
                setIsCollapsed(!isCollapsed);
              }
            }}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id, item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all
                ${activePage === item.id
                  ? "bg-slate-900 text-white shadow"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
            >
              <span className="shrink-0">{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="px-4 py-6 border-t border-slate-100 space-y-1.5">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition">
            <Bell size={20} />
            {!isCollapsed && <span>Notifications</span>}
          </button>

          <button
            onClick={() => handleMenuClick("account", "/account")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition
              ${activePage === "account" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
          >
            <Settings size={20} />
            {!isCollapsed && <span>Account Settings</span>}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;