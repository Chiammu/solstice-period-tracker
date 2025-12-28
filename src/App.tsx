import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Onboarding from './pages/Onboarding';
import Setup from './pages/Setup';
import Dashboard from './pages/Dashboard';
import LogDetails from './pages/LogDetails';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import Navigation from './components/Navigation';
import PrivacyLock from './components/PrivacyLock';
import { AnimatePresence } from 'framer-motion';

import Auth from './pages/Auth';

const AppRoutes = () => {
  const { state } = useAppContext();
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Auto-unlock if no PIN set or already onboarded but we want security
  useEffect(() => {
    // For now, only show lock if setup is complete
    if (state.setupComplete) setIsUnlocked(false);
    else setIsUnlocked(true);
  }, [state.setupComplete]);

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!state.session) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  if (!state.isOnboarded) {
    return (
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  if (!state.setupComplete) {
    return (
      <Routes>
        <Route path="/setup" element={<Setup />} />
        <Route path="*" element={<Navigate to="/setup" replace />} />
      </Routes>
    );
  }

  return (
    <>
      <AnimatePresence>
        {!isUnlocked && <PrivacyLock onUnlock={() => setIsUnlocked(true)} />}
      </AnimatePresence>
      <div className="flex flex-col min-h-screen pb-24">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/log" element={<LogDetails />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Navigation />
      </div>
    </>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;
