import { useMaintenance } from "@/components/maintenance/hooks/useMaintenance";
import { usePostToggleModule } from "@/components/maintenance/hooks/usePostToggleModule";
import { SocketContext } from "@/context/SocketContext";
import { responseModuleData } from "@/services/maintenance/models/maintenaceResponseStatus.interface";
import { useToastMessageStore } from "@/store/ToastMessageStore";
import { useContext, useEffect, useState } from "react";

export function useBlockedModules() {
    const { socket } = useContext(SocketContext);
    const { maintenanceData } = useMaintenance();
    const { mutateAsync: toggleModule, isPending } = usePostToggleModule();
    const { setParams } = useToastMessageStore((state) => state);
    const [modules, setModules] = useState<responseModuleData[] | undefined>([]);

    useEffect(() => {
        if (maintenanceData) {
            setModules(maintenanceData.data);
        }
    }, [maintenanceData]);

    const updateModuleStatus = (
        prevModules: responseModuleData[] | undefined,
        data: { moduleName: string; status: boolean },
    ): responseModuleData[] | undefined => {
        if (!prevModules) return prevModules;
        return prevModules.map((module) =>
            module.moduleName === data.moduleName
                ? { ...module, isBlocked: data.status }
                : module,
            );
    };
    const handleUpdateModule = (data: {
        moduleName: string;
        status: boolean;
    }) => {
        setModules((prevModules) => updateModuleStatus(prevModules, data));
    };

    useEffect(() => {
        socket?.on("update-module", handleUpdateModule);

        return () => {
            socket?.off("update-module", handleUpdateModule);
        };
    }, [socket, maintenanceData]);

    const handleToggleModule = async (moduleName: string, status: boolean) => {
        await toggleModule({ moduleName, status })
            .then((res) => {
                setParams({
                    message: "¡Éxito!",
                    description: `El módulo ${moduleName} ha sido ${status ? "bloqueado" : "habilitado"}.`,
                    typeMessage: "info",
                    show: true,
                });
            })
            .catch((err) => {
                setParams({
                    message: "Error",
                    description: `No se pudo actualizar el módulo ${moduleName}.`,
                    typeMessage: "error",
                    show: true,
                });
                console.error("Error toggling module:", err);
            });
    };

    return {
        modules,
        handleToggleModule,
        isPending
    };
};
