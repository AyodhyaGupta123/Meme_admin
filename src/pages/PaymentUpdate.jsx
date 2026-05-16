import React, { useEffect, useState } from "react";
import { Check, X, Clock, Search } from "lucide-react";
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
          res.data.latestRequests.map((request) => ({
            ...request,
            date: new Date(request.createdAt).toLocaleDateString("en-IN"),
            requestType: request.type.toLowerCase(),
          })),
        );
      }
    } catch (err) {
      console.error(err);
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
      setActionMessage(err?.error || err?.message || "Failed to update request.");
    }
  };

  const filteredTransactions = transactions.filter(
    (txn) =>
      txn.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusBadge = (status) => {
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
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}
      >
        {icons[status] || icons.pending}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payment Verification</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review and verify user deposit and withdrawal requests.
          </p>
        </div>

        <div className="relative w-full lg:w-80">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search name or TXN ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 outline-none focus:border-slate-400 transition"
          />
        </div>
      </div>

      {actionMessage && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-900">
          {actionMessage}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase">TXN ID</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase">User</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Type</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Amount</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-4 text-sm font-medium text-slate-700">{txn.id}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-900">{txn.user}</td>
                  <td className="px-5 py-4 text-sm text-slate-700 uppercase">{txn.requestType}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-900">₹{Number(txn.amount).toLocaleString("en-IN")}</td>
                  <td className="px-5 py-4 text-sm text-slate-500">{txn.date}</td>
                  <td className="px-5 py-4">{getStatusBadge(txn.status)}</td>
                  <td className="px-5 py-4">
                    {txn.status === "pending" ? (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => performAction(txn.id, txn.requestType, "approve")}
                          className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => performAction(txn.id, txn.requestType, "reject")}
                          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-100 transition"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-slate-400">Verified</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="py-16 text-center text-sm text-slate-500">No transactions found</div>
        )}
      </div>
    </div>
  );
}
