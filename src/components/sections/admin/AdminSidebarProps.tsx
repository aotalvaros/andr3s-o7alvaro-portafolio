"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, Blocks, Activity, Settings, ChevronLeft, LogOut } from "lucide-react"
import { AdminView } from './types/adminDashboard.type';
import { logout } from '@/components/auth/logout';

interface AdminSidebarProps {
  currentView: string
  onViewChange: (view: AdminView) => void
  isOpen: boolean
  onToggle: () => void
}

const menuItems: { id: AdminView; label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }[] = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "modules", label: "Módulos", icon: Blocks },
  { id: "activity", label: "Actividad", icon: Activity },
  { id: "settings", label: "Configuración", icon: Settings },
]

export function AdminSidebar({ currentView, onViewChange, isOpen, onToggle }: Readonly<AdminSidebarProps>) {
  return (
    <aside
        className={cn(
            "relative flex h-full flex-col border-r bg-muted transition-all duration-300",
            isOpen ? "w-64" : "w-20",
        )}
        data-testid="admin-sidebar"
    >
        <div className="flex h-16 items-center justify-between border-b px-4" data-testid="sidebar-header">
            {isOpen && <h2 className="text-lg font-semibold">Panel de Admin</h2>}
            <Button variant="ghost" size="icon" onClick={onToggle} className="ml-auto" data-testid="toggle-sidebar-button">
                <ChevronLeft className={cn("h-5 w-5 transition-transform", !isOpen && "rotate-180")} />
            </Button>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-2">
            {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = currentView === item.id

                return (
                <Button
                    key={item.id}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn("w-full justify-start", !isOpen && "justify-center px-2")}
                    onClick={() => onViewChange(item.id)}
                    data-testid={`sidebar-button-${item.id}`}
                >
                    <Icon className={cn("h-5 w-5", isOpen && "mr-3")} />
                    {isOpen && <span>{item.label}</span>}
                </Button>
                )
            })}
            </nav>
        </ScrollArea>

        <div className="border-t p-3">
            <Button
                variant="ghost"
                className={cn(
                    "w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive",
                    !isOpen && "justify-center px-2",
                )}
                onClick={() => logout()}
                data-testid="logout-button"
            >
            <LogOut className={cn("h-5 w-5", isOpen && "mr-3")} />
                {isOpen && <span>Cerrar sesión</span>}
            </Button>
        </div>
    </aside>
  )
}
