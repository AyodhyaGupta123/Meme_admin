import React, { useState } from "react";
import { Eye, EyeOff, LogIn, ShieldCheck } from "lucide-react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      if (email === "admin@upipay.com" && password === "admin123") {
        onLogin({ role: "admin", email });
      } else {
        setError("Invalid email or password");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-4">
              <ShieldCheck size={28} />
            </div>

            <h1 className="text-2xl font-bold text-slate-950">
              Admin Login
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Sign in to manage users and payments.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@upipay.com"
                required
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-slate-900 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full h-12 px-4 pr-12 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-slate-900 transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-slate-900 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-60 transition"
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-500">
            <p className="font-semibold text-slate-700 mb-1">
              Demo Credentials
            </p>
            <p>Email: admin@upipay.com</p>
            <p>Password: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}