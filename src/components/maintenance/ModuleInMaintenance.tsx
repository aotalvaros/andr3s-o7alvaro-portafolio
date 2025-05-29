// src/components/ModuleInMaintenance.tsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ModuleInMaintenanceProps {
  moduleName?: string;
  message?: string;
}

const ModuleInMaintenance: React.FC<ModuleInMaintenanceProps> = ({
  moduleName,
  message = 'Este módulo está actualmente en mantenimiento. Por favor, vuelve más tarde.',
}) => {
  return (
    <main className="min-h-screen flex items-center justify-center  px-4 py-10">
      <div className="shadow-lg rounded-2xl p-8 text-center max-w-md w-full dark:shadow-white/10 border border-yellow-500">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-12 h-12 text-yellow-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2 dark:text-white">
          {moduleName ? `Módulo "${moduleName}" en mantenimiento` : 'Estamos en mantenimiento'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </main>
  );
};

export default ModuleInMaintenance;
