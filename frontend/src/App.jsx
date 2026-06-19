import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import SelectClassPage from './pages/onboarding/SelectClassPage';
import SelectStreamPage from './pages/onboarding/SelectStreamPage';
import SelectPlanPage from './pages/onboarding/SelectPlanPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import QuestionBankPage from './pages/dashboard/QuestionBankPage';
import MockTestPage from './pages/dashboard/MockTestPage';
import StudyPlannerPage from './pages/dashboard/StudyPlannerPage';
import FormulaVaultPage from './pages/dashboard/FormulaVaultPage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage';
import AdminPage from './pages/admin/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function OnboardingRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.onboarded) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Onboarding */}
      <Route path="/onboarding/class" element={
        <OnboardingRoute><SelectClassPage /></OnboardingRoute>
      } />
      <Route path="/onboarding/stream" element={
        <OnboardingRoute><SelectStreamPage /></OnboardingRoute>
      } />
      <Route path="/onboarding/plan" element={
        <OnboardingRoute><SelectPlanPage /></OnboardingRoute>
      } />

      {/* Dashboard */}
      <Route path="/dashboard" element={
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      } />
      <Route path="/dashboard/question-bank" element={
        <ProtectedRoute><QuestionBankPage /></ProtectedRoute>
      } />
      <Route path="/dashboard/mock-test" element={
        <ProtectedRoute><MockTestPage /></ProtectedRoute>
      } />
      <Route path="/dashboard/study-planner" element={
        <ProtectedRoute><StudyPlannerPage /></ProtectedRoute>
      } />
      <Route path="/dashboard/formula-vault" element={
        <ProtectedRoute><FormulaVaultPage /></ProtectedRoute>
      } />
      <Route path="/dashboard/analytics" element={
        <ProtectedRoute><AnalyticsPage /></ProtectedRoute>
      } />

      {/* Admin */}
      <Route path="/admin" element={
        <ProtectedRoute><AdminPage /></ProtectedRoute>
      } />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
