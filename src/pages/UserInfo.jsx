import React, { useEffect, useMemo, useState } from "react";
import {
  User,
  Mail,
  Calendar,
  Wallet,
  Search,
  RefreshCcw,
  ShieldCheck,
  Users,
  Coins,
  IndianRupee,
  Save,
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
    [users, selectedUserId]
  );

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    if (!term) return users;

    return users.filter(
      (user) =>
        String(user.username || "").toLowerCase().includes(term) ||
        String(user.email || "").toLowerCase().includes(term) ||
        String(user._id || "").toLowerCase().includes(term)
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
    () =>
      users.reduce(
        (sum, user) => sum + Number(user.wallet?.realUsdBalance || 0),
        0
      ),
    [users]
  );

  const totalTokens = useMemo(
    () =>
      users.reduce(
        (sum, user) => sum + Number(user.wallet?.tokenBalance || 0),
        0
      ),
    [users]
  );

  return (
    <div className="max-w-7xl mx-auto space-y-7">
      <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur">
              <ShieldCheck size={15} />
              User Control Center
            </div>

            <h1 className="mt-5 text-3xl sm:text-4xl font-bold tracking-tight">
              User Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Review all registered users, check wallet details and manage user
              balances from one secure admin panel.
            </p>
          </div>

          <button
            onClick={fetchUsers}
            className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-950 hover:bg-slate-100 transition"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Total Users
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">
                {users.length}
              </h2>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center shadow-lg">
              <Users size={21} />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Wallet Volume
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">
                ₹{totalWalletValue.toLocaleString("en-IN")}
              </h2>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg">
              <Wallet size={21} />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Token Balance
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">
                {totalTokens.toLocaleString("en-IN")} PM
              </h2>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center shadow-lg">
              <Coins size={21} />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <div className="space-y-5">
          {selectedUser ? (
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-950 to-slate-500" />

              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-950 text-white shadow-lg">
                  <User size={28} />
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-xl font-bold text-slate-950">
                    {selectedUser.username || "Unnamed user"}
                  </h3>

                  <p className="truncate text-sm text-slate-500">
                    {selectedUser.email || "No email"}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 rounded-3xl border border-slate-100 bg-slate-50 p-4">
                  <Mail size={18} className="text-slate-400" />
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">
                      Email
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {selectedUser.email || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-3xl border border-slate-100 bg-slate-50 p-4">
                  <Calendar size={18} className="text-slate-400" />
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">
                      Joined
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {selectedUser.createdAt
                        ? new Date(selectedUser.createdAt).toLocaleDateString(
                            "en-IN"
                          )
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
                    Wallet
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-950">
                    ₹
                    {Number(
                      selectedUser.wallet?.realUsdBalance || 0
                    ).toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="rounded-3xl border border-violet-100 bg-violet-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-violet-600">
                    Tokens
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-950">
                    {Number(
                      selectedUser.wallet?.tokenBalance || 0
                    ).toLocaleString("en-IN")}{" "}
                    PM
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Set Wallet Amount
                </label>

                <div className="relative">
                  <IndianRupee
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="number"
                    min="0"
                    value={walletAmount}
                    onChange={(e) => setWalletAmount(e.target.value)}
                    placeholder="Enter new wallet amount"
                    className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-950"
                  />
                </div>

                <button
                  onClick={handleUpdateWallet}
                  disabled={!selectedUser || saving}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800 transition disabled:opacity-60"
                >
                  <Save size={16} />
                  {saving ? "Updating Wallet..." : "Update Wallet"}
                </button>

                {message && (
                  <p className="mt-3 text-sm font-medium text-slate-600">
                    {message}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Select a user to manage wallet details.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 sm:p-6 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-950">All Users</h2>
              <p className="text-sm text-slate-500 mt-1">
                Click a row to load wallet details.
              </p>
            </div>

            <div className="relative w-full lg:w-96">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <input
                type="text"
                placeholder="Search name, email or user ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-700 outline-none focus:border-slate-950 focus:bg-white transition"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                    User
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                    Email
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                    Wallet
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                    Token
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                    Joined
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-sm text-slate-400"
                    >
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-sm text-slate-400"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      onClick={() => setSelectedUserId(user._id)}
                      className={`cursor-pointer transition ${
                        user._id === selectedUserId
                          ? "bg-slate-100"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-2xl bg-slate-950 text-white flex items-center justify-center text-sm font-bold">
                            {String(user.username || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-950">
                              {user.username || "Unnamed User"}
                            </p>
                            <p className="text-xs text-slate-400">
                              #{String(user._id || "").slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {user.email || "-"}
                      </td>

                      <td className="px-5 py-4 text-sm font-bold text-slate-950">
                        ₹
                        {Number(
                          user.wallet?.realUsdBalance || 0
                        ).toLocaleString("en-IN")}
                      </td>

                      <td className="px-5 py-4 text-sm font-bold text-slate-950">
                        {Number(user.wallet?.tokenBalance || 0).toLocaleString(
                          "en-IN"
                        )}{" "}
                        PM
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-IN")
                          : "-"}
                      </td>
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