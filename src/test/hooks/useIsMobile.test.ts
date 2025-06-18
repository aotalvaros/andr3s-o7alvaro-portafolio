import { useIsMobile } from "@/hooks/useIsMobile";
import { renderHook } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";

describe("useIsMobile Hook", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });


    it("should return true if window width is less than or equal to breakpoint", () => {
        window.matchMedia = vi.fn().mockImplementation(query => ({
            matches: true,
            media: query,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            onchange: null,
            dispatchEvent: vi.fn(),
        }));

        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(true);
    });

    it("should return false if window width is greater than breakpoint", () => {
        window.matchMedia = vi.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            onchange: null,
            dispatchEvent: vi.fn(),
        }));

        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(false);
    });

    it("should use custom breakpoint", () => {
        window.matchMedia = vi.fn().mockImplementation(query => ({
            matches: query === "(max-width: 800px)",
            media: query,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            onchange: null,
            dispatchEvent: vi.fn(),
        }));

        const { result } = renderHook(() => useIsMobile(800));
        expect(result.current).toBe(true);
    });

    it("should clean up event listener on unmount", () => {
        const removeEventListener = vi.fn();
        const mockMedia = {
            matches: false,
            media: "",
            addEventListener: vi.fn(),
            removeEventListener,
            onchange: null,
            dispatchEvent: vi.fn(),
        };
        window.matchMedia = vi.fn().mockImplementation(() => mockMedia);

        const { unmount } = renderHook(() => useIsMobile());
        unmount();
        expect(removeEventListener).toHaveBeenCalled();
    });
})