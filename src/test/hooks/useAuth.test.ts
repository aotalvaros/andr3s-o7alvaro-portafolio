import { useAuth } from "@/hooks/useAuth";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { describe, it, expect, beforeEach, vi, beforeAll } from "vitest";
import { renderHook } from "@testing-library/react";

const mockGetCookie = vi.mocked(getCookie);
const mockJwtDecode = vi.mocked(jwtDecode);

vi.mock("cookies-next");

vi.mock("jwt-decode");

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  beforeAll(() => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  it("should return null user if no token is present", () => {
    mockGetCookie.mockReturnValue(undefined);
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("should decode token and set user if token is valid", () => {
    const mockToken = "valid.token.here";
    const mockDecodedToken = {
      email: "user@example.com"
    };
    mockGetCookie.mockReturnValue(mockToken);
    mockJwtDecode.mockReturnValue(mockDecodedToken);
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toEqual(mockDecodedToken);
    expect(result.current.isAuthenticated).toBe(true);
  });
  it("should set user to null if token is expired", () => {
    const mockToken = "expired.token.here";
    const expiredDecodedToken = {
      email: "expired@example.com",
      role: "user",
      name: "Expired User",
      iat: 1000,
      exp: Math.floor(Date.now() / 1000) - 100, // expired
    };
    mockGetCookie.mockReturnValue(mockToken);
    mockJwtDecode.mockReturnValue(expiredDecodedToken);
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
  
  it("should handle invalid token and not throw", () => {
    const mockToken = "invalid.token";
    mockGetCookie.mockReturnValue(mockToken);
    mockJwtDecode.mockImplementation(() => {
      throw new Error("Invalid token");
    });
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(errorSpy).toHaveBeenCalledWith(
      "Token inválido",
      expect.any(Error)
    );
    errorSpy.mockRestore();
  });
  
  it("should set user to null if jwtDecode returns undefined", () => {
    const mockToken = "token.with.undefined.decode";
    mockGetCookie.mockReturnValue(mockToken);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockJwtDecode.mockReturnValue(undefined as any)
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
  
  it("should not set user if getCookie returns undefined", () => {
    mockGetCookie.mockReturnValue(undefined);
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
  
  it("should not set user if getCookie returns empty string", () => {
    mockGetCookie.mockReturnValue("");
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
