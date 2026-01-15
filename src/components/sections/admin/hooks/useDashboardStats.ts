import { useMemo } from 'react';
import { Activity, Eye, EyeOff, Zap } from 'lucide-react';
import { useBlockedModules } from './useBlockedModules';
import { DashboardStat } from '../types/dashboard.types';

export function useDashboardStats() {
  const { modules } = useBlockedModules();

  return useMemo((): DashboardStat[] => {
    const activeModules = modules?.filter(module => !module.isBlocked).length || 0;
    const blockedModules = modules?.filter(module => module.isBlocked).length || 0;
    const totalModules = modules?.length || 0;

    return [
      {
        title: "Módulos Activos",
        description: `De ${totalModules} totales`,
        value: activeModules,
        icon: Zap,
        color: "text-green-500",
      },
      {
        title: "Módulos Bloqueados",
        description: "No visibles",
        value: blockedModules,
        icon: EyeOff,
        color: "text-red-500",
      },
      {
        title: "Visitas Hoy",
        value: "-",
        description: "¡Pronto! en desarrollo",
        icon: Eye,
        color: "text-blue-500",
      },
      {
        title: "Actividad Reciente",
        value: "-",
        description: "¡Pronto! en desarrollo",
        icon: Activity,
        color: "text-purple-500",
      },
    ];
  }, [modules]);
}
