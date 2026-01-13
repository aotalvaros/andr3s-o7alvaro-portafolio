import { AdminSidebar } from '@/components/sections/admin/AdminSidebarProps';
import { afterEach, beforeEach, vi, describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from "@testing-library/react";
import { logout } from "@/components/auth/logout";
import { AdminView } from '@/components/sections/admin/types/adminDashboard.type';


vi.mock("@/components/sections/admin/BlockedModules", () => ({
    BlockedModules: () => <div data-testid="blocked-modules">Bienvenido al panel de administración</div>,
}));

vi.mock("@/components/auth/logout");

describe("Test AdminSidebar component", () => {

    const mockOnViewChange = vi.fn()
    const mockOnToggle = vi.fn()
    const mockLogout = vi.fn()

    const defaultProps = {
        currentView: 'overview' as AdminView,
        onViewChange: mockOnViewChange,
        isOpen: true,
        onToggle: mockOnToggle,
    }

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(logout).mockImplementation(mockLogout);
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('Rendering', () => {
        it('should render sidebar with all menu items', () => {
        render(<AdminSidebar {...defaultProps} />)

        expect(screen.getByTestId('admin-sidebar')).toBeInTheDocument()
        expect(screen.getByTestId('sidebar-header')).toBeInTheDocument()
        expect(screen.getByTestId('sidebar-button-overview')).toBeInTheDocument()
        expect(screen.getByTestId('sidebar-button-modules')).toBeInTheDocument()
        expect(screen.getByTestId('sidebar-button-activity')).toBeInTheDocument()
        expect(screen.getByTestId('sidebar-button-settings')).toBeInTheDocument()
        expect(screen.getByTestId('logout-button')).toBeInTheDocument()
        })

        it('should render header title when sidebar is open', () => {
        render(<AdminSidebar {...defaultProps} isOpen={true} />)

        expect(screen.getByText('Panel de Admin')).toBeInTheDocument()
        })

        it('should not render header title when sidebar is closed', () => {
        render(<AdminSidebar {...defaultProps} isOpen={false} />)

        expect(screen.queryByText('Panel de Admin')).not.toBeInTheDocument()
        })

        it('should render all menu item labels when open', () => {
        render(<AdminSidebar {...defaultProps} isOpen={true} />)

        expect(screen.getByText('Dashboard')).toBeInTheDocument()
        expect(screen.getByText('Módulos')).toBeInTheDocument()
        expect(screen.getByText('Actividad')).toBeInTheDocument()
        expect(screen.getByText('Configuración')).toBeInTheDocument()
        expect(screen.getByText('Cerrar sesión')).toBeInTheDocument()
        })

        it('should not render menu item labels when closed', () => {
        render(<AdminSidebar {...defaultProps} isOpen={false} />)

        expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
        expect(screen.queryByText('Módulos')).not.toBeInTheDocument()
        expect(screen.queryByText('Actividad')).not.toBeInTheDocument()
        expect(screen.queryByText('Configuración')).not.toBeInTheDocument()
        expect(screen.queryByText('Cerrar sesión')).not.toBeInTheDocument()
        })

        it('should render toggle button', () => {
        render(<AdminSidebar {...defaultProps} />)

        expect(screen.getByTestId('toggle-sidebar-button')).toBeInTheDocument()
        })

        it('should render logout button', () => {
        render(<AdminSidebar {...defaultProps} />)

        expect(screen.getByTestId('logout-button')).toBeInTheDocument()
        })
    });

    describe('Active state', () => {
        it('should highlight overview button when currentView is overview', () => {
        render(<AdminSidebar {...defaultProps} currentView="overview" />)

        const overviewButton = screen.getByTestId('sidebar-button-overview')
        expect(overviewButton).toHaveClass('bg-secondary')
        })

        it('should highlight modules button when currentView is modules', () => {
        render(<AdminSidebar {...defaultProps} currentView="modules" />)

        const modulesButton = screen.getByTestId('sidebar-button-modules')
        expect(modulesButton).toHaveClass('bg-secondary')
        })

        it('should highlight activity button when currentView is activity', () => {
        render(<AdminSidebar {...defaultProps} currentView="activity" />)

        const activityButton = screen.getByTestId('sidebar-button-activity')
        expect(activityButton).toHaveClass('bg-secondary')
        })

        it('should highlight settings button when currentView is settings', () => {
        render(<AdminSidebar {...defaultProps} currentView="settings" />)

        const settingsButton = screen.getByTestId('sidebar-button-settings')
        expect(settingsButton).toHaveClass('bg-secondary')
        })

        it('should only highlight one button at a time', () => {
        render(<AdminSidebar {...defaultProps} currentView="modules" />)

        const overviewButton = screen.getByTestId('sidebar-button-overview')
        const modulesButton = screen.getByTestId('sidebar-button-modules')
        const activityButton = screen.getByTestId('sidebar-button-activity')
        const settingsButton = screen.getByTestId('sidebar-button-settings')

        expect(overviewButton).not.toHaveClass('bg-secondary')
        expect(modulesButton).toHaveClass('bg-secondary')
        expect(activityButton).not.toHaveClass('bg-secondary')
        expect(settingsButton).not.toHaveClass('bg-secondary')
        })
    })

    describe('Navigation', () => {
        it('should call onViewChange with "overview" when Dashboard is clicked', () => {
        render(<AdminSidebar {...defaultProps} />)

        const overviewButton = screen.getByTestId('sidebar-button-overview')
        fireEvent.click(overviewButton)

        expect(mockOnViewChange).toHaveBeenCalledWith('overview')
        expect(mockOnViewChange).toHaveBeenCalledTimes(1)
        })

        it('should call onViewChange with "modules" when Módulos is clicked', () => {
        render(<AdminSidebar {...defaultProps} />)

        const modulesButton = screen.getByTestId('sidebar-button-modules')
        fireEvent.click(modulesButton)

        expect(mockOnViewChange).toHaveBeenCalledWith('modules')
        expect(mockOnViewChange).toHaveBeenCalledTimes(1)
        })

        it('should call onViewChange with "activity" when Actividad is clicked', () => {
        render(<AdminSidebar {...defaultProps} />)

        const activityButton = screen.getByTestId('sidebar-button-activity')
        fireEvent.click(activityButton)

        expect(mockOnViewChange).toHaveBeenCalledWith('activity')
        expect(mockOnViewChange).toHaveBeenCalledTimes(1)
        })

        it('should call onViewChange with "settings" when Configuración is clicked', () => {
        render(<AdminSidebar {...defaultProps} />)

        const settingsButton = screen.getByTestId('sidebar-button-settings')
        fireEvent.click(settingsButton)

        expect(mockOnViewChange).toHaveBeenCalledWith('settings')
        expect(mockOnViewChange).toHaveBeenCalledTimes(1)
        })

        it('should allow clicking on currently active view', () => {
        render(<AdminSidebar {...defaultProps} currentView="overview" />)

        const overviewButton = screen.getByTestId('sidebar-button-overview')
        fireEvent.click(overviewButton)

        expect(mockOnViewChange).toHaveBeenCalledWith('overview')
        })

        it('should handle multiple navigation clicks', () => {
        render(<AdminSidebar {...defaultProps} />)

        const overviewButton = screen.getByTestId('sidebar-button-overview')
        const modulesButton = screen.getByTestId('sidebar-button-modules')
        const activityButton = screen.getByTestId('sidebar-button-activity')

        fireEvent.click(overviewButton)
        fireEvent.click(modulesButton)
        fireEvent.click(activityButton)

        expect(mockOnViewChange).toHaveBeenCalledTimes(3)
        expect(mockOnViewChange).toHaveBeenNthCalledWith(1, 'overview')
        expect(mockOnViewChange).toHaveBeenNthCalledWith(2, 'modules')
        expect(mockOnViewChange).toHaveBeenNthCalledWith(3, 'activity')
        })
    })

    describe('Toggle functionality', () => {
        it('should call onToggle when toggle button is clicked', () => {
        render(<AdminSidebar {...defaultProps} />)

        const toggleButton = screen.getByTestId('toggle-sidebar-button')
        fireEvent.click(toggleButton)

        expect(mockOnToggle).toHaveBeenCalledTimes(1)
        })

        it('should call onToggle multiple times for multiple clicks', () => {
        render(<AdminSidebar {...defaultProps} />)

        const toggleButton = screen.getByTestId('toggle-sidebar-button')
        
        fireEvent.click(toggleButton)
        fireEvent.click(toggleButton)
        fireEvent.click(toggleButton)

        expect(mockOnToggle).toHaveBeenCalledTimes(3)
        })

        it('should apply correct width class when open', () => {
        render(<AdminSidebar {...defaultProps} isOpen={true} />)

        const sidebar = screen.getByTestId('admin-sidebar')
        expect(sidebar).toHaveClass('w-64')
        })

        it('should apply correct width class when closed', () => {
        render(<AdminSidebar {...defaultProps} isOpen={false} />)

        const sidebar = screen.getByTestId('admin-sidebar')
        expect(sidebar).toHaveClass('w-20')
        })

        it('should rotate chevron icon when closed', () => {
        const { container } = render(<AdminSidebar {...defaultProps} isOpen={false} />)

        const chevron = container.querySelector('.rotate-180')
        expect(chevron).toBeInTheDocument()
        })

        it('should not rotate chevron icon when open', () => {
        const { container } = render(<AdminSidebar {...defaultProps} isOpen={true} />)

        const chevron = container.querySelector('.rotate-180')
        expect(chevron).not.toBeInTheDocument()
        })
    })

    describe('Logout functionality', () => {
        it('should call logout when logout button is clicked', () => {
        render(<AdminSidebar {...defaultProps} />)

        const logoutButton = screen.getByTestId('logout-button')
        fireEvent.click(logoutButton)

        expect(mockLogout).toHaveBeenCalledTimes(1)
        })

        it('should not call onViewChange when logout is clicked', () => {
        render(<AdminSidebar {...defaultProps} />)

        const logoutButton = screen.getByTestId('logout-button')
        fireEvent.click(logoutButton)

        expect(mockOnViewChange).not.toHaveBeenCalled()
        expect(mockLogout).toHaveBeenCalledTimes(1)
        })

        it('should handle multiple logout clicks', () => {
        render(<AdminSidebar {...defaultProps} />)

        const logoutButton = screen.getByTestId('logout-button')
        
        fireEvent.click(logoutButton)
        fireEvent.click(logoutButton)

        expect(mockLogout).toHaveBeenCalledTimes(2)
        })
    })

    describe('Styling and CSS classes', () => {
        it('should apply base classes to sidebar', () => {
        render(<AdminSidebar {...defaultProps} />)

        const sidebar = screen.getByTestId('admin-sidebar')
        expect(sidebar).toHaveClass('relative', 'flex', 'h-full', 'flex-col')
        })

        it('should apply transition class for smooth animation', () => {
        render(<AdminSidebar {...defaultProps} />)

        const sidebar = screen.getByTestId('admin-sidebar')
        expect(sidebar).toHaveClass('transition-all', 'duration-300')
        })

        it('should apply destructive color to logout button', () => {
        render(<AdminSidebar {...defaultProps} />)

        const logoutButton = screen.getByTestId('logout-button')
        expect(logoutButton).toHaveClass('text-destructive')
        })

        it('should center buttons when sidebar is closed', () => {
        render(<AdminSidebar {...defaultProps} isOpen={false} />)

        const overviewButton = screen.getByTestId('sidebar-button-overview')
        expect(overviewButton).toHaveClass('justify-center')
        })

        it('should left-align buttons when sidebar is open', () => {
        render(<AdminSidebar {...defaultProps} isOpen={true} />)

        const overviewButton = screen.getByTestId('sidebar-button-overview')
        expect(overviewButton).toHaveClass('justify-start')
        })
    })

    describe('Accessibility', () => {
        it('should have proper testids for all interactive elements', () => {
        render(<AdminSidebar {...defaultProps} />)

        expect(screen.getByTestId('admin-sidebar')).toBeInTheDocument()
        expect(screen.getByTestId('sidebar-header')).toBeInTheDocument()
        expect(screen.getByTestId('toggle-sidebar-button')).toBeInTheDocument()
        expect(screen.getByTestId('sidebar-button-overview')).toBeInTheDocument()
        expect(screen.getByTestId('sidebar-button-modules')).toBeInTheDocument()
        expect(screen.getByTestId('sidebar-button-activity')).toBeInTheDocument()
        expect(screen.getByTestId('sidebar-button-settings')).toBeInTheDocument()
        expect(screen.getByTestId('logout-button')).toBeInTheDocument()
        })

        it('should render all buttons as clickable elements', () => {
        render(<AdminSidebar {...defaultProps} />)

        const allButtons = screen.getAllByRole('button')
        expect(allButtons.length).toBeGreaterThanOrEqual(6) // 4 menu + 1 toggle + 1 logout
        })

        it('should have icons in all menu items', () => {
        const { container } = render(<AdminSidebar {...defaultProps} isOpen={true} />)

        const icons = container.querySelectorAll('svg')
        expect(icons.length).toBeGreaterThanOrEqual(5) // 4 menu icons + 1 chevron + 1 logout
        })
    })

    describe('Edge cases', () => {
        it('should handle rapid toggle clicks', () => {
        render(<AdminSidebar {...defaultProps} />)

        const toggleButton = screen.getByTestId('toggle-sidebar-button')
        
        for (let i = 0; i < 10; i++) {
            fireEvent.click(toggleButton)
        }

        expect(mockOnToggle).toHaveBeenCalledTimes(10)
        })

        it('should handle rapid navigation clicks', () => {
        render(<AdminSidebar {...defaultProps} />)

        const buttons = [
            screen.getByTestId('sidebar-button-overview'),
            screen.getByTestId('sidebar-button-modules'),
            screen.getByTestId('sidebar-button-activity'),
            screen.getByTestId('sidebar-button-settings'),
        ]

        buttons.forEach(button => {
            fireEvent.click(button)
            fireEvent.click(button)
        })

        expect(mockOnViewChange).toHaveBeenCalledTimes(8)
        })

        it('should work when starting with closed state', () => {
        render(<AdminSidebar {...defaultProps} isOpen={false} />)

        const modulesButton = screen.getByTestId('sidebar-button-modules')
        fireEvent.click(modulesButton)

        expect(mockOnViewChange).toHaveBeenCalledWith('modules')
        })

        it('should maintain functionality across state changes', () => {
        const { rerender } = render(<AdminSidebar {...defaultProps} isOpen={true} />)

        const overviewButton = screen.getByTestId('sidebar-button-overview')
        fireEvent.click(overviewButton)

        expect(mockOnViewChange).toHaveBeenCalledWith('overview')

        rerender(<AdminSidebar {...defaultProps} isOpen={false} />)

        fireEvent.click(overviewButton)

        expect(mockOnViewChange).toHaveBeenCalledTimes(2)
        })

        it('should handle all views being changed sequentially', () => {
        render(<AdminSidebar {...defaultProps} />)

        const views: AdminView[] = ['overview', 'modules', 'activity', 'settings']

        views.forEach(view => {
            const button = screen.getByTestId(`sidebar-button-${view}`)
            fireEvent.click(button)
        })

        expect(mockOnViewChange).toHaveBeenCalledTimes(4)
        views.forEach((view, index) => {
            expect(mockOnViewChange).toHaveBeenNthCalledWith(index + 1, view)
        })
        })
    })

    describe('Props validation', () => {
        it('should accept and render with all valid AdminView types', () => {
        const views: AdminView[] = ['overview', 'modules', 'activity', 'settings']

        views.forEach(view => {
            const { unmount } = render(
            <AdminSidebar {...defaultProps} currentView={view} />
            )

            const activeButton = screen.getByTestId(`sidebar-button-${view}`)
            expect(activeButton).toHaveClass('bg-secondary')

            unmount()
        })
        })

        it('should work with different callback functions', () => {
        const customOnViewChange = vi.fn()
        const customOnToggle = vi.fn()

        render(
            <AdminSidebar
            {...defaultProps}
            onViewChange={customOnViewChange}
            onToggle={customOnToggle}
            />
        )

        fireEvent.click(screen.getByTestId('sidebar-button-modules'))
        fireEvent.click(screen.getByTestId('toggle-sidebar-button'))

        expect(customOnViewChange).toHaveBeenCalled()
        expect(customOnToggle).toHaveBeenCalled()
        })

        it('should render correctly with isOpen true', () => {
        render(<AdminSidebar {...defaultProps} isOpen={true} />)

        expect(screen.getByTestId('admin-sidebar')).toHaveClass('w-64')
        expect(screen.getByText('Panel de Admin')).toBeInTheDocument()
        })

        it('should render correctly with isOpen false', () => {
        render(<AdminSidebar {...defaultProps} isOpen={false} />)

        expect(screen.getByTestId('admin-sidebar')).toHaveClass('w-20')
        expect(screen.queryByText('Panel de Admin')).not.toBeInTheDocument()
        })
    })

    describe('Integration scenarios', () => {
        it('should handle complete user flow: navigate, toggle, navigate again', () => {
        render(<AdminSidebar {...defaultProps} />)

        // Navigate to modules
        fireEvent.click(screen.getByTestId('sidebar-button-modules'))
        expect(mockOnViewChange).toHaveBeenCalledWith('modules')

        // Toggle sidebar
        fireEvent.click(screen.getByTestId('toggle-sidebar-button'))
        expect(mockOnToggle).toHaveBeenCalled()

        // Navigate to activity
        fireEvent.click(screen.getByTestId('sidebar-button-activity'))
        expect(mockOnViewChange).toHaveBeenCalledWith('activity')

        expect(mockOnViewChange).toHaveBeenCalledTimes(2)
        expect(mockOnToggle).toHaveBeenCalledTimes(1)
        })

        it('should handle navigation and logout flow', () => {
        render(<AdminSidebar {...defaultProps} />)

        // Navigate through menu
        fireEvent.click(screen.getByTestId('sidebar-button-modules'))
        fireEvent.click(screen.getByTestId('sidebar-button-settings'))

        // Logout
        fireEvent.click(screen.getByTestId('logout-button'))

        expect(mockOnViewChange).toHaveBeenCalledTimes(2)
        expect(mockLogout).toHaveBeenCalledTimes(1)
        })

        it('should maintain state after multiple interactions', () => {
        render(<AdminSidebar {...defaultProps} currentView="overview" />)

        // Multiple toggles
        fireEvent.click(screen.getByTestId('toggle-sidebar-button'))
        fireEvent.click(screen.getByTestId('toggle-sidebar-button'))

        // Multiple navigations
        fireEvent.click(screen.getByTestId('sidebar-button-modules'))
        fireEvent.click(screen.getByTestId('sidebar-button-activity'))

        expect(mockOnToggle).toHaveBeenCalledTimes(2)
        expect(mockOnViewChange).toHaveBeenCalledTimes(2)
        })
    });
});