import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export interface HttpConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface RequestConfig {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  showLoading?: boolean;
  skipErrorToast?: boolean;
}

export interface Interceptor {
  onRequest?(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig>;
  onResponse?(response: AxiosResponse): Promise<AxiosResponse>;
  onResponseError?(error: unknown): Promise<never>;
}

/**
 * HttpClient - Cliente HTTP basado en axios con soporte para interceptors
 * 
 * Responsabilidades:
 * - Configurar instancia de axios
 * - Registrar interceptors
 * - Proveer métodos HTTP (GET, POST, PUT, DELETE)
 * 
 * Principios SOLID:
 * - Single Responsibility: Solo maneja comunicación HTTP
 * - Open/Closed: Extensible via interceptors sin modificar la clase
 * - Dependency Inversion: Depende de abstracción (Interceptor interface)
 */
export class HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(
    private config: HttpConfig,
    private interceptors: Interceptor[] = []
  ) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout ?? 60000,
      headers: config.headers ?? {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.interceptors.forEach(interceptor => {
      if (interceptor.onRequest) {
        this.axiosInstance.interceptors.request.use(
          interceptor.onRequest.bind(interceptor)
        );
      }

      if (interceptor.onResponse || interceptor.onResponseError) {
        this.axiosInstance.interceptors.response.use(
          interceptor.onResponse?.bind(interceptor),
          interceptor.onResponseError?.bind(interceptor)
        );
      }
    });
  }

  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }
}

/*
  Explicacion del HttpClient:

  El HttpClient es una clase que encapsula la funcionalidad de comunicación HTTP utilizando la biblioteca axios. 
  Su responsabilidad principal es manejar las solicitudes y respuestas HTTP, proporcionando una interfaz sencilla 
  para realizar operaciones comunes como GET, POST, PUT, DELETE y PATCH.

  Tiene un constructor que acepta una configuración básica (baseURL, timeout, headers) y una lista de interceptors. 
  Estos interceptors permiten modificar las solicitudes antes de que se envíen y las respuestas antes de que se procesen, 
  facilitando la implementación.


*/