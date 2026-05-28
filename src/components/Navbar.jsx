import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  Bell,
  Search,
  LogOut,
  ShieldCheck,
  Menu,
  Sparkles,
  Wallet,
  Users,
  CreditCard,
  Settings,
  ReceiptText,
  BadgeCheck,
  LayoutDashboard,
} from "lucide-react";

export default function Navbar({
  onLogout,
  isMobileOpen = false,
  setIsMobileOpen = () => {},
  admin = {},
  notificationCount = 3,
  onNotificationClick = () => {},
}) {
  const location = useLocation();

  const pageMeta = useMemo(() => {
    const map = {
      "/": {
        title: "Dashboard",
        label: "Overview",
        icon: LayoutDashboard,
        gradient: "from-slate-950 to-slate-800",
      },
      "/dashboard": {
        title: "Dashboard",
        label: "Overview",
        icon: LayoutDashboard,
        gradient: "from-slate-950 to-slate-800",
      },
      "/payments": {
        title: "Payment Verification",
        label: "Payments",
        icon: CreditCard,
        gradient: "from-amber-600 to-orange-600",
      },
      "/upi-management": {
        title: "UPI & Withdrawal Management",
        label: "Payment Control",
        icon: Wallet,
        gradient: "from-emerald-600 to-teal-600",
      },
      "/user-info": {
        title: "User Management",
        label: "Users",
        icon: Users,
        gradient: "from-indigo-600 to-violet-600",
      },
      "/account": {
        title: "Account Settings",
        label: "Settings",
        icon: Settings,
        gradient: "from-slate-700 to-slate-950",
      },
      "/transactions": {
        title: "All Transactions",
        label: "Ledger",
        icon: ReceiptText,
        gradient: "from-blue-600 to-cyan-600",
      },
      "/verification": {
        title: "KYC Verification",
        label: "Compliance",
        icon: BadgeCheck,
        gradient: "from-purple-600 to-fuchsia-600",
      },
      "/admin/support": {
        title: "Support Messages",
        label: "Customer Support",
        icon: Bell,
        gradient: "from-rose-600 to-pink-600",
      },
    };

    return (
      map[location.pathname] || {
        title: "Admin Panel",
        label: "Control Center",
        icon: Sparkles,
        gradient: "from-slate-950 to-slate-800",
      }
    );
  }, [location.pathname]);

  const PageIcon = pageMeta.icon;

  const adminName =
    admin?.name || admin?.username || localStorage.getItem("adminName") || "Admin User";

  const adminEmail =
    admin?.email || localStorage.getItem("adminEmail") || "admin@upipay.com";

  const adminInitial = adminName?.charAt(0)?.toUpperCase() || "A";

  return (
    <nav className="sticky top-0 z-30 bg-slate-50/80 backdrop-blur-2xl border-b border-slate-200/80">
      <div className="px-3 sm:px-6 py-3">
        <div className="min-h-16 rounded-3xl bg-white/90 border border-slate-200 shadow-[0_18px_45px_rgba(15,23,42,0.06)] px-3 sm:px-5 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden w-11 h-11 rounded-2xl bg-slate-950 text-white flex items-center justify-center hover:bg-slate-800 transition active:scale-95"
            >
              <Menu size={22} />
            </button>

            <div
              className={`hidden sm:flex h-12 w-12 rounded-2xl bg-gradient-to-br ${pageMeta.gradient} text-white items-center justify-center shadow-lg shadow-slate-900/10`}
            >
              <PageIcon size={22} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  {pageMeta.label}
                </p>

                <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>

              <h1 className="text-lg sm:text-2xl font-black text-slate-950 truncate">
                {pageMeta.title}
              </h1>
            </div>
          </div>

          <div className="hidden xl:flex flex-1 max-w-xl mx-5">
            <div className="relative w-full group">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition"
              />

              <input
                type="text"
                placeholder={`Search in ${pageMeta.title.toLowerCase()}...`}
                className="w-full h-12 rounded-2xl bg-slate-50 border border-slate-200 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:bg-white focus:border-slate-900 focus:shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onNotificationClick}
              className="relative w-11 h-11 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-700 hover:bg-white hover:border-slate-300 transition active:scale-95"
            >
              <Bell size={20} />

              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </button>

            <div className="hidden md:flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2">
              <div className="text-right">
                <p className="max-w-32 truncate text-sm font-black text-slate-950">
                  {adminName}
                </p>

                <p className="max-w-36 truncate text-xs text-slate-500">
                  {adminEmail}
                </p>
              </div>

              <div className="relative w-10 h-10 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-black shadow-sm">
                {adminInitial}

                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                  <ShieldCheck size={11} />
                </span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="h-11 px-3 sm:px-4 rounded-2xl bg-slate-950 text-white flex items-center gap-2 text-sm font-bold hover:bg-slate-800 transition active:scale-95"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}