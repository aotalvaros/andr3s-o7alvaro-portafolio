import { INotificationService } from '../http/interceptors/ErrorInterceptor';

/**
 * ToastNotificationService - Implementación usando el store existente
 */
export class ToastNotificationService implements INotificationService {
  constructor(
    private setToast: (params: {
      show: boolean;
      typeMessage: 'success' | 'error' | 'warning' | 'info';
      message: string;
      description: string;
    }) => void
  ) {}

  error(message: string, description?: string): void {
    this.setToast({
      show: true,
      typeMessage: 'error',
      message,
      description: description ?? ''
    });
  }

  warning(message: string, description?: string): void {
    this.setToast({
      show: true,
      typeMessage: 'warning',
      message,
      description: description ?? ''
    });
  }

  info(message: string, description?: string): void {
    this.setToast({
      show: true,
      typeMessage: 'info',
      message,
      description: description ?? ''
    });
  }

  success(message: string, description?: string): void {
    this.setToast({
      show: true,
      typeMessage: 'success',
      message,
      description: description ?? ''
    });
  }
}

/*
  Que hace:
  - Proporciona métodos para mostrar notificaciones de diferentes tipos (error, advertencia, info, éxito)
  - Utiliza una función inyectada para actualizar el estado del store de notificaciones
*/