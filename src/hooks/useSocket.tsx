import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

export const useSocket = (serverPath: string) => {
    
    const socket = useMemo( () => {
        return io(serverPath, {
            transports: ['websocket'],
        });
    }, [serverPath]);

    const [ online, setOnline ] = useState(false);
     
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const handleConnect = () => {
            setOnline(true);
        };

        const handleDisconnect = () => {
            setOnline(false);
        };

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);

        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
        };
    }, [socket]);

    return {
        socket,
        online,
    }

  
}