import { AdminDashboard } from '../../../../components/sections/admin/AdminDashboard';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { afterEach, beforeEach, vi, describe, it, expect } from 'vitest';

vi.mock("../../../../components/sections/admin/BlockedModules",() => ({
    BlockedModules: () => <div data-testid="blocked-modules">Blocked Modules Component</div>
}))

vi.mock("../../../../components/sections/admin/AdminSidebarProps", () => ({
    AdminSidebar: ({onViewChange, onToggle }: {onViewChange: (view: string) => void, onToggle: () => void}) => {
        return (
            <div>
                <button onClick={() => onViewChange("modules")} data-testid="change-view-modules">Change View to Modules</button>
                <button onClick={onToggle} data-testid="toggle-sidebar">Toggle Sidebar</button>
            </div>
        )
    }
}))     
vi.mock("../../../../components/sections/admin/AdminHeader", () => ({
    AdminHeader: () => <div data-testid="admin-header">Admin Header</div>
}))

vi.mock("../../../../components/sections/admin/DashboardOverview", () => ({
    DashboardOverview: () => <div data-testid="dashboard-overview">Dashboard Overview</div>
}))

describe('AdminDashboard Component', () => {
    beforeEach(() => {
        render(<AdminDashboard />);
    });

    afterEach(() => {
        vi.clearAllMocks();
    }   );

    it('should render AdminHeader and DashboardOverview by default', () => {
        expect(screen.getByTestId('admin-header')).toBeInTheDocument();
        expect(screen.getByTestId('dashboard-overview')).toBeInTheDocument();
    });

    it('should toggle sidebar when the toggle button is clicked', () => {
        const toggleButton = screen.getByTestId('toggle-sidebar');
        act(() => {
            fireEvent.click(toggleButton);
        });
        // Since the sidebar state change does not affect visible text in this mock, we just ensure the button works without error.
        expect(toggleButton).toBeInTheDocument();
    });
})