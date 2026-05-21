import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AdminLayout({ children, onLogout }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="lg:ml-72 min-h-screen">
        <Navbar
          onLogout={onLogout}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}