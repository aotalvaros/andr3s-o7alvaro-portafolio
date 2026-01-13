import { AdminSidebar } from './AdminSidebarProps';
import { useState } from 'react';
import { AdminView } from './types/adminDashboard.type';
import { AdminHeader } from './AdminHeader';
export function AdminDashboard() {
    const [currentView, setCurrentView] = useState<AdminView>("overview")
    const [sidebarOpen, setSidebarOpen] = useState(true)

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
                {currentView === "overview" && <div>overview</div>}
                {currentView === "modules" && <div>modules</div>}
                {currentView === "activity" && <div>activity</div>}
                {currentView === "settings" && <div>settings</div>}
            </main>
        </div>
    </div>
   )
}