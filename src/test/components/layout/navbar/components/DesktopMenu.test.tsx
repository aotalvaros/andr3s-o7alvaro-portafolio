/* eslint-disable @typescript-eslint/no-explicit-any */
import { DesktopMenu } from "@/components/layout/navbar/components/DesktopMenu";
import { beforeEach, vi, describe, it, expect } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

vi.mock("@/components/layout/navbar/components/NavigationLinks", () => ({
    NavigationLinks: ({ onContactClick, onLinkClick, onThemeToggle, isDarkMode, variant }: any) => (
        <div data-testid="navigation-links-mock" data-variant={variant}>
            <a href="#home" data-testid="nav-link-home" onClick={onLinkClick}>Home</a>
            <a href="#about" data-testid="nav-link-about" onClick={onLinkClick}>About</a>
            <a href="#contact" data-testid="nav-link-contact" onClick={onContactClick}>Contact</a>
            <button data-testid="theme-toggle" onClick={onThemeToggle}>
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
        </div>
    )
}));

describe("DesktopMenu Component", () => {

    const mockOnContactClick = vi.fn();
    const mockOnLinkClick = vi.fn();
    const mockOnThemeToggle = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it("should render with hidden class for mobile and visible for desktop", () => {
        render(
            <DesktopMenu
                isDarkMode={false}
                onContactClick={mockOnContactClick}
                onLinkClick={mockOnLinkClick}
                onThemeToggle={mockOnThemeToggle}
            />
        );

        const desktopMenu = screen.getByTestId("navigation-links-mock").parentElement;
        expect(desktopMenu).toHaveClass("hidden", "md:flex", "items-center", "gap-6");
    });

    it("should render NavigationLinks component with correct variant", () => {
        render(
            <DesktopMenu
                isDarkMode={false}
                onContactClick={mockOnContactClick}
                onLinkClick={mockOnLinkClick}
                onThemeToggle={mockOnThemeToggle}
            />
        );

        const navigationLinks = screen.getByTestId("navigation-links-mock");
        expect(navigationLinks).toBeInTheDocument();
        expect(navigationLinks).toHaveAttribute("data-variant", "desktop");
    });

    it("should pass all props to NavigationLinks component", () => {
        render(
            <DesktopMenu
                isDarkMode={true}
                onContactClick={mockOnContactClick}
                onLinkClick={mockOnLinkClick}
                onThemeToggle={mockOnThemeToggle}
            />
        );

        const themeToggle = screen.getByTestId("theme-toggle");
        expect(themeToggle).toHaveTextContent("Light Mode");
    });

    it("should handle onContactClick when contact link is clicked", () => {
        render(
            <DesktopMenu
                isDarkMode={false}
                onContactClick={mockOnContactClick}
                onLinkClick={mockOnLinkClick}
                onThemeToggle={mockOnThemeToggle}
            />
        );

        const contactLink = screen.getByTestId("nav-link-contact");
        fireEvent.click(contactLink);

        expect(mockOnContactClick).toHaveBeenCalledTimes(1);
    });

    it("should handle onLinkClick when navigation links are clicked", () => {
        render(
            <DesktopMenu
                isDarkMode={false}
                onContactClick={mockOnContactClick}
                onLinkClick={mockOnLinkClick}
                onThemeToggle={mockOnThemeToggle}
            />
        );

        const homeLink = screen.getByTestId("nav-link-home");
        const aboutLink = screen.getByTestId("nav-link-about");

        fireEvent.click(homeLink);
        fireEvent.click(aboutLink);

        expect(mockOnLinkClick).toHaveBeenCalledTimes(2);
    });

    it("should handle onThemeToggle when theme toggle is clicked", () => {
        render(
            <DesktopMenu
                isDarkMode={false}
                onContactClick={mockOnContactClick}
                onLinkClick={mockOnLinkClick}
                onThemeToggle={mockOnThemeToggle}
            />
        );

        const themeToggle = screen.getByTestId("theme-toggle");
        fireEvent.click(themeToggle);

        expect(mockOnThemeToggle).toHaveBeenCalledTimes(1);
    });

    it("should render correctly with isDarkMode true", () => {
        render(
            <DesktopMenu
                isDarkMode={true}
                onContactClick={mockOnContactClick}
                onLinkClick={mockOnLinkClick}
                onThemeToggle={mockOnThemeToggle}
            />
        );

        const themeToggle = screen.getByTestId("theme-toggle");
        expect(themeToggle).toHaveTextContent("Light Mode");
    });

    it("should render correctly with isDarkMode false", () => {
        render(
            <DesktopMenu
                isDarkMode={false}
                onContactClick={mockOnContactClick}
                onLinkClick={mockOnLinkClick}
                onThemeToggle={mockOnThemeToggle}
            />
        );

        const themeToggle = screen.getByTestId("theme-toggle");
        expect(themeToggle).toHaveTextContent("Dark Mode");
    });

    it("should not call any handlers when component is just rendered", () => {
        render(
            <DesktopMenu
                isDarkMode={false}
                onContactClick={mockOnContactClick}
                onLinkClick={mockOnLinkClick}
                onThemeToggle={mockOnThemeToggle}
            />
        );

        expect(mockOnContactClick).not.toHaveBeenCalled();
        expect(mockOnLinkClick).not.toHaveBeenCalled();
        expect(mockOnThemeToggle).not.toHaveBeenCalled();
    });

    it("should maintain component structure and accessibility", () => {
        render(
            <DesktopMenu
                isDarkMode={false}
                onContactClick={mockOnContactClick}
                onLinkClick={mockOnLinkClick}
                onThemeToggle={mockOnThemeToggle}
            />
        );

        const container = screen.getByTestId("navigation-links-mock").parentElement;
        expect(container?.tagName).toBe("DIV");
        
        const links = screen.getAllByRole("link");
        expect(links).toHaveLength(3);
        
        const button = screen.getByRole("button");
        expect(button).toBeInTheDocument();
    });
});