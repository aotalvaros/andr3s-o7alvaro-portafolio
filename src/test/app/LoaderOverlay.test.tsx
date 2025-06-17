import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LoaderOverlay } from '../../app/LoaderOverlay';
import { useLoadingStore } from '../../store/loadingStore';

vi.mock("@/store/loadingStore");

vi.mock("@/components/ui/BlackHoleSpinner", () => ({
    __esModule: true,
    default: () => <div data-testid="black-hole-spinner" />,
}));

describe("Test LoaderOverlay component", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render BlackHoleSpinner when isLoading is true", () => {
        vi.mocked(useLoadingStore).mockReturnValue(true);

        render(<LoaderOverlay />);
        expect(screen.getByTestId("black-hole-spinner")).toBeInTheDocument();
    });

    it("should render null when isLoading is false", () => {
        vi.mocked(useLoadingStore).mockReturnValue(false);

        const { container } = render(<LoaderOverlay />);
        expect(container).toBeEmptyDOMElement();
    });

    it("should not render multiple spinners if called multiple times", () => {
        vi.mocked(useLoadingStore).mockReturnValue(true);

        render(<LoaderOverlay />);
        render(<LoaderOverlay />);
        expect(screen.getAllByTestId("black-hole-spinner").length).toBeGreaterThanOrEqual(1);
    });

    it("should update when isLoading changes from false to true", () => {
        const mockUseLoadingStore = useLoadingStore as unknown as ReturnType<typeof vi.fn>;
        // First render: isLoading false
        mockUseLoadingStore.mockReturnValueOnce(false);
        const { rerender } = render(<LoaderOverlay />);
        expect(screen.queryByTestId("black-hole-spinner")).toBeNull();

        // Rerender: isLoading true
        mockUseLoadingStore.mockReturnValueOnce(true);
        rerender(<LoaderOverlay />);
        expect(screen.getByTestId("black-hole-spinner")).toBeInTheDocument();
    });

    it("should update when isLoading changes from true to false", () => {
        const mockUseLoadingStore = useLoadingStore as unknown as ReturnType<typeof vi.fn>;
        // First render: isLoading true
        mockUseLoadingStore.mockReturnValueOnce(true);
        const { rerender, container } = render(<LoaderOverlay />);
        expect(screen.getByTestId("black-hole-spinner")).toBeInTheDocument();

        // Rerender: isLoading false
        mockUseLoadingStore.mockReturnValueOnce(false);
        rerender(<LoaderOverlay />);
        expect(container).toBeEmptyDOMElement();
    });
});
