'use client'

import { getMaintenanceStatus } from "@/services/maintenance/maintenace.service";
import { useQuery } from "@tanstack/react-query";

export const useGetStatusMaintenance = () => {

    const maintenanceData = useQuery({
        queryKey: ['maintenanceStatus'],
        queryFn: getMaintenanceStatus,
        staleTime: 1000 * 60 * 5, // 5 min
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
            if (failureCount >= 3) return false;
            if (error?.response?.status >= 400 && error?.response?.status < 500) return false;
            return true;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // ✅ Configurar comportamiento en caso de error
        throwOnError: false, // No lanzar errores, manejarlos gracefully
    });

    const isInMaintenance = maintenanceData?.data?.data.some((module) => module.isActive) || false;

    return {
        isInMaintenance,
        ...maintenanceData
    };
}
