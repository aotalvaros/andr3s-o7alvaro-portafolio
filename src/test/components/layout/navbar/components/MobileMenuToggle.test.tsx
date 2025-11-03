import { MobileMenuToggle } from "@/components/layout/navbar/components/MobileMenuToggle";
import { beforeEach, vi, describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

describe("MobileMenuToggle Component", () => {

    const mockOnClick = vi.fn();

    beforeEach(() => {
        render(<MobileMenuToggle isOpen={false} onClick={mockOnClick} />);
    });

    afterEach(() => {
        cleanup();
    });

    it("should render the toggle button", () => {
        const toggleButton = screen.getByRole("button");
        expect(toggleButton).toBeInTheDocument();
    });

    it("should call onClick when button is clicked", () => {
        const toggleButton = screen.getByTestId("mobile-menu-toggle");
        fireEvent.click(toggleButton);
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
})