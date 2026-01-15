/* eslint-disable @typescript-eslint/no-explicit-any */
import { toggleModule, type ToggleModuleResponse } from "@/services/maintenance/toggleModule.service";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ToggleModuleRequest } from "@/services/maintenance/models/toggleModuleRequest.interface";
import { httpClient } from '@/core/infrastructure/http/httpClientFactory';

// Mock httpClient factory
vi.mock('@/core/infrastructure/http/httpClientFactory', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}));

describe('Toggle Module Service', () => {
  const mockHttpClient = vi.mocked(httpClient);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('toggleModule - Success cases', () => {
    it('should toggle module successfully', async () => {
      const mockRequest: ToggleModuleRequest = {
        moduleName: 'auth-module',
        status: true
      };

      const mockResponse: ToggleModuleResponse = {
        message: 'Module toggled successfully',
        data: mockRequest
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await toggleModule(mockRequest);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/modules/toggle',
        mockRequest,
        { showLoading: false }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should activate a module', async () => {
      const activateRequest: ToggleModuleRequest = {
        moduleName: 'payments',
        status: true
      };

      const mockResponse: ToggleModuleResponse = {
        message: 'Module activated',
        data: activateRequest
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await toggleModule(activateRequest);

      expect(result.data.status).toBe(true);
      expect(result.message).toBe('Module activated');
    });

    it('should deactivate a module', async () => {
      const deactivateRequest: ToggleModuleRequest = {
        moduleName: 'reports',
        status: false
      };

      const mockResponse: ToggleModuleResponse = {
        message: 'Module deactivated',
        data: deactivateRequest
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await toggleModule(deactivateRequest);

      expect(result.data.status).toBe(false);
      expect(result.message).toBe('Module deactivated');
    });

    it('should call the correct endpoint /modules/toggle', async () => {
      const mockRequest: ToggleModuleRequest = {
        moduleName: 'test-module',
        status: true
      };

      mockHttpClient.post.mockResolvedValue({
        message: 'Success',
        data: mockRequest
      });

      await toggleModule(mockRequest);

      const callArgs = mockHttpClient.post.mock.calls[0];
      expect(callArgs[0]).toBe('/modules/toggle');
    });

    it('should pass the complete request payload', async () => {
      const request: ToggleModuleRequest = {
        moduleName: 'complex-module-123',
        status: true,
        reason: 'Manual activation by admin',
        metadata: { userId: 'admin-1', timestamp: '2025-12-22' }
      } as any;

      mockHttpClient.post.mockResolvedValue({
        message: 'Success',
        data: request
      });

      await toggleModule(request);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/modules/toggle',
        request,
        expect.any(Object)
      );
    });

    it('should return response with message and data', async () => {
      const request: ToggleModuleRequest = {
        moduleName: 'module-1',
        status: true
      };

      const expectedResponse: ToggleModuleResponse = {
        message: 'Operation completed',
        data: request
      };

      mockHttpClient.post.mockResolvedValue(expectedResponse);

      const result = await toggleModule(request);

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(result.message).toBe('Operation completed');
      expect(result.data).toEqual(request);
    });

    it('should handle module IDs with special characters', async () => {
      const request: ToggleModuleRequest = {
        moduleName: 'auth-module-v2.0_beta',
        status: true
      };

      const mockResponse: ToggleModuleResponse = {
        message: 'Success',
        data: request
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await toggleModule(request);

      expect(result.data.moduleName).toBe('auth-module-v2.0_beta');
    });

    it('should handle UUID format module IDs', async () => {
      const request: ToggleModuleRequest = {
        moduleName: '550e8400-e29b-41d4-a716-446655440000',
        status: false
      };

      mockHttpClient.post.mockResolvedValue({
        message: 'Success',
        data: request
      });

      await toggleModule(request);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/modules/toggle',
        expect.objectContaining({
          moduleName: '550e8400-e29b-41d4-a716-446655440000'
        }),
        expect.any(Object)
      );
    });
  });

  describe('toggleModule - Configuration', () => {
    it('should disable loading indicator with showLoading: false', async () => {
      const request: ToggleModuleRequest = {
        moduleName: 'test',
        status: true
      };

      mockHttpClient.post.mockResolvedValue({
        message: 'Success',
        data: request
      });

      await toggleModule(request);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/modules/toggle',
        request,
        expect.objectContaining({
          showLoading: false
        })
      );
    });

    it('should pass only showLoading config option', async () => {
      const request: ToggleModuleRequest = {
        moduleName: 'module',
        status: true
      };

      mockHttpClient.post.mockResolvedValue({
        message: 'Success',
        data: request
      });

      await toggleModule(request);

      const config = mockHttpClient.post.mock.calls[0][2];
      expect(config).toEqual({ showLoading: false });
      expect(Object.keys(config || {})).toHaveLength(1);
    });

    it('should not suppress error toasts unlike maintenance status', async () => {
      const request: ToggleModuleRequest = {
        moduleName: 'test',
        status: true
      };

      mockHttpClient.post.mockResolvedValue({
        message: 'Success',
        data: request
      });

      await toggleModule(request);

      const config = mockHttpClient.post.mock.calls[0][2];
      expect(config?.skipErrorToast).toBeUndefined();
    });
  });

  describe('toggleModule - Error handling', () => {
    it('should propagate network errors', async () => {
      const request: ToggleModuleRequest = {
        moduleName: 'module-1',
        status: true
      };

      const networkError = new Error('Network error');
      mockHttpClient.post.mockRejectedValue(networkError);

      await expect(toggleModule(request)).rejects.toThrow('Network error');
    });

    it('should propagate 400 validation errors', async () => {
      const request: ToggleModuleRequest = {
        moduleName: '',
        status: true
      };

      const validationError = new Error('Module ID is required');
      mockHttpClient.post.mockRejectedValue(validationError);

      await expect(toggleModule(request)).rejects.toThrow('Module ID is required');
    });

    it('should propagate 403 permission errors', async () => {
      const request: ToggleModuleRequest = {
        moduleName: 'admin-module',
        status: true
      };

      const permissionError = new Error('Insufficient permissions');
      mockHttpClient.post.mockRejectedValue(permissionError);

      await expect(toggleModule(request)).rejects.toThrow('Insufficient permissions');
    });

    it('should propagate 404 module not found errors', async () => {
      const request: ToggleModuleRequest = {
        moduleName: 'non-existent-module',
        status: true
      };

      const notFoundError = new Error('Module not found');
      mockHttpClient.post.mockRejectedValue(notFoundError);

      await expect(toggleModule(request)).rejects.toThrow('Module not found');
    });

    it('should propagate 409 conflict errors', async () => {
      const request: ToggleModuleRequest = {
        moduleName: 'locked-module',
        status: false
      };

      const conflictError = new Error('Module is currently locked');
      mockHttpClient.post.mockRejectedValue(conflictError);

      await expect(toggleModule(request)).rejects.toThrow('Module is currently locked');
    });

    it('should propagate 500 server errors', async () => {
      const request: ToggleModuleRequest = {
        moduleName: 'module',
        status: true
      };

      const serverError = new Error('Internal server error');
      mockHttpClient.post.mockRejectedValue(serverError);

      await expect(toggleModule(request)).rejects.toThrow('Internal server error');
    });

    it('should propagate timeout errors', async () => {
      const request: ToggleModuleRequest = {
        moduleName: 'slow-module',
        status: true
      };

      const timeoutError = new Error('Request timeout');
      mockHttpClient.post.mockRejectedValue(timeoutError);

      await expect(toggleModule(request)).rejects.toThrow('Request timeout');
    });
  });

  describe('toggleModule - Integration with httpClient', () => {
    it('should use only POST method', async () => {
      const request: ToggleModuleRequest = {
        moduleName: 'test',
        status: true
      };

      mockHttpClient.post.mockResolvedValue({
        message: 'Success',
        data: request
      });

      await toggleModule(request);

      expect(mockHttpClient.post).toHaveBeenCalled();
      expect(mockHttpClient.get).not.toHaveBeenCalled();
      expect(mockHttpClient.put).not.toHaveBeenCalled();
      expect(mockHttpClient.delete).not.toHaveBeenCalled();
      expect(mockHttpClient.patch).not.toHaveBeenCalled();
    });

    it('should use generic type ToggleModuleResponse', async () => {
      const request: ToggleModuleRequest = {
        moduleName: 'typed-module',
        status: true
      };

      const typedResponse: ToggleModuleResponse = {
        message: 'Typed response',
        data: request
      };

      mockHttpClient.post.mockResolvedValue(typedResponse);

      const result = await toggleModule(request);

      // TypeScript should infer correct types
      expect(result.message).toBeDefined();
      expect(result.data).toBeDefined();
      expect(result.data.moduleName).toBe('typed-module');
      expect(result.data.status).toBe(true);
    });

    it('should be called exactly once per toggle operation', async () => {
      const request: ToggleModuleRequest = {
        moduleName: 'module',
        status: true
      };

      mockHttpClient.post.mockResolvedValue({
        message: 'Success',
        data: request
      });

      await toggleModule(request);

      expect(mockHttpClient.post).toHaveBeenCalledTimes(1);
    });
  });

  describe('toggleModule - State transitions', () => {
    it('should toggle from inactive to active', async () => {
      const activateRequest: ToggleModuleRequest = {
        moduleName: 'module-1',
        status: true
      };

      mockHttpClient.post.mockResolvedValue({
        message: 'Module activated',
        data: activateRequest
      });

      const result = await toggleModule(activateRequest);

      expect(result.data.status).toBe(true);
    });

    it('should toggle from active to inactive', async () => {
      const deactivateRequest: ToggleModuleRequest = {
        moduleName: 'module-1',
        status: false
      };

      mockHttpClient.post.mockResolvedValue({
        message: 'Module deactivated',
        data: deactivateRequest
      });

      const result = await toggleModule(deactivateRequest);

      expect(result.data.status).toBe(false);
    });

    it('should handle rapid toggle operations', async () => {
      const request1: ToggleModuleRequest = {
        moduleName: 'module-1',
        status: true
      };

      const request2: ToggleModuleRequest = {
        moduleName: 'module-1',
        status: false
      };

      mockHttpClient.post
        .mockResolvedValueOnce({ message: 'Activated', data: request1 })
        .mockResolvedValueOnce({ message: 'Deactivated', data: request2 });

      await toggleModule(request1);
      await toggleModule(request2);

      expect(mockHttpClient.post).toHaveBeenCalledTimes(2);
    });

    it('should handle multiple modules being toggled simultaneously', async () => {
      const requests: ToggleModuleRequest[] = [
        { moduleName: 'module-1', status: true },
        { moduleName: 'module-2', status: false },
        { moduleName: 'module-3', status: true }
      ];

      mockHttpClient.post.mockImplementation((url, data) => 
        Promise.resolve({
          message: 'Success',
          data: data as ToggleModuleRequest
        })
      );

      const results = await Promise.all(requests.map(req => toggleModule(req)));

      expect(results).toHaveLength(3);
      expect(mockHttpClient.post).toHaveBeenCalledTimes(3);
      expect(results[0].data.moduleName).toBe('module-1');
      expect(results[1].data.moduleName).toBe('module-2');
      expect(results[2].data.moduleName).toBe('module-3');
    });
  });

  describe('toggleModule - Edge cases', () => {
    it('should handle response with additional metadata', async () => {
      const request: ToggleModuleRequest = {
        moduleName: 'module',
        status: true
      };

      const extendedResponse: ToggleModuleResponse = {
        message: 'Success',
        data: request,
        timestamp: '2025-12-22T10:00:00Z',
        userId: 'admin-123'
      } as any;

      mockHttpClient.post.mockResolvedValue(extendedResponse);

      const result = await toggleModule(request);

      expect(result).toEqual(extendedResponse);
      expect((result as any).timestamp).toBeDefined();
    });

    it('should preserve request data structure in response', async () => {
      const complexRequest: ToggleModuleRequest = {
        moduleName: 'module-1',
        status: true,
        config: {
          feature1: true,
          feature2: false,
          settings: { theme: 'dark' }
        }
      } as any;

      mockHttpClient.post.mockResolvedValue({
        message: 'Success',
        data: complexRequest
      });

      const result = await toggleModule(complexRequest);

      expect(result.data).toEqual(complexRequest);
      expect((result.data as any).config).toBeDefined();
    });

    it('should handle empty string moduleName gracefully', async () => {
      const request: ToggleModuleRequest = {
        moduleName: '',
        status: true
      };

      mockHttpClient.post.mockRejectedValue(new Error('Invalid module ID'));

      await expect(toggleModule(request)).rejects.toThrow('Invalid module ID');
    });

    it('should handle very long module IDs', async () => {
      const longmoduleName = 'a'.repeat(500);
      const request: ToggleModuleRequest = {
        moduleName: longmoduleName,
        status: true
      };

      mockHttpClient.post.mockResolvedValue({
        message: 'Success',
        data: request
      });

      const result = await toggleModule(request);

      expect(result.data.moduleName).toHaveLength(500);
    });

    it('should maintain type safety in response', async () => {
      const request: ToggleModuleRequest = {
        moduleName: 'module',
        status: true
      };

      mockHttpClient.post.mockResolvedValue({
        message: 'Success',
        data: request
      });

      const result: ToggleModuleResponse = await toggleModule(request);

      expect(typeof result.message).toBe('string');
      expect(typeof result.data.moduleName).toBe('string');
      expect(typeof result.data.status).toBe('boolean');
    });
  });
});