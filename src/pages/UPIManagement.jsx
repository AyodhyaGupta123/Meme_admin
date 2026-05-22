import React, { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Wallet,
  Bell,
  Save,
  CheckCircle2,
  AlertCircle,
  Send,
} from "lucide-react";

const UPIManagement = () => {
  const [upiId, setUpiId] = useState("");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
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

  useEffect(() => {
    fetchUpiId();
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
                UPI & Notification Management
              </h1>
              <p className="text-slate-400 mt-2 max-w-2xl">
                Update payment UPI ID and publish notification to main frontend
                navbar.
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

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Notification Title
              </label>

              <input
                type="text"
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
                className="w-full h-13 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-slate-950 transition text-slate-900"
                placeholder="Payment Update"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Notification Message
              </label>

              <textarea
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                rows="4"
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-slate-950 transition resize-none text-slate-900"
                placeholder="New UPI ID has been updated. Please check before payment."
              />
            </div>

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
      </div>
    </div>
  );
};

export default UPIManagement;
