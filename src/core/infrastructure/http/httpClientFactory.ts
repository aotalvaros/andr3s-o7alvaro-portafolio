import { HttpClient, HttpConfig } from './HttpClient';
import { LoadingInterceptor } from './interceptors/LoadingInterceptor';
import { AuthInterceptor } from './interceptors/AuthInterceptor';
import { ErrorInterceptor } from './interceptors/ErrorInterceptor';
import { LoadingService } from '../services/LoadingService';
import { CookieStorageService } from '../services/CookieStorageService';
import { ToastNotificationService } from '../services/ToastNotificationService';
import { useLoadingStore } from '@/store/loadingStore';
import { useToastMessageStore } from '@/store/ToastMessageStore';

/**
 * Factory para crear instancia configurada de HttpClient
 * 
 * Centraliza la configuración y dependencias
 */
export function createHttpClient(): HttpClient {
  // Services
  const storageService = new CookieStorageService();
  const loadingService = new LoadingService(useLoadingStore.getState().setLoading);
  const notificationService = new ToastNotificationService(useToastMessageStore.getState().setParams);

  // Auth repository (temporal - se debe inyectar correctamente)
  const authRepository = {
    async refreshToken(refreshToken: string): Promise<string> {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      const data = await response.json();
      return data.token;
    }
  };

  // Config
  const config: HttpConfig = {
    baseURL: process.env.NEXT_PUBLIC_BASE_URL!,
    timeout: 60000,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Interceptors (orden importa)
  const interceptors = [
    new LoadingInterceptor(loadingService),
    new AuthInterceptor(storageService, authRepository),
    new ErrorInterceptor(notificationService)
  ];

  return new HttpClient(config, interceptors);
}

// Singleton instance
export const httpClient = createHttpClient();
