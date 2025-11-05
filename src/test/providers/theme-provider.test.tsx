/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@/providers/theme-provider";
import { useThemeStore } from "@/store/themeStore";

// Mock useThemeStore hook from zustand
vi.mock("@/store/themeStore")



describe("ThemeProvider", () => {
  beforeEach(() => {
    // Default: not dark mode (false), can toggle
    vi.mocked(useThemeStore).mockImplementation(
      (selector: any) => selector({ isDarkMode: false, toggleTheme: vi.fn() })
    );
    vi.resetAllMocks();
    document.body.className = ""; // Clean class for each test
  });

  afterEach(() => {
    // Clean up document.body classes after every test
    document.body.className = "";
  });

  it("renders children when mounted", async () => {
    render(
      <ThemeProvider>
        <div data-testid="child">Test Child</div>
      </ThemeProvider>
    );
    expect(await screen.findByTestId("child")).toBeInTheDocument();
  });

  it("adds dark class when isDarkMode=true after mount", async () => {
    // Dark mode ON
     vi.mocked(useThemeStore).mockImplementation(
      (selector: any) => selector({ isDarkMode: true, toggleTheme: vi.fn() })
    );
    render(
      <ThemeProvider>
        <div>Child</div>
      </ThemeProvider>
    );
    // Wait for useEffect to run
    await new Promise((r) => setTimeout(r, 10));
    expect(document.body.classList.contains("dark")).toBe(true);
  });

  it("removes dark class when isDarkMode=false after mount", async () => {
    // Dark mode OFF
     vi.mocked(useThemeStore).mockImplementation(
      (selector: any) => selector({ isDarkMode: false, toggleTheme: vi.fn() })
    );
    document.body.classList.add("dark"); // simulate class present before render
    render(
      <ThemeProvider>
        <div>Child</div>
      </ThemeProvider>
    );
    await new Promise((r) => setTimeout(r, 10));
    expect(document.body.classList.contains("dark")).toBe(false);
  });

  it("reacts to isDarkMode changes and toggles body class", async () => {
    const state = { isDarkMode: false, toggleTheme: vi.fn() };
    vi.mocked(useThemeStore).mockImplementation((selector: any) => selector(state));
    const { rerender } = render(
      <ThemeProvider>
        <div>Child</div>
      </ThemeProvider>
    );
    await new Promise((r) => setTimeout(r, 10));
    expect(document.body.classList.contains("dark")).toBe(false);

    // Change to dark mode
    state.isDarkMode = true;
    rerender(
      <ThemeProvider>
        <div>Child</div>
      </ThemeProvider>
    );
    await new Promise((r) => setTimeout(r, 10));
    expect(document.body.classList.contains("dark")).toBe(true);

    // Toggle back to light
    state.isDarkMode = false;
    rerender(
      <ThemeProvider>
        <div>Child</div>
      </ThemeProvider>
    );
    await new Promise((r) => setTimeout(r, 10));
    expect(document.body.classList.contains("dark")).toBe(false);
  });


  it("should handle unexpected store shape gracefully", () => {
    // Mock store without isDarkMode
     vi.mocked(useThemeStore).mockImplementation((selector: any) => selector({}));
    render(
      <ThemeProvider>
        <div data-testid="child">Test Child</div>
      </ThemeProvider>
    );
    // Should not throw, should render children
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(document.body.className).toBe("");
  });
});