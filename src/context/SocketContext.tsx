'use client';
import { createContext, useContext } from 'react';
import type { Socket } from 'socket.io-client';
import { useSocket } from '@/hooks/useSocket';

interface SocketContextType {
  socket: Socket | null;
  online: boolean;
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  online: false,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { socket, online } = useSocket(process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:4000');

  return (
    <SocketContext.Provider value={{ socket, online }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
