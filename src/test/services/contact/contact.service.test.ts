import { sendContact, type ContactPayload } from "@/services/contact/contact.service";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { httpClient } from '@/core/infrastructure/http/httpClientFactory';


vi.mock('@/core/infrastructure/http/httpClientFactory', () => ({
  httpClient: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}));

describe('Contact Service', () => {
  const mockHttpClient = vi.mocked(httpClient);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendContact', () => {
    it('should send the contact message successfully', async () => {
      const mockResponse = { 
        success: true, 
        message: 'Contact sent successfully',
        id: '123'
      };
      
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const payload: ContactPayload = { 
        name: 'John Doe', 
        email: 'john.doe@example.com', 
        message: 'Hello, this is a test message.' 
      };

      const response = await sendContact(payload);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/contact', payload);
      expect(mockHttpClient.post).toHaveBeenCalledTimes(1);
      expect(response).toEqual(mockResponse);
    });

    it('should call the correct endpoint with the complete payload', async () => {
      const mockResponse = { success: true };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const payload: ContactPayload = {
        name: 'Jane Smith',
        email: 'jane.smith@test.com',
        message: 'Testing the contact form'
      };

      await sendContact(payload);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/contact', {
        name: 'Jane Smith',
        email: 'jane.smith@test.com',
        message: 'Testing the contact form'
      });
    });

    it('should return the data directly without additional wrappers', async () => {
      const mockData = { 
        id: 'contact-456',
        timestamp: '2025-12-22T10:00:00Z'
      };
      
      mockHttpClient.post.mockResolvedValue(mockData);

      const payload: ContactPayload = {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message'
      };

      const result = await sendContact(payload);

      // Verifica que retorna directamente lo que devuelve httpClient
      expect(result).toBe(mockData);
    });

    it('should propagate network errors', async () => {
      const networkError = new Error('Network Error');
      mockHttpClient.post.mockRejectedValue(networkError);

      const payload: ContactPayload = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        message: 'Hello, this is a test message.'
      };

      await expect(sendContact(payload)).rejects.toThrow('Network Error');
      expect(mockHttpClient.post).toHaveBeenCalledWith('/contact', payload);
    });

    it('should propagate 500 server errors', async () => {
      const serverError = new Error('Internal Server Error');
      mockHttpClient.post.mockRejectedValue(serverError);

      const payload: ContactPayload = {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Message'
      };

      await expect(sendContact(payload)).rejects.toThrow('Internal Server Error');
    });

    it('should propagate 400 validation errors', async () => {
      const validationError = new Error('Invalid email format');
      mockHttpClient.post.mockRejectedValue(validationError);

      const payload: ContactPayload = {
        name: 'Test',
        email: 'invalid-email',
        message: 'Test'
      };

      await expect(sendContact(payload)).rejects.toThrow('Invalid email format');
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      mockHttpClient.post.mockRejectedValue(timeoutError);

      const payload: ContactPayload = {
        name: 'User',
        email: 'user@test.com',
        message: 'Long message...'
      };

      await expect(sendContact(payload)).rejects.toThrow('Request timeout');
    });
  });

  describe('Payload validation', () => {
    it('should accept names with spaces and special characters', async () => {
      mockHttpClient.post.mockResolvedValue({ success: true });

      const payload: ContactPayload = {
        name: 'José María O\'Connor',
        email: 'jose@example.com',
        message: 'Hola desde Colombia! 🇨🇴'
      };

      await sendContact(payload);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/contact', payload);
    });

    it('should accept long messages', async () => {
      mockHttpClient.post.mockResolvedValue({ success: true });

      const longMessage = 'A'.repeat(5000);
      const payload: ContactPayload = {
        name: 'Test',
        email: 'test@example.com',
        message: longMessage
      };

      await sendContact(payload);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/contact', 
        expect.objectContaining({
          message: longMessage
        })
      );
    });

    it('should maintain the exact email format', async () => {
      mockHttpClient.post.mockResolvedValue({ success: true });

      const payload: ContactPayload = {
        name: 'Test',
        email: 'Test.User+tag@Example.COM',
        message: 'Testing email case sensitivity'
      };

      await sendContact(payload);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/contact', 
        expect.objectContaining({
          email: 'Test.User+tag@Example.COM'
        })
      );
    });
  });

  describe('Integration with httpClient', () => {
    it('should use the POST method of httpClient', async () => {
      mockHttpClient.post.mockResolvedValue({ success: true });

      await sendContact({
        name: 'Test',
        email: 'test@test.com',
        message: 'Test'
      });

      expect(mockHttpClient.post).toHaveBeenCalled();
      expect(mockHttpClient.get).not.toHaveBeenCalled();
      expect(mockHttpClient.put).not.toHaveBeenCalled();
      expect(mockHttpClient.delete).not.toHaveBeenCalled();
    });

    it('should call the /contact endpoint exactly', async () => {
      mockHttpClient.post.mockResolvedValue({ success: true });

      await sendContact({
        name: 'Test',
        email: 'test@test.com',
        message: 'Test'
      });

      const callArgs = mockHttpClient.post.mock.calls[0];
      expect(callArgs[0]).toBe('/contact');
    });
  });
});