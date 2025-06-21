import { fetchNasaPhotoOfTheDay } from "@/services/nasa/nasa.service";
import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "@/lib/axios";

vi.mock("@/lib/axios");

describe("NASA Service", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should fetch NASA photo of the day successfully", async () => {
        const mockResponse = {
            title: "Test Photo",
            url: "https://example.com/photo.jpg",
            explanation: "This is a test photo from NASA.",
        };

        api.get = vi.fn().mockResolvedValue({ data: mockResponse });

        const response = await fetchNasaPhotoOfTheDay();
        expect(response).toEqual(mockResponse);
    });

    it("should handle errors when fetching NASA photo of the day", async () => {
        api.get = vi.fn().mockRejectedValue(new Error("Network Error"));

        await expect(fetchNasaPhotoOfTheDay()).rejects.toThrow("Network Error");
    });
});