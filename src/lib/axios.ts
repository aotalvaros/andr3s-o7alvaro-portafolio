import { useToastMessageStore } from '@/store/ToastMessageStore';
import { loadingController } from '@/utils/setLoading';
import axios, {
  AxiosRequestConfig,
} from 'axios';
import { getCookie, setCookie } from 'cookies-next';

interface CustomAxiosError extends Error {
  status?: number;
  data?: unknown;
  originalError?: unknown;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// ──────────── Interceptors ────────────

// Interceptor para manejar el refresh token
api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
  
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getCookie('refreshToken') // Verifica si existe un refresh token
    ){
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`, {
            refreshToken: getCookie('refreshToken'),
        });

        setCookie('token', data.token, { path: '/' });
        return  api(originalRequest);

      } catch (refreshError) {
        setCookie('token', '', { path: '/' });
        setCookie('refreshToken', '', { path: '/' });
        window.location.href = '/login';
        return Promise.reject(refreshError); 
      }
    }
  }
);

api.interceptors.request.use((config) => {
  loadingController.start();

  // ──────────── Authorization ────────────
  const token = getCookie('token') as string | undefined;
  if (token) {
     config.headers["Authorization"] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  config.signal = controller.signal;

  const slowThreshold = (58000) / 3;
  const slowTimer = setTimeout(() => {
    useToastMessageStore.getState().setParams({
      show: true,
      typeMessage: 'warning',
      message: '¡Ups! Algo no está bien.',
      description: 'La operación está tardando más de lo habitual.',
    });
  }, slowThreshold);

  const abortTimer = setTimeout(() => {
    controller.abort(); // cancela la request real
    useToastMessageStore.getState().setParams({
      show: true,
      typeMessage: 'error',
      message: '¡Ups! Algo no está bien.',
      description: 'La operación fue cancelada por tiempo de espera.',
    });
  }, 58000); 

  config.metadata = { slowTimer, abortTimer };
  return config;
});

function clearTimers(cfg?: AxiosRequestConfig) {
  if (!cfg?.metadata) return;
  clearTimeout(cfg.metadata.slowTimer);
  clearTimeout(cfg.metadata.abortTimer);
  useToastMessageStore.getState().setParams({
    message: '',
    description: '',
    typeMessage: 'success',
    show: false,
  })
}

api.interceptors.response.use(
  (response) => {
    
    loadingController.stop();
    clearTimers(response?.config);
    return response;
  },

  // ──────────── error ────────────
  (error) => {
    loadingController.stop();
    clearTimers(error.config);
    const toastState = useToastMessageStore.getState();
    console.log("🚀 ~ toastState:", toastState)
    if (!toastState.show || toastState.typeMessage !== 'error') {
      toastState.setParams({
        show: true,
        typeMessage: 'error',
        message: '¡Ups! Algo no está bien.',
        description: error.response?.data?.error ?? 'La operación no se pudo completar.',
      });
    }

    const friendly = error.response?.data?.error ?? 'La operación no se pudo completar.';

    const customError = new Error(friendly) as CustomAxiosError;
    customError.originalError = error;
    customError.status = error.response?.status ?? 500;
    customError.data = error.response?.data ?? null;
    return Promise.reject(customError);
  }
);

export default api;