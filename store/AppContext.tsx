import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, PasswordEntry, GeneratorSettings } from '../types';

interface AppContextType extends AppState {
  addToHistory: (entry: PasswordEntry) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  updateSettings: (newSettings: Partial<GeneratorSettings>) => void;
  toggleDarkMode: () => void;
  installPrompt: any; // Evento PWA
  triggerInstall: () => void;
}

const defaultSettings: GeneratorSettings = {
  length: 16,
  useUppercase: true,
  useLowercase: true,
  useNumbers: true,
  useSymbols: true,
  useAmbiguous: false,
  easyTyping: true, // Default to USP
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state from localStorage or defaults
  // Updated keys from 'cf_' to 'pg_' for Password GEN
  const [history, setHistory] = useState<PasswordEntry[]>(() => {
    const saved = localStorage.getItem('pg_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<GeneratorSettings>(() => {
    const saved = localStorage.getItem('pg_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('pg_darkmode');
    return saved ? JSON.parse(saved) : true;
  });

  // PWA Install State
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const triggerInstall = () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    installPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setInstallPrompt(null);
      } else {
        console.log('User dismissed the install prompt');
      }
    });
  };

  // Persist effects
  useEffect(() => {
    localStorage.setItem('pg_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('pg_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('pg_darkmode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addToHistory = (entry: PasswordEntry) => {
    setHistory((prev) => [entry, ...prev].slice(0, 50)); // Keep last 50
  };

  const removeFromHistory = (id: string) => {
    setHistory((prev) => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => setHistory([]);

  const updateSettings = (newSettings: Partial<GeneratorSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <AppContext.Provider value={{
      history,
      settings,
      darkMode,
      addToHistory,
      removeFromHistory,
      clearHistory,
      updateSettings,
      toggleDarkMode,
      installPrompt,
      triggerInstall
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};