import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Interceptor } from '../HttpClient';

export interface IStorageService {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

export interface IAuthRepository {
  refreshToken(refreshToken: string): Promise<string>;
}

/**
 * AuthInterceptor - Maneja autenticación y refresh de tokens
 * 
 * Responsabilidades:
 * - Agregar token a requests
 * - Manejar refresh token en 401
 */
export class AuthInterceptor implements Interceptor {
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  constructor(
    private storageService: IStorageService,
    private authRepository: IAuthRepository
  ) {}

  async onRequest(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    const token = this.storageService.get('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  }

  async onResponseError(error: unknown): Promise<never> {
    const axiosError = error as AxiosError;
    const originalRequest = axiosError.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (axiosError.response?.status === 401 && !originalRequest._retry) {
      if (this.isRefreshing) {
        return new Promise((resolve, reject) => {
          this.failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest);
        });
      }

      originalRequest._retry = true;
      this.isRefreshing = true;

      try {
        const refreshToken = this.storageService.get('refreshToken');
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const newToken = await this.authRepository.refreshToken(refreshToken);
        
        this.storageService.set('token', newToken);
        this.processQueue(null, newToken);
        
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        this.processQueue(refreshError, null);
        this.clearAuth();
        throw refreshError;
      } finally {
        this.isRefreshing = false;
      }
    }

    throw error;
  }

  private processQueue(error: unknown, token: string | null = null): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  private clearAuth(): void {
    this.storageService.remove('token');
    this.storageService.remove('refreshToken');
    
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      window.location.replace('/login');
    }
  }
}
