import { AdminSidebar } from './AdminSidebarProps';
import { useEffect, useState } from 'react';
import { AdminView } from './types/adminDashboard.type';
import { AdminHeader } from './AdminHeader';
import dynamic from "next/dynamic"
import { useAuth } from '@/hooks/useAuth';
import { canAccessAdminView, getDefaultAdminView } from './access/adminAccess';

const DashboardOverview = dynamic(
  () => import("./DashboardOverview").then((m) => ({ default: m.DashboardOverview })),
  {
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    ),
  },
)

const ModulesManager = dynamic(() => import("./modules/ModulesManager").then((m) => ({ default: m.ModulesManager })), {
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  ),
})

const UserProfile = dynamic(() => import("./profile/UserProfile").then((m) => ({ default: m.UserProfile })), {
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  ),
})

export function AdminDashboard() {
  const { user } = useAuth();
  const passwordChangeRequired = user?.mustChangePassword === true;
  const [currentView, setCurrentView] = useState<AdminView>(() => getDefaultAdminView(user));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (passwordChangeRequired) {
      setCurrentView('profile');
      return;
    }

    setCurrentView((previousView) => {
      if (previousView === 'profile') {
        return getDefaultAdminView(user);
      }

      return previousView;
    });
  }, [passwordChangeRequired, user]);

  const handleViewChange = (nextView: AdminView) => {
    if (passwordChangeRequired && !canAccessAdminView(user, nextView)) {
      setCurrentView('profile');
      return;
    }

    setCurrentView(nextView);
  };

  const effectiveCurrentView = passwordChangeRequired ? 'profile' : currentView;

  return(
    <div className="flex h-full bg-background">
      <AdminSidebar
        currentView={effectiveCurrentView}
        onViewChange={handleViewChange}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        passwordChangeRequired={passwordChangeRequired}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-6">
          {effectiveCurrentView === "profile" && <UserProfile />}
          {!passwordChangeRequired && effectiveCurrentView === "overview" && <DashboardOverview />}
          {!passwordChangeRequired && effectiveCurrentView === "modules" && <ModulesManager />}
          {!passwordChangeRequired && effectiveCurrentView === "activity" && <div>activity</div>}
          {!passwordChangeRequired && effectiveCurrentView === "settings" && <div>settings</div>}
        </main>
      </div>
    </div>
  )
}