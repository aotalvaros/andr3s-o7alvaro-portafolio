import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface SystemStatusCardProps {
  isSocketOnline: boolean;
}

export function SystemStatusCard({ isSocketOnline }: Readonly<SystemStatusCardProps>) {
  return (
    <Card className='bg-muted/60'>
      <CardHeader>
        <CardTitle>Estado del Sistema</CardTitle>
        <CardDescription>Rendimiento y disponibilidad</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Socket.IO</span>
            <Badge variant="default" className={isSocketOnline ? 'bg-green-500' : 'bg-red-500'}>
              {isSocketOnline ? 'Conectado' : 'Desconectado'}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Servidor</span>
            <Badge variant="default"  className="bg-gray-400">
              ¡Pronto!
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Base de datos</span>
            <Badge variant="default" className=" bg-gray-400">
              ¡Pronto!
            </Badge>
          </div>
         
        </div>
      </CardContent>
    </Card>
  );
}
