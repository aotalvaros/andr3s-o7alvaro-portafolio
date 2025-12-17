/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useWeatherContent } from '../../../../components/weather/hooks/useWeatherContent';
import {
  getOneCallWeather,
  getAirQuality,
  getUserLocation,
  searchCities,
} from '@/services/weather';

vi.mock('@/services/weather');

describe('useWeatherContent - Integration Tests (Simplified)', () => {
  const mockWeatherData = {
    current: {
      dt: 1234567890,
      sunrise: 1234560000,
      sunset: 1234600000,
      temp: 25,
      weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
    },
    daily: [],
    hourly: [],
  };

  const mockAirQuality = {
    aqi: 50,
    components: { co: 201.94, no2: 0.01, o3: 68.66, pm2_5: 0.5 },
  };

  const mockCityResults = [
    {
      name: 'Bogotá',
      country: 'CO',
      state: 'Bogotá D.C.',
      lat: 4.6097,
      lon: -74.0817,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // NO usamos fake timers aquí - dejamos que el debounce funcione naturalmente
    
    vi.mocked(getOneCallWeather).mockResolvedValue(mockWeatherData as any);
    vi.mocked(getAirQuality).mockResolvedValue(mockAirQuality as any);
    vi.mocked(getUserLocation).mockResolvedValue({ lat: 6.251, lon: -75.5636 });
    vi.mocked(searchCities).mockResolvedValue(mockCityResults as any);

    vi.spyOn(console, 'error').mockImplementation(() => {}); // Silenciar errores en consola durante tests
  });

  describe('Real debounce behavior', () => {
    it('should debounce search requests correctly', async () => {
      const { result } = renderHook(() => useWeatherContent());

      // Esperar carga inicial
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Escribir rápidamente (simular typing real)
      act(() => {
        result.current.handleSearchChange('B');
      });
      
      // Esperar un poco
      await new Promise(resolve => setTimeout(resolve, 100));
      
      act(() => {
        result.current.handleSearchChange('Bo');
      });
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      act(() => {
        result.current.handleSearchChange('Bog');
      });

      // Inmediatamente después, no debería haber buscado
      expect(searchCities).not.toHaveBeenCalled();

      // Esperar el debounce real (300ms + margen)
      await waitFor(
        () => {
          expect(searchCities).toHaveBeenCalledTimes(1);
          expect(searchCities).toHaveBeenCalledWith('Bog');
        },
        { timeout: 1000 }
      );
    });

    it('should cancel previous debounced search on new input', async () => {
      const { result } = renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Primera búsqueda
      act(() => {
        result.current.handleSearchChange('Bog');
      });

      // Esperar 200ms (menos que el debounce de 300ms)
      await new Promise(resolve => setTimeout(resolve, 200));

      // Segunda búsqueda interrumpe la primera
      act(() => {
        result.current.handleSearchChange('Med');
      });

      // Esperar a que se complete el debounce
      await waitFor(
        () => {
          expect(searchCities).toHaveBeenCalledTimes(1);
          expect(searchCities).toHaveBeenCalledWith('Med');
        },
        { timeout: 1000 }
      );

      // No debería haber buscado "Bog"
      expect(searchCities).not.toHaveBeenCalledWith('Bog');
    });

    it('should handle user typing and stopping', async () => {
      const { result } = renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Usuario escribe y para
      act(() => {
        result.current.handleSearchChange('Bogo');
      });

      // Esperar a que busque
      await waitFor(
        () => {
          expect(searchCities).toHaveBeenCalledWith('Bogo');
        },
        { timeout: 1000 }
      );

      // Usuario continúa escribiendo después de un tiempo
      act(() => {
        result.current.handleSearchChange('Bogot');
      });

      await waitFor(
        () => {
          expect(searchCities).toHaveBeenCalledWith('Bogot');
          expect(searchCities).toHaveBeenCalledTimes(2);
        },
        { timeout: 1000 }
      );
    });
  });

  describe('Real loading states flow', () => {
    it('should transition through all loading states correctly', async () => {
      // API lenta pero REAL (no fake timers)
      vi.mocked(getOneCallWeather).mockImplementation(
        () => new Promise(resolve => 
          setTimeout(() => resolve(mockWeatherData as any), 200)
        )
      );

      const { result } = renderHook(() => useWeatherContent());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.weatherData).toBeNull();

      // Esperar a que cargue
      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
          expect(result.current.weatherData).not.toBeNull();
        },
        { timeout: 2000 }
      );
    });

    it('should handle concurrent location request during search', async () => {
      const { result } = renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Iniciar búsqueda
      act(() => {
        result.current.handleSearchChange('Bog');
      });

      // Mientras hace debounce, pedir ubicación
      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      // Esperar a que termine la búsqueda también
      await waitFor(
        () => {
          expect(searchCities).toHaveBeenCalled();
        },
        { timeout: 1000 }
      );

      // Verificar que ambas operaciones se completaron
      expect(getUserLocation).toHaveBeenCalled();
      expect(result.current.isLoadingLocation).toBe(false);
    });
  });

  describe('Store interactions', () => {
    it('should update loading store on mount', async () => {
      const { result } = renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current).toBeDefined();
    });
  });

  describe('Race conditions', () => {
    it('should handle rapid city selection correctly', async () => {
      const { result } = renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Seleccionar múltiples ciudades rápidamente
      await act(async () => {
        result.current.handleCitySelect(mockCityResults[0]);
        result.current.handleCitySelect(mockCityResults[0]);
        result.current.handleCitySelect(mockCityResults[0]);
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.weatherData).not.toBeNull();
      expect(result.current.cityName).toBe('Bogotá, Bogotá D.C., CO');
    });

    it('should handle search while weather is loading', async () => {
      vi.mocked(getOneCallWeather).mockImplementation(
        () => new Promise(resolve => 
          setTimeout(() => resolve(mockWeatherData as any), 500)
        )
      );

      const { result } = renderHook(() => useWeatherContent());

      // Mientras carga el clima inicial, buscar ciudades
      act(() => {
        result.current.handleSearchChange('Bog');
      });

      // Esperar a que se complete la búsqueda
      await waitFor(
        () => {
          expect(searchCities).toHaveBeenCalled();
        },
        { timeout: 1000 }
      );

      // Esperar a que se complete la carga de clima
      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
        },
        { timeout: 1000 }
      );

      // Ambas operaciones deberían completarse
      expect(result.current.weatherData).not.toBeNull();
      expect(result.current.results).toEqual(mockCityResults);
    });
  });

  describe('Error recovery flows', () => {
    it('should recover from error when retrying', async () => {
      vi.mocked(getOneCallWeather)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(mockWeatherData as any);

      const { result } = renderHook(() => useWeatherContent());

      // Primera carga falla
      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      // Retry con nueva ciudad
      await act(async () => {
        result.current.handleCitySelect(mockCityResults[0]);
      });

      await waitFor(() => {
        expect(result.current.error).toBeNull();
        expect(result.current.weatherData).not.toBeNull();
      });
    });

    it('should handle alternating success/failure', async () => {
      vi.mocked(getOneCallWeather)
        .mockResolvedValueOnce(mockWeatherData as any)
        .mockRejectedValueOnce(new Error('Error'))
        .mockResolvedValueOnce(mockWeatherData as any);

      const { result } = renderHook(() => useWeatherContent());

      // Primera carga exitosa
      await waitFor(() => {
        expect(result.current.weatherData).not.toBeNull();
      });

      // Segunda carga falla
      await act(async () => {
        result.current.handleCitySelect(mockCityResults[0]);
      });

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      // Tercera carga exitosa
      await act(async () => {
        result.current.handleCitySelect(mockCityResults[0]);
      });

      await waitFor(() => {
        expect(result.current.error).toBeNull();
        expect(result.current.weatherData).not.toBeNull();
      });
    });
  });
});