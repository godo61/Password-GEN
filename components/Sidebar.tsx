import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../store/AppContext';

const Sidebar: React.FC = () => {
  const { toggleDarkMode, darkMode, installPrompt, triggerInstall, isStandalone, isIOS } = useApp();
  const location = useLocation();
  const [showInstructions, setShowInstructions] = useState(false);

  const navItems = [
    { name: 'Generador', path: '/', icon: 'password' },
    { name: 'Historial', path: '/history', icon: 'history' },
    { name: 'Ajustes', path: '/settings', icon: 'tune' },
    { name: 'Ayuda', path: '/help', icon: 'help' },
  ];

  const handleInstallClick = () => {
    if (installPrompt) {
      triggerInstall();
    } else {
      setShowInstructions(true);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-72 flex-col bg-white dark:bg-[#101922] border-r border-gray-200 dark:border-gray-800/50 z-50 transition-colors">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg shadow-blue-500/20">
              <span className="material-symbols-outlined text-[24px]">lock</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">Password GEN</h1>
              <p className="text-xs font-medium text-slate-500 dark:text-gray-400 mt-1">Gestor QWERTY</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 flex flex-col gap-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden
                ${isActive 
                  ? 'bg-primary/5 dark:bg-primary/10 text-primary font-semibold' 
                  : 'text-slate-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-gray-200'}
              `}
            >
              {({ isActive }) => (
                <>
                  <span className={`material-symbols-outlined text-[24px] transition-transform duration-300 group-hover:scale-110 ${isActive ? 'fill-1' : ''}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm tracking-wide">{item.name}</span>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
          
          {/* Install Button (Desktop) - Always show if not installed */}
          {!isStandalone && (
            <div className="mt-4 px-4">
              <button 
                onClick={handleInstallClick}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span className="material-symbols-outlined">download</span>
                <span className="text-sm font-bold">Instalar App</span>
              </button>
            </div>
          )}
        </nav>

        <div className="p-4 mt-auto border-t border-gray-100 dark:border-gray-800">
          <button 
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-gray-300 group"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">
                {darkMode ? 'dark_mode' : 'light_mode'}
              </span>
              <span className="text-sm font-medium">
                {darkMode ? 'Modo Oscuro' : 'Modo Claro'}
              </span>
            </div>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full glass-nav border-t border-gray-200/50 dark:border-gray-800/50 z-50 pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex flex-col items-center justify-center w-full h-full gap-1 transition-colors
                ${isActive ? 'text-primary' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}
              `}
            >
              {({ isActive }) => (
                <>
                  <span className={`material-symbols-outlined text-[24px] ${isActive ? 'fill-1 scale-110' : ''} transition-transform`}>
                    {item.icon}
                  </span>
                  <span className="text-[10px] font-medium">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
          {!isStandalone && (
             <button
              onClick={handleInstallClick}
              className="flex flex-col items-center justify-center w-full h-full gap-1 text-green-600 dark:text-green-500 animate-pulse"
             >
                <span className="material-symbols-outlined text-[24px]">download</span>
                <span className="text-[10px] font-bold">Instalar</span>
             </button>
          )}
        </div>
      </nav>

      {/* Manual Install Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowInstructions(false)}>
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-gray-700" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Instalar Aplicación</h3>
              <button onClick={() => setShowInstructions(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="flex flex-col gap-4 text-sm text-slate-600 dark:text-gray-300">
              {isIOS ? (
                <>
                  <p>Para instalar en tu iPhone o iPad:</p>
                  <ol className="flex flex-col gap-3">
                    <li className="flex items-center gap-3 bg-gray-50 dark:bg-black/20 p-3 rounded-lg">
                      <span className="material-symbols-outlined text-blue-500">ios_share</span>
                      <span>1. Pulsa el botón <strong>Compartir</strong> en la barra inferior de Safari.</span>
                    </li>
                    <li className="flex items-center gap-3 bg-gray-50 dark:bg-black/20 p-3 rounded-lg">
                      <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">add_box</span>
                      <span>2. Desliza y selecciona <strong>Añadir a inicio</strong>.</span>
                    </li>
                  </ol>
                </>
              ) : (
                <>
                  <p>Para instalar en tu navegador:</p>
                  <ol className="flex flex-col gap-3">
                    <li className="flex items-center gap-3 bg-gray-50 dark:bg-black/20 p-3 rounded-lg">
                      <span className="material-symbols-outlined">more_vert</span>
                      <span>1. Pulsa el menú de opciones (tres puntos) de tu navegador.</span>
                    </li>
                    <li className="flex items-center gap-3 bg-gray-50 dark:bg-black/20 p-3 rounded-lg">
                      <span className="material-symbols-outlined">install_mobile</span>
                      <span>2. Selecciona <strong>Instalar aplicación</strong> o <strong>Añadir a pantalla de inicio</strong>.</span>
                    </li>
                  </ol>
                </>
              )}
            </div>

            <button 
              onClick={() => setShowInstructions(false)}
              className="mt-6 w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;