import { LucideIcon } from 'lucide-react';

export interface DashboardStat {
  title: string;
  description: string;
  value: string | number;
  color: string;
  icon: LucideIcon;
}

export interface RecentActivity {
  module: string;
  lastModifiedBy: string;
  time: string;
  isBlocked: boolean;
}

export interface SystemStatus {
  name: string;
  status: 'operational' | 'down';
}
