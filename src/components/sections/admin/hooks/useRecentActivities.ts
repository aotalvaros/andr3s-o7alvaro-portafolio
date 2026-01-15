import { useMemo } from 'react';
import { useBlockedModules } from './useBlockedModules';
import { formattedDate } from '@/utils/formattedDate';
import { RecentActivity } from '../types/dashboard.types';

export function useRecentActivities(limit: number = 3) {
  const { modules } = useBlockedModules();

  return useMemo((): RecentActivity[] => {
    if (!modules) return [];

    const sortedModules = [...modules].sort((a, b) => 
      new Date(b.lastModifiedAt).getTime() - new Date(a.lastModifiedAt).getTime()
    );

    return sortedModules.slice(0, limit).map(module => ({
      module: module.name,
      lastModifiedBy: module.lastModifiedBy.name,
      time: formattedDate(module.lastModifiedAt, { includeTime: false }),
      isBlocked: module.isBlocked
    }));
  }, [modules, limit]);
}
