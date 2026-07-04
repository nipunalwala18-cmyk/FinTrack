import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

// Lazy loaded page components (resolving named exports)
const LoginPage = lazy(() => import('../pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const OAuthCallbackPage = lazy(() => import('../pages/OAuthCallbackPage').then(m => ({ default: m.OAuthCallbackPage })));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

const AppLayout = lazy(() => import('../components/layout/AppLayout').then(m => ({ default: m.AppLayout })));
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const AccountsPage = lazy(() => import('../pages/Accounts/AccountsPage').then(m => ({ default: m.AccountsPage })));
const TransactionsPage = lazy(() => import('../pages/Transactions/TransactionsPage').then(m => ({ default: m.TransactionsPage })));
const CategoriesPage = lazy(() => import('../pages/Categories/CategoriesPage').then(m => ({ default: m.CategoriesPage })));
const BudgetsPage = lazy(() => import('../pages/Budgets/BudgetsPage').then(m => ({ default: m.BudgetsPage })));
const GoalsPage = lazy(() => import('../pages/Goals/GoalsPage').then(m => ({ default: m.GoalsPage })));
const ReportsPage = lazy(() => import('../pages/Reports/ReportsPage').then(m => ({ default: m.ReportsPage })));
const SettingsPage = lazy(() => import('../pages/Settings/SettingsPage').then(m => ({ default: m.SettingsPage })));

export const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-gray-50 dark:bg-[#0b0c10]">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      }
    >
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

        {/* Protected Layout Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/budgets" element={<BudgetsPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Fallback 404 Route */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};
export default AppRoutes;
