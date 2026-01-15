import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { IStorageService } from '../http/interceptors/AuthInterceptor';

/**
 * CookieStorageService - Implementación de storage usando cookies
 */
export class CookieStorageService implements IStorageService {
  get(key: string): string | null {
    const value = getCookie(key);
    return value ? String(value) : null;
  }

  set(key: string, value: string): void {
    setCookie(key, value, {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  }

  remove(key: string): void {
    deleteCookie(key, { path: '/' });
  }
}

/*
  Que hace este servicio:
  - Proporciona métodos para obtener, establecer y eliminar cookies en el navegador.
  - Implementa la interfaz IStorageService para ser utilizado en el interceptor de autenticación.
  - Utiliza la librería 'cookies-next' para manejar las cookies de manera sencilla y compatible con Next.js.
*/