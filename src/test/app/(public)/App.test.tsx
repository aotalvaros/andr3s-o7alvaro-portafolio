import { App } from "@/app/(public)/App";
import { useMaintenance } from "@/components/maintenance/hooks/useMaintenance";
import { useThemeStore } from "@/store/themeStore";
import { describe, it, expect, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";


vi.mock("@/components/maintenance/hooks/useMaintenance")
vi.mock("@/store/themeStore");

vi.mock("next/dynamic", () => ({
    default: () => {
        const Comp = () => <div data-testid="maintenance-module">Mantenimiento</div>;
        return Comp;
    },
}));

vi.mock("@/components/maintenance/ModuleInMaintenance", () => ({
    ModuleInMaintenance: ({ message }: { message: string }) => (
        <div data-testid="maintenance-module">{message}</div>
    ),
}));

vi.mock("@/app/LoaderOverlay", () => ({
    LoaderOverlay: () => <div data-testid="loader-overlay">Cargando...</div>,
}));

vi.mock("@/components/ui/FloatingActionButton", () => ({
    FloatingActionButton: ({ onClick, className, icon }: { onClick: () => void; className?: string; icon: React.ReactNode }) => (
        <button data-testid="theme-toggle-button" onClick={onClick} className={className}>
            {icon}
        </button>
    ),
}));

vi.mock("@/components/layout/navbar.components", () => ({
    Navbar: () => <nav data-testid="navbar">Navbar</nav>,
}));

const mockUseMaintenance = vi.mocked(useMaintenance);
const mockUseThemeStore = vi.mocked(useThemeStore);

describe("Test App Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("Should show the maintenance module if isApplicationInMaintenance is true.", () => {
        mockUseMaintenance.mockReturnValue({ isAplicationInMaintenance: true, isInMaintenance: true, maintenanceData:[] });
        render(<App>contenido</App>);
        expect(screen.getByTestId("maintenance-module")).toBeInTheDocument();
        expect(screen.queryByText("contenido")).not.toBeInTheDocument();
    });

    it("Should render LoaderOverlay, Navbar, FloatingActionButton and children if not in maintenance.", () => {
        mockUseMaintenance.mockReturnValue({ isAplicationInMaintenance: false, isInMaintenance: true, maintenanceData:[]  });
        mockUseThemeStore.mockImplementation((fn) =>
            fn({ isDarkMode: false, toggleTheme: vi.fn() })
        );
        render(<App>contenido</App>);
        expect(screen.getByText(/contenido/)).toBeInTheDocument();
        expect(screen.getByText(/todos los derechos reservados/i)).toBeInTheDocument();
        expect(screen.getByText(/portafolio en construcción/i)).toBeInTheDocument();
        expect(screen.getByTestId("theme-toggle-button")).toBeInTheDocument();
    });

    it("Should show the icon ☀️ if isDarkMode is true.", () => {
        mockUseMaintenance.mockReturnValue({ isAplicationInMaintenance: false, isInMaintenance: true, maintenanceData:[]  });
        mockUseThemeStore.mockImplementation((fn) =>
            fn({ isDarkMode: true, toggleTheme: vi.fn() })
        );
        render(<App>contenido</App>);
        expect(screen.getByTestId("theme-toggle-button")).toHaveTextContent("☀️");
    });

    it("Should show the icon ☀️ if isDarkMode is false.", () => {
        mockUseMaintenance.mockReturnValue({ isAplicationInMaintenance: false, isInMaintenance: true, maintenanceData:[]  });
        mockUseThemeStore.mockImplementation((fn) =>
            fn({ isDarkMode: false, toggleTheme: vi.fn() })
        );
        render(<App>contenido</App>);
        expect(screen.getByTestId("theme-toggle-button")).toHaveTextContent("🌙");
    });

    it("Should call toggleTheme when you click on the FloatingActionButton.", () => {
        const toggleTheme = vi.fn();
        mockUseMaintenance.mockReturnValue({ isAplicationInMaintenance: false, isInMaintenance: true, maintenanceData:[]  });
        mockUseThemeStore.mockImplementation((fn) =>
            fn({ isDarkMode: false, toggleTheme })
        );
        render(<App>contenido</App>);
        const button = screen.getByTestId("theme-toggle-button");
        fireEvent.click(button);
        expect(toggleTheme).toHaveBeenCalled();
    });

    it("Should render correctly the footer with the expected texts.", () => {
        mockUseMaintenance.mockReturnValue({ isAplicationInMaintenance: false, isInMaintenance: true, maintenanceData:[]  });
        mockUseThemeStore.mockImplementation((fn) =>
            fn({ isDarkMode: false, toggleTheme: vi.fn() })
        );
        render(<App>contenido</App>);
        expect(screen.getByText(/desarrollado por andrés otalvaro/i)).toBeInTheDocument();
        expect(screen.getByText(/portafolio en construcción/i)).toBeInTheDocument();
    });
});