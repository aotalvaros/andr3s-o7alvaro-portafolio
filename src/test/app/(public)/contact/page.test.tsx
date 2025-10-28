import ContactPage from "@/app/(public)/contact/page";
import { useMaintenance } from "@/components/maintenance/hooks/useMaintenance";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/components/contact/ContactForm", () => ({
    ContactForm: () => <div data-testid="contact-form">Contact Form</div>,
}));

vi.mock("@/components/maintenance/hooks/useMaintenance");
vi.mock("@/components/maintenance/ModuleInMaintenance", () => ({
    __esModule: true,
    default: ({ moduleName }: { moduleName: string }) => (
        <div data-testid="maintenance-module">Módulo en mantenimiento: {moduleName}</div>
    ),
}));

const mockUseMaintenance = vi.mocked(useMaintenance);

describe("Test ContactPage Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("Should render ContactForm when not in maintenance", () => {
        mockUseMaintenance.mockReturnValue({ isInMaintenance: false, isAplicationInMaintenance: false, maintenanceData: undefined, isLoading: true });
        render(<ContactPage />);
        expect(screen.getByTestId("contact-form")).toBeInTheDocument();
    });

    it("Should show ModuleInMaintenance when in maintenance", () => {
        mockUseMaintenance.mockReturnValue({ isInMaintenance: true, isAplicationInMaintenance: true, maintenanceData: undefined, isLoading: true });
        render(<ContactPage />);
        expect(screen.getByTestId("maintenance-module")).toHaveTextContent("Módulo en mantenimiento: contacto");
    });
});