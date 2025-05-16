import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  async(error) => {
    return Promise.reject({
      ...error,
      message: error.response?.data?.error ?? 'An error occurred',
      status: error.response?.status ?? 500,
      data: error.response?.data ?? null,
    });
  }
);

export default api;