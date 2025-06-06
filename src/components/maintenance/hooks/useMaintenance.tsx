'use client'
import { paths } from '@/constants/path.constants';
import { SocketContext } from '@/context/SocketContext';
import { usePathname } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { useGetStatusMaintenance } from './useGetStatusMaintenance';
import { MaintenanceResponseStatus } from '@/services/maintenance/models/maintenaceResponseStatus.interface';

export const useMaintenance = () => {
  const pathname = usePathname();
  const { socket } = useContext(SocketContext);
  const [isInMaintenance, setIsInMaintenance] = useState(false);
  const [isAplicationInMaintenance, setIsAplicationInMaintenance] = useState(false);

  const { maintenanceData } = useGetStatusMaintenance();
  
  useEffect(() => {
    
    if ( maintenanceData) {
      const currentPath = paths(pathname);
      setIsInMaintenance(Boolean(
        maintenanceData.find((m: MaintenanceResponseStatus) => m.moduleName === currentPath)?.isActive
      ));
      setIsAplicationInMaintenance(Boolean(
        maintenanceData.find((m: MaintenanceResponseStatus) => m.moduleName === 'allAplications')?.isActive
      ));
    }

    const handler = (data: Record<string, boolean>) => {
      const currentPath = paths(pathname);
      setIsInMaintenance(Boolean(data[currentPath]));
      setIsAplicationInMaintenance(Boolean(data['allAplications']));
    };

    socket?.on('init-module-status', handler);

    socket?.on('update-module', (data: { moduleName: string, status: boolean }) => {
        const currentPath = paths(pathname);
        if (data.moduleName === currentPath) {
          setIsInMaintenance(data.status);
        }

        if (data.moduleName === 'allAplications') {
          setIsAplicationInMaintenance(data.status);
        }
    });


    return () => {
      socket?.off('init-module-status', handler);
      socket?.off('update-module');
    };
  }, [socket, pathname, maintenanceData]);

  return { isInMaintenance, isAplicationInMaintenance, maintenanceData};
};