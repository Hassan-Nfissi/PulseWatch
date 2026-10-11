import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { MonitorsPage } from './pages/MonitorsPage';
import { MonitorDetailPage } from './pages/MonitorDetailPage';
import { StatusPagesAdminPage } from './pages/StatusPagesAdminPage';
import { PublicStatusPage } from './pages/PublicStatusPage';
import { LoginPage } from './pages/LoginPage';
import { LandingPage } from './pages/LandingPage';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export const App: React.FC = () => {
  const googleClientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    '870803756957-i09rf7aptulg6jng376tgasp6gvmo604.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Unauthenticated Public Status Page Route */}
            <Route path="/status/:slug" element={<PublicStatusPage />} />

            {/* Login Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Public SaaS Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Protected App Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedLayout>
                  <DashboardPage />
                </ProtectedLayout>
              }
            />
            <Route
              path="/monitors"
              element={
                <ProtectedLayout>
                  <MonitorsPage />
                </ProtectedLayout>
              }
            />
            <Route
              path="/monitors/:id"
              element={
                <ProtectedLayout>
                  <MonitorDetailPage />
                </ProtectedLayout>
              }
            />
            <Route
              path="/status-pages"
              element={
                <ProtectedLayout>
                  <StatusPagesAdminPage />
                </ProtectedLayout>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
