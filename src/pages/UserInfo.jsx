import React from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Wallet,
  BadgeCheck,
} from "lucide-react";

export default function UserInfo() {
  const user = {
    name: "Raj Kumar",
    email: "raj@example.com",
    phone: "9876543210",
    totalPayments: 8,
    totalAmount: 485000,
    joined: "March 2024",
  };

  const stats = [
    {
      label: "Phone Number",
      value: user.phone,
      icon: <Phone size={20} />,
    },
    {
      label: "Member Since",
      value: user.joined,
      icon: <Calendar size={20} />,
    },
    {
      label: "Total Transactions",
      value: user.totalPayments,
      icon: <CreditCard size={20} />,
    },
    {
      label: "Total Paid",
      value: `₹${user.totalAmount.toLocaleString("en-IN")}`,
      icon: <Wallet size={20} />,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">
            User Information
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Complete profile overview and payment summary.
          </p>
        </div>

        <span className="w-fit inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold">
          <BadgeCheck size={15} />
          Active User
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-24 h-24 rounded-3xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
                <User size={42} />
              </div>

              <div>
                <h2 className="text-3xl font-bold text-slate-950">
                  {user.name}
                </h2>

                <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    <span>{user.email}</span>
                  </div>

                  <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300" />

                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    <span>{user.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 min-w-[180px]">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Paid
              </p>
              <h3 className="text-2xl font-bold text-slate-950 mt-1">
                ₹{user.totalAmount.toLocaleString("en-IN")}
              </h3>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map((item, index) => (
            <div
              key={index}
              className="group bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-slate-300 transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 mb-5 group-hover:bg-slate-900 group-hover:text-white transition-all">
                {item.icon}
              </div>

              <p className="text-sm text-slate-500 mb-1">{item.label}</p>

              <h3 className="text-xl font-bold text-slate-950">
                {item.value}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}