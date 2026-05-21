import React, { useEffect, useState } from "react";
import {
  CreditCard,
  Clock3,
  IndianRupee,
  ArrowUpRight,
  Users,
  Wallet,
  ShieldCheck,
  Activity,
  RefreshCcw,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

import api from "../api/axios";

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [dashboardRes, requestsRes] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/latest-requests"),
      ]);

      if (dashboardRes.data?.success) {
        const data = dashboardRes.data.stats;

        setStats([
          {
            title: "Total Deposits",
            value: `₹${Number(data.totalDeposits || 0).toLocaleString("en-IN")}`,
            icon: CreditCard,
            growth: "+12%",
            gradient: "from-emerald-500 to-teal-500",
          },
          {
            title: "Pending Requests",
            value: data.pendingRequests || 0,
            icon: Clock3,
            growth: "Review",
            gradient: "from-amber-500 to-orange-500",
          },
          {
            title: "Total Users",
            value: data.totalUsers || 0,
            icon: Users,
            growth: "+8%",
            gradient: "from-blue-500 to-indigo-500",
          },
          {
            title: "Wallet Volume",
            value: `₹${Number(data.walletVolume || 0).toLocaleString("en-IN")}`,
            icon: IndianRupee,
            growth: "+18%",
            gradient: "from-violet-500 to-fuchsia-500",
          },
        ]);
      }

      if (requestsRes.data?.success) {
        setRequests(requestsRes.data.latestRequests || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const walletVolume = stats[3]?.value || "₹0";

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full border-4 border-slate-200 border-t-slate-950 animate-spin" />
          <p className="text-sm font-medium text-slate-500">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur">
              <Activity size={15} />
              Live Admin Overview
            </div>

            <h1 className="mt-5 text-3xl sm:text-4xl font-bold tracking-tight">
              Admin Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Manage users, deposits, withdrawals and wallet activity from one
              secure control panel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <ShieldCheck size={18} className="text-emerald-300" />
              <span className="text-sm font-semibold">System Active</span>
            </div>

            <button
              onClick={fetchDashboard}
              className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100 transition"
            >
              <RefreshCcw size={16} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.gradient}`}
              />

              <div className="flex items-start justify-between">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center shadow-lg`}
                >
                  <Icon size={22} />
                </div>

                <div className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 border border-slate-100">
                  <ArrowUpRight size={14} />
                  {item.growth}
                </div>
              </div>

              <div className="mt-7">
                <p className="text-sm font-medium text-slate-500">
                  {item.title}
                </p>

                <h2 className="text-3xl font-bold text-slate-950 mt-2 tracking-tight">
                  {item.value}
                </h2>
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-emerald-600">
                <TrendingUp size={14} />
                Updated from live backend
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-[2rem] border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-950">
                Latest Requests
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Recent deposit and withdrawal activities.
              </p>
            </div>

            <div className="rounded-full bg-slate-50 border border-slate-100 px-4 py-2 text-xs font-bold text-slate-600">
              {requests.length} Recent Records
            </div>
          </div>

          <div className="space-y-4">
            {requests.length > 0 ? (
              requests.map((request, index) => (
                <div
                  key={index}
                  className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-slate-100 bg-slate-50/50 p-4 hover:bg-white hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-slate-950 text-white flex items-center justify-center">
                      {request.type === "Deposit" ? (
                        <CreditCard size={20} />
                      ) : (
                        <Wallet size={20} />
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-950">
                        {request.user || "Unknown User"}
                      </h4>

                      <p className="text-sm text-slate-500 mt-1">
                        {request.type} Request • ₹
                        {Number(request.amount || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${
                        request.status === "approved"
                          ? "bg-emerald-50 text-emerald-700"
                          : request.status === "rejected"
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {request.status || "pending"}
                    </span>

                    <button className="px-4 py-2 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 transition">
                      Review
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 py-14 text-center">
                <CheckCircle2 className="mx-auto text-emerald-500 mb-3" size={34} />
                <p className="text-sm font-semibold text-slate-700">
                  No recent requests found.
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  New deposit and withdrawal requests will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
          <div className="absolute -top-20 -right-20 h-52 w-52 rounded-full bg-emerald-400/20 blur-3xl" />

          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
              <Wallet size={24} />
            </div>

            <p className="text-sm text-slate-400">Wallet Overview</p>

            <h2 className="text-4xl sm:text-5xl font-bold mt-3 tracking-tight">
              {walletVolume}
            </h2>

            <p className="text-sm text-slate-400 mt-3">
              Total verified wallet balance across all users.
            </p>

            <div className="mt-10 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">
                    Approved Requests
                  </span>
                  <span className="font-bold">88%</span>
                </div>

                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-[88%] h-full bg-emerald-400 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">
                    Pending Requests
                  </span>
                  <span className="font-bold">12%</span>
                </div>

                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-[12%] h-full bg-amber-400 rounded-full" />
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-3xl border border-white/10 bg-white/10 p-4">
              <p className="text-xs text-slate-400">Security Status</p>
              <div className="mt-2 flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-300" />
                <p className="text-sm font-bold">Admin session protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}