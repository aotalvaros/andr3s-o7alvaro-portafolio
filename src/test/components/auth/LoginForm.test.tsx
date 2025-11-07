import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLoginForm } from "@/components/auth/hook/useLoginForm";
import { LoginForm } from "@/components/auth/LoginForm";

vi.mock("@/components/auth/hook/useLoginForm");

vi.mock("react-google-recaptcha", () => ({
  default: vi.fn(({ onChange }) => (
    <div data-testid="recaptcha-mock">
      <button
        data-testid="recaptcha-trigger"
        onClick={() => onChange("mock-recaptcha-token")}
      >
        Verify ReCAPTCHA
      </button>
    </div>
  )),
}));

vi.mock("@/components/ui/input", () => ({
  Input: vi.fn(({ className, ...props }) => (
    <input className={className} {...props} />
  )),
}));

vi.mock("@/components/ui/button", () => ({
  Button: vi.fn(({ children, className, ...props }) => (
    <button className={className} {...props}>
      {children}
    </button>
  )),
}));

vi.mock("@/components/ui/tooltip", () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  TooltipContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-content">{children}</div>
  ),
}));

describe("LoginForm", () => {
  const mockRegister = vi.fn((name) => ({
    name,
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
  }));

  const mockHandleSubmit = vi.fn();

  const mockOnSubmit = vi.fn();
  const mockSetShowPassword = vi.fn();
  const mockOnChangeReCaptcha = vi.fn();
  const mockRecaptchaRef = { current: null };

  const defaultMockReturn = {
    register: mockRegister,
    handleSubmit: mockHandleSubmit,
    errors: {},
    isSubmitting: false,
    onSubmit: mockOnSubmit,
    showPassword: false,
    setShowPassword: mockSetShowPassword,
    recaptchaRef: mockRecaptchaRef,
    onChangeReCaptcha: mockOnChangeReCaptcha,
    isButtonDisabled: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLoginForm).mockReturnValue(defaultMockReturn);
  });
  

  describe("Rendering", () => {
    it("should render login form with all elements", () => {
      render(<LoginForm />);

      expect(screen.getByText(/Iniciar sesión 🔐/i)).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/Ingresa tu email/i)
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/Ingresa tu contraseña/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Iniciar sesión/i })
      ).toBeInTheDocument();
      expect(screen.getByTestId("recaptcha-mock")).toBeInTheDocument();
    });

    it("should render info tooltip", () => {
      render(<LoginForm />);

      const tooltipContent = screen.getByTestId("tooltip-content");
      expect(tooltipContent).toHaveTextContent(
        "Inicio de sesion solo para usuarios registrados (administrador)"
      );
    });

    it("should render password input as password type by default", () => {
      render(<LoginForm />);

      const passwordInput = screen.getByPlaceholderText(
        /Ingresa tu contraseña/i
      );
      expect(passwordInput).toHaveAttribute("type", "password");
    });
  });

  describe("Form Validation Errors", () => {
    it("should display email error message when present", () => {
      vi.mocked(useLoginForm).mockReturnValue({
        ...defaultMockReturn,
        errors: {
          email: {
            message: "Email inválido",
            type: "required",
          },
        },
      });

      render(<LoginForm />);

      expect(screen.getByText("Email inválido")).toBeInTheDocument();
      expect(screen.getByText("Email inválido")).toHaveClass("text-red-500");
    });

    it("should display password error message when present", () => {
      vi.mocked(useLoginForm).mockReturnValue({
        ...defaultMockReturn,
        errors: {
          password: { message: "La contraseña es requerida", type: "required" },
        },
      });

      render(<LoginForm />);

      expect(
        screen.getByText("La contraseña es requerida")
      ).toBeInTheDocument();
      expect(screen.getByText("La contraseña es requerida")).toHaveClass(
        "text-red-500"
      );
    });

    it("should display multiple error messages", () => {
      vi.mocked(useLoginForm).mockReturnValue({
        ...defaultMockReturn,
        errors: {
          email: { message: "Email inválido", type: "invalid" },
          password: { message: "La contraseña es requerida", type: "required" },
        },
      });

      render(<LoginForm />);

      expect(screen.getByText("Email inválido")).toBeInTheDocument();
      expect(
        screen.getByText("La contraseña es requerida")
      ).toBeInTheDocument();
    });
  });

  describe("Password Visibility Toggle", () => {
    it("should show eye icon when password is hidden", () => {
      render(<LoginForm />);

      const eyeIcon = screen.getByRole("button", { name: "" });
      expect(eyeIcon.querySelector("svg")).toBeInTheDocument();
    });

    it("should show EyeOff icon when password is visible", () => {
      vi.mocked(useLoginForm).mockReturnValue({
        ...defaultMockReturn,
        showPassword: true,
      });

      render(<LoginForm />);

      const passwordInput = screen.getByPlaceholderText(
        /Ingresa tu contraseña/i
      );
      expect(passwordInput).toHaveAttribute("type", "text");
    });
  });

  describe("Form Submission", () => {
    it("should call onSubmit when form is submitted", async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const submitButton = screen.getByRole("button", {
        name: /Iniciar sesión/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockHandleSubmit).toHaveBeenCalled();
      });
    });

    it("should disable submit button when isSubmitting is true", () => {
      vi.mocked(useLoginForm).mockReturnValue({
        ...defaultMockReturn,
        isSubmitting: true,
      });

      render(<LoginForm />);

      const submitButton = screen.getByRole("button", {
        name: /Iniciando sesión.../i,
      });
      expect(submitButton).toBeDisabled();
    });

    it("should disable submit button when isButtonDisabled is true", () => {
      vi.mocked(useLoginForm).mockReturnValue({
        ...defaultMockReturn,
        isButtonDisabled: true,
      });

      render(<LoginForm />);

      const submitButton = screen.getByRole("button", {
        name: /Iniciar sesión/i,
      });
      expect(submitButton).toBeDisabled();
    });

    it("should show loading text when submitting", () => {
      vi.mocked(useLoginForm).mockReturnValue({
        ...defaultMockReturn,
        isSubmitting: true,
      });

      render(<LoginForm />);

      expect(screen.getByText("Iniciando sesión...")).toBeInTheDocument();
    });

    it("should enable submit button when not submitting and not disabled", () => {
      render(<LoginForm />);

      const submitButton = screen.getByRole("button", {
        name: /Iniciar sesión/i,
      });
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe("ReCAPTCHA", () => {
    it("should render ReCAPTCHA component", () => {
      render(<LoginForm />);

      expect(screen.getByTestId("recaptcha-mock")).toBeInTheDocument();
    });

    it("should call onChangeReCaptcha when ReCAPTCHA is verified", async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const recaptchaButton = screen.getByTestId("recaptcha-trigger");
      await user.click(recaptchaButton);

      expect(mockOnChangeReCaptcha).toHaveBeenCalledWith(
        "mock-recaptcha-token"
      );
    });

    it("should pass correct sitekey to ReCAPTCHA", () => {
      const originalEnv = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY;
      process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY = "test-site-key";

      render(<LoginForm />);

      expect(screen.getByTestId("recaptcha-mock")).toBeInTheDocument();

      process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY = originalEnv;
    });
  });

  describe("Form Inputs Registration", () => {
    it("should register email input", () => {
      render(<LoginForm />);

      expect(mockRegister).toHaveBeenCalledWith("email");
    });

    it("should register password input", () => {
      render(<LoginForm />);

      expect(mockRegister).toHaveBeenCalledWith("password");
    });
  });

  describe("Styling and Classes", () => {
    it("should apply dark mode classes to inputs", () => {
      render(<LoginForm />);

      const emailInput = screen.getByPlaceholderText(/Ingresa tu email/i);
      const passwordInput = screen.getByPlaceholderText(
        /Ingresa tu contraseña/i
      );

      expect(emailInput).toHaveClass(
        "dark:text-white",
        "dark:placeholder:text-secondary-foreground"
      );
      expect(passwordInput).toHaveClass(
        "dark:text-white",
        "dark:placeholder:text-secondary-foreground"
      );
    });

    it("should apply correct classes to submit button", () => {
      render(<LoginForm />);

      const submitButton = screen.getByRole("button", {
        name: /Iniciar sesión/i,
      });
      expect(submitButton).toHaveClass(
        "w-full",
        "dark:text-gray-800",
        "text-white",
        "select-none"
      );
    });

    it("should apply correct classes to form container", () => {
      render(<LoginForm />);

      const form = screen
        .getByRole("button", { name: /Iniciar sesión/i })
        .closest("form");
      expect(form).toHaveClass(
        "max-w-md",
        "w-full",
        "space-y-6",
        "bg-white",
        "dark:bg-gray-800",
        "rounded-lg",
        "shadow-md",
        "border"
      );
    });
  });

  describe("User Interactions", () => {
    it("should allow typing in email input", async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const emailInput = screen.getByPlaceholderText(/Ingresa tu email/i);
      await user.type(emailInput, "test@example.com");

      expect(emailInput).toHaveValue("test@example.com");
    });

    it("should allow typing in password input", async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const passwordInput = screen.getByPlaceholderText(
        /Ingresa tu contraseña/i
      );
      await user.type(passwordInput, "password123");

      expect(passwordInput).toHaveValue("password123");
    });
  });
});
