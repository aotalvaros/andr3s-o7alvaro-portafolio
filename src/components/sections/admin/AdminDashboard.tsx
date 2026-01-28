import { AdminSidebar } from './AdminSidebarProps';
import { useState } from 'react';
import { AdminView } from './types/adminDashboard.type';
import { AdminHeader } from './AdminHeader';
import dynamic from "next/dynamic"

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

export function AdminDashboard() {
  const [currentView, setCurrentView] = useState<AdminView>("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return(
    <div className="flex h-screen bg-background">
      <AdminSidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-6">
          {currentView === "overview" && <DashboardOverview />}
          {currentView === "modules" && <ModulesManager />}
          {currentView === "activity" && <div>activity</div>}
          {currentView === "settings" && <div>settings</div>}
        </main>
      </div>
    </div>
  )
}