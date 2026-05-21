import React, { useEffect, useMemo, useState } from "react";
import {
  Check,
  X,
  Clock,
  Search,
  ShieldCheck,
  RefreshCcw,
  CreditCard,
  Wallet,
  ArrowUpRight,
  IndianRupee,
} from "lucide-react";
import api from "../api/axios";

export default function PaymentUpdate() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/latest-requests");

      if (res.data?.success) {
        setTransactions(
          (res.data.latestRequests || []).map((request) => ({
            ...request,
            date: request.createdAt
              ? new Date(request.createdAt).toLocaleDateString("en-IN")
              : "-",
            requestType: request.type?.toLowerCase() || "deposit",
          }))
        );
      }
    } catch (err) {
      console.error(err);
      setActionMessage("Unable to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  const performAction = async (id, requestType, action) => {
    try {
      setActionMessage("");

      const bodyKey = requestType === "deposit" ? "depositId" : "withdrawId";

      const res = await api.post(`/admin/${requestType}/${action}`, {
        [bodyKey]: id,
      });

      if (res.data?.success) {
        setActionMessage(res.data.message || "Request updated successfully.");
        await fetchTransactions();
      }
    } catch (err) {
      setActionMessage(
        err?.response?.data?.error || err?.message || "Failed to update request."
      );
    }
  };

  const filteredTransactions = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return transactions.filter(
      (txn) =>
        String(txn.user || "").toLowerCase().includes(term) ||
        String(txn.id || "").toLowerCase().includes(term) ||
        String(txn.requestType || "").toLowerCase().includes(term)
    );
  }, [transactions, searchTerm]);

  const summary = useMemo(() => {
    return {
      total: transactions.length,
      pending: transactions.filter((txn) => txn.status === "pending").length,
      approved: transactions.filter(
        (txn) => txn.status === "approved" || txn.status === "processed"
      ).length,
      rejected: transactions.filter((txn) => txn.status === "rejected").length,
    };
  }, [transactions]);

  const getStatusBadge = (status = "pending") => {
    const styles = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
      processed: "bg-emerald-50 text-emerald-700 border-emerald-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
    };

    const icons = {
      pending: <Clock size={14} />,
      approved: <Check size={14} />,
      processed: <Check size={14} />,
      rejected: <X size={14} />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border capitalize ${
          styles[status] || styles.pending
        }`}
      >
        {icons[status] || icons.pending}
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 rounded-full border-4 border-slate-200 border-t-slate-950 animate-spin" />
        <p className="text-sm font-medium text-slate-500">
          Loading payment requests...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-7">
      <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur">
              <ShieldCheck size={15} />
              Payment Control Center
            </div>

            <h1 className="mt-5 text-3xl sm:text-4xl font-bold tracking-tight">
              Payment Verification
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Review, approve and reject user deposit or withdrawal requests
              from one secure admin panel.
            </p>
          </div>

          <button
            onClick={fetchTransactions}
            className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-950 hover:bg-slate-100 transition"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Requests",
            value: summary.total,
            icon: CreditCard,
            color: "from-blue-500 to-indigo-500",
          },
          {
            title: "Pending",
            value: summary.pending,
            icon: Clock,
            color: "from-amber-500 to-orange-500",
          },
          {
            title: "Approved",
            value: summary.approved,
            icon: Check,
            color: "from-emerald-500 to-teal-500",
          },
          {
            title: "Rejected",
            value: summary.rejected,
            icon: X,
            color: "from-red-500 to-rose-500",
          },
        ].map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.color}`}
              />
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    {item.title}
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-950">
                    {item.value}
                  </h2>
                </div>

                <div
                  className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-lg`}
                >
                  <Icon size={21} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {actionMessage && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm font-medium text-emerald-900">
          {actionMessage}
        </div>
      )}

      <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 sm:p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Transaction Requests
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Search and manage all recent payment requests.
            </p>
          </div>

          <div className="relative w-full lg:w-96">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search user, type or TXN ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-700 outline-none focus:border-slate-950 focus:bg-white transition"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                  TXN ID
                </th>
                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                  User
                </th>
                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                  Type
                </th>
                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                  Amount
                </th>
                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                  Date
                </th>
                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                  Status
                </th>
                <th className="px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                    #{String(txn.id || "").slice(-8)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-slate-950 text-white flex items-center justify-center text-sm font-bold">
                        {String(txn.user || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-950">
                          {txn.user || "Unknown User"}
                        </p>
                        <p className="text-xs text-slate-400">
                          Payment request
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 border border-slate-100 px-3 py-1.5 text-xs font-bold uppercase text-slate-700">
                      {txn.requestType === "deposit" ? (
                        <CreditCard size={14} />
                      ) : (
                        <Wallet size={14} />
                      )}
                      {txn.requestType}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm font-bold text-slate-950">
                    <span className="inline-flex items-center gap-1">
                      <IndianRupee size={14} />
                      {Number(txn.amount || 0).toLocaleString("en-IN")}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-500">
                    {txn.date}
                  </td>

                  <td className="px-5 py-4">{getStatusBadge(txn.status)}</td>

                  <td className="px-5 py-4">
                    {txn.status === "pending" ? (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            performAction(txn.id, txn.requestType, "approve")
                          }
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 transition"
                        >
                          <Check size={14} />
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            performAction(txn.id, txn.requestType, "reject")
                          }
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition"
                        >
                          <X size={14} />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                        <Check size={14} />
                        Verified
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="py-16 text-center text-sm text-slate-500">
            No transactions found
          </div>
        )}
      </div>
    </div>
  );
}