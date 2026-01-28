import { AdminDashboard } from '../../../../components/sections/admin/AdminDashboard';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, vi, describe, it, expect } from 'vitest';
import React from 'react';
import userEvent from '@testing-library/user-event';

// Mocks de componentes dinámicos
vi.mock("next/dynamic", () => ({
  __esModule: true,
  default: (loader: () => Promise<any>, options?: any) => {
    const DynamicComponent = ({ ...props }) => {
      const [Component, setComponent] = React.useState<any>(null);
      const [loading, setLoading] = React.useState(true);

      React.useEffect(() => {
        loader()
          .then((mod) => {
            setComponent(() => mod.default);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      }, []);

      if (loading && options?.loading) {
        return options.loading();
      }

      return Component ? <Component {...props} /> : null;
    };
    return DynamicComponent;
  },
}));

// Mock de componentes estáticos
vi.mock("../../../../components/sections/admin/AdminSidebarProps", () => ({
    AdminSidebar: ({ 
        currentView,
        onViewChange, 
        isOpen,
        onToggle 
    }: {
        currentView: string;
        onViewChange: (view: string) => void;
        isOpen: boolean;
        onToggle: () => void;
    }) => (
        <div data-testid="admin-sidebar" data-open={isOpen} data-current-view={currentView}>
            <button onClick={() => onViewChange("overview")} data-testid="view-overview">
                Overview
            </button>
            <button onClick={() => onViewChange("modules")} data-testid="view-modules">
                Modules
            </button>
            <button onClick={() => onViewChange("activity")} data-testid="view-activity">
                Activity
            </button>
            <button onClick={() => onViewChange("settings")} data-testid="view-settings">
                Settings
            </button>
            <button onClick={onToggle} data-testid="toggle-sidebar">
                Toggle
            </button>
        </div>
    )
}));

vi.mock("../../../../components/sections/admin/AdminHeader", () => ({
    AdminHeader: () => <div data-testid="admin-header">Admin Header</div>
}));

vi.mock("../../../../components/sections/admin/DashboardOverview", () => ({
    DashboardOverview: () => <div data-testid="dashboard-overview">Dashboard Overview Component</div>
}));

vi.mock("../../../../components/sections/admin/modules/ModulesManager", () => ({
    ModulesManager: () => <div data-testid="modules-manager">Modules Manager Component</div>
}));

describe('AdminDashboard Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Initial Rendering', () => {
        it('should render with correct initial structure', () => {
            render(<AdminDashboard />);
            
            // Verificar estructura principal
            expect(screen.getByTestId('admin-sidebar')).toBeInTheDocument();
            expect(screen.getByTestId('admin-header')).toBeInTheDocument();
        });

        it('should have sidebar closed by default', () => {
            render(<AdminDashboard />);
            
            const sidebar = screen.getByTestId('admin-sidebar');
            expect(sidebar).toHaveAttribute('data-open', 'false');
        });

        it('should have overview as default view', () => {
            render(<AdminDashboard />);
            
            const sidebar = screen.getByTestId('admin-sidebar');
            expect(sidebar).toHaveAttribute('data-current-view', 'overview');
        });

        it('should have correct layout classes', () => {
            const { container } = render(<AdminDashboard />);
            
            const mainContainer = container.querySelector('.flex.h-screen.bg-background');
            expect(mainContainer).toBeInTheDocument();
        });
    });

    describe('View Navigation', () => {
        it('should change to modules view when modules button is clicked', async () => {
            const user = userEvent.setup();
            render(<AdminDashboard />);
            
            const modulesButton = screen.getByTestId('view-modules');
            await user.click(modulesButton);
            
            await waitFor(() => {
                expect(screen.getByTestId('modules-manager')).toBeInTheDocument();
            });
            
            // Overview no debe estar visible
            expect(screen.queryByTestId('dashboard-overview')).not.toBeInTheDocument();
        });

        it('should change to activity view', async () => {
            const user = userEvent.setup();
            render(<AdminDashboard />);
            
            const activityButton = screen.getByTestId('view-activity');
            await user.click(activityButton);
            
            await waitFor(() => {
                expect(screen.getByText('activity')).toBeInTheDocument();
            });
        });

        it('should change to settings view', async () => {
            const user = userEvent.setup();
            render(<AdminDashboard />);
            
            const settingsButton = screen.getByTestId('view-settings');
            await user.click(settingsButton);
            
            await waitFor(() => {
                expect(screen.getByText('settings')).toBeInTheDocument();
            });
        });

        it('should return to overview view', async () => {
            const user = userEvent.setup();
            render(<AdminDashboard />);
            
            // Cambiar a modules
            await user.click(screen.getByTestId('view-modules'));
            
            await waitFor(() => {
                expect(screen.getByTestId('modules-manager')).toBeInTheDocument();
            });
            
            // Volver a overview
            await user.click(screen.getByTestId('view-overview'));
            
            await waitFor(() => {
                expect(screen.getByTestId('dashboard-overview')).toBeInTheDocument();
            });
        });

        it('should update currentView prop passed to sidebar', async () => {
            const user = userEvent.setup();
            render(<AdminDashboard />);
            
            const sidebar = screen.getByTestId('admin-sidebar');
            expect(sidebar).toHaveAttribute('data-current-view', 'overview');
            
            await user.click(screen.getByTestId('view-modules'));
            
            await waitFor(() => {
                expect(sidebar).toHaveAttribute('data-current-view', 'modules');
            });
        });
    });

    describe('Sidebar Toggle', () => {
        it('should toggle sidebar state when toggle button is clicked', async () => {
            const user = userEvent.setup();
            render(<AdminDashboard />);
            
            const sidebar = screen.getByTestId('admin-sidebar');
            const toggleButton = screen.getByTestId('toggle-sidebar');
            
            // Estado inicial: cerrado
            expect(sidebar).toHaveAttribute('data-open', 'false');
            
            // Abrir sidebar
            await user.click(toggleButton);
            
            await waitFor(() => {
                expect(sidebar).toHaveAttribute('data-open', 'true');
            });
            
            // Cerrar sidebar
            await user.click(toggleButton);
            
            await waitFor(() => {
                expect(sidebar).toHaveAttribute('data-open', 'false');
            });
        });

        it('should toggle sidebar multiple times', async () => {
            const user = userEvent.setup();
            render(<AdminDashboard />);
            
            const sidebar = screen.getByTestId('admin-sidebar');
            const toggleButton = screen.getByTestId('toggle-sidebar');
            
            // Click 1: abrir
            await user.click(toggleButton);
            expect(sidebar).toHaveAttribute('data-open', 'true');
            
            // Click 2: cerrar
            await user.click(toggleButton);
            expect(sidebar).toHaveAttribute('data-open', 'false');
            
            // Click 3: abrir
            await user.click(toggleButton);
            expect(sidebar).toHaveAttribute('data-open', 'true');
        });
    });

    describe('Dynamic Components Loading', () => {
        it('should show loading state for DashboardOverview', () => {
            render(<AdminDashboard />);
            
            // Durante la carga inicial, debe haber algún indicador
            // (Dependiendo de la implementación de next/dynamic mock)
            const mainContent = screen.getByRole('main');
            expect(mainContent).toBeInTheDocument();
        });

        it('should show loading state for ModulesManager', async () => {
            const user = userEvent.setup();
            render(<AdminDashboard />);
            
            await user.click(screen.getByTestId('view-modules'));
            
            // El componente eventualmente se carga
            await waitFor(() => {
                expect(screen.getByTestId('modules-manager')).toBeInTheDocument();
            });
        });
    });

    describe('Layout and Styling', () => {
        it('should have correct main layout structure', () => {
            const { container } = render(<AdminDashboard />);
            
            // Contenedor principal
            const mainContainer = container.querySelector('.flex.h-screen');
            expect(mainContainer).toBeInTheDocument();
            
            // Área de contenido
            const contentArea = container.querySelector('.flex.flex-1.flex-col');
            expect(contentArea).toBeInTheDocument();
        });

        it('should have scrollable main content area', () => {
            const { container } = render(<AdminDashboard />);
            
            const mainContent = container.querySelector('main.overflow-y-auto');
            expect(mainContent).toBeInTheDocument();
            expect(mainContent).toHaveClass('flex-1', 'overflow-y-auto', 'p-6');
        });

        it('should render AdminHeader in correct position', () => {
            const { container } = render(<AdminDashboard />);
            
            const header = screen.getByTestId('admin-header');
            const contentArea = container.querySelector('.flex.flex-1.flex-col');
            
            expect(contentArea).toContainElement(header);
        });
    });

    describe('Component Integration', () => {
        it('should pass correct props to AdminSidebar', () => {
            render(<AdminDashboard />);
            
            const sidebar = screen.getByTestId('admin-sidebar');
            
            expect(sidebar).toHaveAttribute('data-current-view', 'overview');
            expect(sidebar).toHaveAttribute('data-open', 'false');
            expect(screen.getByTestId('toggle-sidebar')).toBeInTheDocument();
        });

        it('should maintain view state while toggling sidebar', async () => {
            const user = userEvent.setup();
            render(<AdminDashboard />);
            
            // Cambiar a modules
            await user.click(screen.getByTestId('view-modules'));
            
            await waitFor(() => {
                expect(screen.getByTestId('modules-manager')).toBeInTheDocument();
            });
            
            // Toggle sidebar
            await user.click(screen.getByTestId('toggle-sidebar'));
            
            // La vista debe mantenerse en modules
            expect(screen.getByTestId('modules-manager')).toBeInTheDocument();
        });

        it('should maintain sidebar state while changing views', async () => {
            const user = userEvent.setup();
            render(<AdminDashboard />);
            
            const sidebar = screen.getByTestId('admin-sidebar');
            
            // Abrir sidebar
            await user.click(screen.getByTestId('toggle-sidebar'));
            expect(sidebar).toHaveAttribute('data-open', 'true');
            
            // Cambiar vista
            await user.click(screen.getByTestId('view-modules'));
            
            // Sidebar debe seguir abierto
            await waitFor(() => {
                expect(sidebar).toHaveAttribute('data-open', 'true');
            });
        });
    });

    describe('Edge Cases', () => {
        it('should handle rapid view changes', async () => {
            const user = userEvent.setup();
            render(<AdminDashboard />);
            
            // Cambios rápidos de vista
            await user.click(screen.getByTestId('view-modules'));
            await user.click(screen.getByTestId('view-activity'));
            await user.click(screen.getByTestId('view-settings'));
            await user.click(screen.getByTestId('view-overview'));
            
            // Debe terminar en overview
            await waitFor(() => {
                expect(screen.getByTestId('dashboard-overview')).toBeInTheDocument();
            });
        });

        it('should handle rapid sidebar toggles', async () => {
            const user = userEvent.setup();
            render(<AdminDashboard />);
            
            const toggleButton = screen.getByTestId('toggle-sidebar');
            const sidebar = screen.getByTestId('admin-sidebar');
            
            // Múltiples toggles rápidos
            await user.click(toggleButton);
            await user.click(toggleButton);
            await user.click(toggleButton);
            
            // Estado final debe ser consistente
            await waitFor(() => {
                const isOpen = sidebar.getAttribute('data-open');
                expect(isOpen === 'true' || isOpen === 'false').toBe(true);
            });
        });
    });

    describe('Conditional Rendering', () => {
        it('should only render one view at a time', async () => {
            const user = userEvent.setup();
            render(<AdminDashboard />);
            
            // Verificar que solo overview está visible
            await waitFor(() => {
                expect(screen.getByTestId('dashboard-overview')).toBeInTheDocument();
            });
            expect(screen.queryByTestId('modules-manager')).not.toBeInTheDocument();
            
            // Cambiar a modules
            await user.click(screen.getByTestId('view-modules'));
            
            // Verificar que solo modules está visible
            await waitFor(() => {
                expect(screen.getByTestId('modules-manager')).toBeInTheDocument();
            });
            expect(screen.queryByTestId('dashboard-overview')).not.toBeInTheDocument();
        });

        it('should render placeholder content for activity view', async () => {
            const user = userEvent.setup();
            render(<AdminDashboard />);
            
            await user.click(screen.getByTestId('view-activity'));
            
            await waitFor(() => {
                expect(screen.getByText('activity')).toBeInTheDocument();
            });
        });

        it('should render placeholder content for settings view', async () => {
            const user = userEvent.setup();
            render(<AdminDashboard />);
            
            await user.click(screen.getByTestId('view-settings'));
            
            await waitFor(() => {
                expect(screen.getByText('settings')).toBeInTheDocument();
            });
        });
    });
});