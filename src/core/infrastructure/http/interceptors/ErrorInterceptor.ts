import { AxiosError } from 'axios';
import { Interceptor } from '../HttpClient';

export interface INotificationService {
  error(message: string, description?: string): void;
  warning(message: string, description?: string): void;
  info(message: string, description?: string): void;
  success(message: string, description?: string): void;
}

export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NetworkError extends DomainError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR', 500);
  }
}

export class RateLimitError extends DomainError {
  constructor() {
    super('Límite de solicitudes alcanzado', 'RATE_LIMIT_ERROR', 429);
  }
}

export class NotFoundError extends DomainError {
  constructor(message: string = 'Recurso no encontrado') {
    super(message, 'NOT_FOUND_ERROR', 404);
  }
}

/**
 * ErrorInterceptor - Maneja errores HTTP y muestra notificaciones
 * 
 * Responsabilidad única: Transformar errores HTTP en errores de dominio
 */
export class ErrorInterceptor implements Interceptor {
  constructor(private notificationService: INotificationService) {}

  async onResponseError(error: unknown): Promise<never> {
    const axiosError = error as AxiosError;
    const customError = this.mapError(axiosError);

    if (!(axiosError.config as any)?.skipErrorToast) {
      this.notificationService.error(customError.message);
    }

    throw customError;
  }

  private mapError(error: AxiosError): DomainError {
    // Rate limit
    if (error.response?.status === 429) {
      return new RateLimitError();
    }

    // Network errors
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      return new NetworkError('No se pudo conectar con el servidor');
    }

    if (error.code === 'ENOTFOUND') {
      return new NetworkError('Servidor no encontrado');
    }

    if (error.code === 'ECONNABORTED') {
      return new NetworkError('La solicitud tardó demasiado tiempo');
    }

    // HTTP errors
    if (error.response?.status === 404) {
      return new NotFoundError();
    }

    if (error.response?.status && error.response.status >= 500) {
      return new NetworkError('Error interno del servidor');
    }

    // Default
    const message = (error.response?.data as { error?: string })?.error ?? error.message ?? 'Error desconocido';
    return new NetworkError(message);
  }
}

/*
  Que hace:
  - Intercepta errores HTTP en las respuestas
  - Mapea errores HTTP a errores de dominio específicos
  - Muestra notificaciones de error usando el servicio inyectado

*/
