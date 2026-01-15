'use client'

import { getMaintenanceStatus } from "@/services/maintenance/maintenace.service";
import { useQuery } from "@tanstack/react-query";
import { getSecureRandomInRange } from '@/utils/randomValues';

export const useGetStatusMaintenance = () => {

    const maintenanceData = useQuery({
        queryKey: ['maintenanceStatus'],
        queryFn: getMaintenanceStatus,
        staleTime: 1000 * 60 * 5, // 5 min
        refetchOnWindowFocus: false,
        retry: 3, // Máximo 3 reintentos
        retryDelay: (attemptIndex) => {
            const base = 1000 * 2 ** attemptIndex;
            const jitter = getSecureRandomInRange(0, 1000);
            return Math.min(base + jitter, 30000);
        },
        refetchOnMount: false,
        refetchOnReconnect: true,
        // ✅ Configurar comportamiento en caso de error
        throwOnError: false, // No lanzar errores, manejarlos gracefully
        networkMode: 'online', // Solo hacer peticiones cuando hay conexión
    });

    const isInMaintenance = maintenanceData?.data?.data.some((module) => module.isBlocked) || false;

    return {
        isInMaintenance,
        ...maintenanceData
    };
}
