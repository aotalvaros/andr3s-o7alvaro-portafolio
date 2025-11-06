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
  });

  describe("Authentication checks", () => {
    it("should render children when user is not authenticated", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      await waitFor(() => {
        expect(screen.getByText("Login Form")).toBeInTheDocument();
      });

      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should redirect to /admin when user is authenticated", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/admin");
      });
    });

    it("should show loading message when authenticated and checking", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      expect(screen.getByText("Redirigiendo...")).toBeInTheDocument();
    });

    it("should not show loading message when not authenticated", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      await waitFor(() => {
        expect(screen.queryByText("Redirigiendo...")).not.toBeInTheDocument();
      });

      expect(screen.getByText("Login Form")).toBeInTheDocument();
    });
  });

  describe("Loading state transitions", () => {
    it("should transition from loading to redirect when authenticated", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      // Initially shows loading
      expect(screen.getByText("Redirigiendo...")).toBeInTheDocument();

      // Then redirects
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/admin");
      });
    });

    it("should show children immediately when not authenticated", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      await waitFor(() => {
        expect(screen.getByText("Login Form")).toBeInTheDocument();
      });

      expect(screen.queryByText("Redirigiendo...")).not.toBeInTheDocument();
    });
  });

  describe("Redirect behavior", () => {
    it("should redirect to /admin path", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/admin");
        expect(mockPush).toHaveBeenCalledTimes(1);
      });
    });

    it("should not redirect when isAuthenticated is false", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      await waitFor(() => {
        expect(screen.getByText("Login Form")).toBeInTheDocument();
      });

      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should redirect even if user object is present but isAuthenticated is true", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/admin");
      });
    });
  });

  describe("Children rendering", () => {
    it("should render simple children when not authenticated", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Simple Login</div>
        </PublicRoute>
      );

      await waitFor(() => {
        expect(screen.getByText("Simple Login")).toBeInTheDocument();
      });
    });

    it("should render complex children when not authenticated", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: false,
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

      await waitFor(() => {
        expect(screen.getByText("Login")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
        expect(screen.getByText("Sign In")).toBeInTheDocument();
      });
    });

    it("should render multiple children when not authenticated", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Header</div>
          <div>Login Form</div>
          <div>Login Footer</div>
        </PublicRoute>
      );

      await waitFor(() => {
        expect(screen.getByText("Login Header")).toBeInTheDocument();
        expect(screen.getByText("Login Form")).toBeInTheDocument();
        expect(screen.getByText("Login Footer")).toBeInTheDocument();
      });
    });

    it("should not render children when authenticated and redirecting", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      // Should show loading, not children
      expect(screen.getByText("Redirigiendo...")).toBeInTheDocument();
      expect(screen.queryByText("Login Form")).not.toBeInTheDocument();

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/admin");
      });
    });
  });

  describe("useEffect dependencies", () => {
    it("should handle rapid authentication state changes", async () => {
      const { rerender } = render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      // Not authenticated
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        clearAuth: vi.fn(),
      });

      rerender(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      await waitFor(() => {
        expect(screen.getByText("Login Form")).toBeInTheDocument();
      });

      // Authenticated
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
        clearAuth: vi.fn(),
      });

      rerender(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/admin");
      });

      // Back to not authenticated
      vi.clearAllMocks();
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        clearAuth: vi.fn(),
      });

      rerender(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      await waitFor(() => {
        expect(screen.getByText("Login Form")).toBeInTheDocument();
      });

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe("Edge cases", () => {
    it("should handle isAuthenticated being true with null user", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: null,
        isLoading: false,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/admin");
      });
    });

    it("should handle isAuthenticated being false with user object present", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: mockUser,
        isLoading: false,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      await waitFor(() => {
        expect(screen.getByText("Login Form")).toBeInTheDocument();
      });

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe("Loading message display logic", () => {
    it("should only show loading when both isChecking and isAuthenticated are true", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      // Initially isChecking is true and isAuthenticated is true
      expect(screen.getByText("Redirigiendo...")).toBeInTheDocument();
    });

    it("should not show loading when isAuthenticated is false even if isChecking", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        clearAuth: vi.fn(),
      });

      render(
        <PublicRoute>
          <div>Login Form</div>
        </PublicRoute>
      );

      // Even though isChecking might be true initially, 
      // loading message should not appear when isAuthenticated is false
      await waitFor(() => {
        expect(screen.queryByText("Redirigiendo...")).not.toBeInTheDocument();
        expect(screen.getByText("Login Form")).toBeInTheDocument();
      });
    });
  });
});