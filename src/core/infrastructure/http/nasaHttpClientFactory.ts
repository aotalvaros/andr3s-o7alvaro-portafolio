import { HttpClient, HttpConfig } from './HttpClient';
import { LoadingInterceptor } from './interceptors/LoadingInterceptor';
import { ErrorInterceptor } from './interceptors/ErrorInterceptor';
import { LoadingService } from '../services/LoadingService';
import { ToastNotificationService } from '../services/ToastNotificationService';
import { useLoadingStore } from '@/store/loadingStore';
import { useToastMessageStore } from '@/store/ToastMessageStore';

/**
 * Factory para crear cliente HTTP específico para NASA API
 */
export function createNasaHttpClient(): HttpClient {
  const loadingService = new LoadingService(useLoadingStore.getState()?.setLoading);
  const notificationService = new ToastNotificationService(useToastMessageStore.getState()?.setParams);

  const config: HttpConfig = {
    baseURL: 'https://api.nasa.gov',
    timeout: 60000
  };

  const interceptors = [
    new LoadingInterceptor(loadingService),
    new ErrorInterceptor(notificationService)
  ];

  return new HttpClient(config, interceptors);
}

export const nasaHttpClient = createNasaHttpClient();
