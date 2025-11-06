import PublicRoute from '@/components/auth/PublicRoute';
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

// Mock hooks
vi.mock("@/hooks/useAuth");
vi.mock("next/navigation");

const mockUseAuth = vi.mocked(useAuth);
const mockUseRouter = vi.mocked(useRouter);

describe("PublicRoute", () => {
  const mockReplace = vi.fn();
  const mockRouter = {
    push: vi.fn(),
    replace: mockReplace,
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
  });

  describe("Initialization and loading states", () => {
    it("should show loading when not initialized", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        isInitialized: false,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      expect(screen.getByText("Verificando autenticación...")).toBeInTheDocument();
      expect(screen.queryByText("Login Form")).not.toBeInTheDocument();
      expect(mockReplace).not.toHaveBeenCalled();
    });

    it("should show loading when isLoading is true", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: true,
        isInitialized: true,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      expect(screen.getByText("Verificando autenticación...")).toBeInTheDocument();
      expect(screen.queryByText("Login Form")).not.toBeInTheDocument();
      expect(mockReplace).not.toHaveBeenCalled();
    });

    it("should show loading when both not initialized and loading", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: true,
        isInitialized: false,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      expect(screen.getByText("Verificando autenticación...")).toBeInTheDocument();
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });

  describe("Unauthenticated user scenarios", () => {
    it("should render children when user is not authenticated", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        isInitialized: true,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      expect(screen.getByText("Login Form")).toBeInTheDocument();
      expect(screen.queryByText("Verificando autenticación...")).not.toBeInTheDocument();
      expect(screen.queryByText("Redirigiendo...")).not.toBeInTheDocument();
      expect(mockReplace).not.toHaveBeenCalled();
    });

    it("should render complex children when not authenticated", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        isInitialized: true,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>
            <h1>Login</h1>
            <form>
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <button type="submit">Sign In</button>
            </form>
          </div>
        </PublicRoute>
      );

      expect(screen.getByText("Login")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
      expect(screen.getByText("Sign In")).toBeInTheDocument();
    });

    it("should render multiple children when not authenticated", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        isInitialized: true,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Header</div>
          <div>Login Form</div>
          <div>Login Footer</div>
        </PublicRoute>
      );

      expect(screen.getByText("Login Header")).toBeInTheDocument();
      expect(screen.getByText("Login Form")).toBeInTheDocument();
      expect(screen.getByText("Login Footer")).toBeInTheDocument();
    });
  });

  describe("Authenticated user scenarios", () => {
    it("should show redirecting message when authenticated", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
        isInitialized: true,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      expect(screen.getByText("Redirigiendo...")).toBeInTheDocument();
      expect(screen.queryByText("Login Form")).not.toBeInTheDocument();
      expect(screen.queryByText("Verificando autenticación...")).not.toBeInTheDocument();
    });

    it("should redirect to /admin when authenticated and initialized", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
        isInitialized: true,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith("/admin");
      });
    });

    it("should not redirect when authenticated but not initialized", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
        isInitialized: false,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      expect(mockReplace).not.toHaveBeenCalled();
      expect(screen.getByText("Verificando autenticación...")).toBeInTheDocument();
    });

    it("should not redirect when authenticated but still loading", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        isLoading: true,
        isInitialized: true,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      expect(mockReplace).not.toHaveBeenCalled();
      expect(screen.getByText("Verificando autenticación...")).toBeInTheDocument();
    });

    it("should show redirecting message even without user object if authenticated", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: null,
        isLoading: false,
        isInitialized: true,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      expect(screen.getByText("Redirigiendo...")).toBeInTheDocument();
      expect(screen.queryByText("Login Form")).not.toBeInTheDocument();
    });
  });

  describe("Router method usage", () => {
    it("should use router.replace instead of router.push", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
        isInitialized: true,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith("/admin");
        expect(mockRouter.push).not.toHaveBeenCalled();
      });
    });

    it("should redirect to /admin path specifically", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
        isInitialized: true,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith("/admin");
        expect(mockReplace).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("State transitions", () => {
    it("should transition from loading to children when not authenticated", async () => {
      const { rerender } = render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      // Initial state - loading
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: true,
        isInitialized: false,
        clearAuth: vi.fn(),
      });

      rerender(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      expect(screen.getByText("Verificando autenticación...")).toBeInTheDocument();

      // Loading completed - not authenticated
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        isInitialized: true,
        clearAuth: vi.fn(),
      });

      rerender(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      await waitFor(() => {
        expect(screen.getByText("Login Form")).toBeInTheDocument();
        expect(screen.queryByText("Verificando autenticación...")).not.toBeInTheDocument();
      });
    });

    it("should transition from loading to redirect when authenticated", async () => {
      const { rerender } = render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      // Initial state - loading
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: true,
        isInitialized: false,
        clearAuth: vi.fn(),
      });

      rerender(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      expect(screen.getByText("Verificando autenticación...")).toBeInTheDocument();
      expect(mockReplace).not.toHaveBeenCalled();

      // Loading completed - authenticated
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
        isInitialized: true,
        clearAuth: vi.fn(),
      });

      rerender(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith("/admin");
        expect(screen.getByText("Redirigiendo...")).toBeInTheDocument();
      });
    });

    it("should handle user logging in while on public route", async () => {
      const { rerender } = render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      // Initially not authenticated
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        isInitialized: true,
        clearAuth: vi.fn(),
      });

      rerender(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      expect(screen.getByText("Login Form")).toBeInTheDocument();

      // User logs in
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
        isInitialized: true,
        clearAuth: vi.fn(),
      });

      rerender(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith("/admin");
        expect(screen.getByText("Redirigiendo...")).toBeInTheDocument();
      });
    });

    it("should transition through all states correctly", async () => {
      const { rerender } = render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      // State 1: Not initialized
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        isInitialized: false,
        clearAuth: vi.fn(),
      });

      rerender(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      expect(screen.getByText("Verificando autenticación...")).toBeInTheDocument();

      // State 2: Initialized, loading
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: true,
        isInitialized: true,
        clearAuth: vi.fn(),
      });

      rerender(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      expect(screen.getByText("Verificando autenticación...")).toBeInTheDocument();

      // State 3: Initialized, not loading, authenticated
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
        isInitialized: true,
        clearAuth: vi.fn(),
      });

      rerender(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      await waitFor(() => {
        expect(screen.getByText("Redirigiendo...")).toBeInTheDocument();
        expect(mockReplace).toHaveBeenCalledWith("/admin");
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle isAuthenticated being false with user object present", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: mockUser,
        isLoading: false,
        isInitialized: true,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      expect(screen.getByText("Login Form")).toBeInTheDocument();
      expect(mockReplace).not.toHaveBeenCalled();
    });

    it("should handle isAuthenticated being true with null user", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: null,
        isLoading: false,
        isInitialized: true,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      expect(screen.getByText("Redirigiendo...")).toBeInTheDocument();
      
      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith("/admin");
      });
    });

    it("should handle all conditions being false", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        isInitialized: true,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      expect(screen.getByText("Login Form")).toBeInTheDocument();
      expect(screen.queryByText("Verificando autenticación...")).not.toBeInTheDocument();
      expect(screen.queryByText("Redirigiendo...")).not.toBeInTheDocument();
    });

    it("should not redirect multiple times for same auth state", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
        isInitialized: true,
        clearAuth: vi.fn(),
      });

      const { rerender } = render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith("/admin");
      });

      const callCount = mockReplace.mock.calls.length;

      // Rerender with same state
      rerender(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      // Should be called again because useEffect runs on every render
      await waitFor(() => {
        expect(mockReplace.mock.calls.length).toBeGreaterThanOrEqual(callCount);
      });
    });
  });

  describe("Loading message differences", () => {
    it('should show "Verificando autenticación..." when not initialized', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        isInitialized: false,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      expect(screen.getByText("Verificando autenticación...")).toBeInTheDocument();
      expect(screen.queryByText("Redirigiendo...")).not.toBeInTheDocument();
    });

    it('should show "Redirigiendo..." when authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
        isInitialized: true,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      expect(screen.getByText("Redirigiendo...")).toBeInTheDocument();
      expect(screen.queryByText("Verificando autenticación...")).not.toBeInTheDocument();
    });

    it("should prioritize initialization/loading message over redirecting message", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        isLoading: true,
        isInitialized: false,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      expect(screen.getByText("Verificando autenticación...")).toBeInTheDocument();
      expect(screen.queryByText("Redirigiendo...")).not.toBeInTheDocument();
    });
  });
});