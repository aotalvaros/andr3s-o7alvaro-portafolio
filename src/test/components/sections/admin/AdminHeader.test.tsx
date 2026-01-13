import { AdminHeader } from '@/components/sections/admin/AdminHeader';
import { render, screen } from '@testing-library/react';
import { useSocketContext } from "@/context/SocketContext";
import { Socket } from "socket.io-client";

vi.mock("@/context/SocketContext");

describe("AdminHeader Component", () => {
     beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useSocketContext).mockReturnValue({ online: true, socket: { emit: vi.fn() } as unknown as Socket });
    });

    it("should render AdminHeader with socket online", () => {
        render(<AdminHeader />);
        expect(screen.getByText("Panel de Administración")).toBeInTheDocument();
        expect(screen.getByText("Socket conectado")).toBeInTheDocument();
        expect(screen.getByTestId("notifications-button")).toBeInTheDocument();
    });

    it("should render AdminHeader with socket offline", () => {
        vi.mocked(useSocketContext).mockReturnValue({ online: false, socket: { emit: vi.fn() } as unknown as Socket });
        render(<AdminHeader />);
        expect(screen.getByText("Panel de Administración")).toBeInTheDocument();
        expect(screen.getByText("Desconectado")).toBeInTheDocument();
        expect(screen.getByTestId("notifications-button")).toBeInTheDocument();
    });

});