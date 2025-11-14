/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMaintenanceStatus } from "@/services/maintenance/maintenace.service";
import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "@/lib/axios";
// Mock de axios
vi.mock('@/lib/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockApi = vi.mocked(api);

describe('Maintenance Service - getMaintenanceStatus', () => {
  let consoleErrorSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Silenciar console.error para evitar ruido en los tests
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('Successful Responses', () => {
    it('should fetch maintenance status successfully', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [
          { module: 'Module1', status: 'active' },
          { module: 'Module2', status: 'inactive' },
        ],
        status: 'success',
        cache: true,
      };

      mockApi.get.mockResolvedValue({ data: mockResponse });

      const response = await getMaintenanceStatus();

      expect(response).toEqual(mockResponse);
      expect(mockApi.get).toHaveBeenCalledTimes(1);
    });

    it('should call API with correct endpoint and configuration', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [],
        status: 'success',
        cache: false,
      };

      mockApi.get.mockResolvedValue({ data: mockResponse });

      await getMaintenanceStatus();

      expect(mockApi.get).toHaveBeenCalledWith('/modules', {
        showLoading: false,
        skipErrorToast: true,
      });
    });

    it('should return data with cache enabled', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [{ module: 'CachedModule', status: 'active' }],
        status: 'success',
        cache: true,
      };

      mockApi.get.mockResolvedValue({ data: mockResponse });

      const response = await getMaintenanceStatus();

      expect(response.cache).toBe(true);
      expect(response.data).toHaveLength(1);
    });

    it('should return empty data array', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [],
        status: 'success',
        cache: false,
      };

      mockApi.get.mockResolvedValue({ data: mockResponse });

      const response = await getMaintenanceStatus();

      expect(response.data).toEqual([]);
      expect(response.status).toBe('success');
    });

    it('should handle multiple modules in response', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [
          { module: 'Module1', status: 'active' },
          { module: 'Module2', status: 'inactive' },
          { module: 'Module3', status: 'maintenance' },
          { module: 'Module4', status: 'active' },
        ],
        status: 'success',
        cache: true,
      };

      mockApi.get.mockResolvedValue({ data: mockResponse });

      const response = await getMaintenanceStatus();

      expect(response.data).toHaveLength(4);
      expect(response.data[2].status).toBe('maintenance');
    });
  });

  describe('Error Handling', () => {
    it('should return error state when API call fails', async () => {
      mockApi.get.mockRejectedValue(new Error('Network Error'));

      const response = await getMaintenanceStatus();

      expect(response).toEqual({
        data: [],
        status: 'error',
        cache: false,
      });
    });

    it('should log error to console when request fails', async () => {
      const error = new Error('Network Error');
      mockApi.get.mockRejectedValue(error);

      await getMaintenanceStatus();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[getMaintenanceStatus] Error fetching maintenance status:',
        error
      );
    });

    it('should not throw error when API fails', async () => {
      mockApi.get.mockRejectedValue(new Error('Network Error'));

      await expect(getMaintenanceStatus()).resolves.toBeDefined();
    });

    it('should return default state on 500 error', async () => {
      mockApi.get.mockRejectedValue({
        response: {
          status: 500,
          data: { message: 'Internal Server Error' },
        },
      });

      const response = await getMaintenanceStatus();

      expect(response).toEqual({
        data: [],
        status: 'error',
        cache: false,
      });
    });

    it('should return default state on 404 error', async () => {
      mockApi.get.mockRejectedValue({
        response: {
          status: 404,
          data: { message: 'Not Found' },
        },
      });

      const response = await getMaintenanceStatus();

      expect(response.status).toBe('error');
      expect(response.data).toEqual([]);
    });

    it('should return default state on timeout error', async () => {
      mockApi.get.mockRejectedValue({
        code: 'ECONNABORTED',
        message: 'timeout of 5000ms exceeded',
      });

      const response = await getMaintenanceStatus();

      expect(response).toEqual({
        data: [],
        status: 'error',
        cache: false,
      });
    });

    it('should handle network error gracefully', async () => {
      mockApi.get.mockRejectedValue({
        message: 'Network Error',
        code: 'ERR_NETWORK',
      });

      const response = await getMaintenanceStatus();

      expect(response.status).toBe('error');
      expect(response.cache).toBe(false);
    });

    it('should handle undefined error', async () => {
      mockApi.get.mockRejectedValue(undefined);

      const response = await getMaintenanceStatus();

      expect(response).toEqual({
        data: [],
        status: 'error',
        cache: false,
      });
    });

    it('should handle null error', async () => {
      mockApi.get.mockRejectedValue(null);

      const response = await getMaintenanceStatus();

      expect(response.status).toBe('error');
    });

    it('should handle string error', async () => {
      mockApi.get.mockRejectedValue('Something went wrong');

      const response = await getMaintenanceStatus();

      expect(response).toEqual({
        data: [],
        status: 'error',
        cache: false,
      });
    });
  });

  describe('API Configuration', () => {
    it('should call API with showLoading set to false', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [],
        status: 'success',
        cache: false,
      };

      mockApi.get.mockResolvedValue({ data: mockResponse });

      await getMaintenanceStatus();

      expect(mockApi.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          showLoading: false,
        })
      );
    });

    it('should call API with skipErrorToast set to true', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [],
        status: 'success',
        cache: false,
      };

      mockApi.get.mockResolvedValue({ data: mockResponse });

      await getMaintenanceStatus();

      expect(mockApi.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          skipErrorToast: true,
        })
      );
    });

    it('should use /modules endpoint', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [],
        status: 'success',
        cache: false,
      };

      mockApi.get.mockResolvedValue({ data: mockResponse });

      await getMaintenanceStatus();

      expect(mockApi.get).toHaveBeenCalledWith(
        '/modules',
        expect.any(Object)
      );
    });
  });

  describe('Response Structure', () => {
    it('should return response with data property', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [{ module: 'Test', status: 'active' }],
        status: 'success',
        cache: true,
      };

      mockApi.get.mockResolvedValue({ data: mockResponse });

      const response = await getMaintenanceStatus();

      expect(response).toHaveProperty('data');
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('should return response with status property', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [],
        status: 'success',
        cache: false,
      };

      mockApi.get.mockResolvedValue({ data: mockResponse });

      const response = await getMaintenanceStatus();

      expect(response).toHaveProperty('status');
      expect(typeof response.status).toBe('string');
    });

    it('should return response with cache property', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [],
        status: 'success',
        cache: true,
      };

      mockApi.get.mockResolvedValue({ data: mockResponse });

      const response = await getMaintenanceStatus();

      expect(response).toHaveProperty('cache');
      expect(typeof response.cache).toBe('boolean');
    });

    it('should return all required properties on error', async () => {
      mockApi.get.mockRejectedValue(new Error('Test Error'));

      const response = await getMaintenanceStatus();

      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('status');
      expect(response).toHaveProperty('cache');
    });
  });

  describe('Edge Cases', () => {
    it('should handle malformed response data', async () => {
      mockApi.get.mockResolvedValue({ data: null });

      const response = await getMaintenanceStatus();

      expect(response).toBeNull();
    });

    it('should handle response without data property', async () => {
      mockApi.get.mockResolvedValue({});

      const response = await getMaintenanceStatus();

      expect(response).toBeUndefined();
    });

    it('should handle very large data arrays', async () => {
      const largeDataArray = Array.from({ length: 1000 }, (_, i) => ({
        module: `Module${i}`,
        status: i % 2 === 0 ? 'active' : 'inactive',
      }));

      const mockResponse: MaintenanceResponseStatus = {
        data: largeDataArray,
        status: 'success',
        cache: true,
      };

      mockApi.get.mockResolvedValue({ data: mockResponse });

      const response = await getMaintenanceStatus();

      expect(response.data).toHaveLength(1000);
      expect(response.data[999].module).toBe('Module999');
    });

    it('should handle concurrent calls', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [{ module: 'Test', status: 'active' }],
        status: 'success',
        cache: false,
      };

      mockApi.get.mockResolvedValue({ data: mockResponse });

      const [response1, response2, response3] = await Promise.all([
        getMaintenanceStatus(),
        getMaintenanceStatus(),
        getMaintenanceStatus(),
      ]);

      expect(response1).toEqual(mockResponse);
      expect(response2).toEqual(mockResponse);
      expect(response3).toEqual(mockResponse);
      expect(mockApi.get).toHaveBeenCalledTimes(3);
    });

    it('should handle slow API response', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [],
        status: 'success',
        cache: false,
      };

      mockApi.get.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ data: mockResponse }), 100)
          )
      );

      const response = await getMaintenanceStatus();

      expect(response).toEqual(mockResponse);
    });
  });

  describe('Type Safety', () => {
    it('should return correct TypeScript type', async () => {
      const mockResponse: MaintenanceResponseStatus = {
        data: [],
        status: 'success',
        cache: false,
      };

      mockApi.get.mockResolvedValue({ data: mockResponse });

      const response: MaintenanceResponseStatus = await getMaintenanceStatus();

      expect(response).toBeDefined();
    });

    it('should maintain type structure on error', async () => {
      mockApi.get.mockRejectedValue(new Error('Test'));

      const response: MaintenanceResponseStatus = await getMaintenanceStatus();

      expect(response.data).toEqual([]);
      expect(response.status).toBe('error');
      expect(response.cache).toBe(false);
    });
  });
});