import RootLayout from "@/app/layout";
import { screen, render } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, vi, describe, it, expect } from 'vitest'

vi.mock('@/components/theme-provider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="theme-provider">{children}</div>,
}));

vi.mock('@/app/providers', () => ({
  Providers: ({ children }: { children: React.ReactNode }) => <div data-testid="providers">{children}</div>,
}));

vi.mock('@/context/SocketContext', () => ({
  SocketProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="socket-provider">{children}</div>,
}));

vi.mock('@/components/ui/ToastMessageComponent', () => ({
    ToastMessage: () => <div data-testid="toast-message" />,
}));

describe("Test RootLayout component", () => {
  beforeEach(() => {
      vi.clearAllMocks();
  });

  afterEach(() => {
      vi.restoreAllMocks();
  });

  it("renders children correctly", () => {
      render(<RootLayout><div>Test Child</div></RootLayout>);
      expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("renders all providers and UI components", () => {
      render(<RootLayout><div>Test</div></RootLayout>);
      expect(screen.getByTestId("theme-provider")).toBeInTheDocument();
      expect(screen.getByTestId("providers")).toBeInTheDocument();
      expect(screen.getByTestId("socket-provider")).toBeInTheDocument();
      expect(screen.getByTestId("toast-message")).toBeInTheDocument();
  });

  it("renders children inside providers", () => {
      render(<RootLayout><span data-testid="child-span">Child</span></RootLayout>);
      const child = screen.getByTestId("child-span");
      expect(child).toBeInTheDocument();

      expect(child.closest('[data-testid="providers"]')).not.toBeNull();
      expect(child.closest('[data-testid="theme-provider"]')).not.toBeNull();
  });

  it("renders Toaster with correct props", () => {
      render(<RootLayout><div>Test</div></RootLayout>);
      const toaster = screen.getByTestId("toast-message");
      expect(toaster).toBeInTheDocument();
  });
});
