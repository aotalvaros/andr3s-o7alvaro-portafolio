/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMaintenanceStatus } from "@/services/maintenance/maintenace.service";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { httpClient } from '@/core/infrastructure/http/httpClientFactory';
import { MaintenanceResponseStatus } from '../../../services/maintenance/models/maintenaceResponseStatus.interface';

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

describe('Maintenance Status Service', () => {
  const mockHttpClient = vi.mocked(httpClient);
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('getMaintenanceStatus - Success cases', () => {
    it('should fetch maintenance status successfully', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [
          { _id: '1', name: 'Module A', isActive: true, __v:0, moduleName:'ModuleA' },
          { _id: '2', name: 'Module B', isActive: false, __v:0, moduleName:'ModuleB' }
        ],
        status: 'success',
        cache: true
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await getMaintenanceStatus();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/modules', {
        showLoading: false,
        skipErrorToast: true
      });
      expect(result).toEqual(mockResponse);
    });

    it('should call the correct endpoint /modules', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [],
        status: 'success',
        cache: false
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      await getMaintenanceStatus();

      const callArgs = mockHttpClient.get.mock.calls[0];
      expect(callArgs[0]).toBe('/modules');
    });

    it('should pass custom config with showLoading: false', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [],
        status: 'success',
        cache: false
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      await getMaintenanceStatus();

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        '/modules',
        expect.objectContaining({
          showLoading: false
        })
      );
    });

    it('should pass custom config with skipErrorToast: true', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [],
        status: 'success',
        cache: false
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      await getMaintenanceStatus();

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        '/modules',
        expect.objectContaining({
          skipErrorToast: true
        })
      );
    });

    it('should return response with empty data array', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [],
        status: 'success',
        cache: false
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await getMaintenanceStatus();

      expect(result).toEqual(mockResponse);
      expect(result.data).toEqual([]);
    });

    it('should return response with multiple modules', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [
          { _id: '1', name: 'Auth', isActive: true, __v:0, moduleName:'Auth' },
          { _id: '2', name: 'Payments', isActive: true, __v:0, moduleName:'Payments' },
          { _id: '3', name: 'Reports', isActive: false, __v:0, moduleName:'Reports' }
        ],
        status: 'success',
        cache: true
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await getMaintenanceStatus();

      expect(result.data).toHaveLength(3);
      expect(result.data[0].name).toBe('Auth');
    });

    it('should handle cached responses', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [{ _id: '1', name: 'Module', isActive: true, __v:0, moduleName:'Module' }],
        status: 'success',
        cache: true
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await getMaintenanceStatus();

      expect(result.cache).toBe(true);
    });

    it('should handle non-cached responses', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [{ _id: '1', name: 'Module', isActive: true, __v:0, moduleName:'Module' }],
        status: 'success',
        cache: false
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await getMaintenanceStatus();

      expect(result.cache).toBe(false);
    });
  });

  describe('getMaintenanceStatus - Error handling', () => {
    it('should return default error state when request fails', async () => {
      const networkError = new Error('Network error');
      mockHttpClient.get.mockRejectedValue(networkError);

      const result = await getMaintenanceStatus();

      expect(result).toEqual({
        data: [],
        status: 'error',
        cache: false
      });
    });

    it('should log error to console when request fails', async () => {
      const testError = new Error('Test error');
      mockHttpClient.get.mockRejectedValue(testError);

      await getMaintenanceStatus();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[getMaintenanceStatus] Error fetching maintenance status:',
        testError
      );
    });

    it('should handle 500 server error gracefully', async () => {
      const serverError = new Error('Internal server error');
      mockHttpClient.get.mockRejectedValue(serverError);

      const result = await getMaintenanceStatus();

      expect(result.status).toBe('error');
      expect(result.data).toEqual([]);
    });

    it('should handle 404 not found error gracefully', async () => {
      const notFoundError = new Error('Not found');
      mockHttpClient.get.mockRejectedValue(notFoundError);

      const result = await getMaintenanceStatus();

      expect(result.status).toBe('error');
      expect(result.data).toEqual([]);
    });

    it('should handle timeout errors gracefully', async () => {
      const timeoutError = new Error('Request timeout');
      mockHttpClient.get.mockRejectedValue(timeoutError);

      const result = await getMaintenanceStatus();

      expect(result.status).toBe('error');
      expect(result.cache).toBe(false);
    });

    it('should not throw error when request fails', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Fatal error'));

      await expect(getMaintenanceStatus()).resolves.toBeDefined();
    });

    it('should return consistent error structure', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Error'));

      const result = await getMaintenanceStatus();

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('cache');
    });

    it('should handle undefined error objects', async () => {
      mockHttpClient.get.mockRejectedValue(undefined);

      const result = await getMaintenanceStatus();

      expect(result.status).toBe('error');
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should handle null error objects', async () => {
      mockHttpClient.get.mockRejectedValue(null);

      const result = await getMaintenanceStatus();

      expect(result.status).toBe('error');
    });

    it('should handle string error messages', async () => {
      mockHttpClient.get.mockRejectedValue('String error message');

      const result = await getMaintenanceStatus();

      expect(result.status).toBe('error');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[getMaintenanceStatus] Error fetching maintenance status:',
        'String error message'
      );
    });
  });

  describe('getMaintenanceStatus - Integration with httpClient', () => {
    it('should use only GET method', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [],
        status: 'success',
        cache: false
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      await getMaintenanceStatus();

      expect(mockHttpClient.get).toHaveBeenCalled();
      expect(mockHttpClient.post).not.toHaveBeenCalled();
      expect(mockHttpClient.put).not.toHaveBeenCalled();
      expect(mockHttpClient.delete).not.toHaveBeenCalled();
      expect(mockHttpClient.patch).not.toHaveBeenCalled();
    });

    it('should be called with generic type MaintenanceResponseStatus', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [{ _id: '1', name: 'Test', isActive: true, __v:0, moduleName:'Test' }],
        status: 'success',
        cache: true
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await getMaintenanceStatus();

      // TypeScript should infer correct types
      expect(result.data).toBeDefined();
      expect(result.status).toBeDefined();
      expect(result.cache).toBeDefined();
    });

    it('should not trigger loading indicator', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [],
        status: 'success',
        cache: false
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      await getMaintenanceStatus();

      const config = mockHttpClient.get.mock.calls[0][1];
      expect(config?.showLoading).toBe(false);
    });

    it('should not trigger error toast notifications', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [],
        status: 'success',
        cache: false
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      await getMaintenanceStatus();

      const config = mockHttpClient.get.mock.calls[0][1];
      expect(config?.skipErrorToast).toBe(true);
    });
  });

  describe('getMaintenanceStatus - React Query integration scenarios', () => {
    it('should prevent infinite retry loops by returning default state', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Network unstable'));

      const result = await getMaintenanceStatus();

      // Should return a valid response to stop React Query retries
      expect(result).toBeDefined();
      expect(result.status).toBe('error');
      expect(typeof result).toBe('object');
    });

    it('should be safe for background polling', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [{ _id: '1', name: 'Service', isActive: true, __v:0, moduleName:'Service' }],
        status: 'success',
        cache: true
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      // Simulate multiple calls (polling)
      await getMaintenanceStatus();
      await getMaintenanceStatus();
      await getMaintenanceStatus();

      expect(mockHttpClient.get).toHaveBeenCalledTimes(3);
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        '/modules',
        expect.objectContaining({
          showLoading: false,
          skipErrorToast: true
        })
      );
    });

    it('should handle rapid successive calls', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [],
        status: 'success',
        cache: false
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const promises = [
        getMaintenanceStatus(),
        getMaintenanceStatus(),
        getMaintenanceStatus()
      ];

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result).toEqual(mockResponse);
      });
    });
  });

  describe('getMaintenanceStatus - Edge cases', () => {
    it('should handle response with additional unexpected fields', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [],
        status: 'success',
        cache: false,
        // Extra fields
        timestamp: '2025-12-22T10:00:00Z',
        version: '1.0'
      } as any;

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await getMaintenanceStatus();

      expect(result).toEqual(mockResponse);
    });

    it('should handle very large data arrays', async () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        _id: `${i}`,
        name: `Module ${i}`,
        isActive: i % 2 === 0,
        __v: 0,
        moduleName: `Module${i}`
      }));

      const mockResponse: MaintenanceResponseStatus = {
        data: largeData,
        status: 'success',
        cache: true
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await getMaintenanceStatus();

      expect(result.data).toHaveLength(1000);
    });

    it('should maintain type safety in error responses', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Error'));

      const result = await getMaintenanceStatus();

      // Ensure the error response matches MaintenanceResponseStatus interface
      const testTyping: MaintenanceResponseStatus = result;
      expect(testTyping.data).toEqual([]);
      expect(testTyping.status).toBe('error');
      expect(testTyping.cache).toBe(false);
    });
  });
});
