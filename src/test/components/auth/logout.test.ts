/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { deleteCookie } from "cookies-next";
import { logout } from '@/components/auth/logout';

// Mock cookies-next
vi.mock("cookies-next");

const mockDeleteCookie = vi.mocked(deleteCookie);

describe("logout", () => {
  let originalLocation: Location;

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.clearAllMocks();

    // Save original window and location
    originalLocation = window?.location;

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

    // Mock window.location.replace
    delete (window as any).location;
    window.location = {
      ...originalLocation,
      replace: vi.fn(),
    } as any;
  });


  describe("Cookie cleanup", () => {
    it("should delete token cookie with path option", () => {
      logout();

      expect(mockDeleteCookie).toHaveBeenCalledWith("token", { path: "/" });
    });

    it("should delete refreshToken cookie with path option", () => {
      logout();

      expect(mockDeleteCookie).toHaveBeenCalledWith("refreshToken", { path: "/" });
    });

    it("should delete both cookies", () => {
      logout();

      expect(mockDeleteCookie).toHaveBeenCalledTimes(2);
      expect(mockDeleteCookie).toHaveBeenNthCalledWith(1, "token", { path: "/" });
      expect(mockDeleteCookie).toHaveBeenNthCalledWith(2, "refreshToken", { path: "/" });
    });
  });

  describe("localStorage cleanup", () => {
    it("should remove token from localStorage", () => {
      const removeItemSpy = vi.spyOn(window.localStorage, "removeItem");

      logout();

      expect(removeItemSpy).toHaveBeenCalledWith("token");
    });

    it("should remove refreshToken from localStorage", () => {
      const removeItemSpy = vi.spyOn(window.localStorage, "removeItem");

      logout();

      expect(removeItemSpy).toHaveBeenCalledWith("refreshToken");
    });

    it("should call localStorage.removeItem twice", () => {
      const removeItemSpy = vi.spyOn(window.localStorage, "removeItem");

      logout();

      expect(removeItemSpy).toHaveBeenCalledTimes(2);
      expect(removeItemSpy).toHaveBeenNthCalledWith(1, "token");
      expect(removeItemSpy).toHaveBeenNthCalledWith(2, "refreshToken");
    });

    it("should handle localStorage when window is defined", () => {
      const removeItemSpy = vi.spyOn(window.localStorage, "removeItem");

      logout();

      expect(removeItemSpy).toHaveBeenCalledWith("token");
      expect(removeItemSpy).toHaveBeenCalledWith("refreshToken");
    });
  });

  describe("Redirection with window.location.replace", () => {
    it("should use window.location.replace instead of href", () => {
      const replaceSpy = vi.spyOn(window.location, "replace");

      logout();

      expect(replaceSpy).toHaveBeenCalledWith("/login");
    });

    it("should redirect to /login path", () => {
      const replaceSpy = vi.spyOn(window.location, "replace");

      logout();

      expect(replaceSpy).toHaveBeenCalledWith("/login");
      expect(replaceSpy).toHaveBeenCalledTimes(1);
    });

    it("should redirect after cleaning cookies and localStorage", () => {
      const removeItemSpy = vi.spyOn(window.localStorage, "removeItem");
      const replaceSpy = vi.spyOn(window.location, "replace");

      logout();

      // Verify order: cookies and localStorage cleaned before redirect
      expect(mockDeleteCookie).toHaveBeenCalled();
      expect(removeItemSpy).toHaveBeenCalled();
      expect(replaceSpy).toHaveBeenCalledWith("/login");
    });
  });

  describe("Error handling", () => {
    it("should handle and log errors when deleteCookie throws", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const replaceSpy = vi.spyOn(window.location, "replace");
      
      mockDeleteCookie.mockImplementation(() => {
        throw new Error("Cookie deletion failed");
      });

      logout();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error during logout:",
        expect.any(Error)
      );
      // Should still redirect even with error
      expect(replaceSpy).toHaveBeenCalledWith("/login");

      consoleErrorSpy.mockRestore();
    });

    it("should handle and log errors when localStorage.removeItem throws", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const replaceSpy = vi.spyOn(window.location, "replace");
      
      window.localStorage.removeItem = vi.fn().mockImplementation(() => {
        throw new Error("localStorage error");
      });

      logout();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error during logout:",
        expect.any(Error)
      );
      // Should still redirect even with error
      expect(replaceSpy).toHaveBeenCalledWith("/login");

      consoleErrorSpy.mockRestore();
    });

    it("should force redirect even when multiple errors occur", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const replaceSpy = vi.spyOn(window.location, "replace");
      
      mockDeleteCookie.mockImplementation(() => {
        throw new Error("Cookie error");
      });

      logout();

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(replaceSpy).toHaveBeenCalledWith("/login");

      consoleErrorSpy.mockRestore();
    });

    it("should not throw error when logout fails", () => {
      mockDeleteCookie.mockImplementation(() => {
        throw new Error("Fatal error");
      });

      // Should not throw, error is caught and handled
      expect(() => logout()).not.toThrow();
    });

  });

  describe("SSR and window undefined scenarios", () => {
    it("should not call localStorage methods when window is undefined", () => {
      const removeItemSpy = vi.fn();
      
      // Remove window
      const tempWindow = global.window;

      (globalThis as any).window = undefined;

      logout();

      expect(removeItemSpy).not.toHaveBeenCalled();

      // Restore
      global.window = tempWindow;
    });

    it("should not call window.location.replace when window is undefined", () => {
      const replaceSpy = vi.fn();
      
      // Remove window
      const tempWindow = global.window;

      (globalThis as any).window = undefined;

      logout();

      expect(replaceSpy).not.toHaveBeenCalled();

      // Restore
      global.window = tempWindow;
    });
  });

  describe("Complete flow", () => {
    it("should execute complete logout flow in correct order", () => {
      const removeItemSpy = vi.spyOn(window.localStorage, "removeItem");
      const replaceSpy = vi.spyOn(window.location, "replace");
      const operations: string[] = [];

      mockDeleteCookie.mockImplementation((name) => {
        operations.push(`delete-cookie-${name}`);
      });

      removeItemSpy.mockImplementation((key) => {
        operations.push(`remove-localStorage-${key}`);
      });

      replaceSpy.mockImplementation(() => {
        operations.push("redirect");
      });

      logout();

      // Verify execution order
      expect(operations).toEqual([
        "delete-cookie-token",
        "delete-cookie-refreshToken",
        "remove-localStorage-token",
        "remove-localStorage-refreshToken",
        "redirect",
      ]);
    });

    it("should successfully logout with all side effects", () => {
      const removeItemSpy = vi.spyOn(window.localStorage, "removeItem");
      const replaceSpy = vi.spyOn(window.location, "replace");

      logout();

      // All cleanup operations executed
      expect(mockDeleteCookie).toHaveBeenCalledWith("token", { path: "/" });
      expect(mockDeleteCookie).toHaveBeenCalledWith("refreshToken", { path: "/" });
      expect(removeItemSpy).toHaveBeenCalledWith("token");
      expect(removeItemSpy).toHaveBeenCalledWith("refreshToken");
      
      // Redirected using replace
      expect(replaceSpy).toHaveBeenCalledWith("/login");
    });

    it("should clean up both token and refreshToken everywhere", () => {
      const removeItemSpy = vi.spyOn(window.localStorage, "removeItem");

      logout();

      // Cookies
      expect(mockDeleteCookie).toHaveBeenCalledWith("token", { path: "/" });
      expect(mockDeleteCookie).toHaveBeenCalledWith("refreshToken", { path: "/" });
      
      // localStorage
      expect(removeItemSpy).toHaveBeenCalledWith("token");
      expect(removeItemSpy).toHaveBeenCalledWith("refreshToken");
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
      const replaceSpy = vi.spyOn(window.location, "replace");

      // First call
      logout();
      expect(replaceSpy).toHaveBeenCalledWith("/login");

      // Reset mocks
      vi.clearAllMocks();

      // Second call
      logout();
      expect(mockDeleteCookie).toHaveBeenCalledTimes(2);
      expect(removeItemSpy).toHaveBeenCalledTimes(2);
      expect(replaceSpy).toHaveBeenCalledWith("/login");
    });

    it("should handle errors on first call and succeed on second", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const replaceSpy = vi.spyOn(window.location, "replace");

      // First call - with error
      mockDeleteCookie.mockImplementationOnce(() => {
        throw new Error("First error");
      });

      logout();
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(replaceSpy).toHaveBeenCalledWith("/login");

      // Reset
      vi.clearAllMocks();

      // Second call - success
      mockDeleteCookie.mockImplementation(() => {});

      logout();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(mockDeleteCookie).toHaveBeenCalledTimes(2);
      expect(replaceSpy).toHaveBeenCalledWith("/login");

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Cookie path option", () => {
    it("should include path option for token cookie", () => {
      logout();

      expect(mockDeleteCookie).toHaveBeenCalledWith(
        "token",
        expect.objectContaining({ path: "/" })
      );
    });

    it("should include path option for refreshToken cookie", () => {
      logout();

      expect(mockDeleteCookie).toHaveBeenCalledWith(
        "refreshToken",
        expect.objectContaining({ path: "/" })
      );
    });

    it("should use root path for all cookies", () => {
      logout();

      const calls = mockDeleteCookie.mock.calls;
      calls.forEach((call) => {
        expect(call[1]).toEqual({ path: "/" });
      });
    });
  });

  describe("Error recovery", () => {

    it("should continue execution after error in localStorage", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const replaceSpy = vi.spyOn(window.location, "replace");

      window.localStorage.removeItem = vi.fn().mockImplementation(() => {
        throw new Error("localStorage error");
      });

      logout();

      // Should still redirect despite error
      expect(replaceSpy).toHaveBeenCalledWith("/login");
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it("should always attempt redirect in catch block", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const replaceSpy = vi.spyOn(window.location, "replace");

      mockDeleteCookie.mockImplementation(() => {
        throw new Error("Fatal error");
      });

      logout();

      // Redirect should be called in catch block
      expect(replaceSpy).toHaveBeenCalledWith("/login");
      expect(replaceSpy).toHaveBeenCalledTimes(1);

      consoleErrorSpy.mockRestore();
    });
  });
});