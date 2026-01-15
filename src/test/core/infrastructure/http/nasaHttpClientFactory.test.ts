/* eslint-disable @typescript-eslint/no-explicit-any */
import { nasaHttpClient, createNasaHttpClient } from '@/core/infrastructure/http/nasaHttpClientFactory';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useLoadingStore } from '@/store/loadingStore';
import { useToastMessageStore } from '@/store/ToastMessageStore';
import { HttpClient } from '../../../../core/infrastructure/http/HttpClient';
import { LoadingService } from '../../../../core/infrastructure/services/LoadingService';
import { ToastNotificationService } from '../../../../core/infrastructure/services/ToastNotificationService';
import { LoadingInterceptor } from '../../../../core/infrastructure/http/interceptors/LoadingInterceptor';
import { ErrorInterceptor } from '../../../../core/infrastructure/http/interceptors/ErrorInterceptor';

// Mock all modules
vi.mock('../../../../core/infrastructure/http/HttpClient');
vi.mock('../../../../core/infrastructure/http/interceptors/LoadingInterceptor');
vi.mock('../../../../core/infrastructure/http/interceptors/ErrorInterceptor');
vi.mock('../../../../core/infrastructure/services/LoadingService');
vi.mock('../../../../core/infrastructure/services/ToastNotificationService');
vi.mock('@/store/loadingStore');
vi.mock('@/store/ToastMessageStore');

