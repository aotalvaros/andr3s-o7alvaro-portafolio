/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
import {
  ErrorInterceptor,
  INotificationService,
  DomainError,
  NetworkError,
  RateLimitError,
  NotFoundError
} from '@/core/infrastructure/http/interceptors/ErrorInterceptor';

describe('ErrorInterceptor', () => {
  let errorInterceptor: ErrorInterceptor;
  let mockNotificationService: INotificationService;

  // Helper to create mock AxiosError
  const createMockAxiosError = (
    status?: number,
    code?: string,
    data?: any,
    config?: Partial<InternalAxiosRequestConfig>
  ): AxiosError => {
    const error = new Error('Request failed') as AxiosError;
    error.isAxiosError = true;
    error.code = code;
    error.message = 'Request failed';
    
    if (status !== undefined) {
      error.response = {
        status,
        data,
        statusText: 'Error',
        headers: {},
        config: {
          headers: new AxiosHeaders(),
          ...config
        } as InternalAxiosRequestConfig
      };
    }
    
    error.config = {
      headers: new AxiosHeaders(),
      ...config
    } as InternalAxiosRequestConfig;
    
    return error;
  };

  beforeEach(() => {
    mockNotificationService = {
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn(),
      success: vi.fn(),
    };

    errorInterceptor = new ErrorInterceptor(mockNotificationService);
  });

  describe('Domain Error Classes', () => {
    describe('DomainError', () => {
      it('should create a domain error with message, code, and statusCode', () => {
        const error = new DomainError('Test error', 'TEST_CODE', 400);

        expect(error.message).toBe('Test error');
        expect(error.code).toBe('TEST_CODE');
        expect(error.statusCode).toBe(400);
        expect(error.name).toBe('DomainError');
        expect(error).toBeInstanceOf(Error);
      });
    });

    describe('NetworkError', () => {
      it('should create a network error with status code 500', () => {
        const error = new NetworkError('Connection failed');

        expect(error.message).toBe('Connection failed');
        expect(error.code).toBe('NETWORK_ERROR');
        expect(error.statusCode).toBe(500);
        expect(error.name).toBe('NetworkError');
      });
    });

    describe('RateLimitError', () => {
      it('should create a rate limit error with status code 429', () => {
        const error = new RateLimitError();

        expect(error.message).toBe('Límite de solicitudes alcanzado');
        expect(error.code).toBe('RATE_LIMIT_ERROR');
        expect(error.statusCode).toBe(429);
        expect(error.name).toBe('RateLimitError');
      });
    });

    describe('NotFoundError', () => {
      it('should create a not found error with default message', () => {
        const error = new NotFoundError();

        expect(error.message).toBe('Recurso no encontrado');
        expect(error.code).toBe('NOT_FOUND_ERROR');
        expect(error.statusCode).toBe(404);
        expect(error.name).toBe('NotFoundError');
      });

      it('should create a not found error with custom message', () => {
        const error = new NotFoundError('Usuario no encontrado');

        expect(error.message).toBe('Usuario no encontrado');
        expect(error.code).toBe('NOT_FOUND_ERROR');
        expect(error.statusCode).toBe(404);
      });
    });
  });

  describe('onResponseError - HTTP Status Errors', () => {
    it('should map 429 status to RateLimitError', async () => {
      const axiosError = createMockAxiosError(429);

      await expect(errorInterceptor.onResponseError(axiosError))
        .rejects
        .toThrow(RateLimitError);

      expect(mockNotificationService.error).toHaveBeenCalledWith(
        'Límite de solicitudes alcanzado'
      );
    });

    it('should map 404 status to NotFoundError', async () => {
      const axiosError = createMockAxiosError(404);

      await expect(errorInterceptor.onResponseError(axiosError))
        .rejects
        .toThrow(NotFoundError);

      expect(mockNotificationService.error).toHaveBeenCalledWith(
        'Recurso no encontrado'
      );
    });

    it('should map 500 status to NetworkError', async () => {
      const axiosError = createMockAxiosError(500);

      await expect(errorInterceptor.onResponseError(axiosError))
        .rejects
        .toThrow(NetworkError);

      const thrownError = await errorInterceptor.onResponseError(axiosError)
        .catch(err => err);

      expect(thrownError.message).toBe('Error interno del servidor');
      expect(mockNotificationService.error).toHaveBeenCalled();
    });

    it('should map 502 status to NetworkError', async () => {
      const axiosError = createMockAxiosError(502);

      const thrownError = await errorInterceptor.onResponseError(axiosError)
        .catch(err => err);

      expect(thrownError).toBeInstanceOf(NetworkError);
      expect(thrownError.message).toBe('Error interno del servidor');
    });

    it('should map 503 status to NetworkError', async () => {
      const axiosError = createMockAxiosError(503);

      const thrownError = await errorInterceptor.onResponseError(axiosError)
        .catch(err => err);

      expect(thrownError).toBeInstanceOf(NetworkError);
      expect(thrownError.message).toBe('Error interno del servidor');
    });

    it('should map 504 status to NetworkError', async () => {
      const axiosError = createMockAxiosError(504);

      const thrownError = await errorInterceptor.onResponseError(axiosError)
        .catch(err => err);

      expect(thrownError).toBeInstanceOf(NetworkError);
    });
  });

  describe('onResponseError - Network Error Codes', () => {
    it('should map ERR_NETWORK to NetworkError', async () => {
      const axiosError = createMockAxiosError(undefined, 'ERR_NETWORK');

      const thrownError = await errorInterceptor.onResponseError(axiosError)
        .catch(err => err);

      expect(thrownError).toBeInstanceOf(NetworkError);
      expect(thrownError.message).toBe('No se pudo conectar con el servidor');
    });

    it('should map ECONNREFUSED to NetworkError', async () => {
      const axiosError = createMockAxiosError(undefined, 'ECONNREFUSED');

      const thrownError = await errorInterceptor.onResponseError(axiosError)
        .catch(err => err);

      expect(thrownError).toBeInstanceOf(NetworkError);
      expect(thrownError.message).toBe('No se pudo conectar con el servidor');
    });

    it('should map ENOTFOUND to NetworkError', async () => {
      const axiosError = createMockAxiosError(undefined, 'ENOTFOUND');

      const thrownError = await errorInterceptor.onResponseError(axiosError)
        .catch(err => err);

      expect(thrownError).toBeInstanceOf(NetworkError);
      expect(thrownError.message).toBe('Servidor no encontrado');
    });

    it('should map ECONNABORTED to NetworkError with timeout message', async () => {
      const axiosError = createMockAxiosError(undefined, 'ECONNABORTED');

      const thrownError = await errorInterceptor.onResponseError(axiosError)
        .catch(err => err);

      expect(thrownError).toBeInstanceOf(NetworkError);
      expect(thrownError.message).toBe('La solicitud tardó demasiado tiempo');
    });
  });

  describe('onResponseError - Error Message Extraction', () => {
    it('should use error message from response data', async () => {
      const axiosError = createMockAxiosError(400, undefined, {
        error: 'Email is required'
      });

      const thrownError = await errorInterceptor.onResponseError(axiosError)
        .catch(err => err);

      expect(thrownError).toBeInstanceOf(NetworkError);
      expect(thrownError.message).toBe('Email is required');
    });

    it('should use axios error message if no response data', async () => {
      const axiosError = createMockAxiosError(undefined, undefined);
      axiosError.message = 'Custom axios error message';

      const thrownError = await errorInterceptor.onResponseError(axiosError)
        .catch(err => err);

      expect(thrownError.message).toBe('Custom axios error message');
    });


    it('should handle response data without error property', async () => {
      const axiosError = createMockAxiosError(400, undefined, {
        message: 'Different property name'
      });
      axiosError.message = 'Fallback message';

      const thrownError = await errorInterceptor.onResponseError(axiosError)
        .catch(err => err);

      expect(thrownError.message).toBe('Fallback message');
    });
  });

  describe('onResponseError - Notification Service Integration', () => {
    it('should call notification service error method', async () => {
      const axiosError = createMockAxiosError(404);

      await errorInterceptor.onResponseError(axiosError).catch(() => {});

      expect(mockNotificationService.error).toHaveBeenCalledTimes(1);
      expect(mockNotificationService.error).toHaveBeenCalledWith(
        'Recurso no encontrado'
      );
    });


    it('should call notification service when skipErrorToast is undefined', async () => {
      const axiosError = createMockAxiosError(404);

      await errorInterceptor.onResponseError(axiosError).catch(() => {});

      expect(mockNotificationService.error).toHaveBeenCalled();
    });

    it('should never call warning, info, or success methods', async () => {
      const axiosError = createMockAxiosError(500);

      await errorInterceptor.onResponseError(axiosError).catch(() => {});

      expect(mockNotificationService.warning).not.toHaveBeenCalled();
      expect(mockNotificationService.info).not.toHaveBeenCalled();
      expect(mockNotificationService.success).not.toHaveBeenCalled();
    });
  });

  describe('onResponseError - Error Priority and Mapping', () => {
    it('should prioritize 429 over network codes', async () => {
      const axiosError = createMockAxiosError(429, 'ERR_NETWORK');

      const thrownError = await errorInterceptor.onResponseError(axiosError)
        .catch(err => err);

      expect(thrownError).toBeInstanceOf(RateLimitError);
      expect(thrownError).not.toBeInstanceOf(NetworkError);
    });

    it('should prioritize network codes over 404', async () => {
      const axiosError = createMockAxiosError(404, 'ERR_NETWORK');

      const thrownError = await errorInterceptor.onResponseError(axiosError)
        .catch(err => err);

      expect(thrownError).toBeInstanceOf(NetworkError);
      expect(thrownError.message).toBe('No se pudo conectar con el servidor');
    });

    it('should prioritize 404 over 500 range', async () => {
      // This tests the order of error checking
      const axiosError = createMockAxiosError(404);

      const thrownError = await errorInterceptor.onResponseError(axiosError)
        .catch(err => err);

      expect(thrownError).toBeInstanceOf(NotFoundError);
      expect(thrownError).not.toBeInstanceOf(NetworkError);
    });
  });

  describe('onResponseError - Edge Cases', () => {
    it('should handle error without config', async () => {
      const axiosError = createMockAxiosError(500);
      axiosError.config = undefined as any;

      const thrownError = await errorInterceptor.onResponseError(axiosError)
        .catch(err => err);

      expect(thrownError).toBeInstanceOf(NetworkError);
      expect(mockNotificationService.error).toHaveBeenCalled();
    });

    it('should handle error without response', async () => {
      const axiosError = createMockAxiosError(undefined, 'ERR_NETWORK');
      axiosError.response = undefined;

      const thrownError = await errorInterceptor.onResponseError(axiosError)
        .catch(err => err);

      expect(thrownError).toBeInstanceOf(NetworkError);
    });

    it('should handle error with null response data', async () => {
      const axiosError = createMockAxiosError(400, undefined, null);

      const thrownError = await errorInterceptor.onResponseError(axiosError)
        .catch(err => err);

      expect(thrownError).toBeInstanceOf(NetworkError);
    });

    it('should handle error with undefined response data', async () => {
      const axiosError = createMockAxiosError(400, undefined, undefined);

      const thrownError = await errorInterceptor.onResponseError(axiosError)
        .catch(err => err);

      expect(thrownError).toBeInstanceOf(NetworkError);
    });

    it('should handle non-AxiosError objects', async () => {
      const genericError = new Error('Generic error');

      const thrownError = await errorInterceptor.onResponseError(genericError)
        .catch(err => err);

      expect(thrownError).toBeInstanceOf(NetworkError);
      expect(thrownError.message).toBe('Generic error');
    });

    it('should handle error with status code outside documented ranges', async () => {
      const axiosError = createMockAxiosError(418); // I'm a teapot

      const thrownError = await errorInterceptor.onResponseError(axiosError)
        .catch(err => err);

      expect(thrownError).toBeInstanceOf(NetworkError);
    });
  });

  describe('onResponseError - Real-world Scenarios', () => {
    it('should handle timeout error correctly', async () => {
      const timeoutError = createMockAxiosError(undefined, 'ECONNABORTED');

      const thrownError = await errorInterceptor.onResponseError(timeoutError)
        .catch(err => err);

      expect(thrownError).toBeInstanceOf(NetworkError);
      expect(thrownError.message).toBe('La solicitud tardó demasiado tiempo');
      expect(mockNotificationService.error).toHaveBeenCalledWith(
        'La solicitud tardó demasiado tiempo'
      );
    });

    it('should handle authentication errors (401)', async () => {
      const authError = createMockAxiosError(401, undefined, {
        error: 'Invalid credentials'
      });

      const thrownError = await errorInterceptor.onResponseError(authError)
        .catch(err => err);

      expect(thrownError).toBeInstanceOf(NetworkError);
      expect(thrownError.message).toBe('Invalid credentials');
    });

    it('should handle authorization errors (403)', async () => {
      const forbiddenError = createMockAxiosError(403, undefined, {
        error: 'Access denied'
      });

      const thrownError = await errorInterceptor.onResponseError(forbiddenError)
        .catch(err => err);

      expect(thrownError.message).toBe('Access denied');
    });

    it('should handle validation errors (422)', async () => {
      const validationError = createMockAxiosError(422, undefined, {
        error: 'Email format is invalid'
      });

      const thrownError = await errorInterceptor.onResponseError(validationError)
        .catch(err => err);

      expect(thrownError.message).toBe('Email format is invalid');
    });

    it('should handle CORS errors', async () => {
      const corsError = createMockAxiosError(undefined, 'ERR_NETWORK');
      corsError.message = 'Network Error';

      const thrownError = await errorInterceptor.onResponseError(corsError)
        .catch(err => err);

      expect(thrownError).toBeInstanceOf(NetworkError);
      expect(thrownError.message).toBe('No se pudo conectar con el servidor');
    });

    it('should handle SSL/TLS errors', async () => {
      const sslError = createMockAxiosError(undefined, 'ECONNREFUSED');

      const thrownError = await errorInterceptor.onResponseError(sslError)
        .catch(err => err);

      expect(thrownError).toBeInstanceOf(NetworkError);
    });

    it('should handle gateway timeout (504)', async () => {
      const gatewayError = createMockAxiosError(504);

      const thrownError = await errorInterceptor.onResponseError(gatewayError)
        .catch(err => err);

      expect(thrownError).toBeInstanceOf(NetworkError);
      expect(thrownError.message).toBe('Error interno del servidor');
    });
  });

  describe('onResponseError - Multiple Error Scenarios', () => {
    it('should handle multiple consecutive errors', async () => {
      const errors = [
        createMockAxiosError(404),
        createMockAxiosError(500),
        createMockAxiosError(429)
      ];

      for (const error of errors) {
        await errorInterceptor.onResponseError(error).catch(() => {});
      }

      expect(mockNotificationService.error).toHaveBeenCalledTimes(3);
    });

  });

  describe('Error Transformation Consistency', () => {
    it('should always throw DomainError instances', async () => {
      const errors = [
        createMockAxiosError(404),
        createMockAxiosError(429),
        createMockAxiosError(500),
        createMockAxiosError(undefined, 'ERR_NETWORK')
      ];

      for (const error of errors) {
        const thrownError = await errorInterceptor.onResponseError(error)
          .catch(err => err);

        expect(thrownError).toBeInstanceOf(DomainError);
      }
    });

    it('should preserve error stack traces', async () => {
      const axiosError = createMockAxiosError(500);

      const thrownError = await errorInterceptor.onResponseError(axiosError)
        .catch(err => err);

      expect(thrownError.stack).toBeDefined();
      expect(typeof thrownError.stack).toBe('string');
    });

    it('should have consistent error names', async () => {
      const rateLimitError = await errorInterceptor.onResponseError(
        createMockAxiosError(429)
      ).catch(err => err);

      const networkError = await errorInterceptor.onResponseError(
        createMockAxiosError(500)
      ).catch(err => err);

      const notFoundError = await errorInterceptor.onResponseError(
        createMockAxiosError(404)
      ).catch(err => err);

      expect(rateLimitError.name).toBe('RateLimitError');
      expect(networkError.name).toBe('NetworkError');
      expect(notFoundError.name).toBe('NotFoundError');
    });
  });
});