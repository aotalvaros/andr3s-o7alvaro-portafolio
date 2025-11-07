/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLogin } from "@/components/auth/hook/useLogin";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useLoginForm } from "@/components/auth/hook/useLoginForm";
import { renderHook, act } from "@testing-library/react";
import { useForm } from "react-hook-form";

vi.mock("@/components/auth/hook/useLogin");
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    query: {},
  }),
}));
vi.mock("react-hook-form", async (importActual) => {
  const actual = await importActual<typeof import("react-hook-form")>();
  return {
    ...actual,
    useForm: vi.fn().mockReturnValue({
      control: {},
      handleSubmit: vi.fn(),
      register: vi.fn(),
      formState: { errors: {} },
    }),
  };
});
vi.mock("react-google-recaptcha", () => {
  return {
    __esModule: true,
    default: vi.fn().mockImplementation(() => null),
  };
});

describe("useLoginForm", () => {
  const mockauth = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useLogin as any).mockReturnValue({
      auth: mockauth,
    });

    (useForm as any).mockReturnValue({
      register: vi.fn(),
      handleSubmit: vi.fn((fn) => fn),
      formState: {
        errors: {},
        isSubmitting: false,
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should initialize with correct default values", () => {
    const { result } = renderHook(() => useLoginForm());

    expect(result.current.showPassword).toBe(false);
    expect(result.current.isButtonDisabled).toBe(true);
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it("should toggle password visibility", () => {
    const { result } = renderHook(() => useLoginForm());

    expect(result.current.showPassword).toBe(false);

    act(() => {
      result.current.setShowPassword(true);
    });

    expect(result.current.showPassword).toBe(true);
  });

  it("should call auth function on form submission", async () => {
    const { result } = renderHook(() => useLoginForm());
    const mockFormData = { email: "test@test.com", password: "password123" };

    await act(async () => {
      await result.current.onSubmit(mockFormData);
    });

    expect(mockauth).toHaveBeenCalledWith(mockFormData, {
      onSuccess: expect.any(Function),
    });
  });

  it("should handle authentication errors", async () => {
    const mockError = new Error("Authentication failed");
    mockauth.mockRejectedValue(mockError);

    const { result } = renderHook(() => useLoginForm());
    const mockFormData = { email: "test@test.com", password: "password123" };

    await expect(
      act(async () => {
        await result.current.onSubmit(mockFormData);
      })
    ).rejects.toThrow("Authentication failed");
  });

  it("should enable button when reCAPTCHA is completed", () => {
    const mockGetValue = vi.fn().mockReturnValue("recaptcha-token");
    const mockRecaptchaRef = {
      current: {
        getValue: mockGetValue,
      },
    };

    const { result } = renderHook(() => useLoginForm());

    // Mock the ref to have a value
    Object.defineProperty(result.current.recaptchaRef, "current", {
      value: mockRecaptchaRef.current,
      writable: true,
    });

    act(() => {
      result.current.onChangeReCaptcha();
    });

    expect(result.current.isButtonDisabled).toBe(false);
  });

  it("should disable button when reCAPTCHA is not completed", () => {
    const mockGetValue = vi.fn().mockReturnValue(null);
    const mockRecaptchaRef = {
      current: {
        getValue: mockGetValue,
      },
    };

    const { result } = renderHook(() => useLoginForm());

    // Mock the ref to have no value
    Object.defineProperty(result.current.recaptchaRef, "current", {
      value: mockRecaptchaRef.current,
      writable: true,
    });

    act(() => {
      result.current.onChangeReCaptcha();
    });

    expect(result.current.isButtonDisabled).toBe(true);
  });

  it("should handle form validation errors", () => {
    const mockErrors = {
      email: { message: "Email is required" },
      password: { message: "Password is required" },
    };

    (useForm as any).mockReturnValue({
      register: vi.fn(),
      handleSubmit: vi.fn(),
      formState: {
        errors: mockErrors,
        isSubmitting: false,
      },
    });

    const { result } = renderHook(() => useLoginForm());

    expect(result.current.errors).toEqual(mockErrors);
  });

  it("should show submitting state during authentication", () => {
    (useForm as any).mockReturnValue({
      register: vi.fn(),
      handleSubmit: vi.fn(),
      formState: {
        errors: {},
        isSubmitting: true,
      },
    });

    const { result } = renderHook(() => useLoginForm());

    expect(result.current.isSubmitting).toBe(true);
  });

  it("should return all required form methods and state", () => {
    const { result } = renderHook(() => useLoginForm());

    expect(result.current).toHaveProperty("register");
    expect(result.current).toHaveProperty("handleSubmit");
    expect(result.current).toHaveProperty("errors");
    expect(result.current).toHaveProperty("isSubmitting");
    expect(result.current).toHaveProperty("onSubmit");
    expect(result.current).toHaveProperty("showPassword");
    expect(result.current).toHaveProperty("setShowPassword");
    expect(result.current).toHaveProperty("recaptchaRef");
    expect(result.current).toHaveProperty("onChangeReCaptcha");
    expect(result.current).toHaveProperty("isButtonDisabled");
  });

  it("should handle reCAPTCHA ref being null", () => {
    const { result } = renderHook(() => useLoginForm());

    // Ensure ref is null initially
    expect(result.current.recaptchaRef.current).toBeNull();

    // Should not throw error when ref is null
    expect(() => {
      act(() => {
        result.current.onChangeReCaptcha();
      });
    }).not.toThrow();

    expect(result.current.isButtonDisabled).toBe(true);
  });
});
