import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { InternalAxiosRequestConfig, AxiosError, AxiosHeaders } from 'axios';

import axios from 'axios';
import { AuthInterceptor, IStorageService, IAuthRepository } from '../../../../../core/infrastructure/http/interceptors/AuthInterceptor';

// Mock de axios
vi.mock('axios');

describe('AuthInterceptor', () => {
  let authInterceptor: AuthInterceptor;
  let mockStorageService: IStorageService;
  let mockAuthRepository: IAuthRepository;
  let mockAxios = vi.mocked(axios);

  // Helpers para crear objetos mock
  const createMockConfig = (overrides = {}): InternalAxiosRequestConfig => ({
    headers: new AxiosHeaders(),
    url: 'https://api.test.com/users',
    method: 'GET',
    ...overrides,
  } as InternalAxiosRequestConfig);

  const createMockAxiosError = (
    status: number,
    config: InternalAxiosRequestConfig
  ): AxiosError => {
    const error = new Error('Request failed') as AxiosError;
    error.response = {
      status,
      data: {},
      statusText: 'Error',
      headers: {},
      config,
    };
    error.config = config;
    error.isAxiosError = true;
    return error;
  };

  beforeEach(() => {
    // Mock del storage service
    mockStorageService = {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn(),
    };

    // Mock del auth repository
    mockAuthRepository = {
      refreshToken: vi.fn(),
    };

    authInterceptor = new AuthInterceptor(mockStorageService, mockAuthRepository);

    // Mock de window.location
    delete (window as any).location;
    window.location = {
      pathname: '/dashboard',
      replace: vi.fn(),
    } as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });


  describe('onRequest', () => {
    it('should add the authorization token when it exists in storage', async () => {
      const mockToken = 'test-token-123';
      vi.mocked(mockStorageService.get).mockReturnValue(mockToken);

      const config = createMockConfig();
      const result = await authInterceptor.onRequest(config);

      expect(mockStorageService.get).toHaveBeenCalledWith('token');
      expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`);
    });

    it('should not add Authorization header when there is no token', async () => {
      vi.mocked(mockStorageService.get).mockReturnValue(null);

      const config = createMockConfig();
      const result = await authInterceptor.onRequest(config);

      expect(mockStorageService.get).toHaveBeenCalledWith('token');
      expect(result.headers.Authorization).toBeUndefined();
    });

    it('should return the unmodified config if there is no token', async () => {
      vi.mocked(mockStorageService.get).mockReturnValue(null);

      const config = createMockConfig({ url: 'https://api.test.com/data' });
      const result = await authInterceptor.onRequest(config);

      expect(result.url).toBe('https://api.test.com/data');
      expect(result.method).toBe('GET');
    });
  });

  describe('onResponseError - Non-401 errors', () => {
    it('should propagate errors that are not 401', async () => {
      const config = createMockConfig();
      const error = createMockAxiosError(500, config);

      await expect(authInterceptor.onResponseError(error)).rejects.toThrow();
    });

    it('should propagate 404 errors', async () => {
      const config = createMockConfig();
      const error = createMockAxiosError(404, config);

      await expect(authInterceptor.onResponseError(error)).rejects.toBe(error);
    });

    it('should propagate 403 errors', async () => {
      const config = createMockConfig();
      const error = createMockAxiosError(403, config);

      await expect(authInterceptor.onResponseError(error)).rejects.toBe(error);
    });
  });

  describe('onResponseError - 401 on auth endpoints', () => {
    it('should not attempt refresh on /auth/login to avoid loop', async () => {
      const config = createMockConfig({ url: 'https://api.test.com/auth/login' });
      const error = createMockAxiosError(401, config);

      vi.mocked(mockStorageService.get).mockReturnValue('refresh-token');

      await expect(authInterceptor.onResponseError(error)).rejects.toBe(error);
      expect(mockAuthRepository.refreshToken).not.toHaveBeenCalled();
    });

    it('should not attempt refresh on /auth/refresh-token to avoid loop', async () => {
      const config = createMockConfig({ url: 'https://api.test.com/auth/refresh-token' });
      const error = createMockAxiosError(401, config);

      vi.mocked(mockStorageService.get).mockReturnValue('refresh-token');

      await expect(authInterceptor.onResponseError(error)).rejects.toBe(error);
      expect(mockAuthRepository.refreshToken).not.toHaveBeenCalled();
    });
  });

  describe('onResponseError - 401 without refresh token', () => {
    it('should propagate the error if no refresh token is available', async () => {
      const config = createMockConfig();
      const error = createMockAxiosError(401, config);

      vi.mocked(mockStorageService.get).mockReturnValue(null);

      await expect(authInterceptor.onResponseError(error)).rejects.toBe(error);
      expect(mockAuthRepository.refreshToken).not.toHaveBeenCalled();
    });
  });

  describe('onResponseError - Refresh token successful', () => {
    it('should refresh the token and retry the original request', async () => {
      const config = createMockConfig();
      const error = createMockAxiosError(401, config);
      const newToken = 'new-shiny-token';

      vi.mocked(mockStorageService.get).mockReturnValue('old-refresh-token');
      vi.mocked(mockAuthRepository.refreshToken).mockResolvedValue(newToken);
      mockAxios.mockResolvedValue({ data: 'success' });

      await authInterceptor.onResponseError(error);

      expect(mockAuthRepository.refreshToken).toHaveBeenCalledWith('old-refresh-token');
      expect(mockStorageService.set).toHaveBeenCalledWith('token', newToken);
      expect(mockAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${newToken}`,
          }),
        })
      );
    });

    it('should update the Authorization header with the new token', async () => {
      const config = createMockConfig();
      const error = createMockAxiosError(401, config);
      const newToken = 'super-new-token';

      vi.mocked(mockStorageService.get).mockReturnValue('refresh-token');
      vi.mocked(mockAuthRepository.refreshToken).mockResolvedValue(newToken);
      mockAxios.mockResolvedValue({ data: 'success' });

      await authInterceptor.onResponseError(error);

      expect(mockAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${newToken}`,
          }),
        })
      );
    });

    it('should mark _retry as true to avoid infinite retries', async () => {
      const config = createMockConfig();
      const error = createMockAxiosError(401, config);

      vi.mocked(mockStorageService.get).mockReturnValue('refresh-token');
      vi.mocked(mockAuthRepository.refreshToken).mockResolvedValue('new-token');
      mockAxios.mockResolvedValue({ data: 'success' });

      await authInterceptor.onResponseError(error);

      expect(mockAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          _retry: true,
        })
      );
    });
  });

  describe('onResponseError - Refresh token failed', () => {
    it('should clear auth and redirect to login when refresh fails', async () => {
      const config = createMockConfig();
      const error = createMockAxiosError(401, config);
      const refreshError = new Error('Refresh failed');

      vi.mocked(mockStorageService.get).mockReturnValue('invalid-refresh-token');
      vi.mocked(mockAuthRepository.refreshToken).mockRejectedValue(refreshError);

      await expect(authInterceptor.onResponseError(error)).rejects.toThrow('Refresh failed');

      expect(mockStorageService.remove).toHaveBeenCalledWith('token');
      expect(mockStorageService.remove).toHaveBeenCalledWith('refreshToken');
      expect(window.location.replace).toHaveBeenCalledWith('/login');
    });

    it('should not redirect if already on /login', async () => {
      window.location.pathname = '/login';
      
      const config = createMockConfig();
      const error = createMockAxiosError(401, config);

      vi.mocked(mockStorageService.get).mockReturnValue('refresh-token');
      vi.mocked(mockAuthRepository.refreshToken).mockRejectedValue(new Error('Failed'));

      await expect(authInterceptor.onResponseError(error)).rejects.toThrow();

      expect(window.location.replace).not.toHaveBeenCalled();
    });

    it('should handle the case where window is not defined (SSR)', async () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const config = createMockConfig();
      const error = createMockAxiosError(401, config);

      vi.mocked(mockStorageService.get).mockReturnValue('refresh-token');
      vi.mocked(mockAuthRepository.refreshToken).mockRejectedValue(new Error('Failed'));

      await expect(authInterceptor.onResponseError(error)).rejects.toThrow();

      // No debería lanzar error por window undefined
      global.window = originalWindow;
    });
  });

  describe('onResponseError - Request queue (failedQueue)', () => {
    it('should queue requests while refreshing the token', async () => {
      const config1 = createMockConfig({ url: '/api/users' });
      const config2 = createMockConfig({ url: '/api/posts' });
      const error1 = createMockAxiosError(401, config1);
      const error2 = createMockAxiosError(401, config2);
      const newToken = 'new-token';

      vi.mocked(mockStorageService.get).mockReturnValue('refresh-token');
      
      // Primera llamada inicia el refresh (toma tiempo)
      let resolveRefresh: (value: string) => void;
      const refreshPromise = new Promise<string>((resolve) => {
        resolveRefresh = resolve;
      });
      vi.mocked(mockAuthRepository.refreshToken).mockReturnValue(refreshPromise);
      
      mockAxios.mockResolvedValue({ data: 'success' });

      // Primera petición inicia el refresh
      const promise1 = authInterceptor.onResponseError(error1);
      
      // Segunda petición se encola
      const promise2 = authInterceptor.onResponseError(error2);

      // Resolvemos el refresh
      resolveRefresh!(newToken);
      
      await Promise.all([promise1, promise2]);

      // Ambas peticiones deberían reintentarse con el nuevo token
      expect(mockAxios).toHaveBeenCalledTimes(2);
      expect(mockAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/users',
          headers: expect.objectContaining({
            Authorization: `Bearer ${newToken}`,
          }),
        })
      );
      expect(mockAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/posts',
          headers: expect.objectContaining({
            Authorization: `Bearer ${newToken}`,
          }),
        })
      );
    });

    it('should reject all queued requests if refresh fails', async () => {
      const config1 = createMockConfig({ url: '/api/users' });
      const config2 = createMockConfig({ url: '/api/posts' });
      const error1 = createMockAxiosError(401, config1);
      const error2 = createMockAxiosError(401, config2);
      const refreshError = new Error('Refresh failed');

      vi.mocked(mockStorageService.get).mockReturnValue('refresh-token');

      let rejectRefresh: (reason: Error) => void;
      const refreshPromise = new Promise<string>((_, reject) => {
        rejectRefresh = reject;
      });
      vi.mocked(mockAuthRepository.refreshToken).mockReturnValue(refreshPromise);

      const promise1 = authInterceptor.onResponseError(error1);
      const promise2 = authInterceptor.onResponseError(error2);

      rejectRefresh!(refreshError);

      await expect(promise1).rejects.toThrow('Refresh failed');
      await expect(promise2).rejects.toThrow('Refresh failed');
    });

    it('should clear the queue after processing all requests', async () => {
      const config = createMockConfig();
      const error = createMockAxiosError(401, config);

      vi.mocked(mockStorageService.get).mockReturnValue('refresh-token');
      vi.mocked(mockAuthRepository.refreshToken).mockResolvedValue('new-token');
      mockAxios.mockResolvedValue({ data: 'success' });

      await authInterceptor.onResponseError(error);

      // Intentar otra petición 401 debería iniciar un nuevo refresh, no usar la cola
      const config2 = createMockConfig();
      const error2 = createMockAxiosError(401, config2);
      
      await authInterceptor.onResponseError(error2);

      expect(mockAuthRepository.refreshToken).toHaveBeenCalledTimes(2);
    });
  });

  describe('onResponseError - Requests with _retry already marked', () => {
    it('should not retry requests that already have _retry: true', async () => {
      const config = createMockConfig() as InternalAxiosRequestConfig & { _retry?: boolean };
      config._retry = true;
      const error = createMockAxiosError(401, config);

      vi.mocked(mockStorageService.get).mockReturnValue('refresh-token');

      await expect(authInterceptor.onResponseError(error)).rejects.toBe(error);
      expect(mockAuthRepository.refreshToken).not.toHaveBeenCalled();
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle errors without response', async () => {
      const error = new Error('Network error') as AxiosError;
      error.config = createMockConfig();
      error.isAxiosError = true;

      await expect(authInterceptor.onResponseError(error)).rejects.toBe(error);
    });

    it('should handle errors without config', async () => {
      const error = new Error('Unknown error');

      await expect(authInterceptor.onResponseError(error)).rejects.toBe(error);
    });

    it('should reset isRefreshing after a successful refresh', async () => {
      const config = createMockConfig();
      const error = createMockAxiosError(401, config);

      vi.mocked(mockStorageService.get).mockReturnValue('refresh-token');
      vi.mocked(mockAuthRepository.refreshToken).mockResolvedValue('new-token');
      mockAxios.mockResolvedValue({ data: 'success' });

      await authInterceptor.onResponseError(error);

      // Otra petición 401 debería poder iniciar un nuevo refresh
      const config2 = createMockConfig();
      const error2 = createMockAxiosError(401, config2);
      
      await authInterceptor.onResponseError(error2);

      expect(mockAuthRepository.refreshToken).toHaveBeenCalledTimes(2);
    });

    it('should reset isRefreshing even if the refresh fails', async () => {
      const config = createMockConfig();
      const error = createMockAxiosError(401, config);

      vi.mocked(mockStorageService.get).mockReturnValue('refresh-token');
      vi.mocked(mockAuthRepository.refreshToken).mockRejectedValue(new Error('Failed'));

      await expect(authInterceptor.onResponseError(error)).rejects.toThrow();

      // Debería poder intentar otro refresh
      const config2 = createMockConfig();
      const error2 = createMockAxiosError(401, config2);
      vi.mocked(mockStorageService.get).mockReturnValue('refresh-token');
      vi.mocked(mockAuthRepository.refreshToken).mockResolvedValue('new-token');
      mockAxios.mockResolvedValue({ data: 'success' });

      await authInterceptor.onResponseError(error2);

      expect(mockAuthRepository.refreshToken).toHaveBeenCalledTimes(2);
    });
  });
});