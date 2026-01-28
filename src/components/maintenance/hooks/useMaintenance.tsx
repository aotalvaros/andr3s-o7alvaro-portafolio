'use client'
import { paths } from '@/constants/path.constants';
import { SocketContext } from '@/context/SocketContext';
import { usePathname } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { useGetStatusMaintenance } from './useGetStatusMaintenance';
import { responseModuleData } from '@/services/maintenance/models/maintenaceResponseStatus.interface';
import { useLoadingStore } from '@/store/loadingStore';

export const useMaintenance = () => {
  const pathname = usePathname();
  const { socket } = useContext(SocketContext);
  const [isInMaintenance, setIsInMaintenance] = useState(false);
  const [isAplicationInMaintenance, setIsAplicationInMaintenance] = useState(false);
  const setLoading = useLoadingStore((state) => state.setLoading);

  const { 
    data: maintenanceData, 
    isLoading: isInitialLoading, 
    isFetched,
    isError,
    error,
    refetch
  } = useGetStatusMaintenance();

  useEffect(() => {
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  
  useEffect(() => {
    
    if ( maintenanceData) {
      const currentPath = paths(pathname);
      setIsInMaintenance(Boolean(
        maintenanceData.status === 'error' ||
        maintenanceData.data.find((m: responseModuleData) => m.moduleName === currentPath)?.isBlocked 
      ));
      setIsAplicationInMaintenance(Boolean(
        maintenanceData.data.find((m: responseModuleData) => m.moduleName === 'allAplications')?.isBlocked
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
        
        refetch();
    });

    return () => {
      socket?.off('init-module-status', handler);
      socket?.off('update-module');
    };
  }, [socket, pathname, maintenanceData]);

 return { 
    isInMaintenance, 
    isAplicationInMaintenance, 
    maintenanceData, 
    isFetched, // Solo true hasta el primer fetch (éxito o error)
    isInitialLoading, // El estado original de React Query
    isError,
    error
  };
};