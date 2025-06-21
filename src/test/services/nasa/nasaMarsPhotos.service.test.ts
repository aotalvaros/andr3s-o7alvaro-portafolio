/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchMarsPhotos } from "@/services/nasa/nasaMarsPhotos.service";
import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "@/lib/axios";
import { IFetchMarsPhotosParams } from "@/services/nasa/models/fetchMarsPhotosParams.interface";

vi.mock("@/lib/axios");

describe("NASA Mars Photos Service", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should fetch Mars photos successfully", async () => {
        const mockResponse = {
            photos: [
                { id: 1, img_src: "https://example.com/photo1.jpg", sol: 1000 },
                { id: 2, img_src: "https://example.com/photo2.jpg", sol: 1001 },
            ],
        };

        api.get = vi.fn().mockResolvedValue({ data: mockResponse });

        const params: IFetchMarsPhotosParams = {
            rover: "curiosity",
            sol: 1000,
            page: 1,
        }

        const response = await fetchMarsPhotos(params);
        expect(api.get).toHaveBeenCalledWith("/mars-photos/api/v1/rovers/curiosity/photos", {
            baseURL: "https://api.nasa.gov",
            params: {
                api_key: process.env.NEXT_PUBLIC_NASA_API_KEY ?? "DEMO_KEY",
                page: "1",
                sol: "1000",
            },
        });
        expect(response).toEqual(mockResponse.photos);
    });
    
    it("should throw error if neither sol nor earth_date is provided", async () => {
        const params: IFetchMarsPhotosParams = {
            rover: "curiosity",
            page: 1,
        } as any;

        await expect(fetchMarsPhotos(params)).rejects.toThrow(
            "Debes proporcionar `sol` o `earth_date`"
        );
    });

    it("should use earth_date if provided", async () => {
        const mockResponse = {
            photos: [
                { id: 3, img_src: "https://example.com/photo3.jpg", earth_date: "2020-01-01" },
            ],
        };

        api.get = vi.fn().mockResolvedValue({ data: mockResponse });

        const params: IFetchMarsPhotosParams = {
            rover: "opportunity",
            earth_date: "2020-01-01",
            page: 2,
        };

        const response = await fetchMarsPhotos(params);

        expect(api.get).toHaveBeenCalledWith("/mars-photos/api/v1/rovers/opportunity/photos", {
            baseURL: "https://api.nasa.gov",
            params: {
                api_key: process.env.NEXT_PUBLIC_NASA_API_KEY ?? "DEMO_KEY",
                page: "2",
                earth_date: "2020-01-01",
            },
        });
        expect(response).toEqual(mockResponse.photos);
    });

    it("should include camera param if provided", async () => {
        const mockResponse = { photos: [] };
        api.get = vi.fn().mockResolvedValue({ data: mockResponse });

        const params: IFetchMarsPhotosParams = {
            rover: "spirit",
            sol: 1500,
            camera: "FHAZ",
            page: 3,
        };

        await fetchMarsPhotos(params);

        expect(api.get).toHaveBeenCalledWith("/mars-photos/api/v1/rovers/spirit/photos", {
            baseURL: "https://api.nasa.gov",
            params: {
                api_key: process.env.NEXT_PUBLIC_NASA_API_KEY ?? "DEMO_KEY",
                page: "3",
                sol: "1500",
                camera: "FHAZ",
            },
        });
    });

    it("should default to DEMO_KEY if env variable is not set", async () => {
        const oldEnv = process.env.NEXT_PUBLIC_NASA_API_KEY;
        delete process.env.NEXT_PUBLIC_NASA_API_KEY;

        const mockResponse = { photos: [] };
        api.get = vi.fn().mockResolvedValue({ data: mockResponse });

        const params: IFetchMarsPhotosParams = {
            rover: "curiosity",
            sol: 100,
            page: 1,
        };

        await fetchMarsPhotos(params);

        expect(api.get).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                params: expect.objectContaining({
                    api_key: "DEMO_KEY",
                }),
            })
        );

        process.env.NEXT_PUBLIC_NASA_API_KEY = oldEnv;
    });

    it("should convert sol and page to string", async () => {
        const mockResponse = { photos: [] };
        api.get = vi.fn().mockResolvedValue({ data: mockResponse });

        const params: IFetchMarsPhotosParams = {
            rover: "curiosity",
            sol: 1234,
            page: 5,
        };

        await fetchMarsPhotos(params);

        expect(api.get).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                params: expect.objectContaining({
                    sol: "1234",
                    page: "5",
                }),
            })
        );
    });

    it("should propagate api errors", async () => {
        api.get = vi.fn().mockRejectedValue(new Error("API error"));
        const params: IFetchMarsPhotosParams = {
            rover: "curiosity",
            sol: 1000,
            page: 1,
        };
        await expect(fetchMarsPhotos(params)).rejects.toThrow("API error");
    });

});