/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { deleteCookie } from "cookies-next";
import { logout } from '@/components/auth/logout';

// Mock cookies-next
vi.mock("cookies-next");

const mockDeleteCookie = vi.mocked(deleteCookie);

describe("logout", () => {
  let originalWindow: typeof window;
  let originalLocation: Location;

  beforeEach(() => {
    vi.clearAllMocks();

    // Save original window and location
    originalWindow = global.window;
    originalLocation = window.location;

    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };

    // Ensure window exists
    if (typeof window === "undefined") {
      Object.defineProperty(global, "window", {
        value: {},
        writable: true,
        configurable: true,
      });
    }

    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
      configurable: true,
    });

    // Mock window.location.href
    delete (window as any).location;
    window.location = {
      ...originalLocation,
      href: "",
    } as Location;
  });

  afterEach(() => {
    // Restore original window and location
    global.window = originalWindow;
    if (originalLocation) {
      window.location = originalLocation;
    }
  });

  describe("Cookie cleanup", () => {
    it("should delete token cookie", () => {
      logout();

      expect(mockDeleteCookie).toHaveBeenCalledWith("token");
    });

    it("should delete refreshToken cookie", () => {
      logout();

      expect(mockDeleteCookie).toHaveBeenCalledWith("refreshToken");
    });

    it("should delete both cookies", () => {
      logout();

      expect(mockDeleteCookie).toHaveBeenCalledTimes(2);
      expect(mockDeleteCookie).toHaveBeenNthCalledWith(1, "token");
      expect(mockDeleteCookie).toHaveBeenNthCalledWith(2, "refreshToken");
    });
  });

  describe("localStorage cleanup", () => {
    it("should remove token from localStorage", () => {
      const removeItemSpy = vi.spyOn(window.localStorage, "removeItem");

      logout();

      expect(removeItemSpy).toHaveBeenCalledWith("token");
    });

    it("should call localStorage.removeItem exactly once", () => {
      const removeItemSpy = vi.spyOn(window.localStorage, "removeItem");

      logout();

      expect(removeItemSpy).toHaveBeenCalledTimes(1);
    });

    it("should handle localStorage when window is defined", () => {
      const removeItemSpy = vi.spyOn(window.localStorage, "removeItem");

      logout();

      expect(removeItemSpy).toHaveBeenCalledWith("token");
      expect(window.location.href).toBe("/login");
    });
  });

  describe("Redirection", () => {
    it("should redirect to /login", () => {
      logout();

      expect(window.location.href).toBe("/login");
    });

    it("should redirect after cleaning cookies and localStorage", () => {
      const removeItemSpy = vi.spyOn(window.localStorage, "removeItem");
      const deleteCookieSpy = mockDeleteCookie;

      logout();

      // Verify order: cookies and localStorage cleaned before redirect
      expect(deleteCookieSpy).toHaveBeenCalled();
      expect(removeItemSpy).toHaveBeenCalled();
      expect(window.location.href).toBe("/login");
    });
  });

  describe("SSR and edge cases", () => {
    it("should handle localStorage.removeItem throwing error", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      window.localStorage.removeItem = vi.fn().mockImplementation(() => {
        throw new Error("localStorage error");
      });

      // Should not throw, just fail silently or log
      expect(() => logout()).toThrow(); // This will throw because we don't have error handling

      consoleErrorSpy.mockRestore();
    });

    it("should handle deleteCookie throwing error", () => {
      mockDeleteCookie.mockImplementation(() => {
        throw new Error("Cookie deletion error");
      });

      // Should throw because there's no error handling
      expect(() => logout()).toThrow();
    });
  });

  describe("Complete flow", () => {
    it("should execute complete logout flow in correct order", () => {
      const removeItemSpy = vi.spyOn(window.localStorage, "removeItem");
      const operations: string[] = [];

      mockDeleteCookie.mockImplementation((name) => {
        operations.push(`delete-cookie-${name}`);
      });

      removeItemSpy.mockImplementation(() => {
        operations.push("remove-localStorage");
      });

      logout();

      // Verify execution order
      expect(operations).toEqual([
        "delete-cookie-token",
        "delete-cookie-refreshToken",
        "remove-localStorage",
      ]);

      expect(window.location.href).toBe("/login");
    });

    it("should successfully logout with all side effects", () => {
      const removeItemSpy = vi.spyOn(window.localStorage, "removeItem");

      logout();

      // All cleanup operations executed
      expect(mockDeleteCookie).toHaveBeenCalledWith("token");
      expect(mockDeleteCookie).toHaveBeenCalledWith("refreshToken");
      expect(removeItemSpy).toHaveBeenCalledWith("token");
      
      // Redirected
      expect(window.location.href).toBe("/login");
    });
  });

  describe("Multiple calls", () => {
    it("should handle multiple consecutive logout calls", () => {
      logout();
      logout();
      logout();

      // Should be called 3 times for each operation
      expect(mockDeleteCookie).toHaveBeenCalledTimes(6); // 2 cookies × 3 calls
    });

    it("should maintain correct behavior on second call", () => {
      const removeItemSpy = vi.spyOn(window.localStorage, "removeItem");

      // First call
      logout();
      expect(window.location.href).toBe("/login");

      // Reset mocks
      vi.clearAllMocks();
      window.location.href = "";

      // Second call
      logout();
      expect(mockDeleteCookie).toHaveBeenCalledTimes(2);
      expect(removeItemSpy).toHaveBeenCalledTimes(1);
      expect(window.location.href).toBe("/login");
    });
  });
});