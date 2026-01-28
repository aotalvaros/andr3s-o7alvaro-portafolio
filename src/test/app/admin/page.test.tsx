import AdminPage from "@/app/admin/page";
import { afterEach, beforeEach, vi, describe, it, expect } from 'vitest';
import { render, screen } from "@testing-library/react";
import { useThemeStore } from '@/store/themeStore';
import userEvent from '@testing-library/user-event';

vi.mock('@/components/sections/admin/AdminDashboard', () => ({
    AdminDashboard: vi.fn(() => <div data-testid="admin-dashboard">Mocked AdminDashboard</div>)
}));

vi.mock('@/store/themeStore', () => ({
    useThemeStore: vi.fn()
}));

describe("AdminPage Component", () => {
    const mockToggleTheme = vi.fn();
    
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("Rendering", () => {
        it("should render AdminDashboard component", () => {
            vi.mocked(useThemeStore).mockReturnValue(false); 
            vi.mocked(useThemeStore).mockReturnValueOnce(false); 
            vi.mocked(useThemeStore).mockReturnValueOnce(mockToggleTheme);
            
            render(<AdminPage />);
            
            expect(screen.getByTestId("admin-dashboard")).toBeInTheDocument();
        });

        it("should render FloatingActionButton with correct props", () => {
            vi.mocked(useThemeStore).mockReturnValueOnce(false);
            vi.mocked(useThemeStore).mockReturnValueOnce(mockToggleTheme);

            render(<AdminPage />);
            
            const button = screen.getByTestId("theme-toggle-button");
            expect(button).toBeInTheDocument();
            expect(button).toHaveClass("rounded-full", "bg-primary", "hover:bg-accent");
        });
    });

    describe("Theme Toggle - Dark Mode", () => {
        it("should display Sun icon when dark mode is active", () => {
            vi.mocked(useThemeStore).mockReturnValueOnce(true);
            vi.mocked(useThemeStore).mockReturnValueOnce(mockToggleTheme);

            render(<AdminPage />);

            expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
            expect(screen.queryByTestId("moon-icon")).not.toBeInTheDocument();
        });

        it("should display Moon icon when light mode is active", () => {
            vi.mocked(useThemeStore).mockReturnValueOnce(false); 
            vi.mocked(useThemeStore).mockReturnValueOnce(mockToggleTheme);

            render(<AdminPage />);

            expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
            expect(screen.queryByTestId("sun-icon")).not.toBeInTheDocument();
        });
    });

    describe("User Interactions", () => {
        it("should call toggleTheme when FloatingActionButton is clicked", async () => {
            const user = userEvent.setup();
            vi.mocked(useThemeStore).mockReturnValueOnce(false);
            vi.mocked(useThemeStore).mockReturnValueOnce(mockToggleTheme);
            
            render(<AdminPage />);
            const button = screen.getByTestId("theme-toggle-button");

            await user.click(button);

            expect(mockToggleTheme).toHaveBeenCalledTimes(1);
        });

        it("should handle multiple theme toggle clicks", async () => {
            const user = userEvent.setup();
            vi.mocked(useThemeStore).mockReturnValueOnce(false);
            vi.mocked(useThemeStore).mockReturnValueOnce(mockToggleTheme);
            
            render(<AdminPage />);
            const button = screen.getByTestId("theme-toggle-button");

            await user.click(button);
            await user.click(button);
            await user.click(button);

            expect(mockToggleTheme).toHaveBeenCalledTimes(3);
        });
    });

    describe("Zustand Store Integration", () => {
        it("should read isDarkMode state from store correctly", () => {

            const mockIsDarkMode = true;
            vi.mocked(useThemeStore).mockReturnValueOnce(mockIsDarkMode);
            vi.mocked(useThemeStore).mockReturnValueOnce(mockToggleTheme);

            render(<AdminPage />);

            expect(useThemeStore).toHaveBeenCalledWith(expect.any(Function));
            expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
        });

        it("should get toggleTheme function from store", () => {
            vi.mocked(useThemeStore).mockReturnValueOnce(false);
            vi.mocked(useThemeStore).mockReturnValueOnce(mockToggleTheme);

            render(<AdminPage />);

            expect(useThemeStore).toHaveBeenCalledTimes(2);
        });
    });

    describe("Responsive Behavior", () => {
        it("should have md:hidden class for mobile-only display", () => {
            vi.mocked(useThemeStore).mockReturnValueOnce(false);
            vi.mocked(useThemeStore).mockReturnValueOnce(mockToggleTheme);

            render(<AdminPage />);
            const button = screen.getByTestId("theme-toggle-button");

            expect(button).toHaveClass("md:hidden");
        });
    });
});