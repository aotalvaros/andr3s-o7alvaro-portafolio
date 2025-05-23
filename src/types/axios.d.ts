import 'axios';

declare module 'axios' {
  // Para las requests “externas”
  export interface AxiosRequestConfig {
    metadata?: {
      slowTimer?: ReturnType<typeof setTimeout>;
      abortTimer?: ReturnType<typeof setTimeout>;
    };
  }

  // Para las requests internas que usan los interceptores (Axios >= 1.x)
  export interface InternalAxiosRequestConfig {
    metadata?: {
      slowTimer?: ReturnType<typeof setTimeout>;
      abortTimer?: ReturnType<typeof setTimeout>;
    };
  }
}
