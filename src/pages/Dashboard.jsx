// pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import {
  CreditCard,
  Clock3,
  IndianRupee,
  ArrowUpRight,
  Users,
  Wallet,
  ShieldCheck,
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
            value: data.totalDeposits || 0,
            icon: <CreditCard size={22} />,
            growth: "+12%",
          },
          {
            title: "Pending Requests",
            value: data.pendingRequests || 0,
            icon: <Clock3 size={22} />,
            growth: "Review",
          },
          {
            title: "Total Users",
            value: data.totalUsers || 0,
            icon: <Users size={22} />,
            growth: "+8%",
          },
          {
            title: "Wallet Volume",
            value: `₹${Number(
              data.walletVolume || 0
            ).toLocaleString("en-IN")}`,
            icon: <IndianRupee size={22} />,
            growth: "+18%",
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

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">
            Admin Dashboard
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Manage deposits, withdrawals and user wallet activity.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm w-fit">
          <ShieldCheck size={18} className="text-emerald-600" />

          <span className="text-sm font-semibold text-slate-700">
            System Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800">
                {item.icon}
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-100">
                <ArrowUpRight size={14} />
                {item.growth}
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm text-slate-500">{item.title}</p>

              <h2 className="text-4xl font-bold text-slate-950 mt-2 tracking-tight">
                {item.value}
              </h2>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Latest Requests
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Recent deposit and withdrawal activities.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {requests.length > 0 ? (
              requests.map((request, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition"
                >
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      {request.user}
                    </h4>

                    <p className="text-sm text-slate-500 mt-1">
                      {request.type} Request • ₹
                      {Number(request.amount).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        request.status === "approved"
                          ? "bg-emerald-50 text-emerald-700"
                          : request.status === "rejected"
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {request.status}
                    </span>

                    <button className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition">
                      Review
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500 text-sm">
                No recent requests found.
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
            <Wallet size={24} />
          </div>

          <p className="text-sm text-slate-400">Wallet Overview</p>

          <h2 className="text-5xl font-bold mt-3 tracking-tight">
            ₹
            {stats[3]?.value
              ?.replace("₹", "")
              ?.toLocaleString("en-IN") || 0}
          </h2>

          <p className="text-sm text-slate-400 mt-3">
            Total verified wallet balance.
          </p>

          <div className="mt-10 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">
                  Approved Requests
                </span>

                <span className="font-semibold">88%</span>
              </div>

              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="w-[88%] h-full bg-white rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">
                  Pending Requests
                </span>

                <span className="font-semibold">12%</span>
              </div>

              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="w-[12%] h-full bg-amber-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}