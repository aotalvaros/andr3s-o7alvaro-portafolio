import { useScrollDirection } from "@/hooks/useScrollDirection";
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach} from "vitest";

describe("useScrollDirection Hook", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return true initially (visible)", () => {
      const { result } = renderHook(() => useScrollDirection());
      expect(result.current).toBe(true);
    });
    
    it("should remain visible when scrolling down but not past 100px", async() => {
        let scrollY = 0;
        Object.defineProperty(window, "scrollY", { get: () => scrollY, configurable: true });
        
        const { result } = renderHook(() => useScrollDirection());

        scrollY = 50;
        await act(async() => {
            window.dispatchEvent(new Event("scroll"));
        })

      expect(result.current).toBe(true);
    });
    
    it("should clean up event listener on unmount", () => {
        const addSpy = vi.spyOn(window, "addEventListener");
        const removeSpy = vi.spyOn(window, "removeEventListener");
        
        const { unmount } = renderHook(() => useScrollDirection());
        expect(addSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
        
        unmount();
        expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
    });
});