import LoginPage from "@/app/(public)/login/page";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock('@/components/auth/LoginForm', () => ({
  LoginForm: () => <div data-testid="login-form">Login Form</div>,
}));

const setLoadingMock = vi.fn();
vi.mock('@/store/loadingStore', () => ({
  useLoadingStore: (selector: (store: { setLoading: typeof setLoadingMock }) => unknown) => selector({ setLoading: setLoadingMock }),
}));

describe("LoginPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the LoginForm component", () => {
    render(<LoginPage />);
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });

  it("should call setLoading(false) on mount", () => {
    render(<LoginPage />);
    expect(setLoadingMock).toHaveBeenCalledWith(false);
  });

  it("should render main with correct classes", () => {
    render(<LoginPage />);
    const main = screen.getByRole("main");
    expect(main).toHaveClass(
      "pt-22",
      "flex",
      "items-center",
      "justify-center",
      "bg-muted",
      "px-4",
      "dark:bg-primary-foreground"
    );
  });
});
