import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Interceptor } from '../HttpClient';

export interface ILoadingService {
  start(): void;
  stop(): void;
}

/**
 * LoadingInterceptor - Maneja el estado de loading global
 * 
 * Responsabilidad única: Controlar loading spinner
 */
export class LoadingInterceptor implements Interceptor {
  constructor(private loadingService: ILoadingService) {}

  async onRequest(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    if (config.showLoading !== false) {
      this.loadingService.start();
    }
    return config;
  }

  async onResponse(response: AxiosResponse): Promise<AxiosResponse> {
    this.loadingService.stop();
    return response;
  }

  async onResponseError(error: unknown): Promise<never> {
    this.loadingService.stop();
    throw error;
  }
}

/*
  Que hace el interceptor?
  - Muestra el spinner cuando se hace una solicitud
  - Oculta el spinner cuando se recibe una respuesta o se produce un error

*/