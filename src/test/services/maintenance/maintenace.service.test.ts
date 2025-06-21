import { getMaintenanceStatus } from "@/services/maintenance/maintenace.service";
import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "@/lib/axios";

vi.mock("@/lib/axios");

describe("Maintenance Service", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should fetch maintenance status successfully", async () => {
        const mockResponse = [
            { module: "Module1", status: "active" },
            { module: "Module2", status: "inactive" },
        ];
        api.get = vi.fn().mockResolvedValue({ data: mockResponse });

        const response = await getMaintenanceStatus();
        expect(response).toEqual(mockResponse);
    });

    it("should handle errors when fetching maintenance status", async () => {
        api.get = vi.fn().mockRejectedValue(new Error("Network Error"));

        await expect(getMaintenanceStatus()).rejects.toThrow("Network Error");
    });
});