/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/hooks/useAuth";
import { getCookie, deleteCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import * as userService from "@/services/user/user.service";

// Mock modules
vi.mock("cookies-next");
vi.mock("jwt-decode");
vi.mock("@/services/user/user.service");

const mockGetCookie = vi.mocked(getCookie);
const mockDeleteCookie = vi.mocked(deleteCookie);
const mockJwtDecode = vi.mocked(jwtDecode);
const mockGetUserProfile = vi.mocked(userService.getUserProfile);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) =>
    QueryClientProvider({ client: queryClient, children });
};

describe("useAuth", () => {
  const mockValidToken = "valid.jwt.token";
  const mockValidDecoded = {
    exp: Math.floor(Date.now() / 1000) + 3600, // valid 1h more
  };
  const mockUserProfile = {
    _id: "user-1",
    email: "test@example.com",
    role: "admin",
    name: "Test User",
    avatar: "https://example.com/avatar.jpg",
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

    // Default: no token
    mockGetCookie.mockReturnValue(undefined);
    window.localStorage.getItem = vi.fn().mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initial authentication check", () => {
    it("should return null user and false isAuthenticated when no token exists", async () => {
      mockGetCookie.mockReturnValue(undefined);
      window.localStorage.getItem = vi.fn().mockReturnValue(null);

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(mockJwtDecode).not.toHaveBeenCalled();
    });

    it("should fetch user profile and set user when token is valid", async () => {
      mockGetCookie.mockReturnValue(mockValidToken);
      mockJwtDecode.mockReturnValue(mockValidDecoded as any);
      mockGetUserProfile.mockResolvedValue(mockUserProfile as any);

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      expect(mockJwtDecode).toHaveBeenCalledWith(mockValidToken);
      expect(result.current.user).toEqual(mockUserProfile);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it("should fetch profile using localStorage token when cookie is not present", async () => {
      mockGetCookie.mockReturnValue(undefined);
      window.localStorage.getItem = vi.fn().mockReturnValue(mockValidToken);
      mockJwtDecode.mockReturnValue(mockValidDecoded as any);
      mockGetUserProfile.mockResolvedValue(mockUserProfile as any);

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      expect(window.localStorage.getItem).toHaveBeenCalledWith("token");
      expect(result.current.isAuthenticated).toBe(true);
    });

    it("should prioritize cookie token over localStorage token", async () => {
      const cookieToken = "cookie.token";
      const localStorageToken = "localStorage.token";

      mockGetCookie.mockReturnValue(cookieToken);
      window.localStorage.getItem = vi.fn().mockReturnValue(localStorageToken);
      mockJwtDecode.mockReturnValue(mockValidDecoded as any);
      mockGetUserProfile.mockResolvedValue(mockUserProfile as any);

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      // El token de cookie se usa para validar expiración
      expect(mockJwtDecode).toHaveBeenCalledWith(cookieToken);
      expect(mockJwtDecode).not.toHaveBeenCalledWith(localStorageToken);
    });

    it("should handle profile with avatar field", async () => {
      mockGetCookie.mockReturnValue(mockValidToken);
      mockJwtDecode.mockReturnValue(mockValidDecoded as any);
      mockGetUserProfile.mockResolvedValue(mockUserProfile as any);

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      expect(result.current.user?.avatar).toBe("https://example.com/avatar.jpg");
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe("Token expiration handling", () => {
    it("should clear auth when token is expired", async () => {
      const expiredDecoded = {
        exp: Math.floor(Date.now() / 1000) - 100, // expired
      };

      mockGetCookie.mockReturnValue(mockValidToken);
      mockJwtDecode.mockReturnValue(expiredDecoded as any);
      window.localStorage.removeItem = vi.fn();

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(mockDeleteCookie).toHaveBeenCalledWith("token");
      expect(mockDeleteCookie).toHaveBeenCalledWith("refreshToken");
      expect(window.localStorage.removeItem).toHaveBeenCalledWith("token");
    });

    it("should treat token with exp === now as expired", async () => {
      const tokenExpiringNow = {
        exp: Math.floor(Date.now() / 1000),
      };

      mockGetCookie.mockReturnValue(mockValidToken);
      mockJwtDecode.mockReturnValue(tokenExpiringNow as any);

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("Error handling", () => {
    it("should handle invalid token (jwtDecode throws) and clear auth", async () => {
      mockGetCookie.mockReturnValue(mockValidToken);
      mockJwtDecode.mockImplementation(() => {
        throw new Error("Invalid token format");
      });
      window.localStorage.removeItem = vi.fn();

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(mockDeleteCookie).toHaveBeenCalledWith("token");
      expect(mockDeleteCookie).toHaveBeenCalledWith("refreshToken");
    });

    it("should return null user when jwtDecode returns malformed data (no exp)", async () => {
      mockGetCookie.mockReturnValue(mockValidToken);
      mockJwtDecode.mockReturnValue(undefined as any);
      window.localStorage.removeItem = vi.fn();

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it("should handle empty string token as no token", async () => {
      mockGetCookie.mockReturnValue("");
      window.localStorage.getItem = vi.fn().mockReturnValue(null);

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

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
      mockJwtDecode.mockReturnValue(mockValidDecoded as any);
      mockGetUserProfile.mockResolvedValue(mockUserProfile as any);
      window.localStorage.removeItem = vi.fn();

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      act(() => {
        result.current.clearAuth();
      });

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