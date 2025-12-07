import React from 'react';

const Help: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto w-full animate-fade-in pb-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">Ayuda y Acerca de</h2>
        <p className="text-slate-500 dark:text-gray-400">Información sobre cómo utilizar la aplicación.</p>
      </div>

      <section className="bg-white dark:bg-surface rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6 md:p-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">¿Qué es Password GEN?</h3>
        <p className="text-slate-600 dark:text-gray-300 mb-4 leading-relaxed">
          Password GEN es un generador de contraseñas diseñado específicamente para hispanohablantes que utilizan teclados QWERTY estándar.
        </p>
        <p className="text-slate-600 dark:text-gray-300 leading-relaxed">
          A diferencia de los generadores aleatorios tradicionales, nuestro algoritmo de <strong>"Escritura Fácil"</strong> alterna entre las teclas de la mano izquierda y derecha, y prioriza la fila central del teclado. Esto genera contraseñas que son matemáticamente complejas pero que fluyen naturalmente al escribirlas.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Consejos de Seguridad</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoCard 
            icon="key" 
            title="Únicas" 
            desc="Nunca reutilices la misma contraseña para cuentas importantes como email o bancos." 
          />
           <InfoCard 
            icon="password" 
            title="Longitud" 
            desc="La longitud es más importante que la complejidad. Recomendamos mínimo 16 caracteres." 
          />
           <InfoCard 
            icon="update" 
            title="Rotación" 
            desc="Cambia tus contraseñas periódicamente, especialmente si sospechas de una filtración." 
          />
           <InfoCard 
            icon="lock" 
            title="2FA" 
            desc="Activa siempre la autenticación de dos factores cuando esté disponible." 
          />
        </div>
      </section>

      <section className="text-center mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
        <div className="flex justify-center mb-4">
           <div className="bg-primary/20 p-4 rounded-2xl text-primary">
              <span className="material-symbols-outlined text-4xl">lock_open</span>
           </div>
        </div>
        <h4 className="text-lg font-bold text-slate-900 dark:text-white">Password GEN</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Versión 1.2.0 (Web/PWA)</p>
        <div className="flex justify-center gap-4 text-sm font-medium text-primary">
          <a href="#" className="hover:underline">GitHub</a>
          <a href="#" className="hover:underline">Privacidad</a>
          <a href="#" className="hover:underline">Licencia</a>
        </div>
      </section>
    </div>
  );
};

const InfoCard: React.FC<{ icon: string; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-white dark:bg-surface p-5 rounded-xl border border-gray-200 dark:border-gray-700/50 flex gap-4 items-start">
    <div className="bg-blue-50 dark:bg-primary/10 text-primary p-2 rounded-lg shrink-0">
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <div>
      <h4 className="font-bold text-slate-900 dark:text-white mb-1">{title}</h4>
      <p className="text-sm text-slate-500 dark:text-gray-400 leading-snug">{desc}</p>
    </div>
  </div>
);

export default Help;