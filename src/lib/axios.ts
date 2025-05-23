import { useToastMessageStore } from '@/store/ToastMessageStore';
import { loadingController } from '@/utils/setLoading';
import axios, {
  AxiosRequestConfig,
} from 'axios';


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  loadingController.start();

  const controller = new AbortController();
  config.signal = controller.signal;

  const slowThreshold = (config.timeout ?? 20_000) / 3; 
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
  }, config.timeout); // mismo valor que Axios

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
    clearTimers(response.config);
    return response;
  },

  // ──────────── error ────────────
  (error) => {
    loadingController.stop();
    clearTimers(error.config);
    useToastMessageStore.getState().setParams({
      show: true,
      typeMessage: 'error',
      message: '¡Ups! Algo no está bien.',
      description:  error.response?.data?.error ?? 'La operación no se pudo completar.',
    });

    const friendly = error.response?.data?.error ?? 'La operación no se pudo completar.';

    return Promise.reject({
      ...error,
      message: friendly,
      status: error.response?.status ?? 500,
      data: error.response?.data ?? null,
    });
  }
);

export default api;