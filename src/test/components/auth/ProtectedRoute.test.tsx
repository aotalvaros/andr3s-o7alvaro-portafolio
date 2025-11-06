import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

// Mock hooks
vi.mock("@/hooks/useAuth");
vi.mock("next/navigation");

const mockUseAuth = vi.mocked(useAuth);
const mockUseRouter = vi.mocked(useRouter);

describe("ProtectedRoute", () => {
  const mockPush = vi.fn();
  const mockRouter = {
    push: mockPush,
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  };

  const mockUser = {
    email: "test@example.com",
    role: "admin",
    name: "Test User",
    iat: 1234567890,
    exp: 9999999999,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter);

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
  });

  describe("Authentication checks", () => {
    it("should render children when user is authenticated with valid token", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
        clearAuth: vi.fn(),
      });
      window.localStorage.getItem = vi.fn().mockReturnValue("valid-token");

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(screen.getByText("Protected Content")).toBeInTheDocument();
      });

      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should redirect to login when user is not authenticated", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        clearAuth: vi.fn(),
      });
      window.localStorage.getItem = vi.fn().mockReturnValue(null);

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/login");
      });

      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });

    it("should redirect to login when token is missing in localStorage", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
        clearAuth: vi.fn(),
      });
      window.localStorage.getItem = vi.fn().mockReturnValue(null);

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/login");
      });

      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });

    it("should redirect to login when isAuthenticated is false even with token", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        clearAuth: vi.fn(),
      });
      window.localStorage.getItem = vi.fn().mockReturnValue("some-token");

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/login");
      });
    });

    it("should return null when user is authenticated but user object is null", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: null,
        isLoading: false,
        clearAuth: vi.fn(),
      });
      window.localStorage.getItem = vi.fn().mockReturnValue("valid-token");

      const { container } = render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(screen.queryByText("Verificando autenticación...")).not.toBeInTheDocument();
      });

      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
      expect(container.firstChild).toBeNull();
    });

  });

  describe("Loading state transitions", () => {
    it("should transition from loading to redirect when not authenticated", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        clearAuth: vi.fn(),
      });
      window.localStorage.getItem = vi.fn().mockReturnValue(null);

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      // Initially shows loading
      expect(screen.getByText("Verificando autenticación...")).toBeInTheDocument();

      // Then redirects
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/login");
      });
    });
  });

  describe("Children rendering", () => {
    it("should render complex children when authenticated", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
        clearAuth: vi.fn(),
      });
      window.localStorage.getItem = vi.fn().mockReturnValue("valid-token");

      render(
        <ProtectedRoute>
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back!</p>
            <button>Click me</button>
          </div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
        expect(screen.getByText("Welcome back!")).toBeInTheDocument();
        expect(screen.getByText("Click me")).toBeInTheDocument();
      });
    });

    it("should render multiple children when authenticated", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
        clearAuth: vi.fn(),
      });
      window.localStorage.getItem = vi.fn().mockReturnValue("valid-token");

      render(
        <ProtectedRoute>
          <div>First child</div>
          <div>Second child</div>
          <div>Third child</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(screen.getByText("First child")).toBeInTheDocument();
        expect(screen.getByText("Second child")).toBeInTheDocument();
        expect(screen.getByText("Third child")).toBeInTheDocument();
      });
    });
  });

});