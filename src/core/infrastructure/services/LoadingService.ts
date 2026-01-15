import { ILoadingService } from '../http/interceptors/LoadingInterceptor';

/**
 * LoadingService - Implementación del servicio de loading
 * 
 * Usa el store de Zustand existente
 */
export class LoadingService implements ILoadingService {
  private activeRequests = 0;

  constructor(private setLoading: (value: boolean) => void) {}

  start(): void {
    this.activeRequests++;
    if (this.activeRequests === 1) {
      this.setLoading(true);
    }
  }

  stop(): void {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    if (this.activeRequests === 0) {
      this.setLoading(false);
    }
  }
}

/*
  Que hace el LoadingService?
  ---------------------------
  El LoadingService es un servicio que se encarga de manejar el estado de loading en la aplicación. 
  Cuando una solicitud HTTP comienza, el método start() incrementa el contador de solicitudes activas y, si es la primera solicitud, activa el estado de loading en el store. Cuando una solicitud termina, el método stop() decrementa el contador y, 
  si no hay más solicitudes activas, desactiva el estado de loading.

*/