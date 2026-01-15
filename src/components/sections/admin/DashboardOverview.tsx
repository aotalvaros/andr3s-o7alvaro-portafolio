"use client"

import { useSocketContext } from '@/context/SocketContext';
import { useDashboardStats } from './hooks/useDashboardStats';
import { useRecentActivities } from './hooks/useRecentActivities';
import { DashboardHeader } from './components/DashboardHeader';
import { StatCard } from './components/StatCard';
import { RecentActivityCard } from './components/RecentActivityCard';
import { SystemStatusCard } from './components/SystemStatusCard';

export function DashboardOverview() {
  const { online: isSocketOnline } = useSocketContext();
  const statsData = useDashboardStats();
  const recentActivities = useRecentActivities(3);

  return (
    <div className="space-y-6">
      <DashboardHeader />

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <RecentActivityCard activities={recentActivities} />
        <SystemStatusCard isSocketOnline={isSocketOnline} />
      </section>
    </div>
  );
}