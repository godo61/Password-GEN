import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { generatePassword, calculateStrength } from '../utils/generator';
import { PasswordEntry } from '../types';

const generateId = () => Math.random().toString(36).substring(2, 15);

const Generator: React.FC = () => {
  const { settings, updateSettings, addToHistory } = useApp();
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState<'Débil' | 'Media' | 'Fuerte' | 'Muy Fuerte'>('Media');
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleGenerate = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    const newPassword = generatePassword(settings);
    setPassword(newPassword);
    setStrength(calculateStrength(newPassword));
    setCopied(false);
    
    // Auto-save logic
    const entry: PasswordEntry = {
      id: generateId(),
      value: newPassword,
      createdAt: Date.now(),
      strength: calculateStrength(newPassword),
      isFavorite: false,
    };
    addToHistory(entry);
  };

  useEffect(() => {
    if (!password) handleGenerate();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-4xl mx-auto w-full animate-fade-in pb-20 md:pb-0 pt-2 md:pt-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Generador
          </h2>
          <p className="text-slate-500 dark:text-gray-400 text-sm md:text-base">
            Crea contraseñas seguras optimizadas para tu flujo de escritura.
          </p>
        </div>
        <div className="hidden md:block">
            <button onClick={handleGenerate} className="p-3 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-300">
                <span className={`material-symbols-outlined ${isAnimating ? 'animate-spin' : ''}`}>refresh</span>
            </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-[#151e29] rounded-3xl shadow-xl shadow-blue-900/5 dark:shadow-black/20 border border-gray-100 dark:border-gray-800 p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden group">
        
        {/* Output Area */}
        <div className="relative group/input">
            <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-blue-400 opacity-20 blur transition duration-200 group-hover/input:opacity-30 ${copied ? 'opacity-40' : ''}`}></div>
            <div className="relative flex items-center bg-gray-50 dark:bg-[#0b1219] rounded-xl border border-gray-200 dark:border-gray-700/50 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all">
                <input
                readOnly
                value={password}
                className="w-full bg-transparent text-slate-800 dark:text-white text-2xl md:text-4xl font-mono p-5 pr-16 outline-none truncate font-medium tracking-tight"
                />
                <div className="absolute right-2 flex gap-1">
                    <button
                        onClick={copyToClipboard}
                        className={`h-12 w-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                            copied 
                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/20 transform scale-105' 
                            : 'text-gray-400 hover:text-primary hover:bg-white dark:hover:bg-white/10'
                        }`}
                        title="Copiar al portapapeles"
                    >
                        <span className="material-symbols-outlined text-[28px]">
                            {copied ? 'check' : 'content_copy'}
                        </span>
                    </button>
                </div>
            </div>
        </div>

        {/* Strength Meter */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
             <span className="font-semibold text-gray-500 dark:text-gray-400">Fortaleza</span>
             <span className={`font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wide ${
               strength === 'Muy Fuerte' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
               strength === 'Fuerte' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 
               strength === 'Media' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
               'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
             }`}>{strength}</span>
          </div>
          <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ease-out rounded-full ${
                strength === 'Muy Fuerte' ? 'w-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 
                strength === 'Fuerte' ? 'w-3/4 bg-blue-500' : 
                strength === 'Media' ? 'w-1/2 bg-yellow-500' : 'w-1/4 bg-red-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Length Control */}
          <div className="lg:col-span-1 bg-white dark:bg-[#151e29] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 flex flex-col justify-center gap-6">
             <div className="flex justify-between items-center">
                 <label className="font-bold text-slate-700 dark:text-slate-200">Longitud</label>
                 <div className="h-10 w-16 flex items-center justify-center bg-gray-100 dark:bg-black/20 rounded-lg text-xl font-mono font-bold text-primary">
                    {settings.length}
                 </div>
             </div>
             <div className="relative h-6 flex items-center">
                <input
                    type="range"
                    min="6"
                    max="32"
                    value={settings.length}
                    onChange={(e) => updateSettings({ length: parseInt(e.target.value) })}
                    className="absolute w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-blue-600 active:accent-blue-700 z-10"
                />
                <div className="absolute w-full flex justify-between px-1 text-[10px] text-gray-400 -bottom-5 font-mono">
                    <span>6</span>
                    <span>32</span>
                </div>
             </div>
          </div>

          {/* Character Options */}
          <div className="lg:col-span-2 bg-white dark:bg-[#151e29] rounded-3xl p-6 border border-gray-100 dark:border-gray-800">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <OptionToggle 
                    label="Mayúsculas" 
                    sublabel="A-Z"
                    checked={settings.useUppercase} 
                    onChange={() => updateSettings({ useUppercase: !settings.useUppercase })} 
                />
                <OptionToggle 
                    label="Minúsculas" 
                    sublabel="a-z"
                    checked={settings.useLowercase} 
                    onChange={() => updateSettings({ useLowercase: !settings.useLowercase })} 
                />
                <OptionToggle 
                    label="Números" 
                    sublabel="0-9"
                    checked={settings.useNumbers} 
                    onChange={() => updateSettings({ useNumbers: !settings.useNumbers })} 
                />
                <OptionToggle 
                    label="Símbolos" 
                    sublabel="!@#..."
                    checked={settings.useSymbols} 
                    onChange={() => updateSettings({ useSymbols: !settings.useSymbols })} 
                />
             </div>
          </div>
          
          {/* Special Feature */}
          <div className="lg:col-span-3">
             <button
                 onClick={() => updateSettings({ easyTyping: !settings.easyTyping })}
                 className={`w-full p-5 rounded-2xl border transition-all duration-200 text-left flex items-center gap-4 ${
                     settings.easyTyping 
                     ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-primary/10 dark:to-blue-900/20 border-blue-200 dark:border-primary/30' 
                     : 'bg-white dark:bg-[#151e29] border-gray-100 dark:border-gray-800 opacity-80'
                 }`}
             >
                 <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                     settings.easyTyping ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-400'
                 }`}>
                     <span className="material-symbols-outlined">keyboard</span>
                 </div>
                 <div className="flex-1">
                     <div className="flex items-center gap-2">
                        <span className={`font-bold text-lg ${settings.easyTyping ? 'text-primary dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                            Modo Escritura Fácil
                        </span>
                        {settings.easyTyping && <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Activo</span>}
                     </div>
                     <p className="text-sm text-slate-500 dark:text-gray-400 leading-snug mt-1">
                        Alterna entre mano izquierda y derecha para una escritura fluida en teclados QWERTY.
                     </p>
                 </div>
                 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                     settings.easyTyping ? 'border-primary bg-primary' : 'border-gray-300 dark:border-gray-600'
                 }`}>
                     {settings.easyTyping && <span className="material-symbols-outlined text-white text-sm font-bold">check</span>}
                 </div>
             </button>
          </div>

      </div>
      
      {/* Mobile Floating Action Button */}
      <button
          onClick={handleGenerate}
          className="md:hidden fixed bottom-20 right-6 h-14 w-14 bg-primary text-white rounded-2xl shadow-lg shadow-blue-500/40 flex items-center justify-center z-40 active:scale-90 transition-transform"
      >
          <span className={`material-symbols-outlined text-3xl ${isAnimating ? 'animate-spin' : ''}`}>refresh</span>
      </button>

      <div className="hidden md:block">
        <button
            onClick={handleGenerate}
            className="w-full py-4 bg-primary hover:bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.99] flex items-center justify-center gap-3 text-lg"
        >
            <span className={`material-symbols-outlined text-3xl ${isAnimating ? 'animate-spin-slow' : ''}`}>autorenew</span>
            Generar Nueva Contraseña
        </button>
      </div>

    </div>
  );
};

const OptionToggle: React.FC<{
  label: string;
  sublabel: string;
  checked: boolean;
  onChange: () => void;
}> = ({ label, sublabel, checked, onChange }) => (
  <label className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${
    checked 
    ? 'bg-blue-50/50 dark:bg-primary/5 border-blue-200 dark:border-primary/30' 
    : 'bg-gray-50/50 dark:bg-black/20 border-transparent hover:bg-gray-100 dark:hover:bg-white/5'
  }`}>
    <div className="flex flex-col">
      <span className={`font-semibold ${checked ? 'text-primary dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}`}>
        {label}
      </span>
      <span className="text-xs text-slate-400 dark:text-gray-500 font-mono">{sublabel}</span>
    </div>
    <div className={`w-12 h-7 rounded-full transition-colors relative ${checked ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}>
        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${
            checked ? 'left-6' : 'left-1'
        }`}></div>
    </div>
  </label>
);

export default Generator;