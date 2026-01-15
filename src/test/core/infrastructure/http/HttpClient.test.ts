/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { HttpConfig, HttpClient, Interceptor, RequestConfig } from '../../../../core/infrastructure/http/HttpClient';


// Mock axios
vi.mock('axios');

describe('HttpClient', () => {
  let mockAxiosInstance: {
    get: Mock;
    post: Mock;
    put: Mock;
    delete: Mock;
    patch: Mock;
    interceptors: {
      request: { use: Mock };
      response: { use: Mock };
    };
  };

  beforeEach(() => {
    mockAxiosInstance = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      patch: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      }
    };

    vi.mocked(axios.create).mockReturnValue(mockAxiosInstance as any);
  });

  describe('Constructor and Configuration', () => {
    it('should create axios instance with provided config', () => {
      const config: HttpConfig = {
        baseURL: 'https://api.example.com',
        timeout: 30000,
        headers: { 'X-Custom-Header': 'value' }
      };

      new HttpClient(config);

      expect(axios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.example.com',
        timeout: 30000,
        headers: { 'X-Custom-Header': 'value' }
      });
    });

    it('should use default timeout of 60000ms when not provided', () => {
      const config: HttpConfig = {
        baseURL: 'https://api.example.com'
      };

      new HttpClient(config);

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          timeout: 60000
        })
      );
    });

    it('should use default Content-Type header when headers not provided', () => {
      const config: HttpConfig = {
        baseURL: 'https://api.example.com'
      };

      new HttpClient(config);

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );
    });

    it('should allow custom timeout to override default', () => {
      const config: HttpConfig = {
        baseURL: 'https://api.example.com',
        timeout: 5000
      };

      new HttpClient(config);

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          timeout: 5000
        })
      );
    });

    it('should allow custom headers to override default', () => {
      const config: HttpConfig = {
        baseURL: 'https://api.example.com',
        headers: {
          'Content-Type': 'application/xml',
          'Authorization': 'Bearer token'
        }
      };

      new HttpClient(config);

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/xml',
            'Authorization': 'Bearer token'
          }
        })
      );
    });

    it('should accept empty interceptors array', () => {
      const config: HttpConfig = {
        baseURL: 'https://api.example.com'
      };

      expect(() => new HttpClient(config, [])).not.toThrow();
    });

    it('should accept no interceptors parameter', () => {
      const config: HttpConfig = {
        baseURL: 'https://api.example.com'
      };

      expect(() => new HttpClient(config)).not.toThrow();
    });
  });

  describe('Interceptor Setup', () => {
    describe('Request Interceptors', () => {
      it('should register request interceptor when onRequest is provided', () => {
        const mockInterceptor: Interceptor = {
          onRequest: vi.fn().mockResolvedValue({} as InternalAxiosRequestConfig)
        };

        const config: HttpConfig = { baseURL: 'https://api.example.com' };
        new HttpClient(config, [mockInterceptor]);

        expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalledWith(
          expect.any(Function)
        );
      });

      it('should bind onRequest to interceptor instance', () => {
        const mockInterceptor: Interceptor = {
          onRequest: vi.fn().mockResolvedValue({} as InternalAxiosRequestConfig)
        };

        const config: HttpConfig = { baseURL: 'https://api.example.com' };
        new HttpClient(config, [mockInterceptor]);

        const registeredFunction = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
        expect(registeredFunction).toBeInstanceOf(Function);
      });

      it('should register multiple request interceptors', () => {
        const interceptor1: Interceptor = {
          onRequest: vi.fn().mockResolvedValue({} as InternalAxiosRequestConfig)
        };
        const interceptor2: Interceptor = {
          onRequest: vi.fn().mockResolvedValue({} as InternalAxiosRequestConfig)
        };

        const config: HttpConfig = { baseURL: 'https://api.example.com' };
        new HttpClient(config, [interceptor1, interceptor2]);

        expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalledTimes(2);
      });

      it('should not register request interceptor when onRequest is undefined', () => {
        const mockInterceptor: Interceptor = {
          onResponse: vi.fn().mockResolvedValue({} as AxiosResponse)
        };

        const config: HttpConfig = { baseURL: 'https://api.example.com' };
        new HttpClient(config, [mockInterceptor]);

        expect(mockAxiosInstance.interceptors.request.use).not.toHaveBeenCalled();
      });
    });

    describe('Response Interceptors', () => {
      it('should register response interceptor when onResponse is provided', () => {
        const mockInterceptor: Interceptor = {
          onResponse: vi.fn().mockResolvedValue({} as AxiosResponse)
        };

        const config: HttpConfig = { baseURL: 'https://api.example.com' };
        new HttpClient(config, [mockInterceptor]);

        expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalledWith(
          expect.any(Function),
          undefined
        );
      });

      it('should register response error interceptor when onResponseError is provided', () => {
        const mockInterceptor: Interceptor = {
          onResponseError: vi.fn().mockRejectedValue(new Error('test'))
        };

        const config: HttpConfig = { baseURL: 'https://api.example.com' };
        new HttpClient(config, [mockInterceptor]);

        expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalledWith(
          undefined,
          expect.any(Function)
        );
      });

      it('should register both response and error interceptors', () => {
        const mockInterceptor: Interceptor = {
          onResponse: vi.fn().mockResolvedValue({} as AxiosResponse),
          onResponseError: vi.fn().mockRejectedValue(new Error('test'))
        };

        const config: HttpConfig = { baseURL: 'https://api.example.com' };
        new HttpClient(config, [mockInterceptor]);

        expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalledWith(
          expect.any(Function),
          expect.any(Function)
        );
      });

      it('should bind onResponse to interceptor instance', () => {
        const mockInterceptor: Interceptor = {
          onResponse: vi.fn().mockResolvedValue({} as AxiosResponse)
        };

        const config: HttpConfig = { baseURL: 'https://api.example.com' };
        new HttpClient(config, [mockInterceptor]);

        const registeredFunction = mockAxiosInstance.interceptors.response.use.mock.calls[0][0];
        expect(registeredFunction).toBeInstanceOf(Function);
      });

      it('should bind onResponseError to interceptor instance', () => {
        const mockInterceptor: Interceptor = {
          onResponseError: vi.fn().mockRejectedValue(new Error('test'))
        };

        const config: HttpConfig = { baseURL: 'https://api.example.com' };
        new HttpClient(config, [mockInterceptor]);

        const registeredFunction = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
        expect(registeredFunction).toBeInstanceOf(Function);
      });

      it('should register multiple response interceptors', () => {
        const interceptor1: Interceptor = {
          onResponse: vi.fn().mockResolvedValue({} as AxiosResponse)
        };
        const interceptor2: Interceptor = {
          onResponseError: vi.fn().mockRejectedValue(new Error('test'))
        };

        const config: HttpConfig = { baseURL: 'https://api.example.com' };
        new HttpClient(config, [interceptor1, interceptor2]);

        expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalledTimes(2);
      });
    });

    describe('Mixed Interceptors', () => {
      it('should register all types of interceptors together', () => {
        const interceptor: Interceptor = {
          onRequest: vi.fn().mockResolvedValue({} as InternalAxiosRequestConfig),
          onResponse: vi.fn().mockResolvedValue({} as AxiosResponse),
          onResponseError: vi.fn().mockRejectedValue(new Error('test'))
        };

        const config: HttpConfig = { baseURL: 'https://api.example.com' };
        new HttpClient(config, [interceptor]);

        expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalledTimes(1);
        expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalledTimes(1);
      });

      it('should handle interceptors with only some methods defined', () => {
        const interceptor1: Interceptor = {
          onRequest: vi.fn().mockResolvedValue({} as InternalAxiosRequestConfig)
        };
        const interceptor2: Interceptor = {
          onResponse: vi.fn().mockResolvedValue({} as AxiosResponse)
        };
        const interceptor3: Interceptor = {
          onResponseError: vi.fn().mockRejectedValue(new Error('test'))
        };

        const config: HttpConfig = { baseURL: 'https://api.example.com' };
        new HttpClient(config, [interceptor1, interceptor2, interceptor3]);

        expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalledTimes(1);
        expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('HTTP Methods', () => {
    let httpClient: HttpClient;
    const baseConfig: HttpConfig = { baseURL: 'https://api.example.com' };

    beforeEach(() => {
      httpClient = new HttpClient(baseConfig);
    });

    describe('GET method', () => {
      it('should make GET request and return data', async () => {
        const mockResponse = { data: { id: 1, name: 'Test' } };
        mockAxiosInstance.get.mockResolvedValue(mockResponse);

        const result = await httpClient.get('/users');

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users', undefined);
        expect(result).toEqual(mockResponse.data);
      });

      it('should pass config to axios get', async () => {
        const mockResponse = { data: { id: 1 } };
        mockAxiosInstance.get.mockResolvedValue(mockResponse);

        const config: RequestConfig = {
          params: { page: 1 },
          headers: { 'X-Custom': 'value' }
        };

        await httpClient.get('/users', config);

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users', config);
      });

      it('should work with generic type', async () => {
        interface User { id: number; name: string; }
        const mockResponse = { data: { id: 1, name: 'John' } };
        mockAxiosInstance.get.mockResolvedValue(mockResponse);

        const result = await httpClient.get<User>('/users/1');

        expect(result).toEqual({ id: 1, name: 'John' });
      });

      it('should propagate errors', async () => {
        mockAxiosInstance.get.mockRejectedValue(new Error('Network error'));

        await expect(httpClient.get('/users')).rejects.toThrow('Network error');
      });
    });

    describe('POST method', () => {
      it('should make POST request with data and return response data', async () => {
        const requestData = { name: 'John', email: 'john@example.com' };
        const mockResponse = { data: { id: 1, ...requestData } };
        mockAxiosInstance.post.mockResolvedValue(mockResponse);

        const result = await httpClient.post('/users', requestData);

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users', requestData, undefined);
        expect(result).toEqual(mockResponse.data);
      });

      it('should work without data parameter', async () => {
        const mockResponse = { data: { success: true } };
        mockAxiosInstance.post.mockResolvedValue(mockResponse);

        const result = await httpClient.post('/action');

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/action', undefined, undefined);
        expect(result).toEqual(mockResponse.data);
      });

      it('should pass config to axios post', async () => {
        const requestData = { name: 'John' };
        const mockResponse = { data: { id: 1 } };
        mockAxiosInstance.post.mockResolvedValue(mockResponse);

        const config: RequestConfig = {
          showLoading: false,
          headers: { 'X-Custom': 'value' }
        };

        await httpClient.post('/users', requestData, config);

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users', requestData, config);
      });

      it('should work with generic type', async () => {
        interface CreateUserResponse { id: number; name: string; }
        const mockResponse = { data: { id: 1, name: 'John' } };
        mockAxiosInstance.post.mockResolvedValue(mockResponse);

        const result = await httpClient.post<CreateUserResponse>('/users', { name: 'John' });

        expect(result).toEqual({ id: 1, name: 'John' });
      });

      it('should propagate errors', async () => {
        mockAxiosInstance.post.mockRejectedValue(new Error('Validation error'));

        await expect(httpClient.post('/users', {})).rejects.toThrow('Validation error');
      });
    });

    describe('PUT method', () => {
      it('should make PUT request with data and return response data', async () => {
        const updateData = { name: 'John Updated' };
        const mockResponse = { data: { id: 1, ...updateData } };
        mockAxiosInstance.put.mockResolvedValue(mockResponse);

        const result = await httpClient.put('/users/1', updateData);

        expect(mockAxiosInstance.put).toHaveBeenCalledWith('/users/1', updateData, undefined);
        expect(result).toEqual(mockResponse.data);
      });

      it('should work without data parameter', async () => {
        const mockResponse = { data: { success: true } };
        mockAxiosInstance.put.mockResolvedValue(mockResponse);

        const result = await httpClient.put('/users/1');

        expect(mockAxiosInstance.put).toHaveBeenCalledWith('/users/1', undefined, undefined);
        expect(result).toEqual(mockResponse.data);
      });

      it('should pass config to axios put', async () => {
        const updateData = { name: 'John' };
        const mockResponse = { data: { id: 1 } };
        mockAxiosInstance.put.mockResolvedValue(mockResponse);

        const config: RequestConfig = {
          skipErrorToast: true
        };

        await httpClient.put('/users/1', updateData, config);

        expect(mockAxiosInstance.put).toHaveBeenCalledWith('/users/1', updateData, config);
      });

      it('should propagate errors', async () => {
        mockAxiosInstance.put.mockRejectedValue(new Error('Not found'));

        await expect(httpClient.put('/users/999', {})).rejects.toThrow('Not found');
      });
    });

    describe('DELETE method', () => {
      it('should make DELETE request and return data', async () => {
        const mockResponse = { data: { success: true } };
        mockAxiosInstance.delete.mockResolvedValue(mockResponse);

        const result = await httpClient.delete('/users/1');

        expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/users/1', undefined);
        expect(result).toEqual(mockResponse.data);
      });

      it('should pass config to axios delete', async () => {
        const mockResponse = { data: { success: true } };
        mockAxiosInstance.delete.mockResolvedValue(mockResponse);

        const config: RequestConfig = {
          params: { force: true }
        };

        await httpClient.delete('/users/1', config);

        expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/users/1', config);
      });

      it('should propagate errors', async () => {
        mockAxiosInstance.delete.mockRejectedValue(new Error('Forbidden'));

        await expect(httpClient.delete('/users/1')).rejects.toThrow('Forbidden');
      });
    });

    describe('PATCH method', () => {
      it('should make PATCH request with data and return response data', async () => {
        const patchData = { email: 'newemail@example.com' };
        const mockResponse = { data: { id: 1, email: 'newemail@example.com' } };
        mockAxiosInstance.patch.mockResolvedValue(mockResponse);

        const result = await httpClient.patch('/users/1', patchData);

        expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/users/1', patchData, undefined);
        expect(result).toEqual(mockResponse.data);
      });

      it('should work without data parameter', async () => {
        const mockResponse = { data: { success: true } };
        mockAxiosInstance.patch.mockResolvedValue(mockResponse);

        const result = await httpClient.patch('/users/1');

        expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/users/1', undefined, undefined);
        expect(result).toEqual(mockResponse.data);
      });

      it('should pass config to axios patch', async () => {
        const patchData = { email: 'new@example.com' };
        const mockResponse = { data: { id: 1 } };
        mockAxiosInstance.patch.mockResolvedValue(mockResponse);

        const config: RequestConfig = {
          showLoading: true
        };

        await httpClient.patch('/users/1', patchData, config);

        expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/users/1', patchData, config);
      });

      it('should propagate errors', async () => {
        mockAxiosInstance.patch.mockRejectedValue(new Error('Conflict'));

        await expect(httpClient.patch('/users/1', {})).rejects.toThrow('Conflict');
      });
    });
  });

  describe('RequestConfig Options', () => {
    let httpClient: HttpClient;
    const baseConfig: HttpConfig = { baseURL: 'https://api.example.com' };

    beforeEach(() => {
      httpClient = new HttpClient(baseConfig);
      mockAxiosInstance.get.mockResolvedValue({ data: {} });
    });

    it('should pass params in RequestConfig', async () => {
      const config: RequestConfig = {
        params: { page: 1, limit: 10 }
      };

      await httpClient.get('/users', config);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/users',
        expect.objectContaining({
          params: { page: 1, limit: 10 }
        })
      );
    });

    it('should pass headers in RequestConfig', async () => {
      const config: RequestConfig = {
        headers: { 'Authorization': 'Bearer token' }
      };

      await httpClient.get('/users', config);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/users',
        expect.objectContaining({
          headers: { 'Authorization': 'Bearer token' }
        })
      );
    });

    it('should pass showLoading flag', async () => {
      const config: RequestConfig = {
        showLoading: false
      };

      await httpClient.get('/users', config);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/users',
        expect.objectContaining({
          showLoading: false
        })
      );
    });

    it('should pass skipErrorToast flag', async () => {
      const config: RequestConfig = {
        skipErrorToast: true
      };

      await httpClient.get('/users', config);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/users',
        expect.objectContaining({
          skipErrorToast: true
        })
      );
    });

    it('should pass all config options together', async () => {
      const config: RequestConfig = {
        params: { id: 1 },
        headers: { 'X-Custom': 'value' },
        showLoading: false,
        skipErrorToast: true
      };

      await httpClient.get('/users', config);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users', config);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    let httpClient: HttpClient;
    const baseConfig: HttpConfig = { baseURL: 'https://api.example.com' };

    beforeEach(() => {
      httpClient = new HttpClient(baseConfig);
    });

    it('should handle empty response data', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: null });

      const result = await httpClient.get('/users');

      expect(result).toBeNull();
    });

    it('should handle undefined response data', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: undefined });

      const result = await httpClient.get('/users');

      expect(result).toBeUndefined();
    });

    it('should handle array response data', async () => {
      const mockData = [{ id: 1 }, { id: 2 }];
      mockAxiosInstance.get.mockResolvedValue({ data: mockData });

      const result = await httpClient.get('/users');

      expect(result).toEqual(mockData);
    });

    it('should handle primitive response data', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: 'success' });

      const result = await httpClient.get('/status');

      expect(result).toBe('success');
    });

    it('should handle network timeout', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('timeout of 60000ms exceeded'));

      await expect(httpClient.get('/slow-endpoint')).rejects.toThrow('timeout');
    });

    it('should handle 404 errors', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Request failed with status code 404'));

      await expect(httpClient.get('/not-found')).rejects.toThrow('404');
    });

    it('should handle 500 errors', async () => {
      mockAxiosInstance.post.mockRejectedValue(new Error('Request failed with status code 500'));

      await expect(httpClient.post('/error')).rejects.toThrow('500');
    });
  });

  describe('Real-world Usage Scenarios', () => {
    it('should work for typical REST API CRUD operations', async () => {
      const config: HttpConfig = { baseURL: 'https://api.example.com' };
      const httpClient = new HttpClient(config);

      // Create
      mockAxiosInstance.post.mockResolvedValue({ data: { id: 1, name: 'John' } });
      const created = await httpClient.post('/users', { name: 'John' });
      expect(created).toEqual({ id: 1, name: 'John' });

      // Read
      mockAxiosInstance.get.mockResolvedValue({ data: { id: 1, name: 'John' } });
      const read = await httpClient.get('/users/1');
      expect(read).toEqual({ id: 1, name: 'John' });

      // Update
      mockAxiosInstance.put.mockResolvedValue({ data: { id: 1, name: 'John Updated' } });
      const updated = await httpClient.put('/users/1', { name: 'John Updated' });
      expect(updated).toEqual({ id: 1, name: 'John Updated' });

      // Delete
      mockAxiosInstance.delete.mockResolvedValue({ data: { success: true } });
      const deleted = await httpClient.delete('/users/1');
      expect(deleted).toEqual({ success: true });
    });

    it('should work with pagination', async () => {
      const config: HttpConfig = { baseURL: 'https://api.example.com' };
      const httpClient = new HttpClient(config);

      mockAxiosInstance.get.mockResolvedValue({
        data: {
          items: [{ id: 1 }, { id: 2 }],
          page: 1,
          total: 100
        }
      });

      const result = await httpClient.get('/users', {
        params: { page: 1, limit: 10 }
      });

      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('total');
    });

    it('should work with authentication headers', async () => {
      const config: HttpConfig = { baseURL: 'https://api.example.com' };
      const httpClient = new HttpClient(config);

      mockAxiosInstance.get.mockResolvedValue({ data: { user: 'John' } });

      await httpClient.get('/me', {
        headers: { 'Authorization': 'Bearer token123' }
      });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/me',
        expect.objectContaining({
          headers: { 'Authorization': 'Bearer token123' }
        })
      );
    });
  });
});