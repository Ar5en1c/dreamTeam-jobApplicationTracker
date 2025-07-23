import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ToastProvider } from '@/components/ui/Toast';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Dashboard } from '@/pages/Dashboard';
import { Profile } from '@/pages/Profile';
import { Applications } from '@/pages/Applications';
import { Analytics } from '@/pages/Analytics';
import { Resume } from '@/pages/Resume';
import { Settings } from '@/pages/Settings';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground prevent-overflow">
            <Routes>
              <Route path="/" element={<AppLayout />}>
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
                <Route 
                  path="analytics" 
                  element={
                    <ErrorBoundary>
                      <Analytics />
                    </ErrorBoundary>
                  } 
                />
                <Route 
                  path="settings" 
                  element={
                    <ErrorBoundary>
                      <Settings />
                    </ErrorBoundary>
                  } 
                />
              </Route>
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;