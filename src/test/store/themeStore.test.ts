import { useThemeStore } from "@/store/themeStore";
import { describe, it, expect, beforeEach } from "vitest";

describe("useThemeStore", () => {
    beforeEach(() => {
        // Reset the store state before each test
        useThemeStore.setState({ isDarkMode: false });
    });

    it("should have isDarkMode as false by default", () => {
        expect(useThemeStore.getState().isDarkMode).toBe(false);
    });

    it("should toggle isDarkMode to true", () => {
        useThemeStore.getState().toggleTheme();
        expect(useThemeStore.getState().isDarkMode).toBe(true);
    });

    it("should toggle isDarkMode back to false", () => {
        useThemeStore.getState().toggleTheme();
        useThemeStore.getState().toggleTheme();
        expect(useThemeStore.getState().isDarkMode).toBe(false);
    });

    it("should toggle multiple times correctly", () => {
        useThemeStore.getState().toggleTheme();
        expect(useThemeStore.getState().isDarkMode).toBe(true);
        useThemeStore.getState().toggleTheme();
        expect(useThemeStore.getState().isDarkMode).toBe(false);
        useThemeStore.getState().toggleTheme();
        expect(useThemeStore.getState().isDarkMode).toBe(true);
    });

    it("should allow direct state mutation for isDarkMode", () => {
        useThemeStore.setState({ isDarkMode: true });
        expect(useThemeStore.getState().isDarkMode).toBe(true);
        useThemeStore.setState({ isDarkMode: false });
        expect(useThemeStore.getState().isDarkMode).toBe(false);
    });
});