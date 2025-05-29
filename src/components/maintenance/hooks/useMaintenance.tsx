'use client'
import { paths } from '@/constants/path.constants';
import { SocketContext } from '@/context/SocketContext';
import { usePathname } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

export const useMaintenance = () => {
  const pathname = usePathname();
  const { socket } = useContext(SocketContext);
  const [isInMaintenance, setIsInMaintenance] = useState(false);
  const [isAplicationInMaintenance, setIsAplicationInMaintenance] = useState(false);

  useEffect(() => {

    const handler = (data: Record<string, boolean>) => {
      const currentPath = paths(pathname);
      setIsInMaintenance(Boolean(data[currentPath]));
      setIsAplicationInMaintenance(Boolean(data['allAplications']));
    };

    socket?.on('init-module-status', handler);
    return () => {
      socket?.off('init-module-status');
    };
  }, [socket, pathname]);

  return { isInMaintenance, isAplicationInMaintenance};
};