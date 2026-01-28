import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RecentActivity } from '../types/dashboard.types';

interface RecentActivityCardProps {
  activities: RecentActivity[];
}

export function RecentActivityCard({ activities }: Readonly<RecentActivityCardProps>) {
  return (
    <Card className='bg-muted/60'>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
        <CardDescription>Últimos cambios en el sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((item, i) => (
            <div key={item.module + i} className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">
                Módulo <span className="font-semibold text-foreground">{item.module}</span>{' '}
                esta {item.isBlocked ? 'bloqueado' : 'activo'}
              </p>
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
