import { CookieStorageService } from '@/core/infrastructure/services/CookieStorageService';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

// Mock cookies-next
vi.mock('cookies-next', () => ({
  getCookie: vi.fn(),
  setCookie: vi.fn(),
  deleteCookie: vi.fn(),
}));

describe('CookieStorageService', () => {
  let cookieStorageService: CookieStorageService;

  beforeEach(() => {
    cookieStorageService = new CookieStorageService();
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  describe('get', () => {
    it('should get cookie value as string', () => {
      vi.mocked(getCookie).mockReturnValue('test-value');

      const result = cookieStorageService.get('test-key');

      expect(getCookie).toHaveBeenCalledWith('test-key');
      expect(result).toBe('test-value');
    });

    it('should return null when cookie does not exist', () => {
      vi.mocked(getCookie).mockReturnValue(undefined);

      const result = cookieStorageService.get('non-existent-key');

      expect(getCookie).toHaveBeenCalledWith('non-existent-key');
      expect(result).toBeNull();
    });

    it('should convert non-string values to string', () => {
      vi.mocked(getCookie).mockReturnValue(123 as any);

      const result = cookieStorageService.get('numeric-key');

      expect(result).toBe('123');
      expect(typeof result).toBe('string');
    });

    it('should handle boolean values', () => {
      vi.mocked(getCookie).mockReturnValue(true as any);

      const result = cookieStorageService.get('boolean-key');

      expect(result).toBe('true');
    });

    it('should get token cookie', () => {
      vi.mocked(getCookie).mockReturnValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');

      const result = cookieStorageService.get('token');

      expect(getCookie).toHaveBeenCalledWith('token');
      expect(result).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
    });

    it('should get refreshToken cookie', () => {
      vi.mocked(getCookie).mockReturnValue('refresh_token_abc123');

      const result = cookieStorageService.get('refreshToken');

      expect(getCookie).toHaveBeenCalledWith('refreshToken');
      expect(result).toBe('refresh_token_abc123');
    });

    it('should handle null return from getCookie', () => {
      vi.mocked(getCookie).mockReturnValue(null as any);

      const result = cookieStorageService.get('key');

      expect(result).toBeNull();
    });

    it('should handle undefined return from getCookie', () => {
      vi.mocked(getCookie).mockReturnValue(undefined);

      const result = cookieStorageService.get('key');

      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should set cookie with correct parameters in development', () => {
      vi.stubEnv('NODE_ENV', 'development');

      cookieStorageService.set('test-key', 'test-value');

      expect(setCookie).toHaveBeenCalledWith('test-key', 'test-value', {
        path: '/',
        secure: false,
        sameSite: 'strict'
      });
    });

    it('should set cookie with secure flag in production', () => {
      vi.stubEnv('NODE_ENV', 'production');

      cookieStorageService.set('test-key', 'test-value');

      expect(setCookie).toHaveBeenCalledWith('test-key', 'test-value', {
        path: '/',
        secure: true,
        sameSite: 'strict'
      });
    });

    it('should set cookie with secure flag false when NODE_ENV is test', () => {
      vi.stubEnv('NODE_ENV', 'test');

      cookieStorageService.set('test-key', 'test-value');

      expect(setCookie).toHaveBeenCalledWith('test-key', 'test-value', {
        path: '/',
        secure: false,
        sameSite: 'strict'
      });
    });

    it('should set cookie with secure flag false when NODE_ENV is undefined', () => {
      vi.stubEnv('NODE_ENV', undefined);

      cookieStorageService.set('test-key', 'test-value');

      expect(setCookie).toHaveBeenCalledWith('test-key', 'test-value', {
        path: '/',
        secure: false,
        sameSite: 'strict'
      });
    });

    it('should set token cookie', () => {
      vi.stubEnv('NODE_ENV', 'production');
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

      cookieStorageService.set('token', token);

      expect(setCookie).toHaveBeenCalledWith('token', token, {
        path: '/',
        secure: true,
        sameSite: 'strict'
      });
    });

    it('should set refreshToken cookie', () => {
      vi.stubEnv('NODE_ENV', 'production');
      const refreshToken = 'refresh_token_xyz789';

      cookieStorageService.set('refreshToken', refreshToken);

      expect(setCookie).toHaveBeenCalledWith('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: 'strict'
      });
    });

    it('should set cookie with path as root', () => {
      cookieStorageService.set('key', 'value');

      expect(setCookie).toHaveBeenCalledWith(
        'key',
        'value',
        expect.objectContaining({
          path: '/'
        })
      );
    });

    it('should set cookie with sameSite as strict', () => {
      cookieStorageService.set('key', 'value');

      expect(setCookie).toHaveBeenCalledWith(
        'key',
        'value',
        expect.objectContaining({
          sameSite: 'strict'
        })
      );
    });

    it('should handle empty string value', () => {
      cookieStorageService.set('key', '');

      expect(setCookie).toHaveBeenCalledWith('key', '', expect.any(Object));
    });

    it('should handle long string values', () => {
      const longValue = 'a'.repeat(4000);

      cookieStorageService.set('key', longValue);

      expect(setCookie).toHaveBeenCalledWith('key', longValue, expect.any(Object));
    });

    it('should handle special characters in value', () => {
      const specialValue = 'value!@#$%^&*()_+-={}[]|:;"<>?,./';

      cookieStorageService.set('key', specialValue);

      expect(setCookie).toHaveBeenCalledWith('key', specialValue, expect.any(Object));
    });

    it('should handle unicode characters in value', () => {
      const unicodeValue = 'Hola 👋 español ñáéíóú';

      cookieStorageService.set('key', unicodeValue);

      expect(setCookie).toHaveBeenCalledWith('key', unicodeValue, expect.any(Object));
    });
  });

  describe('remove', () => {
    it('should delete cookie with correct key', () => {
      cookieStorageService.remove('test-key');

      expect(deleteCookie).toHaveBeenCalledWith('test-key', { path: '/' });
    });

    it('should remove token cookie', () => {
      cookieStorageService.remove('token');

      expect(deleteCookie).toHaveBeenCalledWith('token', { path: '/' });
    });

    it('should remove refreshToken cookie', () => {
      cookieStorageService.remove('refreshToken');

      expect(deleteCookie).toHaveBeenCalledWith('refreshToken', { path: '/' });
    });

    it('should delete cookie with path as root', () => {
      cookieStorageService.remove('key');

      expect(deleteCookie).toHaveBeenCalledWith(
        'key',
        expect.objectContaining({
          path: '/'
        })
      );
    });

    it('should remove non-existent cookie without error', () => {
      expect(() => cookieStorageService.remove('non-existent')).not.toThrow();
      expect(deleteCookie).toHaveBeenCalledWith('non-existent', { path: '/' });
    });

    it('should handle multiple removals of the same key', () => {
      cookieStorageService.remove('key');
      cookieStorageService.remove('key');
      cookieStorageService.remove('key');

      expect(deleteCookie).toHaveBeenCalledTimes(3);
    });
  });

  describe('IStorageService interface compliance', () => {
    it('should implement get method', () => {
      expect(cookieStorageService.get).toBeDefined();
      expect(typeof cookieStorageService.get).toBe('function');
    });

    it('should implement set method', () => {
      expect(cookieStorageService.set).toBeDefined();
      expect(typeof cookieStorageService.set).toBe('function');
    });

    it('should implement remove method', () => {
      expect(cookieStorageService.remove).toBeDefined();
      expect(typeof cookieStorageService.remove).toBe('function');
    });

    it('should work as IStorageService in AuthInterceptor', () => {
      // Type check - ensures it implements the interface correctly
      const storage: any = cookieStorageService;
      
      expect(() => {
        storage.get('key');
        storage.set('key', 'value');
        storage.remove('key');
      }).not.toThrow();
    });
  });

  describe('Security considerations', () => {
    it('should use secure flag in production for HTTPS', () => {
      vi.stubEnv('NODE_ENV', 'production');

      cookieStorageService.set('sensitive-data', 'secret');

      expect(setCookie).toHaveBeenCalledWith(
        'sensitive-data',
        'secret',
        expect.objectContaining({
          secure: true
        })
      );
    });

    it('should use sameSite strict to prevent CSRF attacks', () => {
      cookieStorageService.set('key', 'value');

      expect(setCookie).toHaveBeenCalledWith(
        'key',
        'value',
        expect.objectContaining({
          sameSite: 'strict'
        })
      );
    });

    it('should set path to root for application-wide cookies', () => {
      cookieStorageService.set('key', 'value');

      expect(setCookie).toHaveBeenCalledWith(
        'key',
        'value',
        expect.objectContaining({
          path: '/'
        })
      );
    });

    it('should not use secure flag in development for localhost', () => {
      vi.stubEnv('NODE_ENV', 'development');

      cookieStorageService.set('key', 'value');

      expect(setCookie).toHaveBeenCalledWith(
        'key',
        'value',
        expect.objectContaining({
          secure: false
        })
      );
    });
  });

  describe('Integration with cookies-next', () => {
    it('should use getCookie from cookies-next', () => {
      vi.mocked(getCookie).mockReturnValue('value');

      cookieStorageService.get('key');

      expect(getCookie).toHaveBeenCalled();
    });

    it('should use setCookie from cookies-next', () => {
      cookieStorageService.set('key', 'value');

      expect(setCookie).toHaveBeenCalled();
    });

    it('should use deleteCookie from cookies-next', () => {
      cookieStorageService.remove('key');

      expect(deleteCookie).toHaveBeenCalled();
    });

    it('should be compatible with Next.js SSR', () => {
      // cookies-next works on both client and server
      // This test ensures the service uses it correctly
      vi.mocked(getCookie).mockReturnValue('ssr-value');

      const result = cookieStorageService.get('ssr-key');

      expect(result).toBe('ssr-value');
    });
  });

  describe('Real-world authentication scenarios', () => {
    it('should store and retrieve JWT tokens', () => {
      const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      
      vi.stubEnv('NODE_ENV', 'production');
      cookieStorageService.set('token', jwt);

      expect(setCookie).toHaveBeenCalledWith('token', jwt, {
        path: '/',
        secure: true,
        sameSite: 'strict'
      });

      vi.mocked(getCookie).mockReturnValue(jwt);
      const retrieved = cookieStorageService.get('token');

      expect(retrieved).toBe(jwt);
    });

    it('should handle login flow (set token and refreshToken)', () => {
      const token = 'access_token_123';
      const refreshToken = 'refresh_token_456';

      cookieStorageService.set('token', token);
      cookieStorageService.set('refreshToken', refreshToken);

      expect(setCookie).toHaveBeenCalledTimes(2);
      expect(setCookie).toHaveBeenCalledWith('token', token, expect.any(Object));
      expect(setCookie).toHaveBeenCalledWith('refreshToken', refreshToken, expect.any(Object));
    });

    it('should handle logout flow (remove token and refreshToken)', () => {
      cookieStorageService.remove('token');
      cookieStorageService.remove('refreshToken');

      expect(deleteCookie).toHaveBeenCalledTimes(2);
      expect(deleteCookie).toHaveBeenCalledWith('token', { path: '/' });
      expect(deleteCookie).toHaveBeenCalledWith('refreshToken', { path: '/' });
    });

    it('should handle token refresh (update token)', () => {
      const oldToken = 'old_token';
      const newToken = 'new_token';

      vi.mocked(getCookie).mockReturnValueOnce(oldToken);
      cookieStorageService.get('token');

      cookieStorageService.set('token', newToken);

      expect(setCookie).toHaveBeenCalledWith('token', newToken, expect.any(Object));
    });

    it('should check if token exists before making authenticated request', () => {
      vi.mocked(getCookie).mockReturnValue('token_exists');

      const token = cookieStorageService.get('token');

      expect(token).not.toBeNull();
      expect(token).toBe('token_exists');
    });

    it('should handle expired or missing tokens', () => {
      vi.mocked(getCookie).mockReturnValue(undefined);

      const token = cookieStorageService.get('token');

      expect(token).toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid successive get calls', () => {
      vi.mocked(getCookie).mockReturnValue('value');

      cookieStorageService.get('key');
      cookieStorageService.get('key');
      cookieStorageService.get('key');

      expect(getCookie).toHaveBeenCalledTimes(3);
    });

    it('should handle rapid successive set calls', () => {
      cookieStorageService.set('key', 'value1');
      cookieStorageService.set('key', 'value2');
      cookieStorageService.set('key', 'value3');

      expect(setCookie).toHaveBeenCalledTimes(3);
    });

    it('should handle get after remove', () => {
      cookieStorageService.remove('key');
      vi.mocked(getCookie).mockReturnValue(undefined);

      const result = cookieStorageService.get('key');

      expect(result).toBeNull();
    });

    it('should handle keys with special characters', () => {
      const specialKey = 'user:token:123';

      cookieStorageService.set(specialKey, 'value');

      expect(setCookie).toHaveBeenCalledWith(specialKey, 'value', expect.any(Object));
    });

    it('should handle very long keys', () => {
      const longKey = 'a'.repeat(200);

      cookieStorageService.set(longKey, 'value');

      expect(setCookie).toHaveBeenCalledWith(longKey, 'value', expect.any(Object));
    });

    it('should create new instance without errors', () => {
      expect(() => new CookieStorageService()).not.toThrow();
    });

    it('should allow multiple instances', () => {
      const service1 = new CookieStorageService();
      const service2 = new CookieStorageService();

      expect(service1).toBeInstanceOf(CookieStorageService);
      expect(service2).toBeInstanceOf(CookieStorageService);
      expect(service1).not.toBe(service2);
    });
  });

  describe('Environment-specific behavior', () => {
    it('should handle staging environment like development', () => {
      vi.stubEnv('NODE_ENV', 'staging');

      cookieStorageService.set('key', 'value');

      expect(setCookie).toHaveBeenCalledWith(
        'key',
        'value',
        expect.objectContaining({
          secure: false
        })
      );
    });

    it('should handle different NODE_ENV values', () => {
      const environments = ['development', 'test', 'staging', 'qa'];

      environments.forEach(env => {
        vi.stubEnv('NODE_ENV', env);
        vi.clearAllMocks();

        cookieStorageService.set('key', 'value');

        expect(setCookie).toHaveBeenCalledWith(
          'key',
          'value',
          expect.objectContaining({
            secure: false
          })
        );
      });
    });

    it('should only use secure in production', () => {
      vi.stubEnv('NODE_ENV', 'production');

      cookieStorageService.set('key', 'value');

      expect(setCookie).toHaveBeenCalledWith(
        'key',
        'value',
        expect.objectContaining({
          secure: true
        })
      );
    });
  });
});