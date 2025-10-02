import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, } from "react-router-dom";
import App from "./App";
import { Dashboard } from "./scenes";
import Login from "./components/Login";
import PrivateRoute from "./utils/PrivateRoute";
import { useAuth } from "./utils/context/AuthContext";
import SubscriptionManagement from "./scenes/admin/SubscriptionManagement";
import UserManagement from "./scenes/admin/UserManagement";
import LoadingScreen from "./components/LoadingScreen";

const AppRouter = () => {
  const { isAuthenticated, token, login } = useAuth();

  if (isAuthenticated === null) {
    return <div><LoadingScreen /></div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated === null ? (<div>Loading...</div>) : isAuthenticated ? (<Navigate to="/" replace />) : (<Login onLoginSuccess={login} />)} />
        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} token={token} />}>
          <Route path="/" element={<App />}>
            <Route index element={<Dashboard />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="subscription-management" element={<SubscriptionManagement />} />
            <Route path="matches" element={<div>Matches & Connections - Coming Soon</div>} />
            <Route path="messages" element={<div>Messages & Chats - Coming Soon</div>} />
            <Route path="verification" element={<div>Verification Center - Coming Soon</div>} />
            <Route path="analytics" element={<div>Reports & Analytics - Coming Soon</div>} />
            <Route path="success-stories" element={<div>Success Stories - Coming Soon</div>} />
            <Route path="notifications" element={<div>Notifications - Coming Soon</div>} />
            <Route path="settings" element={<div>System Settings - Coming Soon</div>} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
