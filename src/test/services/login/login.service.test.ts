import { login } from "@/services/login/login.service";
import { describe, it, expect, vi } from "vitest";
import api from "@/lib/axios";

vi.mock("@/lib/axios");

describe("Login Service", () => {
   
    it("should login successfully", async () => {
        api.post = vi.fn().mockResolvedValue({
            data: {
                token: "test-token",
                refreshToken: "test-refresh-token",
            },
        });

        const payload = { email: "john.doe@example.com", password: "password123" };
        const response = await login(payload);
        expect(response).toEqual({
            token: "test-token",
            refreshToken: "test-refresh-token",
        });
    });

    it("should handle login errors", async () => {
        api.post = vi.fn().mockRejectedValue(new Error("Login failed"));

        const payload = { email: "john.doe@example.com", password: "password123" };
        await expect(login(payload)).rejects.toThrow("Login failed");
    });
});
