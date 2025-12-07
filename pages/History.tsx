import React, { useState } from 'react';
import { useApp } from '../store/AppContext';

const History: React.FC = () => {
  const { history, clearHistory, removeFromHistory } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredHistory = history.filter(item => 
    item.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (id: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    }).format(new Date(timestamp));
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full animate-fade-in h-full pb-20 md:pb-0 pt-2 md:pt-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Historial</h2>
          <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">Tus últimas contraseñas generadas.</p>
        </div>
        
        {history.length > 0 && (
            <button 
                onClick={clearHistory}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-xl transition-colors ml-auto md:ml-0"
            >
                <span className="material-symbols-outlined text-lg">delete_sweep</span>
                Borrar Todo
            </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">search</span>
        </div>
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#151e29] border border-gray-200 dark:border-gray-800 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
        />
      </div>

      {/* List */}
      <div className="flex-1 flex flex-col gap-3">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
             <div className="h-24 w-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-400">
                <span className="material-symbols-outlined text-5xl">history</span>
             </div>
             <p className="text-lg font-bold text-gray-600 dark:text-gray-300">Historial Vacío</p>
             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
                 Genera algunas contraseñas para que aparezcan aquí automáticamente.
             </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredHistory.map((entry) => (
              <div 
                key={entry.id} 
                className="bg-white dark:bg-[#151e29] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:border-primary/50 dark:hover:border-primary/50 transition-colors shadow-sm"
              >
                 <div className="flex items-center gap-4 overflow-hidden">
                    <div className={`hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        entry.strength === 'Muy Fuerte' ? 'bg-green-100 text-green-600 dark:bg-green-900/20' :
                        entry.strength === 'Fuerte' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20' :
                        'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20'
                    }`}>
                        <span className="material-symbols-outlined text-xl">
                            {entry.strength === 'Muy Fuerte' ? 'shield' : entry.strength === 'Fuerte' ? 'lock' : 'lock_open'}
                        </span>
                    </div>
                    
                    <div className="flex flex-col overflow-hidden">
                        <span className="font-mono text-lg text-slate-800 dark:text-slate-200 font-medium truncate w-full">
                            {entry.value}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                            <span>{formatDate(entry.createdAt)}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                            <span className={`${
                                entry.strength === 'Muy Fuerte' ? 'text-green-500' :
                                entry.strength === 'Fuerte' ? 'text-blue-500' : 'text-yellow-500'
                            }`}>{entry.strength}</span>
                        </div>
                    </div>
                 </div>

                 <div className="flex items-center gap-1 pl-2">
                    <button 
                        onClick={() => handleCopy(entry.id, entry.value)}
                        className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all ${
                            copiedId === entry.id 
                            ? 'bg-green-500 text-white' 
                            : 'text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-white/10'
                        }`}
                    >
                        <span className="material-symbols-outlined text-xl">
                            {copiedId === entry.id ? 'check' : 'content_copy'}
                        </span>
                    </button>
                    <button 
                        onClick={() => removeFromHistory(entry.id)}
                        className="h-10 w-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;