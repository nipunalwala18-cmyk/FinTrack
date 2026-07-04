import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { OAuthCallbackPage } from '../pages/OAuthCallbackPage';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

export const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Root Path Redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public / Unauthenticated Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
      />
      <Route path="/oauth-callback" element={<OAuthCallbackPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      {/* Fallback 404 Route */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
