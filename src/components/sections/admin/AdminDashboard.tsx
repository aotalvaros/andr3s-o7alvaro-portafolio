import { AdminSidebar } from './AdminSidebarProps';
import { useState } from 'react';
import { AdminView } from './types/adminDashboard.type';
import { AdminHeader } from './AdminHeader';
import { DashboardOverview } from './DashboardOverview';
import { BlockedModules } from './BlockedModules';
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
                {currentView === "modules" && <BlockedModules />}
                {currentView === "activity" && <div>activity</div>}
                {currentView === "settings" && <div>settings</div>}
            </main>
        </div>
    </div>
   )
}