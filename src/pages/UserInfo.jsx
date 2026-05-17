import React, { useEffect, useMemo, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Wallet,
  BadgeCheck,
  Search,
  RefreshCcw,
} from "lucide-react";
import api from "../api/axios";

export default function UserInfo() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [walletAmount, setWalletAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/admin/users");
      if (res.data?.success) {
        setUsers(res.data.users || []);
        if (!selectedUserId && res.data.users?.length > 0) {
          setSelectedUserId(res.data.users[0]._id);
        }
      } else {
        setError(res.data?.error || "Unable to load users.");
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  const selectedUser = useMemo(
    () => users.find((user) => user._id === selectedUserId) || users[0] || null,
    [users, selectedUserId],
  );

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    return users.filter((user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [users, searchTerm]);

  const handleUpdateWallet = async () => {
    if (!selectedUser) return;

    const amount = Number(walletAmount);
    if (!Number.isFinite(amount) || amount < 0) {
      setMessage("Enter a valid wallet amount (0 or higher).");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const res = await api.put(`/admin/users/${selectedUser._id}/wallet`, {
        amount,
      });

      if (res.data?.success) {
        setMessage("Wallet updated successfully.");
        setWalletAmount("");
        fetchUsers();
      } else {
        setMessage(res.data?.error || "Failed to update wallet.");
      }
    } catch (err) {
      setMessage(err.response?.data?.error || err.message || "Failed to update wallet.");
    } finally {
      setSaving(false);
    }
  };

  const totalWalletValue = useMemo(
    () => users.reduce((sum, user) => sum + Number(user.wallet?.realUsdBalance || 0), 0),
    [users],
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">User Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review all users and update wallet balances from the backend.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Total Users
                </p>
                <h2 className="text-3xl font-bold text-slate-950 mt-2">
                  {users.length}
                </h2>
              </div>
              <div className="rounded-3xl bg-slate-900 px-4 py-3 text-white text-sm">
                ₹{totalWalletValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Total wallet value across all users as reported by the backend.
            </p>
          </div>

          {selectedUser ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 text-white">
                  <User size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-950">
                    {selectedUser.username || "Unnamed user"}
                  </h3>
                  <p className="text-sm text-slate-500">{selectedUser.email}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Wallet balance
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    ₹{Number(selectedUser.wallet?.realUsdBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Token balance
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {Number(selectedUser.wallet?.tokenBalance || 0).toLocaleString()} PM
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Set wallet amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={walletAmount}
                    onChange={(e) => setWalletAmount(e.target.value)}
                    placeholder="Enter new wallet amount"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                  />
                </div>
                <button
                  onClick={handleUpdateWallet}
                  disabled={!selectedUser || saving}
                  className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition disabled:opacity-60"
                >
                  {saving ? "Updating wallet..." : "Update Wallet"}
                </button>
                {message && (
                  <p className="text-sm text-slate-600">{message}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Select a user to manage wallet details.</p>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">All Users</h2>
              <p className="text-sm text-slate-500">Click a row to load wallet details.</p>
            </div>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search users"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 rounded-2xl border border-slate-200 bg-slate-50 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" style={{ minWidth: 700 }}>
              <thead>
                <tr className="text-xs uppercase tracking-[0.18em] text-slate-500 border-b border-slate-200">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Wallet</th>
                  <th className="px-4 py-3">Token</th>
                  <th className="px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      onClick={() => setSelectedUserId(user._id)}
                      className={`cursor-pointer transition ${user._id === selectedUserId ? "bg-slate-100" : "hover:bg-slate-50"}`}
                    >
                      <td className="px-4 py-4 font-medium text-slate-900">{user.username}</td>
                      <td className="px-4 py-4 text-slate-500">{user.email}</td>
                      <td className="px-4 py-4 text-slate-900">₹{Number(user.wallet?.realUsdBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-4 text-slate-900">{Number(user.wallet?.tokenBalance || 0).toLocaleString()}</td>
                      <td className="px-4 py-4 text-slate-500">{new Date(user.createdAt).toLocaleDateString("en-IN")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
