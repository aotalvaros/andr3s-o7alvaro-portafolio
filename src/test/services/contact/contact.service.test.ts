import { sendContact } from "@/services/contact/contact.service";
import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "@/lib/axios";

vi.mock("@/lib/axios");

describe("Contact Service", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should send contact message successfully", async () => {
        const mockResponse = { success: true, message: "Contact sent successfully" };
        api.post = vi.fn().mockResolvedValue({ data: mockResponse });

        const payload = { name: "John Doe", email: "john.doe@example.com", message: "Hello, this is a test message." };
        const response = await sendContact(payload);
        expect(response).toEqual(mockResponse);
    });

    it("should handle errors when sending contact message", async () => {
        api.post = vi.fn().mockRejectedValue(new Error("Network Error"));

        const payload = { name: "John Doe", email: "john.doe@example.com", message: "Hello, this is a test message." };
        await expect(sendContact(payload)).rejects.toThrow("Network Error");
    });
});
