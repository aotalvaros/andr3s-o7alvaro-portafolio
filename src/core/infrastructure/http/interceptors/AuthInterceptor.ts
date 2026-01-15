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

  // onRequest agrega el token a cada solicitud
  async onRequest(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    const token = this.storageService.get('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  }

  // onResponseError maneja errores 401 y refresca el token si es necesario
  async onResponseError(error: unknown): Promise<never> {
    const axiosError = error as AxiosError; // Aseguramos que es un AxiosError
    const originalRequest = axiosError.config as InternalAxiosRequestConfig & { _retry?: boolean }; // Tipo extendido para manejar reintentos

    if (!originalRequest) {  // Validar que existe configuración original
      throw error;
    }

    const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || 
                          originalRequest.url?.includes('/auth/refresh-token'); // Evitar bucles infinitos
    
    if (axiosError.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) { // Evitar bucles infinitos
      const refreshToken = this.storageService.get('refreshToken'); // Obtener refresh token
      
      if (!refreshToken) { // Si no hay refresh token, limpiar auth y redirigir
        throw error;
      }

      if (this.isRefreshing) { // Si ya se está refrescando, encolar la solicitud
        return new Promise((resolve, reject) => {
          this.failedQueue.push({ resolve, reject }); // Encolar la solicitud fallida
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`; // Actualizar el header con el nuevo token
          return axios(originalRequest); // Reintentar la solicitud original
        });
      }

      originalRequest._retry = true;
      this.isRefreshing = true;

      try {
        const newToken = await this.authRepository.refreshToken(refreshToken);
        
        this.storageService.set('token', newToken); // Actualiza el token almacenado
        this.processQueue(null, newToken); // Procesa la cola de solicitudes fallidas
        
        originalRequest.headers.Authorization = `Bearer ${newToken}`; // Actualiza el header con el nuevo token

        return axios(originalRequest); // Reintenta la solicitud original

      } catch (refreshError) {

        this.processQueue(refreshError, null); // Rechaza todas las solicitudes en la cola
        this.clearAuth(); // Limpia tokens y redirige al login
        throw refreshError; // Propaga el error de refresh

      } finally {
        this.isRefreshing = false;
      }
    }

    throw error;
  }

  //processQueue maneja las solicitudes fallidas encoladas
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

  //clearAuth limpia los tokens almacenados y redirige al login
  private clearAuth(): void {
    this.storageService.remove('token');
    this.storageService.remove('refreshToken');
    
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      window.location.replace('/login');
    }
  }
}

/*
  Explicación:
  - onRequest: Agrega el token de autorización a cada request si está disponible.
  - onResponseError: Maneja errores 401. Si ocurre un 401, intenta refrescar el token usando el refresh token almacenado.
  - Si ya hay un refresh en proceso, encola la solicitud fallida para que se reintente una vez que el refresh se complete.
  - Si el refresh es exitoso, actualiza el token y reintenta la solicitud original.
  - Si el refresh falla, limpia los tokens almacenados y redirige al usuario a la página de login.
*/