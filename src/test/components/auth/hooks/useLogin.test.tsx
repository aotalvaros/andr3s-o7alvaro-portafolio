/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import { setCookie } from 'cookies-next';
import React from 'react';
import { useLogin } from '@/components/auth/hook/useLogin';
import { useLoadingStore } from '../../../../store/loadingStore';
import { httpClient } from '@/core/infrastructure/http/httpClientFactory'

vi.mock('@/core/infrastructure/http/httpClientFactory', () => ({
  httpClient: {
    post: vi.fn(),
  },
}))

vi.mock('../../../../store/loadingStore');

vi.mock('sonner');
vi.mock('cookies-next');

describe('useLogin', () => {
  let queryClient: QueryClient;
  const mockSetLoading = vi.fn();
  
  // Mock de localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value?.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  const mockLoginResponse = {
      token: 'mock-access-token-123',
      refreshToken: 'mock-refresh-token-456',
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      },
    };


  beforeEach(() => {

    vi.mocked(httpClient.post).mockResolvedValue(mockLoginResponse);

    // Reset de queryClient para cada test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Mock de localStorage
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    vi.mocked(useLoadingStore).mockImplementation((selector: any) => {
      const state = {
        setLoading: mockSetLoading,
        isLoading: false,
      };
      // Si hay selector, ejecutarlo; si no, devolver todo el estado
      return selector ? selector(state) : state;
    });

    // Limpiar mocks
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    queryClient.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  describe('Initialization', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useLogin(), { wrapper });

      expect(result.current.auth).toBeDefined();
      expect(result.current.isLoading).toBe(false);
    });

    it('should call setLoading with false on mount', () => {
      renderHook(() => useLogin(), { wrapper });

      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });

  describe('Successful Login', () => {

    const loginPayload = {
      email: 'test@example.com',
      password: 'password123',
    };


    it('should call login service with correct payload', async () => {
      const { result } = renderHook(() => useLogin(), { wrapper });

      await result.current.auth(loginPayload);

      expect(httpClient.post).toHaveBeenCalledWith('/auth/login', loginPayload);
      expect(httpClient.post).toHaveBeenCalledTimes(1);
    });

    it('should set cookies with correct values and configuration', async () => {
      const { result } = renderHook(() => useLogin(), { wrapper });

      await result.current.auth(loginPayload);

      await waitFor(() => {
        expect(setCookie).toHaveBeenCalledWith('token', mockLoginResponse.token, {
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7, // 7 días
        });

        expect(setCookie).toHaveBeenCalledWith('refreshToken', mockLoginResponse.refreshToken, {
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 30, // 30 días
        });
      });
    });

    it('should store token in localStorage', async () => {
      const { result } = renderHook(() => useLogin(), { wrapper });

      await result.current.auth(loginPayload);

      await waitFor(() => {
        expect(localStorage.getItem('token')).toBe(mockLoginResponse.token);
      });
    });

    it('should show success toast message', async () => {
      const { result } = renderHook(() => useLogin(), { wrapper });

      await result.current.auth(loginPayload);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Inicio de sesión exitoso');
      });
    });

    it('should return login response data', async () => {
      const { result } = renderHook(() => useLogin(), { wrapper });

      const response = await result.current.auth(loginPayload);

      expect(response).toEqual(mockLoginResponse);
    });
  });

  describe('Failed Login', () => {
    const loginPayload = {
      email: 'test@example.com',
      password: 'wrongpassword',
    };

    it('should not set cookies on error', async () => {
      vi.mocked(httpClient.post).mockRejectedValue(new Error('Error'));

      const { result } = renderHook(() => useLogin(), { wrapper });

      try {
        await result.current.auth(loginPayload);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }

      await waitFor(() => {
        expect(setCookie).not.toHaveBeenCalled();
      });
    });

    it('should not store token in localStorage on error', async () => {
      vi.mocked(httpClient.post).mockRejectedValue(new Error('Error'));

      const { result } = renderHook(() => useLogin(), { wrapper });

      try {
        await result.current.auth(loginPayload);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }

      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('Loading State', () => {
    it('should set loading to true when mutation starts', async () => {
      vi.mocked(httpClient.post).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const { result } = renderHook(() => useLogin(), { wrapper });

      result.current.auth({ email: 'test@example.com', password: 'password' });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });
    });

    it('should call setLoading with true during mutation', async () => {
      vi.mocked(httpClient.post).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const { result } = renderHook(() => useLogin(), { wrapper });

      result.current.auth({ email: 'test@example.com', password: 'password' });

      await waitFor(() => {
        expect(mockSetLoading).toHaveBeenCalledWith(true);
      });
    });

    it('should set loading to false after successful mutation', async () => {
      vi.mocked(httpClient.post).mockResolvedValue({
        token: 'token',
        refreshToken: 'refreshToken',
      });

      const { result } = renderHook(() => useLogin(), { wrapper });

      await result.current.auth({ email: 'test@example.com', password: 'password' });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(mockSetLoading).toHaveBeenCalledWith(false);
      });
    });

    it('should set loading to false after failed mutation', async () => {
      vi.mocked(httpClient.post).mockRejectedValue(new Error('Error'));

      const { result } = renderHook(() => useLogin(), { wrapper });

      try {
        await result.current.auth({ email: 'test@example.com', password: 'password' });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(mockSetLoading).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('Cookie Security Configuration', () => {
    it('should set correct maxAge for token cookie (7 days)', async () => {
      vi.mocked(httpClient.post).mockResolvedValue({
        token: 'token',
        refreshToken: 'refreshToken',
      });

      const { result } = renderHook(() => useLogin(), { wrapper });

      await result.current.auth({ email: 'test@example.com', password: 'password' });

      await waitFor(() => {
        expect(setCookie).toHaveBeenCalledWith(
          'token',
          'token',
          expect.objectContaining({ maxAge: 60 * 60 * 24 * 7 })
        );
      });
    });

    it('should set correct maxAge for refreshToken cookie (30 days)', async () => {
      vi.mocked(httpClient.post).mockResolvedValue({
        token: 'token',
        refreshToken: 'refreshToken',
      });

      const { result } = renderHook(() => useLogin(), { wrapper });

      await result.current.auth({ email: 'test@example.com', password: 'password' });

      await waitFor(() => {
        expect(setCookie).toHaveBeenCalledWith(
          'refreshToken',
          'refreshToken',
          expect.objectContaining({ maxAge: 60 * 60 * 24 * 30 })
        );
      });
    });
  });

  describe('Multiple Login Attempts', () => {
    it('should handle multiple sequential login attempts', async () => {
      const mockResponse = { token: 'token', refreshToken: 'refreshToken' };
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useLogin(), { wrapper });

      await result.current.auth({ email: 'user1@example.com', password: 'pass1' });
      await result.current.auth({ email: 'user2@example.com', password: 'pass2' });

      expect(httpClient.post).toHaveBeenCalledTimes(2);
      expect(toast.success).toHaveBeenCalledTimes(2);
    });
  });
});