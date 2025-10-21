import { toggleModule } from "@/services/maintenance/toggleModule.service";
import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "@/lib/axios";
import { ToggleModuleRequest } from "@/services/maintenance/models/toggleModuleRequest.interface";

vi.mock("@/lib/axios");

describe("Toggle Module Service", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should toggle a module successfully", async () => {
        const mockResponse = {
            message: "Module toggled successfully",
            data: { moduleName: "testModule", enabled: true },
        };

        api.post = vi.fn().mockResolvedValue({ data: mockResponse });

        const requestData: ToggleModuleRequest = { moduleName: "testModule", status: true };
        const response = await toggleModule(requestData);
        
        expect(response).toEqual(mockResponse);
        expect(api.post).toHaveBeenCalledWith('/modules/toggle', requestData, { showLoading: false });
    });

    it("should handle errors when toggling a module", async () => {
        api.post = vi.fn().mockRejectedValue(new Error("Network Error"));

        const requestData: ToggleModuleRequest = { moduleName: "testModule", status: true };
        await expect(toggleModule(requestData)).rejects.toThrow("Network Error");
    });
});