/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/hooks/useAuth";
import { getCookie, deleteCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

// Mock modules
vi.mock("cookies-next");
vi.mock("jwt-decode");

const mockGetCookie = vi.mocked(getCookie);
const mockDeleteCookie = vi.mocked(deleteCookie);
const mockJwtDecode = vi.mocked(jwtDecode);

describe("useAuth", () => {
  const mockValidToken = "valid.jwt.token";
  const mockDecodedToken = {
    email: "test@example.com",
    role: "admin",
    name: "Test User",
    avatar: "https://example.com/avatar.jpg",
    iat: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    exp: Math.floor(Date.now() / 1000) + 3600, // expires in 1 hour
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    
    // Ensure window object exists
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
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initial authentication check", () => {
    it("should return null user and false isAuthenticated when no token exists", async () => {
      mockGetCookie.mockReturnValue(undefined);
      window.localStorage.getItem = vi.fn().mockReturnValue(null);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(mockJwtDecode).not.toHaveBeenCalled();
    });

    it("should decode token from cookie and set user when token is valid", async () => {
      mockGetCookie.mockReturnValue(mockValidToken);
      mockJwtDecode.mockReturnValue(mockDecodedToken);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockJwtDecode).toHaveBeenCalledWith(mockValidToken);
      expect(result.current.user).toEqual(mockDecodedToken);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it("should decode token from localStorage when cookie is not present", async () => {
      mockGetCookie.mockReturnValue(undefined);
      window.localStorage.getItem = vi.fn().mockReturnValue(mockValidToken);
      mockJwtDecode.mockReturnValue(mockDecodedToken);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(window.localStorage.getItem).toHaveBeenCalledWith("token");
      expect(mockJwtDecode).toHaveBeenCalledWith(mockValidToken);
      expect(result.current.user).toEqual(mockDecodedToken);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it("should prioritize cookie token over localStorage token", async () => {
      const cookieToken = "cookie.token";
      const localStorageToken = "localStorage.token";
      
      mockGetCookie.mockReturnValue(cookieToken);
      window.localStorage.getItem = vi.fn().mockReturnValue(localStorageToken);
      mockJwtDecode.mockReturnValue(mockDecodedToken);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockJwtDecode).toHaveBeenCalledWith(cookieToken);
      expect(mockJwtDecode).not.toHaveBeenCalledWith(localStorageToken);
    });

    it("should handle token without avatar field", async () => {
      const tokenWithoutAvatar = { ...mockDecodedToken };
      delete tokenWithoutAvatar.avatar;

      mockGetCookie.mockReturnValue(mockValidToken);
      mockJwtDecode.mockReturnValue(tokenWithoutAvatar);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(tokenWithoutAvatar);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe("Token expiration handling", () => {
    it("should clear auth when token is expired", async () => {
      const expiredToken = {
        ...mockDecodedToken,
        exp: Math.floor(Date.now() / 1000) - 100, // expired 100 seconds ago
      };

      mockGetCookie.mockReturnValue(mockValidToken);
      mockJwtDecode.mockReturnValue(expiredToken);
      window.localStorage.removeItem = vi.fn();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(mockDeleteCookie).toHaveBeenCalledWith("token");
      expect(mockDeleteCookie).toHaveBeenCalledWith("refreshToken");
      expect(window.localStorage.removeItem).toHaveBeenCalledWith("token");
    });

    it("should accept token expiring exactly now", async () => {
      const tokenExpiringNow = {
        ...mockDecodedToken,
        exp: Math.floor(Date.now() / 1000), // expires right now
      };

      mockGetCookie.mockReturnValue(mockValidToken);
      mockJwtDecode.mockReturnValue(tokenExpiringNow);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Token with exp === currentTime should be considered expired
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("Error handling", () => {
    it("should handle invalid token and clear auth", async () => {
      mockGetCookie.mockReturnValue(mockValidToken);
      mockJwtDecode.mockImplementation(() => {
        throw new Error("Invalid token format");
      });
      window.localStorage.removeItem = vi.fn();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(console.error).toHaveBeenCalledWith(
        "Token inválido",
        expect.any(Error)
      );
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(mockDeleteCookie).toHaveBeenCalledWith("token");
      expect(mockDeleteCookie).toHaveBeenCalledWith("refreshToken");
    });

    it("should handle jwtDecode returning malformed data", async () => {
      mockGetCookie.mockReturnValue(mockValidToken);
      mockJwtDecode.mockReturnValue(undefined as any);
      window.localStorage.removeItem = vi.fn();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it("should handle empty string token", async () => {
      mockGetCookie.mockReturnValue("");
      window.localStorage.getItem = vi.fn().mockReturnValue(null);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(mockJwtDecode).not.toHaveBeenCalled();
    });
  });

  describe("clearAuth function", () => {
    it("should clear user state and remove all tokens", async () => {
      mockGetCookie.mockReturnValue(mockValidToken);
      mockJwtDecode.mockReturnValue(mockDecodedToken);
      window.localStorage.removeItem = vi.fn();

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(mockDecodedToken);

      // Call clearAuth
      result.current.clearAuth();

      await waitFor(() => {
        expect(result.current.user).toBeNull();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(mockDeleteCookie).toHaveBeenCalledWith("token");
      expect(mockDeleteCookie).toHaveBeenCalledWith("refreshToken");
      expect(window.localStorage.removeItem).toHaveBeenCalledWith("token");
    });

  });
});