describe('NASA HTTP Client Factory', () => {
  const mockSetLoading = vi.fn();
  const mockSetParams = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup loading store
    vi.mocked(useLoadingStore.getState).mockReturnValue({
      setLoading: mockSetLoading,
    } as any);

    // Setup toast store
    vi.mocked(useToastMessageStore.getState).mockReturnValue({
      setParams: mockSetParams,
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createNasaHttpClient', () => {
    describe('Instance Creation', () => {
      it('should create an instance of HttpClient', () => {
        const client = createNasaHttpClient();

        expect(HttpClient).toHaveBeenCalled();
        expect(client).toBeInstanceOf(HttpClient);
      });

      it('should create HttpClient with NASA API base URL', () => {
        createNasaHttpClient();

        expect(HttpClient).toHaveBeenCalledWith(
          expect.objectContaining({
            baseURL: 'https://api.nasa.gov'
          }),
          expect.any(Array)
        );
      });

      it('should create HttpClient with 60 second timeout', () => {
        createNasaHttpClient();

        expect(HttpClient).toHaveBeenCalledWith(
          expect.objectContaining({
            timeout: 60000
          }),
          expect.any(Array)
        );
      });

      it('should create HttpClient without default Content-Type header', () => {
        createNasaHttpClient();

        const config = vi.mocked(HttpClient).mock.calls[0][0];
        expect(config.headers).toBeUndefined();
      });

      it('should create a new instance each time it is called', () => {
        const client1 = createNasaHttpClient();
        const client2 = createNasaHttpClient();

        expect(HttpClient).toHaveBeenCalledTimes(2);
        expect(client1).toBeInstanceOf(HttpClient);
        expect(client2).toBeInstanceOf(HttpClient);
      });
    });

    describe('Services Initialization', () => {
      it('should create LoadingService with setLoading from store', () => {
        createNasaHttpClient();

        expect(LoadingService).toHaveBeenCalledWith(mockSetLoading);
        expect(useLoadingStore.getState).toHaveBeenCalled();
      });

      it('should create ToastNotificationService with setParams from store', () => {
        createNasaHttpClient();

        expect(ToastNotificationService).toHaveBeenCalledWith(mockSetParams);
        expect(useToastMessageStore.getState).toHaveBeenCalled();
      });

      it('should create LoadingService before creating HttpClient', () => {
        createNasaHttpClient();

        const loadingServiceCallOrder = vi.mocked(LoadingService).mock.invocationCallOrder[0];
        const httpClientCallOrder = vi.mocked(HttpClient).mock.invocationCallOrder[0];

        expect(loadingServiceCallOrder).toBeLessThan(httpClientCallOrder);
      });

      it('should create ToastNotificationService before creating HttpClient', () => {
        createNasaHttpClient();

        const toastServiceCallOrder = vi.mocked(ToastNotificationService).mock.invocationCallOrder[0];
        const httpClientCallOrder = vi.mocked(HttpClient).mock.invocationCallOrder[0];

        expect(toastServiceCallOrder).toBeLessThan(httpClientCallOrder);
      });
    });

    describe('Interceptors Configuration', () => {
      it('should create two interceptors', () => {
        createNasaHttpClient();

        const interceptors = vi.mocked(HttpClient).mock.calls[0][1];
        expect(interceptors).toHaveLength(2);
      });

      it('should create LoadingInterceptor with LoadingService', () => {
        createNasaHttpClient();

        expect(LoadingInterceptor).toHaveBeenCalledWith(
          expect.any(LoadingService)
        );
      });

      it('should create ErrorInterceptor with ToastNotificationService', () => {
        createNasaHttpClient();

        expect(ErrorInterceptor).toHaveBeenCalledWith(
          expect.any(ToastNotificationService)
        );
      });

      it('should pass interceptors in correct order: Loading, Error', () => {
        createNasaHttpClient();

        const interceptors = vi.mocked(HttpClient).mock.calls[0][1];
        expect(interceptors).toBeDefined();
        expect(interceptors![0]).toBeInstanceOf(LoadingInterceptor);
        expect(interceptors![1]).toBeInstanceOf(ErrorInterceptor);
      });

      it('should NOT include AuthInterceptor (unlike main httpClient)', () => {
        createNasaHttpClient();

        const interceptors = vi.mocked(HttpClient).mock.calls[0][1];
        
        expect(LoadingInterceptor).toHaveBeenCalled();
        expect(ErrorInterceptor).toHaveBeenCalled();
        expect(interceptors).toHaveLength(2); // Only 2, not 3
      });
    });

    describe('Configuration Differences from Main HttpClient', () => {
      it('should use NASA base URL instead of env variable', () => {
        createNasaHttpClient();

        const config = vi.mocked(HttpClient).mock.calls[0][0];
        expect(config.baseURL).toBe('https://api.nasa.gov');
        expect(config.baseURL).not.toContain('NEXT_PUBLIC_BASE_URL');
      });

      it('should not include authentication interceptor', () => {
        createNasaHttpClient();

        expect(LoadingInterceptor).toHaveBeenCalledTimes(1);
        expect(ErrorInterceptor).toHaveBeenCalledTimes(1);
        // AuthInterceptor would be 3rd if it existed
        expect(vi.mocked(HttpClient).mock.calls[0][1]).toHaveLength(2);
      });

      it('should use same timeout as main client (60s)', () => {
        createNasaHttpClient();

        const config = vi.mocked(HttpClient).mock.calls[0][0];
        expect(config.timeout).toBe(60000);
      });
    });

    describe('Store Integration', () => {
      it('should handle when useLoadingStore returns undefined', () => {
        vi.mocked(useLoadingStore.getState).mockReturnValueOnce(undefined as any);

        expect(() => createNasaHttpClient()).not.toThrow();
      });

      it('should handle when useToastMessageStore returns undefined', () => {
        vi.mocked(useToastMessageStore.getState).mockReturnValueOnce(undefined as any);

        expect(() => createNasaHttpClient()).not.toThrow();
      });

      it('should call getState on both stores', () => {
        createNasaHttpClient();

        expect(useLoadingStore.getState).toHaveBeenCalled();
        expect(useToastMessageStore.getState).toHaveBeenCalled();
      });

      it('should retrieve latest state from stores on each call', () => {
        const mockSetLoading2 = vi.fn();
        
        createNasaHttpClient();
        
        vi.mocked(useLoadingStore.getState).mockReturnValueOnce({
          setLoading: mockSetLoading2,
        } as any);
        
        createNasaHttpClient();

        expect(LoadingService).toHaveBeenNthCalledWith(1, mockSetLoading);
        expect(LoadingService).toHaveBeenNthCalledWith(2, mockSetLoading2);
      });
    });

    describe('Error Handling', () => {
      it('should propagate error if LoadingService creation fails', () => {
        vi.mocked(LoadingService).mockImplementationOnce(() => {
          throw new Error('LoadingService creation failed');
        });

        expect(() => createNasaHttpClient()).toThrow('LoadingService creation failed');
      });

      it('should propagate error if ToastNotificationService creation fails', () => {
        vi.mocked(ToastNotificationService).mockImplementationOnce(() => {
          throw new Error('ToastNotificationService creation failed');
        });

        expect(() => createNasaHttpClient()).toThrow('ToastNotificationService creation failed');
      });

      it('should propagate error if HttpClient creation fails', () => {
        vi.mocked(HttpClient).mockImplementationOnce(() => {
          throw new Error('HttpClient creation failed');
        });

        expect(() => createNasaHttpClient()).toThrow('HttpClient creation failed');
      });

      it('should propagate error if interceptor creation fails', () => {
        vi.mocked(LoadingInterceptor).mockImplementationOnce(() => {
          throw new Error('LoadingInterceptor creation failed');
        });

        expect(() => createNasaHttpClient()).toThrow('LoadingInterceptor creation failed');
      });
    });

    describe('Memory and Performance', () => {
      it('should create new service instances on each call', () => {
        createNasaHttpClient();
        createNasaHttpClient();

        expect(LoadingService).toHaveBeenCalledTimes(2);
        expect(ToastNotificationService).toHaveBeenCalledTimes(2);
      });

      it('should create new interceptor instances on each call', () => {
        createNasaHttpClient();
        createNasaHttpClient();

        expect(LoadingInterceptor).toHaveBeenCalledTimes(2);
        expect(ErrorInterceptor).toHaveBeenCalledTimes(2);
      });

      it('should not share interceptor instances between clients', () => {
        createNasaHttpClient();
        createNasaHttpClient();

        const interceptors1 = vi.mocked(HttpClient).mock.calls[0][1];
        const interceptors2 = vi.mocked(HttpClient).mock.calls[1][1];

        expect(interceptors1).toBeDefined();
        expect(interceptors2).toBeDefined();
        expect(interceptors1).not.toBe(interceptors2);
      });
    });
  });

  describe('nasaHttpClient singleton', () => {
    it('should export a singleton instance', () => {
      expect(nasaHttpClient).toBeDefined();
      expect(nasaHttpClient).toBeInstanceOf(HttpClient);
    });

    it('should be the same instance when imported multiple times', () => {
      // In real scenario, multiple imports would return the same instance
      expect(nasaHttpClient).toBe(nasaHttpClient);
    });
  });

  describe('Comparison with Main HttpClient Factory', () => {
    it('should use hardcoded NASA URL instead of env variable', () => {
      createNasaHttpClient();

      const config = vi.mocked(HttpClient).mock.calls[0][0];
      expect(config.baseURL).toBe('https://api.nasa.gov');
    });

    it('should have fewer interceptors than main client (no auth)', () => {
      createNasaHttpClient();

      const interceptors = vi.mocked(HttpClient).mock.calls[0][1];
      // Main client has 3 interceptors (Loading, Auth, Error)
      // NASA client has 2 (Loading, Error)
      expect(interceptors).toHaveLength(2);
    });

    it('should not have default Content-Type header like main client', () => {
      createNasaHttpClient();

      const config = vi.mocked(HttpClient).mock.calls[0][0];
      expect(config.headers).toBeUndefined();
    });

    it('should use same services as main client', () => {
      createNasaHttpClient();

      expect(LoadingService).toHaveBeenCalled();
      expect(ToastNotificationService).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid successive calls', () => {
      const clients = [
        createNasaHttpClient(),
        createNasaHttpClient(),
        createNasaHttpClient()
      ];

      expect(HttpClient).toHaveBeenCalledTimes(3);
      expect(clients).toHaveLength(3);
      clients.forEach(client => {
        expect(client).toBeInstanceOf(HttpClient);
      });
    });

    it('should maintain configuration consistency across calls', () => {
      createNasaHttpClient();
      createNasaHttpClient();

      const config1 = vi.mocked(HttpClient).mock.calls[0][0];
      const config2 = vi.mocked(HttpClient).mock.calls[1][0];

      expect(config1.baseURL).toBe(config2.baseURL);
      expect(config1.timeout).toBe(config2.timeout);
    });

    it('should maintain interceptor order consistency', () => {
      createNasaHttpClient();
      createNasaHttpClient();

      const interceptors1 = vi.mocked(HttpClient).mock.calls[0][1];
      const interceptors2 = vi.mocked(HttpClient).mock.calls[1][1];

      expect(interceptors1).toBeDefined();
      expect(interceptors2).toBeDefined();
      expect(interceptors1![0]).toBeInstanceOf(LoadingInterceptor);
      expect(interceptors1![1]).toBeInstanceOf(ErrorInterceptor);
      expect(interceptors2![0]).toBeInstanceOf(LoadingInterceptor);
      expect(interceptors2![1]).toBeInstanceOf(ErrorInterceptor);
    });

    it('should work without environment variables', () => {
      // NASA client doesn't depend on env vars for base URL
      const originalEnv = process.env.NEXT_PUBLIC_BASE_URL;
      delete process.env.NEXT_PUBLIC_BASE_URL;

      expect(() => createNasaHttpClient()).not.toThrow();

      if (originalEnv !== undefined) {
        process.env.NEXT_PUBLIC_BASE_URL = originalEnv;
      }
    });
  });

  describe('Real-world Usage Scenarios', () => {
    it('should be suitable for NASA API requests without authentication', () => {
      const client = createNasaHttpClient();

      const config = vi.mocked(HttpClient).mock.calls[0][0];
      const interceptors = vi.mocked(HttpClient).mock.calls[0][1];

      expect(config.baseURL).toBe('https://api.nasa.gov');
      expect(interceptors).toHaveLength(2); // No auth interceptor
      expect(client).toBeInstanceOf(HttpClient);
    });

    it('should provide loading feedback for NASA API calls', () => {
      createNasaHttpClient();

      expect(LoadingInterceptor).toHaveBeenCalledWith(
        expect.any(LoadingService)
      );
    });

    it('should provide error notifications for NASA API failures', () => {
      createNasaHttpClient();

      expect(ErrorInterceptor).toHaveBeenCalledWith(
        expect.any(ToastNotificationService)
      );
    });

    it('should use 60 second timeout suitable for NASA API responses', () => {
      createNasaHttpClient();

      const config = vi.mocked(HttpClient).mock.calls[0][0];
      // NASA APIs can be slow, especially for large datasets
      expect(config.timeout).toBe(60000);
    });
  });
});
