/* eslint-disable @typescript-eslint/no-explicit-any */
import { useToastMessageStore } from '@/store/ToastMessageStore';
import { loadingController } from '@/utils/setLoading';
import axios, {
  AxiosRequestConfig,
  InternalAxiosRequestConfig
} from 'axios';
import { getCookie, setCookie } from 'cookies-next';

interface CustomAxiosError extends Error {
  status?: number;
  data?: unknown;
  originalError?: unknown;
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    showLoading?: boolean;
    skipErrorToast?: boolean; // ✅ Opción para omitir toast de error
    retryConfig?: {
      retries: number;
      retryDelay: number;
    };
    metadata?: {
      slowTimer?: ReturnType<typeof setTimeout>;
      abortTimer?: ReturnType<typeof setTimeout>;
      requestId?: string; // ✅ Para tracking
    };
  }

  export interface InternalAxiosRequestConfig {
    showLoading?: boolean;
    skipErrorToast?: boolean;
    retryConfig?: {
      retries: number;
      retryDelay: number;
    };
    metadata?: {
      slowTimer?: ReturnType<typeof setTimeout>;
      abortTimer?: ReturnType<typeof setTimeout>;
      requestId?: string;
    };
  }
}


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
  // ✅ Configuración adicional para mejor performance, solo considerar errores 5xx como fallas
  validateStatus: (status) => status >= 200 && status < 300,
});

// ✅ Queue para manejar múltiples refresh token requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// ──────────── Interceptors ────────────

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const shouldShowLoading = config.showLoading !== false;
  
  if (shouldShowLoading) {
    loadingController.start();
  }

  // Authorization header
  const token = getCookie('token') as string | undefined;
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  // Request ID para tracking
  config.metadata = {
    ...config.metadata,
    requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };

  // Abort controller para timeouts largos
  if (config.timeout && config.timeout > 30000) {
    const controller = new AbortController();
    config.signal = controller.signal;
    
    const abortTimer = setTimeout(() => {
      controller.abort();
    }, config.timeout);
    
    config.metadata.abortTimer = abortTimer;
  }

  return config;
});

// ✅ HELPER: Limpiar timers
function clearTimers(cfg?: AxiosRequestConfig) {
  if (!cfg?.metadata) return;
  
  if (cfg.metadata.slowTimer) {
    clearTimeout(cfg.metadata.slowTimer);
  }
  if (cfg.metadata.abortTimer) {
    clearTimeout(cfg.metadata.abortTimer);
  }
}

// ✅ ÚNICO RESPONSE INTERCEPTOR CONSOLIDADO
api.interceptors.response.use(
  // Success handler
  (response) => {
    loadingController.stop();
    clearTimers(response.config);
    return response;
  },
  
  // Error handler
  async (error) => {
    const originalRequest = error.config;
    
    // Siempre limpiar loading y timers
    loadingController.stop();
    clearTimers(originalRequest);

    // ✅ MANEJO DE 401 - REFRESH TOKEN
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      // Si ya hay un refresh en progreso, agregar a la cola
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = getCookie('refreshToken');
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`,
          { refreshToken }
        );

        // Actualizar cookies y localStorage
        setCookie('token', data.token, { 
          path: '/', 
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.token);
        }
        
        processQueue(null, data.token);
        
        // Reintentar petición original
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Limpiar autenticación
        setCookie('token', '', { path: '/', expires: new Date(0) });
        setCookie('refreshToken', '', { path: '/', expires: new Date(0) });
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          
          if (!window.location.pathname.includes('/login')) {
            window.location.replace('/login');
          }
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ✅ MANEJO DE ERRORES DE RED (ECONNREFUSED, ENOTFOUND, etc.)
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      if (!originalRequest?.skipErrorToast) {
        const toastState = useToastMessageStore.getState();
        if (!toastState.show) {
          toastState.setParams({
            show: true,
            typeMessage: 'error',
            message: 'Error de conexión',
            description: 'No se pudo conectar con el servidor. Verifica tu conexión.',
          });
        }
      }
      
      // ✅ IMPORTANTE: Rechazar inmediatamente para que React Query maneje el retry
      return Promise.reject(createCustomError(error));
    }

    // ✅ TOAST DE ERROR (si no se debe omitir)
    if (!originalRequest?.skipErrorToast) {
      const toastState = useToastMessageStore.getState();
      
      if (!toastState.show) {
        const errorMessage = getErrorMessage(error);
        toastState.setParams({
          show: true,
          typeMessage: 'error',
          message: 'Error en la solicitud',
          description: errorMessage,
        });
      }
    }

    // ✅ Error customizado
    return Promise.reject(createCustomError(error));
  }
);

// ✅ HELPER: Obtener mensaje de error
function getErrorMessage(error: any): string {
  // Errores de red
  if (error.code === 'ERR_NETWORK') {
    return 'No se pudo conectar con el servidor';
  }
  if (error.code === 'ECONNREFUSED') {
    return 'Conexión rechazada por el servidor';
  }
  if (error.code === 'ENOTFOUND') {
    return 'Servidor no encontrado';
  }
  if (error.code === 'ECONNABORTED') {
    return 'La solicitud tardó demasiado tiempo';
  }
  
  // Errores HTTP
  if (error.response?.status >= 500) {
    return 'Error interno del servidor';
  }
  if (error.response?.status === 429) {
    return 'Demasiadas solicitudes. Intenta más tarde';
  }
  if (error.response?.status === 404) {
    return 'Recurso no encontrado';
  }
  
  return error.response?.data?.error ?? error.message ?? 'Error desconocido';
}

// ✅ HELPER: Crear error customizado
function createCustomError(error: any): CustomAxiosError {
  const friendly = getErrorMessage(error);
  const customError = new Error(friendly) as CustomAxiosError;
  
  customError.originalError = error;
  customError.status = error.response?.status ?? (error.code === 'ECONNABORTED' ? 408 : 500);
  customError.data = error.response?.data ?? null;
  
  return customError;
}

export default api;