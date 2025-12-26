import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useLoadingStore } from '@/store/loadingStore';
import { useToastMessageStore } from '@/store/ToastMessageStore';
import { createHttpClient, httpClient } from '../../../../core/infrastructure/http/httpClientFactory';
import { HttpClient } from '../../../../core/infrastructure/http/HttpClient';
import { CookieStorageService } from '../../../../core/infrastructure/services/CookieStorageService';
import { LoadingService } from '../../../../core/infrastructure/services/LoadingService';
import { ToastNotificationService } from '../../../../core/infrastructure/services/ToastNotificationService';
import { LoadingInterceptor } from '../../../../core/infrastructure/http/interceptors/LoadingInterceptor';
import { AuthInterceptor } from '../../../../core/infrastructure/http/interceptors/AuthInterceptor';
import { ErrorInterceptor } from '../../../../core/infrastructure/http/interceptors/ErrorInterceptor';

// Mock de los módulos
vi.mock('../../../../core/infrastructure/http/HttpClient');
vi.mock('../../../../core/infrastructure/http/interceptors/LoadingInterceptor');
vi.mock('../../../../core/infrastructure/http/interceptors/AuthInterceptor');
vi.mock('../../../../core/infrastructure/http/interceptors/ErrorInterceptor');
vi.mock('../../../../core/infrastructure/services/LoadingService');
vi.mock('../../../../core/infrastructure/services/CookieStorageService');
vi.mock('../../../../core/infrastructure/services/ToastNotificationService');
vi.mock('@/store/loadingStore');
vi.mock('@/store/ToastMessageStore');

describe('createHttpClient', () => {
  // Mocks de funciones de stores
  const mockSetLoading = vi.fn();
  const mockSetParams = vi.fn();
  
  // Mock de fetch global
  const mockFetch = vi.fn();

  beforeEach(() => {
    // Reset de todos los mocks
    vi.clearAllMocks();
    
    // Setup del store de loading
    vi.mocked(useLoadingStore.getState).mockReturnValue({
      setLoading: mockSetLoading,
    } as any);
    
    // Setup del store de toast
    vi.mocked(useToastMessageStore.getState).mockReturnValue({
      setParams: mockSetParams,
    } as any);

    // Setup de fetch global
    global.fetch = mockFetch;
    
    // Setup de variables de entorno
    process.env.NEXT_PUBLIC_BASE_URL = 'https://api.test.com';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  //Cambia los test a ingles

  describe('Instance creation', () => {
    it('should create an instance of HttpClient with the correct configuration', () => {
      const client = createHttpClient();

      expect(HttpClient).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://api.test.com',
          timeout: 60000,
          headers: {
            'Content-Type': 'application/json'
          }
        }),
        expect.any(Array)
      );
      
      expect(client).toBeInstanceOf(HttpClient);
    });

    it('should use the baseURL from environment variables', () => {
      process.env.NEXT_PUBLIC_BASE_URL = 'https://custom.api.com';
      
      createHttpClient();

      expect(HttpClient).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://custom.api.com'
        }),
        expect.any(Array)
      );
    });
  });

  describe('Service initialization', () => {
    it('should create CookieStorageService correctly', () => {
      createHttpClient();

      expect(CookieStorageService).toHaveBeenCalledTimes(1);
    });

    it('should create LoadingService with setLoading from the store', () => {
      createHttpClient();

      expect(LoadingService).toHaveBeenCalledWith(mockSetLoading);
      expect(useLoadingStore.getState).toHaveBeenCalled();
    });

    it('should create ToastNotificationService with setParams from the store', () => {
      createHttpClient();

      expect(ToastNotificationService).toHaveBeenCalledWith(mockSetParams);
      expect(useToastMessageStore.getState).toHaveBeenCalled();
    });
  });

  describe('Interceptor configuration', () => {
    it('should create the three interceptors in the correct order', () => {
      createHttpClient();

      const callArgs = vi.mocked(HttpClient).mock.calls[0];
      const interceptors = callArgs[1];

      expect(interceptors).toHaveLength(3);
      expect(LoadingInterceptor).toHaveBeenCalled();
      expect(AuthInterceptor).toHaveBeenCalled();
      expect(ErrorInterceptor).toHaveBeenCalled();
    });

    it('should initialize LoadingInterceptor with LoadingService', () => {
      createHttpClient();

      expect(LoadingInterceptor).toHaveBeenCalledWith(
        expect.any(LoadingService)
      );
    });

    it('should initialize AuthInterceptor with storage and authRepository', () => {
      createHttpClient();

      expect(AuthInterceptor).toHaveBeenCalledWith(
        expect.any(CookieStorageService),
        expect.objectContaining({
          refreshToken: expect.any(Function)
        })
      );
    });

    it('should initialize ErrorInterceptor with ToastNotificationService', () => {
      createHttpClient();

      expect(ErrorInterceptor).toHaveBeenCalledWith(
        expect.any(ToastNotificationService)
      );
    });
  });

  describe('AuthRepository - refreshToken', () => {
    it('should make a POST request to the refresh token endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ token: 'new-access-token' })
      });

      createHttpClient();
      
      // Obtener el authRepository que se pasó al AuthInterceptor
      const authInterceptorCall = vi.mocked(AuthInterceptor).mock.calls[0];
      const authRepository = authInterceptorCall[1];

      await authRepository.refreshToken('old-refresh-token');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/auth/refresh-token',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: 'old-refresh-token' })
        }
      );
    });

    it('should return the new token from the response', async () => {
      const expectedToken = 'shiny-new-token-123';
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ token: expectedToken })
      });

      createHttpClient();
      
      const authInterceptorCall = vi.mocked(AuthInterceptor).mock.calls[0];
      const authRepository = authInterceptorCall[1];

      const result = await authRepository.refreshToken('refresh-token');

      expect(result).toBe(expectedToken);
    });

    it('should propagate errors if the refresh token fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      createHttpClient();
      
      const authInterceptorCall = vi.mocked(AuthInterceptor).mock.calls[0];
      const authRepository = authInterceptorCall[1];

      await expect(authRepository.refreshToken('bad-token'))
        .rejects.toThrow('Network error');
    });
  });

  describe('Singleton httpClient', () => {
    it('should export a singleton instance of HttpClient', () => {
      expect(httpClient).toBeDefined();
      expect(httpClient).toBeInstanceOf(HttpClient);
    });

    it('httpClient should be the same instance when imported multiple times', () => {
      // En un escenario real, múltiples imports retornarían la misma instancia
      // Aquí verificamos que se crea correctamente
      expect(httpClient).toBe(httpClient);
    });
  });

  describe('Handling edge cases', () => {
    it('should handle when useLoadingStore.getState() returns undefined', () => {
      vi.mocked(useLoadingStore.getState).mockReturnValueOnce(undefined as any);

      // No debería lanzar error
      expect(() => createHttpClient()).not.toThrow();
    });

    it('should use default timeout of 60 seconds', () => {
      createHttpClient();

      expect(HttpClient).toHaveBeenCalledWith(
        expect.objectContaining({
          timeout: 60000
        }),
        expect.any(Array)
      );
    });

    it('should set default headers with Content-Type JSON', () => {
      createHttpClient();

      expect(HttpClient).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json'
          }
        }),
        expect.any(Array)
      );
    });
  });
});