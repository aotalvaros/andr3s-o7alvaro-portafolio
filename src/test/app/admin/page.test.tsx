import AdminPage from "@/app/admin/page";
import { afterEach, beforeEach, vi, describe, it, expect } from 'vitest';
import { render, screen } from "@testing-library/react";
import { AdminDashboard } from '@/components/sections/admin/AdminDashboard';

vi.mock('@/components/sections/admin/AdminDashboard', () => {
    return {
        AdminDashboard: vi.fn(() => <div>Mocked AdminDashboard</div>)
    }
});

describe("Test AdminPage component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should render AdminDashboard component", () => {
        render(<AdminPage />);
        expect(AdminDashboard).toHaveBeenCalled();
        expect(screen.getByText("Mocked AdminDashboard")).toBeInTheDocument();
    });
    
    
})