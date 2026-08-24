import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
// Lazy load pages for performance
import React, { Suspense, lazy } from 'react';

const Login = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Expenses = lazy(() => import('../pages/Expenses'));
const Funds = lazy(() => import('../pages/Funds'));
const Analytics = lazy(() => import('../pages/Analytics'));
const Shares = lazy(() => import('../pages/Shares'));
const Settings = lazy(() => import('../pages/Settings'));
const SharedView = lazy(() => import('../pages/SharedView'));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Public Shared Route */}
        <Route path="/shared/:token" element={<SharedView />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="funds" element={<Funds />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="shares" element={<Shares />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        {/* Catch all - redirect to login for unauthenticated, dashboard for authenticated */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
