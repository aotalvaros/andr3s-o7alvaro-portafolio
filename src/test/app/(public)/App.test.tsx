import { App } from "@/app/(public)/App";
import { useMaintenance } from "@/components/maintenance/hooks/useMaintenance";
import { useThemeStore } from "@/store/themeStore";
import { describe, it, expect, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

// ✅ Remover useFirstVisit ya que no se usa en el componente actual
// vi.mock("@/hooks/useFirstVisit");

vi.mock("@/components/maintenance/hooks/useMaintenance");
vi.mock("@/store/themeStore");

vi.mock("@/app/LoaderOverlay", () => ({
    LoaderOverlay: () => <div data-testid="loader-overlay">Cargando...</div>,
}));

vi.mock("@/components/ui/FloatingActionButton", () => ({
    FloatingActionButton: ({ 
        onClick, 
        className, 
        icon,
        ...props 
    }: { 
        onClick: () => void; 
        className?: string; 
        icon: React.ReactNode 
    }) => (
        <button 
            data-testid="theme-toggle-button" 
            onClick={onClick} 
            className={className}
            {...props}
        >
            {icon}
        </button>
    ),
}));

vi.mock("@/components/layout/navbar/navbar.components", () => ({
    Navbar: () => <nav data-testid="navbar">Navbar</nav>,
}));

vi.mock("@/components/ui/spaceLoading", () => ({
    SpaceLoading: ({ isLoading }: { isLoading?: boolean }) => (
        <div data-testid="space-loading" data-loading={isLoading}>
            Space Loading
        </div>
    ),
}));

vi.mock("@/components/ui/BackToTop", () => ({
    BackToTop: () => <div data-testid="back-to-top">Back to Top</div>,
}));

const mockUseMaintenance = vi.mocked(useMaintenance);
const mockUseThemeStore = vi.mocked(useThemeStore);

describe("App Component", () => {

    beforeEach(() => {
        vi.clearAllMocks();
        
        // ✅ Setup default mocks
        mockUseThemeStore.mockImplementation((selector) =>
            selector({ isDarkMode: false, toggleTheme: vi.fn() })
        );
        
        mockUseMaintenance.mockReturnValue({
            isAplicationInMaintenance: false,
            isInMaintenance: false,
            maintenanceData: undefined,
            isFetched: true,
            isInitialLoading: false,
            isError: false,
            error: null
        });
    });

    describe("Loading States", () => {
        it("Should render SpaceLoading when isFetched is false", () => {
            mockUseMaintenance.mockReturnValue({
                isAplicationInMaintenance: false,
                isInMaintenance: false,
                maintenanceData: undefined,
                isFetched: false,
                isInitialLoading: true,
                isError: false,
                error: null
            });

            render(<App>contenido</App>);
            
            expect(screen.getByTestId("space-loading")).toBeInTheDocument();
            expect(screen.queryByText("contenido")).not.toBeInTheDocument();
            expect(screen.queryByTestId("navbar")).not.toBeInTheDocument();
        });

        it("Should pass correct props to SpaceLoading", () => {
            mockUseMaintenance.mockReturnValue({
                isAplicationInMaintenance: false,
                isInMaintenance: false,
                maintenanceData: undefined,
                isFetched: false,
                isInitialLoading: true,
                isError: false,
                error: null
            });

            render(<App>contenido</App>);
            
            const spaceLoading = screen.getByTestId("space-loading");
            expect(spaceLoading).toHaveAttribute("data-loading", "true");
        });
    });

    describe("Maintenance States", () => {
        it("Should show maintenance module when isAplicationInMaintenance is true", () => {
            mockUseMaintenance.mockReturnValue({
                isAplicationInMaintenance: true,
                isInMaintenance: false,
                maintenanceData: undefined,
                isFetched: true,
                isInitialLoading: false,
                isError: false,
                error: null
            });

            render(<App>contenido</App>);
            
         
            expect(screen.getByText(/Cargando.../i)).toBeInTheDocument();
            expect(screen.queryByText("contenido")).not.toBeInTheDocument();
            expect(screen.queryByTestId("navbar")).not.toBeInTheDocument();
        });

        it("Should not show maintenance when isInMaintenance is true but isAplicationInMaintenance is false", () => {
            mockUseMaintenance.mockReturnValue({
                isAplicationInMaintenance: false,
                isInMaintenance: true,
                maintenanceData: undefined,
                isFetched: true,
                isInitialLoading: false,
                isError: false,
                error: null
            });

            render(<App>contenido</App>);
            
            expect(screen.getByText("contenido")).toBeInTheDocument();
        });
    });

    describe("Normal Rendering", () => {
        beforeEach(() => {
            mockUseMaintenance.mockReturnValue({
                isAplicationInMaintenance: false,
                isInMaintenance: false,
                maintenanceData: undefined,
                isFetched: true,
                isInitialLoading: false,
                isError: false,
                error: null
            });
        });

        it("Should render all main components when not in maintenance or loading", () => {
            render(<App>contenido</App>);
            
            expect(screen.getByTestId("loader-overlay")).toBeInTheDocument();
            expect(screen.getByTestId("navbar")).toBeInTheDocument();
            expect(screen.getByTestId("theme-toggle-button")).toBeInTheDocument();
            expect(screen.getByText("contenido")).toBeInTheDocument();
            expect(screen.getByTestId("back-to-top")).toBeInTheDocument();
        });

        it("Should render footer with correct content", () => {
            render(<App>contenido</App>);
            
            const currentYear = new Date().getFullYear();
            expect(screen.getByText(new RegExp(`© ${currentYear}.*Todos los derechos reservados`, "i"))).toBeInTheDocument();
            expect(screen.getByText(/desarrollado por andrés otalvaro/i)).toBeInTheDocument();
            expect(screen.getByText(/portafolio en construcción/i)).toBeInTheDocument();
            expect(screen.getByText("andr3s.o7alvaro@gmail.com")).toBeInTheDocument();
        });

        it("Should render footer with current year dynamically", () => {
            render(<App>contenido</App>);
            
            const currentYear = new Date().getFullYear();
            expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
        });
    });

    describe("Theme Toggle Functionality", () => {
        it("Should show moon icon when isDarkMode is false", () => {
            mockUseThemeStore.mockImplementation((selector) =>
                selector({ isDarkMode: false, toggleTheme: vi.fn() })
            );

            
            render(<App>contenido</App>);
            const iconMoon = screen.getByTestId("moon-icon");
            
            expect(screen.getByTestId("theme-toggle-button")).toContainElement(iconMoon);
        });

        it("Should show sun icon when isDarkMode is true", () => {
            mockUseThemeStore.mockImplementation((selector) =>
                selector({ isDarkMode: true, toggleTheme: vi.fn() })
            );

            render(<App>contenido</App>);
            const iconSun = screen.getByTestId("sun-icon");
            expect(screen.getByTestId("theme-toggle-button")).toContainElement(iconSun);
        });

        it("Should call toggleTheme when FloatingActionButton is clicked", () => {
            const toggleTheme = vi.fn();
            mockUseThemeStore.mockImplementation((selector) =>
                selector({ isDarkMode: false, toggleTheme })
            );

            render(<App>contenido</App>);
            
            const button = screen.getByTestId("theme-toggle-button");
            fireEvent.click(button);
            
            expect(toggleTheme).toHaveBeenCalledTimes(1);
        });

        it("Should apply correct CSS classes to FloatingActionButton", () => {
            render(<App>contenido</App>);
            
            const button = screen.getByTestId("theme-toggle-button");
            expect(button).toHaveClass("rounded-full transition-all duration-300 hover:scale-110 bg-primary hover:bg-accent cursor-pointer top-23 right-1 md:hidden")
        });
    });

    describe("Children Rendering", () => {
        it("Should render children content correctly", () => {
            render(<App><div data-testid="child-content">Custom Content</div></App>);
            
            expect(screen.getByTestId("child-content")).toBeInTheDocument();
            expect(screen.getByText("Custom Content")).toBeInTheDocument();
        });

        it("Should render multiple children", () => {
            render(
                <App>
                    <div data-testid="child-1">Child 1</div>
                    <div data-testid="child-2">Child 2</div>
                </App>
            );
            
            expect(screen.getByTestId("child-1")).toBeInTheDocument();
            expect(screen.getByTestId("child-2")).toBeInTheDocument();
        });

        it("Should render children with complex JSX", () => {
            render(
                <App>
                    <main>
                        <h1>Page Title</h1>
                        <section>
                            <p>Page content</p>
                        </section>
                    </main>
                </App>
            );
            
            expect(screen.getByText("Page Title")).toBeInTheDocument();
            expect(screen.getByText("Page content")).toBeInTheDocument();
        });
    });

    describe("Component Integration", () => {
        it("Should not render FloatingActionButton on desktop (md:hidden class)", () => {
            render(<App>contenido</App>);
            
            const button = screen.getByTestId("theme-toggle-button");
            expect(button).toHaveClass("md:hidden");
        });

        it("Should maintain proper component hierarchy", () => {
            render(<App>contenido</App>);
            
            // Verify that components exist in the DOM
            expect(screen.getByTestId("loader-overlay")).toBeInTheDocument();
            expect(screen.getByTestId("navbar")).toBeInTheDocument();
            expect(screen.getByTestId("theme-toggle-button")).toBeInTheDocument();
            expect(screen.getByTestId("back-to-top")).toBeInTheDocument();
        });
    });

    describe("Error Handling", () => {
        it("Should handle missing maintenance data gracefully", () => {
            mockUseMaintenance.mockReturnValue({
                isAplicationInMaintenance: false,
                isInMaintenance: false,
                maintenanceData: undefined,
                isFetched: true,
                isInitialLoading: false,
                isError: true,
                error: new Error("Network error")
            });

            render(<App>contenido</App>);
            
            // Should still render normally when there's an error but not in maintenance
            expect(screen.getByText("contenido")).toBeInTheDocument();
            expect(screen.getByTestId("navbar")).toBeInTheDocument();
        });
    });

    describe("Accessibility", () => {
        it("Should have proper data-testid attributes for testing", () => {
            render(<App>contenido</App>);
            
            expect(screen.getByTestId("theme-toggle-button")).toHaveAttribute("data-testid", "theme-toggle-button");
        });

        it("Should render semantic HTML elements", () => {
            render(<App>contenido</App>);
            
            expect(screen.getByRole("navigation")).toBeInTheDocument(); // navbar
            expect(screen.getByRole("contentinfo")).toBeInTheDocument(); // footer
            expect(screen.getByRole("button")).toBeInTheDocument(); // theme toggle
        });
    });

    describe("State Transitions", () => {
        it("Should transition correctly from loading to normal state", () => {
            const { rerender } = render(<App>contenido</App>);
            
            // Initially loading
            mockUseMaintenance.mockReturnValue({
                isAplicationInMaintenance: false,
                isInMaintenance: false,
                maintenanceData: undefined,
                isFetched: true,
                isInitialLoading: true,
                isError: false,
                error: null
            });
            
            rerender(<App>contenido</App>);
            expect(screen.getByTestId("space-loading")).toBeInTheDocument();
            
            // Then loaded
            mockUseMaintenance.mockReturnValue({
                isAplicationInMaintenance: false,
                isInMaintenance: false,
                maintenanceData: undefined,
                isFetched: true,
                isInitialLoading: false,
                isError: false,
                error: null
            });
            
            rerender(<App>contenido</App>);
            expect(screen.queryByTestId("space-loading")).not.toBeInTheDocument();
            expect(screen.getByText("contenido")).toBeInTheDocument();
        });

        it("Should handle theme transitions correctly", () => {
            const toggleTheme = vi.fn();
            // Start with light theme
            mockUseThemeStore.mockImplementation((selector) =>
                selector({ isDarkMode: false, toggleTheme })
            );
            
            
            const { rerender } = render(<App>contenido</App>);
            const iconMoon = screen.getByTestId("moon-icon");
            expect(screen.getByTestId("theme-toggle-button")).toContainElement(iconMoon);

            
            
            //Switch to dark theme
            mockUseThemeStore.mockImplementation((selector) =>
                selector({ isDarkMode: true, toggleTheme })
            );
            
            

            rerender(<App>contenido</App>);
            const iconSun = screen.getByTestId("sun-icon");
            expect(screen.getByTestId("theme-toggle-button")).toContainElement(iconSun);
        });
    });
});