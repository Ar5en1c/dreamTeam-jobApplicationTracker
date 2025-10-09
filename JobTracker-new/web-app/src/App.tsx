import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ToastProvider } from "@/components/ui/Toast";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { Dashboard } from "@/pages/Dashboard";
import { Profile } from "@/pages/Profile";
import { Applications } from "@/pages/Applications";
// import { Analytics } from "@/pages/Analytics"; // Commented out - will be added in Phase 2
import { Resume } from "@/pages/Resume";
import { Settings } from "@/pages/Settings";
import { PremiumLoginPage } from "@/components/auth/PremiumLoginPage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PublicRoute } from "@/components/auth/PublicRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

function App() {
  // Handle auth redirect from email verification
  React.useEffect(() => {
    const handleAuthRedirect = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      if (hashParams.get('access_token')) {
        // Clear the hash from URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };
    
    handleAuthRedirect();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <ErrorBoundary>
          <ToastProvider>
            <Router basename="/">
              <div className="min-h-screen bg-background text-foreground prevent-overflow">
                <Routes>
                {/* Public routes (login/signup) */}
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <PremiumLoginPage />
                    </PublicRoute>
                  } 
                />
                
                {/* Protected routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route
                    path="dashboard"
                    element={
                      <ErrorBoundary>
                        <Dashboard />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="profile"
                    element={
                      <ErrorBoundary>
                        <Profile />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="applications"
                    element={
                      <ErrorBoundary>
                        <Applications />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="resume"
                    element={
                      <ErrorBoundary>
                        <Resume />
                      </ErrorBoundary>
                    }
                  />
                  {/* Analytics route commented out - contains only mock data, will be added in Phase 2
                  <Route
                    path="analytics"
                    element={
                      <ErrorBoundary>
                        <Analytics />
                      </ErrorBoundary>
                    }
                  />
                  */}
                  <Route
                    path="settings"
                    element={
                      <ErrorBoundary>
                        <Settings />
                      </ErrorBoundary>
                    }
                  />
                </Route>
                
                {/* Catch all - redirect to dashboard */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </div>
            </Router>
          </ToastProvider>
        </ErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
