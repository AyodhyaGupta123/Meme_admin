import React from "react";
import { useLocation } from "react-router-dom";
import {
  Bell,
  Search,
  LogOut,
  ShieldCheck,
  Menu,
  Sparkles,
} from "lucide-react";

export default function Navbar({
  onLogout,
  isMobileOpen = false,
  setIsMobileOpen = () => {},
}) {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
      case "/dashboard":
        return "Dashboard";
      case "/payments":
        return "Payment Verification";
      case "/user-info":
        return "User Management";
      case "/account":
        return "Account Settings";
      case "/transactions":
        return "All Transactions";
      case "/verification":
        return "KYC Verification";
      default:
        return "Admin Panel";
    }
  };

  return (
    <nav className="sticky top-0 z-30 bg-slate-50/90 backdrop-blur-xl border-b border-slate-200">
      <div className="px-4 sm:px-6 py-4">
        <div className="h-16 rounded-2xl bg-white border border-slate-200 shadow-sm px-4 sm:px-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition"
            >
              <Menu size={22} />
            </button>

            <div className="hidden sm:flex h-11 w-11 rounded-xl bg-slate-900 text-white items-center justify-center">
              <Sparkles size={20} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                UPI Pay Admin
              </p>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-950 truncate">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          <div className="hidden lg:flex flex-1 max-w-xl mx-6">
            <div className="relative w-full">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search users, transactions..."
                className="w-full h-12 rounded-2xl bg-slate-50 border border-slate-200 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:bg-white focus:border-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button className="relative w-11 h-11 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-700 hover:bg-white transition">
              <Bell size={20} />

              <span className="absolute -top-1 -right-1 min-w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                3
              </span>
            </button>

            <div className="hidden sm:flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-950">Admin User</p>

                <p className="text-xs text-slate-500">admin@upipay.com</p>
              </div>

              <div className="relative w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                A
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                  <ShieldCheck size={11} />
                </span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="h-11 px-4 rounded-xl bg-slate-900 text-white flex items-center gap-2 text-sm font-semibold hover:bg-slate-800 transition"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
