import React, { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Wallet,
  Bell,
  Save,
  CheckCircle2,
  AlertCircle,
  Send,
  RefreshCcw,
  IndianRupee,
  Clock,
} from "lucide-react";

const UPIManagement = () => {
  const [upiId, setUpiId] = useState("");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  const [withdrawRequests, setWithdrawRequests] = useState([]);

  const [loading, setLoading] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchUpiId = async () => {
    try {
      const res = await api.get("/upi");

      if (res.data?.success) {
        setUpiId(res.data.upiId || "");
      }
    } catch {
      setError("Failed to load UPI ID");
    }
  };

  const fetchWithdrawRequests = async () => {
    try {
      setWithdrawLoading(true);

      const res = await api.get("/withdraw/admin/requests");

      if (res.data?.success) {
        setWithdrawRequests(res.data.withdrawRequests || []);
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to load withdrawal requests",
      );
    } finally {
      setWithdrawLoading(false);
    }
  };

  useEffect(() => {
    fetchUpiId();
    fetchWithdrawRequests();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!upiId.trim()) {
      setError("UPI ID is required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const res = await api.put("/upi", {
        upiId: upiId.trim(),
      });

      if (res.data?.success) {
        setMessage("UPI ID updated successfully");
      }
    } catch (error) {
      setError(error.response?.data?.message || "UPI update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();

    if (!notificationTitle.trim() || !notificationMessage.trim()) {
      setError("Notification title and message are required");
      return;
    }

    try {
      setNotificationLoading(true);
      setMessage("");
      setError("");

      const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

      const res = await api.post("/admin/notifications", {
        title: notificationTitle.trim(),
        message: notificationMessage.trim(),
        type: "system",
        priority: "high",
        expiresAt,
      });

      if (res.data?.success) {
        setMessage("Notification added successfully");
        setNotificationTitle("");
        setNotificationMessage("");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Notification add failed",
      );
    } finally {
      setNotificationLoading(false);
    }
  };

  const updateWithdrawStatus = async (id, status) => {
    try {
      setMessage("");
      setError("");

      const res = await api.put(`/withdraw/admin/requests/${id}`, {
        status,
      });

      if (res.data?.success) {
        setMessage(`Withdrawal request ${status} successfully`);
        fetchWithdrawRequests();
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Withdrawal status update failed",
      );
    }
  };

  const formatMoney = (value) =>
    Number(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="rounded-3xl bg-slate-950 text-white p-6 md:p-8 overflow-hidden relative">
          <div className="absolute right-0 top-0 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <p className="text-sm text-yellow-300 font-semibold mb-2">
                Admin Payment Control
              </p>
              <h1 className="text-3xl md:text-4xl font-bold">
                UPI & Withdrawal Management
              </h1>
              <p className="text-slate-400 mt-2 max-w-2xl">
                Update payment UPI ID, publish notifications and manage user
                withdrawal requests.
              </p>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
              <Wallet size={32} className="text-yellow-300" />
            </div>
          </div>
        </div>

        {(message || error) && (
          <div
            className={`rounded-2xl px-5 py-4 flex items-start gap-3 ${
              error
                ? "bg-red-50 border border-red-200 text-red-700"
                : "bg-emerald-50 border border-emerald-200 text-emerald-700"
            }`}
          >
            {error ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <p className="text-sm font-medium">{error || message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form
            onSubmit={handleUpdate}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-7 space-y-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center">
                <Wallet size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  UPI Management
                </h2>
                <p className="text-sm text-slate-500">
                  Main frontend wallet page par yahi UPI ID show hogi.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                UPI ID
              </label>

              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full h-13 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-slate-950 transition text-slate-900"
                placeholder="example@upi"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-2xl bg-slate-950 text-white font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-60 transition"
            >
              <Save size={18} />
              {loading ? "Updating..." : "Update UPI ID"}
            </button>
          </form>

          <form
            onSubmit={handleNotificationSubmit}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-7 space-y-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Bell size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Add Notification
                </h2>
                <p className="text-sm text-slate-500">
                  Ye notification main page navbar icon me show hogi.
                </p>
              </div>
            </div>

            <input
              type="text"
              value={notificationTitle}
              onChange={(e) => setNotificationTitle(e.target.value)}
              className="w-full h-13 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-slate-950 transition text-slate-900"
              placeholder="Notification Title"
            />

            <textarea
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              rows="4"
              className="w-full border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-slate-950 transition resize-none text-slate-900"
              placeholder="Notification Message"
            />

            <button
              type="submit"
              disabled={notificationLoading}
              className="w-full h-12 rounded-2xl bg-indigo-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-60 transition"
            >
              <Send size={18} />
              {notificationLoading ? "Adding..." : "Add Notification"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-7">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <IndianRupee size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Withdrawal Requests
                </h2>
                <p className="text-sm text-slate-500">
                  User withdrawal request yaha show hogi.
                </p>
              </div>
            </div>

            <button
              onClick={fetchWithdrawRequests}
              disabled={withdrawLoading}
              className="h-11 px-4 rounded-2xl bg-slate-950 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-60 transition"
            >
              <RefreshCcw size={16} />
              {withdrawLoading ? "Loading..." : "Refresh"}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[850px] w-full text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-600">
                  <th className="px-4 py-3 text-left rounded-l-xl">User</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-right rounded-r-xl">Action</th>
                </tr>
              </thead>

              <tbody>
                {withdrawRequests.length > 0 ? (
                  withdrawRequests.map((item) => (
                    <tr key={item._id} className="border-b border-slate-100">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-900">
                          {item.userId?.name || item.userId?.username || "User"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.userId?.email || "-"}
                        </p>
                      </td>

                      <td className="px-4 py-4 font-bold text-slate-950">
                        ${formatMoney(item.amount)}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status === "approved"
                              ? "bg-emerald-100 text-emerald-700"
                              : item.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {item.status || "pending"}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          {new Date(item.createdAt).toLocaleString()}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-right">
                        {item.status === "pending" ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                updateWithdrawStatus(item._id, "approved")
                              }
                              className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() =>
                                updateWithdrawStatus(item._id, "rejected")
                              }
                              className="px-3 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      No withdrawal requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UPIManagement;
