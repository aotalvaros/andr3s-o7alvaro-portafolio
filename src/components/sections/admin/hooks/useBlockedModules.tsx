import { useMaintenance } from '@/components/maintenance/hooks/useMaintenance';
import { usePostToggleModule } from '@/components/maintenance/hooks/usePostToggleModule';
import { SocketContext } from '@/context/SocketContext';
import { MaintenanceResponseStatus } from '@/services/maintenance/models/maintenaceResponseStatus.interface';
import { useToastMessageStore } from '@/store/ToastMessageStore';
import{  useContext, useEffect, useState } from 'react'

export const useBlockedModules = () => {
  
    const { socket } = useContext(SocketContext);
    const { maintenanceData } = useMaintenance();
    const { mutateAsync: toggleModule } = usePostToggleModule();
     const { setParams } = useToastMessageStore((state) => state)
    const [modules, setModules] = useState<MaintenanceResponseStatus[] | undefined>([]);

    useEffect(() => {
        if (maintenanceData) {
            setModules(maintenanceData);
        }
    }, [maintenanceData]);

    const updateModuleStatus = (
        prevModules: MaintenanceResponseStatus[] | undefined,
        data: { moduleName: string; status: boolean }
    ): MaintenanceResponseStatus[] | undefined => {
        if (!prevModules) return prevModules;
        return prevModules.map((module) =>
            module.moduleName === data.moduleName ? { ...module, isActive: data.status } : module
        );
    };

    useEffect(() => {
        const handleUpdateModule = (data: { moduleName: string; status: boolean }) => {
            setModules((prevModules) => updateModuleStatus(prevModules, data));
        };

        socket?.on('update-module', handleUpdateModule);

        return () => {
            socket?.off('update-module', handleUpdateModule);
        };
    }, [socket, maintenanceData]);

    const handleToggleModule = async(moduleName: string, status: boolean) => {
     const response = await toggleModule({ moduleName, status });
        if (response.message) {
            setParams({
                message: "¡Éxito!",
                description: `El módulo ${moduleName} ha sido ${status ? 'bloqueado' : 'habilitado'}.`,
                typeMessage: "info",
                show: true,
            });
        }
    }

    return {
        modules,
        handleToggleModule
    }
}
