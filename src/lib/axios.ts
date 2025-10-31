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
  // ✅ Configuración adicional para mejor performance
  validateStatus: (status) => status < 500,
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

// Interceptor para manejar el refresh token
api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        getCookie('refreshToken')) {
      
      if (isRefreshing) {
        // ✅ Queue requests mientras se refresca el token
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`,
          { refreshToken: getCookie('refreshToken') }
        );

        setCookie('token', data.token, { 
          path: '/', 
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        
        processQueue(null, data.token);
        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        // ✅ Limpiar cookies de forma segura
        setCookie('token', '', { path: '/', expires: new Date(0) });
        setCookie('refreshToken', '', { path: '/', expires: new Date(0) });
        
        // ✅ Mejor manejo de redirección
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const shouldShowLoading = config.showLoading !== false;
  
  if (shouldShowLoading) {
    loadingController.start();
  }

  // ✅ Authorization header mejorado
  const token = getCookie('token') as string | undefined;
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  config.metadata = {
    ...config.metadata,
    requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };

  // ✅ Implementar abort controller si se requiere
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

function clearTimers(cfg?: AxiosRequestConfig) {
  if (!cfg?.metadata) return;
  
  if (cfg.metadata.slowTimer) {
    clearTimeout(cfg.metadata.slowTimer);
  }
  if (cfg.metadata.abortTimer) {
    clearTimeout(cfg.metadata.abortTimer);
  }
}

api.interceptors.response.use(
  (response) => {
    
    loadingController.stop();
    clearTimers(response?.config);
    return response;
  },

  // ──────────── error ────────────
  (error) => {
      // 🚀 Solo ocultar loading si se mostró inicialmente
    loadingController.stop();
    clearTimers(error.config);

   // ✅ Skip toast si se especifica
    if (!error.config?.skipErrorToast) {
      const toastState = useToastMessageStore.getState();
      
      // ✅ Evitar toast duplicados de forma más elegante
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

    // ✅ Error customizado mejorado
    const customError = createCustomError(error);
    return Promise.reject(customError);
  }
);

function getErrorMessage(error: unknown): string {
  if (error.code === 'ECONNABORTED') {
    return 'La solicitud tardó demasiado tiempo';
  }
  if (error.response?.status >= 500) {
    return 'Error interno del servidor';
  }
  if (error.response?.status === 429) {
    return 'Demasiadas solicitudes. Intenta más tarde';
  }
  return error.response?.data?.error ?? error.message ?? 'Error desconocido';
}

function createCustomError(error: unknown): CustomAxiosError {
  const friendly = getErrorMessage(error);
  const customError = new Error(friendly) as CustomAxiosError;
  
  customError.originalError = error;
  customError.status = error.response?.status ?? (error.code === 'ECONNABORTED' ? 408 : 500);
  customError.data = error.response?.data ?? null;
  
  return customError;
}

export default api;