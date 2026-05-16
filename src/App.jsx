import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PaymentUpdate from './pages/PaymentUpdate';
import UserInfo from './pages/UserInfo';
import AccountUpdate from './pages/AccountUpdate';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setActivePage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActivePage('dashboard');
  };

  // Protected Route Wrapper
  const ProtectedLayout = () => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }

    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Sidebar */}
        <Sidebar 
          activePage={activePage} 
          setActivePage={setActivePage} 
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar onLogout={handleLogout} />
          
          <main className="flex-1 overflow-auto p-6 bg-gray-50">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/payments" element={<PaymentUpdate />} />
              <Route path="/user-info" element={<UserInfo />} />
              <Route path="/account" element={<AccountUpdate />} />
            </Routes>
          </main>
        </div>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        {/* Public Route */}
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

        {/* Protected Routes */}
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </Router>
  );
}

export default App;