import axios from 'axios';

const api = axios.create({
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    console.log('[Request]', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error instanceof Error ? error : new Error(error));
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[Response error]', error);
    return Promise.reject(error instanceof Error ? error : new Error(error));
  }
);

export default api;