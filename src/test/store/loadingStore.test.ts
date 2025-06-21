import { useLoadingStore } from "@/store/loadingStore";
import { describe, it, expect, beforeEach } from "vitest";

describe("useLoadingStore", () => {
    beforeEach(() => {
        // Reset the store state before each test
        useLoadingStore.setState({ isLoading: false });
    });

    it("should have isLoading as false by default", () => {
        expect(useLoadingStore.getState().isLoading).toBe(false);
    });

    it("should set isLoading to true", () => {
        useLoadingStore.getState().setLoading(true);
        expect(useLoadingStore.getState().isLoading).toBe(true);
    });

    it("should set isLoading to false", () => {
        useLoadingStore.getState().setLoading(true);
        useLoadingStore.getState().setLoading(false);
        expect(useLoadingStore.getState().isLoading).toBe(false);
    });

    it("should allow multiple toggles", () => {
        useLoadingStore.getState().setLoading(true);
        expect(useLoadingStore.getState().isLoading).toBe(true);
        useLoadingStore.getState().setLoading(false);
        expect(useLoadingStore.getState().isLoading).toBe(false);
        useLoadingStore.getState().setLoading(true);
        expect(useLoadingStore.getState().isLoading).toBe(true);
    });

    it("should not mutate state if setLoading is called with the same value", () => {
        useLoadingStore.getState().setLoading(false);
        expect(useLoadingStore.getState().isLoading).toBe(false);
        useLoadingStore.getState().setLoading(false);
        expect(useLoadingStore.getState().isLoading).toBe(false);
    });
});
