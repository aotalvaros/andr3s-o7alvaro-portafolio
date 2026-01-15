import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStat } from '../types/dashboard.types';

interface StatCardProps {
  stat: DashboardStat;
}

export function StatCard({ stat }: Readonly<StatCardProps>) {
  const Icon = stat.icon;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
        <Icon className={`h-4 w-4 ${stat.color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stat.value}</div>
        <p className="text-xs text-muted-foreground">{stat.description}</p>
      </CardContent>
    </Card>
  );
}
