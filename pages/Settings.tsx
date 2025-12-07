import React from 'react';
import { useApp } from '../store/AppContext';

const Settings: React.FC = () => {
  const { settings, updateSettings, darkMode, toggleDarkMode } = useApp();

  const handleSync = () => {
    // Mock sync functionality
    alert('Sincronizando con la nube... (Simulación: los datos se guardan en LocalStorage)');
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto w-full animate-fade-in">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">Configuración</h2>
        <p className="text-slate-500 dark:text-gray-400">Personaliza tu experiencia y preferencias.</p>
      </div>

      {/* Apariencia */}
      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">palette</span>
          Apariencia
        </h3>
        <div className="bg-white dark:bg-surface rounded-2xl border border-gray-200 dark:border-gray-700/50 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
          <div className="p-4 md:p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl text-indigo-600 dark:text-indigo-400">
                 <span className="material-symbols-outlined">dark_mode</span>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Tema Oscuro</p>
                <p className="text-sm text-slate-500 dark:text-gray-400">Alternar entre claro y oscuro</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </section>

      {/* Generador Default */}
      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
           <span className="material-symbols-outlined text-primary">tune</span>
           Preferencias del Generador
        </h3>
        <div className="bg-white dark:bg-surface rounded-2xl border border-gray-200 dark:border-gray-700/50 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
          
          <div className="p-4 md:p-6 flex items-center justify-between">
            <div className="flex flex-col">
              <p className="font-semibold text-slate-900 dark:text-white">Evitar caracteres ambiguos</p>
              <p className="text-sm text-slate-500 dark:text-gray-400">Excluir I, l, 1, O, 0 para evitar confusión.</p>
            </div>
             <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.useAmbiguous} 
                onChange={() => updateSettings({ useAmbiguous: !settings.useAmbiguous })} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

           <div className="p-4 md:p-6 flex flex-col gap-4">
              <p className="font-semibold text-slate-900 dark:text-white">Exclusión Manual</p>
              <input 
                type="text" 
                placeholder="Ej: {}[]()/`~,;:.<>"
                className="w-full bg-gray-50 dark:bg-[#101922] border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-white"
              />
              <p className="text-xs text-gray-500">Caracteres que nunca aparecerán en tus contraseñas.</p>
           </div>

        </div>
      </section>

      {/* Sync */}
       <section className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
           <span className="material-symbols-outlined text-primary">cloud_sync</span>
           Sincronización
        </h3>
        <div className="bg-white dark:bg-surface rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
           <div>
             <p className="font-semibold text-slate-900 dark:text-white">Estado de sincronización</p>
             <p className="text-sm text-slate-500 dark:text-gray-400">Mantén tus contraseñas actualizadas en todos tus dispositivos.</p>
           </div>
           <button 
             onClick={handleSync}
             className="px-6 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-lg transition-colors"
           >
             Sincronizar Ahora
           </button>
        </div>
      </section>

    </div>
  );
};

export default Settings;
