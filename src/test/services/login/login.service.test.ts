import { login, type LoginPayload } from "@/services/login/login.service";
import { describe, it, expect, vi } from "vitest";

import { httpClient } from '@/core/infrastructure/http/httpClientFactory';
import { LoginResponse } from '../../../services/login/models/loginResponse.interface';

// Mock del httpClient factory
vi.mock('@/core/infrastructure/http/httpClientFactory', () => ({
  httpClient: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}));

describe('Login Service', () => {
  const mockHttpClient = vi.mocked(httpClient);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  //Cambiar los test en ingles

  describe('login', () => {
    it('should successfully login and return tokens', async () => {
      const mockLoginResponse: LoginResponse = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'refresh_token_abc123'
      };

      mockHttpClient.post.mockResolvedValue(mockLoginResponse);

      const payload: LoginPayload = {
        email: 'user@example.com',
        password: 'SecurePass123!'
      };

      const response = await login(payload);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/auth/login', payload);
      expect(mockHttpClient.post).toHaveBeenCalledTimes(1);
      expect(response).toEqual(mockLoginResponse);
      expect(response.token).toBeDefined();
      expect(response.refreshToken).toBeDefined();
    });

    it('should call the /auth/login endpoint with the POST method', async () => {
      const mockResponse: LoginResponse = {
        token: 'token123',
        refreshToken: 'refresh123',
      } as LoginResponse;

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await login({
        email: 'test@test.com',
        password: 'password'
      });

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/auth/login',
        expect.any(Object)
      );
    });

    it('should send the exact credentials without modifications', async () => {
      const mockResponse: LoginResponse = {
        token: 'token',
        refreshToken: 'refresh',
      } as LoginResponse;

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const credentials: LoginPayload = {
        email: 'User@Example.COM',
        password: 'P@ssw0rd!#$%'
      };

      await login(credentials);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'User@Example.COM',
        password: 'P@ssw0rd!#$%'
      });
    });

    it('should return the complete response typed as LoginResponse', async () => {
      const expectedResponse: LoginResponse = {
        token: 'access_token_xyz',
        refreshToken: 'refresh_token_xyz'
      };

      mockHttpClient.post.mockResolvedValue(expectedResponse);

      const result = await login({
        email: 'admin@test.com',
        password: 'adminpass'
      });

      expect(result).toEqual(expectedResponse);
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('Error Handling', () => {
    it('should propagate 401 error for invalid credentials', async () => {
      const authError = new Error('Invalid credentials');
      mockHttpClient.post.mockRejectedValue(authError);

      const payload: LoginPayload = {
        email: 'wrong@example.com',
        password: 'wrongpassword'
      };

      await expect(login(payload)).rejects.toThrow('Invalid credentials');
      expect(mockHttpClient.post).toHaveBeenCalledWith('/auth/login', payload);
    });

    it('should propagate 400 validation error', async () => {
      const validationError = new Error('Email is required');
      mockHttpClient.post.mockRejectedValue(validationError);

      const payload: LoginPayload = {
        email: '',
        password: 'password123'
      };

      await expect(login(payload)).rejects.toThrow('Email is required');
    });

    it('should propagate 429 rate limiting error', async () => {
      const rateLimitError = new Error('Too many login attempts');
      mockHttpClient.post.mockRejectedValue(rateLimitError);

      const payload: LoginPayload = {
        email: 'user@test.com',
        password: 'pass123'
      };

      await expect(login(payload)).rejects.toThrow('Too many login attempts');
    });

    it('should propagate 500 server error', async () => {
      const serverError = new Error('Internal server error');
      mockHttpClient.post.mockRejectedValue(serverError);

      const payload: LoginPayload = {
        email: 'user@example.com',
        password: 'password'
      };

      await expect(login(payload)).rejects.toThrow('Internal server error');
    });

    it('should propagate network/timeout errors', async () => {
      const networkError = new Error('Network timeout');
      mockHttpClient.post.mockRejectedValue(networkError);

      const payload: LoginPayload = {
        email: 'test@test.com',
        password: 'test123'
      };

      await expect(login(payload)).rejects.toThrow('Network timeout');
    });

    it('should propagate account locked error', async () => {
      const blockedError = new Error('Account locked due to multiple failed attempts');
      mockHttpClient.post.mockRejectedValue(blockedError);

      const payload: LoginPayload = {
        email: 'locked@example.com',
        password: 'password'
      };

      await expect(login(payload)).rejects.toThrow('Account locked');
    });
  });

  describe('Credential Format Validation', () => {
    it('should accept valid emails in different formats', async () => {
      const mockResponse: LoginResponse = {
        token: 'token',
        refreshToken: 'refresh',
      } as LoginResponse;

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const emails = [
        'simple@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user_123@sub.domain.com',
        'UPPERCASE@EXAMPLE.COM'
      ];

      for (const email of emails) {
        await login({ email, password: 'pass123' });
        expect(mockHttpClient.post).toHaveBeenCalledWith(
          '/auth/login',
          expect.objectContaining({ email })
        );
      }
    });

    it('should accept passwords with special characters', async () => {
      const mockResponse: LoginResponse = {
        token: 'token',
        refreshToken: 'refresh',
      } as LoginResponse;

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const passwords = [
        'P@ssw0rd!',
        'MyP@ss#2024',
        'C0mpl3x$P@ss',
        '!@#$%^&*()',
        'Contraseña123!' // Con ñ
      ];

      for (const password of passwords) {
        await login({ 
          email: 'test@test.com', 
          password 
        });
        
        expect(mockHttpClient.post).toHaveBeenCalledWith(
          '/auth/login',
          expect.objectContaining({ password })
        );
      }
    });

    it('should preserve spaces in the password if they exist', async () => {
      const mockResponse: LoginResponse = {
        token: 'token',
        refreshToken: 'refresh',
      } as LoginResponse;

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await login({
        email: 'test@test.com',
        password: 'Pass Word 123' // Con espacios
      });

      expect(mockHttpClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@test.com',
        password: 'Pass Word 123'
      });
    });
  });

  describe('Integration with httpClient', () => {
    it('should use only the POST method, not other methods', async () => {
      const mockResponse: LoginResponse = {
        token: 'token',
        refreshToken: 'refresh',
      } as LoginResponse;

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await login({
        email: 'user@test.com',
        password: 'password'
      });

      expect(mockHttpClient.post).toHaveBeenCalled();
      expect(mockHttpClient.get).not.toHaveBeenCalled();
      expect(mockHttpClient.put).not.toHaveBeenCalled();
      expect(mockHttpClient.delete).not.toHaveBeenCalled();
      expect(mockHttpClient.patch).not.toHaveBeenCalled();
    });

    it('should use generic typing LoginResponse', async () => {
      const mockResponse: LoginResponse = {
        token: 'typed_token',
        refreshToken: 'typed_refresh',
        user: { id: '1', email: 'test@test.com' }
      } as LoginResponse;

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await login({
        email: 'test@test.com',
        password: 'pass'
      });

      // TypeScript debería inferir el tipo correctamente
      expect(result.token).toBe('typed_token');
      expect(result.refreshToken).toBe('typed_refresh');
    });

    it('should call post with the correct generic type', async () => {
      const mockResponse: LoginResponse = {
        token: 'token',
        refreshToken: 'refresh',
      } as LoginResponse;

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await login({
        email: 'test@test.com',
        password: 'password'
      });

      // Verifica que post fue llamado (el tipo genérico es inferido)
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/auth/login',
        expect.objectContaining({
          email: expect.any(String),
          password: expect.any(String)
        })
      );
    });
  });

  describe('Edge cases and security', () => {
    it('should not log or console the password', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const mockResponse: LoginResponse = {
        token: 'token',
        refreshToken: 'refresh',
      } as LoginResponse;

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await login({
        email: 'test@test.com',
        password: 'SuperSecretPassword123!'
      });

      // El password NO debería aparecer en ningún log
      expect(consoleSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('SuperSecretPassword123!')
      );

      consoleSpy.mockRestore();
    });

    it('should handle responses with additional fields', async () => {
      const mockResponse: LoginResponse = {
        token: 'token',
        refreshToken: 'refresh',
        user: { id: '1', email: 'test@test.com' },
        // Campos adicionales que el backend podría enviar
        sessionId: 'session123',
        lastLogin: '2024-12-22T10:00:00Z',
        permissions: ['read', 'write']
      } as any;

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await login({
        email: 'test@test.com',
        password: 'password'
      });

      expect(result).toEqual(mockResponse);
      expect((result as any).sessionId).toBe('session123');
    });

    it('should handle payloads with properties in different order', async () => {
      const mockResponse: LoginResponse = {
        token: 'token',
        refreshToken: 'refresh',
      } as LoginResponse;

      mockHttpClient.post.mockResolvedValue(mockResponse);

      // Orden diferente de propiedades
      const payload = {
        password: 'pass123',
        email: 'test@test.com'
      } as LoginPayload;

      await login(payload);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/auth/login',
        expect.objectContaining({
          email: 'test@test.com',
          password: 'pass123'
        })
      );
    });
  });
});