'use client'

import { getMaintenanceStatus } from "@/services/maintenance/maintenace.service";
import { useQuery } from "@tanstack/react-query";

export const useGetStatusMaintenance = () => {

    const { data: maintenanceData } = useQuery({
        queryKey: ['maintenanceStatus'],
        queryFn: getMaintenanceStatus,
        staleTime: 1000 * 60 * 5, // 5 min
        refetchOnWindowFocus: false,
    });
    
    const isInMaintenance = maintenanceData?.data.some((module) => module.isActive) || false;

    return {
        isInMaintenance,
        maintenanceData
    };
}
