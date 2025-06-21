import api from "@/lib/axios";
import { fetchAsteroidById, fetchAsteroids } from "@/services/nasaAsteroids";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/axios");

describe("NASA Asteroids Service", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should fetch all asteroids", async () => {

        api.get = vi.fn().mockResolvedValue({
            data: {
                asteroids: [
                    { id: "1", name: "Asteroid 1" },
                    { id: "2", name: "Asteroid 2" },
                ],
            },
        });

        const asteroids = await fetchAsteroids();
        expect(asteroids).toEqual({
            asteroids: [
                { id: "1", name: "Asteroid 1" },
                { id: "2", name: "Asteroid 2" },
            ],
        });
    });

   it("should fetch an asteroid by id", async () => {
       api.get = vi.fn().mockResolvedValue({
           data: {
                id: "1",
                name: "Asteroid 1",
                size: "Large",
              },
              headers: {
                "Content-Type": "application/json",
              },
           })

       const asteroid = await fetchAsteroidById("1");
       expect(asteroid).toEqual({
           id: "1",
           name: "Asteroid 1",
           size: "Large",
       });  

         expect(api.get).toHaveBeenCalledWith("https://api.nasa.gov/neo/rest/v1/neo/1", {
              params: {
                api_key: process.env.NEXT_PUBLIC_NASA_API_KEY ?? "DEMO_KEY",
              },
         });
    });
    

    it("should handle errors when fetching asteroids", async () => {
        api.get = vi.fn().mockRejectedValue(new Error("Network Error"));

        await expect(fetchAsteroids()).rejects.toThrow("Network Error");
    });

    it("should handle errors when fetching an asteroid by id", async () => {
        api.get = vi.fn().mockRejectedValue(new Error("Network Error"));

        await expect(fetchAsteroidById("1")).rejects.toThrow("Network Error");
    });

})
