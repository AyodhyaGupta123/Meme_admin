import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PaymentUpdate from "./pages/PaymentUpdate";
import UserInfo from "./pages/UserInfo";
import AccountUpdate from "./pages/AccountUpdate";
import UPIManagement from "./pages/UPIManagement";

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("adminUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [activePage, setActivePage] = useState("dashboard");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isLoggedIn = !!currentUser;

  const handleLogin = (user) => {
    localStorage.setItem("adminUser", JSON.stringify(user));
    setCurrentUser(user);
    setActivePage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    setCurrentUser(null);
    setActivePage("dashboard");
    setIsMobileOpen(false);
  };

  const ProtectedLayout = () => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }

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
            onLogout={handleLogout}
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
          />

          <main className="p-4 sm:p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/payments" element={<PaymentUpdate />} />
              <Route path="/user-info" element={<UserInfo />} />
              <Route path="/account" element={<AccountUpdate />} />
              <Route path="/manage" element={<UPIManagement />} />
            </Routes>
          </main>
        </div>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            !isLoggedIn ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </Router>
  );
}

export default App;