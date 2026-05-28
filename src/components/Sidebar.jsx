import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  Bell,
  UserCheck,
  Wallet,
  Sparkles,
  X,
} from "lucide-react";

const Sidebar = ({
  activePage,
  setActivePage,
  isMobileOpen = false,
  setIsMobileOpen = () => {},
}) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/" },
    {
      id: "payments",
      label: "Payment Updates",
      icon: CreditCard,
      path: "/payments",
    },
    {
      id: "users",
      label: "User Management",
      icon: Users,
      path: "/user-info",
    },
    {
      id: "management",
      label: "Management",
      icon: TrendingUp,
      path: "/manage",
    },
    // {
    //   id: "verification",
    //   label: "KYC Verification",
    //   icon: UserCheck,
    //   path: "/verification",
    // },
     {
      id: "User-Support",
      label: "User Support",
      icon: Sparkles,
      path: "/user-support",
    },
  ];

  const handleMenuClick = (id, path) => {
    setActivePage(id);
    navigate(path);
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      window.location.href = "/login";
    }
  };

  return (
    <>
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-white border-r border-slate-200 transition-transform duration-300
    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0`}
      >
        <div className="h-20 px-5 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
              <Wallet size={22} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-950">UPI Pay</h1>

              <p className="text-xs text-slate-500">Admin Dashboard</p>
            </div>
          </div>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id, item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition
                ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <span
                  className={`w-9 h-9 rounded-xl flex items-center justify-center
                  ${isActive ? "bg-white/10" : "bg-slate-100"}`}
                >
                  <Icon size={19} />
                </span>

                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-5 border-t border-slate-200 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition">
            <Bell size={20} />
            <span>Notifications</span>
          </button>

          <button
            onClick={() => handleMenuClick("account", "/account")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition
            ${
              activePage === "account"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Settings size={20} />
            <span>Account Settings</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
