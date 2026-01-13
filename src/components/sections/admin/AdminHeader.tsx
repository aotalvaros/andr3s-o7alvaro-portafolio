import { Badge } from '@/components/ui/badge';
import { Bell, Wifi, WifiOff } from "lucide-react"
import { Button } from '@/components/ui/button';
import { useSocketContext } from '@/context/SocketContext';
import { StatusIndicator } from '../../layout/navbar/components/StatusIndicator';

export function AdminHeader() {
    const { online: isSocketOnline } = useSocketContext();

    return (
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
        <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Panel de Administración</h1>
            <Badge variant={isSocketOnline ? "default" : "secondary"} className={` ${isSocketOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} gap-1 hover:bg-opacity-80 transition-colors`}>
                {isSocketOnline ? (
                    <>
                    <Wifi className="h-3 w-3" />
                        Socket conectado
                    </>
                ) : (
                   <>
                    <WifiOff className="h-3 w-3" />
                        Desconectado
                   </>
                )}
            </Badge>
             <StatusIndicator online={isSocketOnline} isTextVisible={false} />
        </div>

        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative" disabled data-testid="notifications-button">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </Button>
        </div>
        </header>
    )
}
