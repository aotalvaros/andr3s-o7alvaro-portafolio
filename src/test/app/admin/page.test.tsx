import AdminPage from "@/app/admin/page";
import { afterEach, beforeEach, vi, describe, it, expect } from 'vitest';
import { render, screen } from "@testing-library/react";
import { useSocketContext } from "@/context/SocketContext";
import { logout } from "@/components/auth/logout";
import { Socket } from "socket.io-client";

const mockLogout = vi.fn();

vi.mock("@/components/sections/admin/BlockedModules", () => ({
    BlockedModules: () => <div data-testid="blocked-modules">Bienvenido al panel de administración</div>,
}));

vi.mock("@/components/auth/logout");
vi.mock("@/context/SocketContext");

describe("Test AdminPage component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useSocketContext).mockReturnValue({ online: true, socket: { emit: vi.fn() } as unknown as Socket });
        vi .mocked(logout).mockImplementation(mockLogout);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("renders admin status as online", () => {
        render(<AdminPage />);
        expect(screen.getByTestId('admin-status')).toHaveTextContent('Online');
    });

    it("renders admin status as offline", () => {
        vi.mocked(useSocketContext).mockReturnValue({ online: false, socket: { emit: vi.fn() } as unknown as Socket });
        render(<AdminPage />);
        expect(screen.getByTestId('admin-status')).toHaveTextContent('Offline');
    });

    it("calls logout function when logout button is clicked", () => {
        render(<AdminPage />);
        const logoutButton = screen.getByTestId('logout-button');
        logoutButton.click();
        expect(mockLogout).toHaveBeenCalled();
    });

    it("renders BlockedModules component", () => {
        render(<AdminPage />);
        expect(screen.queryAllByText('Bienvenido al panel de administración')[0]).toBeInTheDocument();
    });
})