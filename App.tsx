import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import Sidebar from './components/Sidebar';
import Generator from './pages/Generator';
import History from './pages/History';
import Settings from './pages/Settings';
import Help from './pages/Help';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-[#101922] transition-colors duration-300">
          <Sidebar />
          <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto mb-16 md:mb-0">
            <Routes>
              <Route path="/" element={<Generator />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/help" element={<Help />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
