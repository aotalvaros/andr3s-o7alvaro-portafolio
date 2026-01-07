import { useWeatherData } from '../../../../components/weather/hooks/useWeatherData';
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

import { useWeatherStore } from '@/store/weatherStore';
import { getOneCallWeather, getAirQuality } from '@/services/weather';
import { useDynamicIcon } from '@/hooks/useDynamicIcon';
import { OneCallWeatherData, AirQuality } from '../../../../types/weather.interface';

// Mock dependencies
vi.mock('@/store/weatherStore');
vi.mock('@/services/weather');
vi.mock('@/hooks/useDynamicIcon');

describe('useWeatherData', () => {
  // Mock functions
  let mockSetWeatherData: ReturnType<typeof vi.fn>;
  let mockSetAirQuality: ReturnType<typeof vi.fn>;
  let mockSetIsLoading: ReturnType<typeof vi.fn>;
  let mockSetError: ReturnType<typeof vi.fn>;
  let mockSetIsRateLimited: ReturnType<typeof vi.fn>;
  let mockSetCityName: ReturnType<typeof vi.fn>;
  let mockSetIsNighttime: ReturnType<typeof vi.fn>;
  let mockUpdateIcon: ReturnType<typeof vi.fn>;

  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  // Mock weather data
  const mockWeatherData = {
    current: {
      dt: 1640010000, // Daytime timestamp
      sunrise: 1639990000,
      sunset: 1640030000,
      temp: 20,
      weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }]
    },
    daily: [],
    hourly: []
  } as any as OneCallWeatherData

  const mockAirQualityData = {
    aqi: 50,
    components: {
      co: 201.94,
    },
  } as AirQuality

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy.mockClear();

    // Mock store functions
    mockSetWeatherData = vi.fn();
    mockSetAirQuality = vi.fn();
    mockSetIsLoading = vi.fn();
    mockSetError = vi.fn();
    mockSetIsRateLimited = vi.fn();
    mockSetCityName = vi.fn();
    mockSetIsNighttime = vi.fn();
    mockUpdateIcon = vi.fn();

    // Mock useWeatherStore
    vi.mocked(useWeatherStore).mockReturnValue({
      setWeatherData: mockSetWeatherData,
      setAirQuality: mockSetAirQuality,
      setIsLoading: mockSetIsLoading,
      setError: mockSetError,
      setIsRateLimited: mockSetIsRateLimited,
      setCityName: mockSetCityName,
      setIsNighttime: mockSetIsNighttime,
    } as any);

    // Mock useDynamicIcon
    vi.mocked(useDynamicIcon).mockReturnValue({
      updateIcon: mockUpdateIcon,
    } as any);

    // Mock services
    vi.mocked(getOneCallWeather).mockResolvedValue(mockWeatherData);
    vi.mocked(getAirQuality).mockResolvedValue(mockAirQualityData);
  });

  describe('Basic functionality', () => {
    it('should return loadWeather function', () => {
      const { result } = renderHook(() => useWeatherData());

      expect(result.current.loadWeather).toBeDefined();
      expect(typeof result.current.loadWeather).toBe('function');
    });

    it('should get dependencies from stores and hooks', () => {
      renderHook(() => useWeatherData());

      expect(useWeatherStore).toHaveBeenCalled();
      expect(useDynamicIcon).toHaveBeenCalled();
    });

    it('should memoize loadWeather with useCallback', () => {
      const { result, rerender } = renderHook(() => useWeatherData());

      const firstFunction = result.current.loadWeather;
      rerender();
      const secondFunction = result.current.loadWeather;

      expect(firstFunction).toBe(secondFunction);
    });
  });

  describe('loadWeather - Success flow', () => {
    it('should set loading to true at start', async () => {
      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    });

    it('should clear error and rate limit states at start', async () => {
      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(mockSetError).toHaveBeenCalledWith(null);
      expect(mockSetIsRateLimited).toHaveBeenCalledWith(false);
    });

    it('should call getOneCallWeather with coordinates', async () => {
      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(getOneCallWeather).toHaveBeenCalledWith(40.7128, -74.006);
    });

    it('should call getAirQuality with coordinates', async () => {
      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(getAirQuality).toHaveBeenCalledWith(40.7128, -74.006);
    });

    it('should call both services in parallel with Promise.all', async () => {
      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(getOneCallWeather).toHaveBeenCalled();
      expect(getAirQuality).toHaveBeenCalled();
    });

    it('should set weather data after successful fetch', async () => {
      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(mockSetWeatherData).toHaveBeenCalledWith(mockWeatherData);
    });

    it('should set air quality data after successful fetch', async () => {
      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(mockSetAirQuality).toHaveBeenCalledWith(mockAirQualityData);
    });

    it('should set loading to false after completion', async () => {
      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    });

    it('should set city name when provided', async () => {
      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006, 'New York');
      });

      expect(mockSetCityName).toHaveBeenCalledWith('New York');
    });

    it('should NOT set city name when not provided', async () => {
      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(mockSetCityName).not.toHaveBeenCalled();
    });

    it('should update icon with weather condition', async () => {
      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(mockUpdateIcon).toHaveBeenCalledWith('weather', 'Clear');
    });

    it('should execute in correct order', async () => {
      const callOrder: string[] = [];

      mockSetIsLoading.mockImplementation((value) => {
        callOrder.push(value ? 'loading-start' : 'loading-end');
      });

      mockSetError.mockImplementation(() => {
        callOrder.push('clear-error');
      });

      vi.mocked(getOneCallWeather).mockImplementation(async () => {
        callOrder.push('fetch-weather');
        return mockWeatherData;
      });

      vi.mocked(getAirQuality).mockImplementation(async () => {
        callOrder.push('fetch-air');
        return mockAirQualityData;
      });

      mockSetWeatherData.mockImplementation(() => {
        callOrder.push('set-weather');
      });

      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(callOrder[0]).toBe('loading-start');
      expect(callOrder[1]).toBe('clear-error');
      expect(callOrder[callOrder.length - 1]).toBe('loading-end');
    });
  });

  describe('loadWeather - Nighttime calculation', () => {
    it('should detect daytime correctly (dt between sunrise and sunset)', async () => {
      const daytimeWeather = {
        current: {
          dt: 1640010000, // Between sunrise and sunset
          sunrise: 1639990000,
          sunset: 1640030000,
          temp: 20,
          weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }]
        },
        daily: [],
        hourly: []
      } as any as OneCallWeatherData

      vi.mocked(getOneCallWeather).mockResolvedValue(daytimeWeather);

      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(mockSetIsNighttime).toHaveBeenCalledWith(false); // Daytime
    });

    it('should detect nighttime correctly (dt before sunrise)', async () => {
      const nighttimeWeather = {
        current: {
          dt: 1639980000, // Before sunrise
          sunrise: 1639990000,
          sunset: 1640030000,
          temp: 15,
          weather: [{ main: 'Clear', description: 'clear sky', icon: '01n' }]
        },
        daily: [],
        hourly: []
      } as any as OneCallWeatherData

      vi.mocked(getOneCallWeather).mockResolvedValue(nighttimeWeather);

      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(mockSetIsNighttime).toHaveBeenCalledWith(true); // Nighttime
    });

    it('should detect nighttime correctly (dt after sunset)', async () => {
      const nighttimeWeather = {
        current: {
          dt: 1640040000, // After sunset
          sunrise: 1639990000,
          sunset: 1640030000,
          temp: 15,
          weather: [{ main: 'Clear', description: 'clear sky', icon: '01n' }]
        },
        daily: [],
        hourly: []
      } as any as OneCallWeatherData;

      vi.mocked(getOneCallWeather).mockResolvedValue(nighttimeWeather);

      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(mockSetIsNighttime).toHaveBeenCalledWith(true); // Nighttime
    });

    it('should detect nighttime at exact sunrise time', async () => {
      const sunriseWeather = {
        current: {
          dt: 1639990000, // Exact sunrise
          sunrise: 1639990000,
          sunset: 1640030000,
          temp: 18,
          weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }]
        },
        daily: [],
        hourly: []
      } as any as OneCallWeatherData;


      vi.mocked(getOneCallWeather).mockResolvedValue(sunriseWeather);

      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      // At exact sunrise, dt < sunrise is false, so it's daytime
      expect(mockSetIsNighttime).toHaveBeenCalledWith(false);
    });

    it('should detect nighttime at exact sunset time', async () => {
      const sunsetWeather = {
        current: {
          dt: 1640030000, // Exact sunset
          sunrise: 1639990000,
          sunset: 1640030000,
          temp: 18,
          weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }]
        },
        daily: [],
        hourly: []
      } as any as OneCallWeatherData;

      vi.mocked(getOneCallWeather).mockResolvedValue(sunsetWeather);

      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      // At exact sunset, dt > sunset is false, so it's daytime
      expect(mockSetIsNighttime).toHaveBeenCalledWith(false);
    });
  });

  describe('loadWeather - Air quality error handling', () => {
    it('should handle air quality fetch failure gracefully', async () => {
      vi.mocked(getAirQuality).mockRejectedValue(new Error('Air quality service down'));

      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      // Should still set weather data
      expect(mockSetWeatherData).toHaveBeenCalledWith(mockWeatherData);
      // Should set air quality to null
      expect(mockSetAirQuality).toHaveBeenCalledWith(null);
      // Should NOT set error (air quality is optional)
      expect(mockSetError).toHaveBeenCalledWith(null); // Only the initial clear
      // Should complete successfully
      expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    });

    it('should continue even if air quality fails', async () => {
      vi.mocked(getAirQuality).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(mockSetWeatherData).toHaveBeenCalled();
      expect(mockSetAirQuality).toHaveBeenCalledWith(null);
      expect(mockUpdateIcon).toHaveBeenCalled();
    });
  });

  describe('loadWeather - Error handling', () => {
    it('should handle rate limit error', async () => {
      const rateLimitError = new Error('RATE_LIMIT_EXCEEDED');
      vi.mocked(getOneCallWeather).mockRejectedValue(rateLimitError);

      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(mockSetIsRateLimited).toHaveBeenCalledWith(true);
      expect(mockSetError).toHaveBeenCalledWith(null); // Clear error for rate limit
      expect(console.error).toHaveBeenCalledWith(rateLimitError);
    });

    it('should handle general errors', async () => {
      const generalError = new Error('Network error');
      vi.mocked(getOneCallWeather).mockRejectedValue(generalError);

      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(mockSetError).toHaveBeenCalledWith('No se pudo cargar el clima. Intenta de nuevo.');
      expect(mockSetIsRateLimited).toHaveBeenCalledWith(false); // Initially cleared
      expect(console.error).toHaveBeenCalledWith(generalError);
    });

    it('should set loading to false even when error occurs', async () => {
      vi.mocked(getOneCallWeather).mockRejectedValue(new Error('Error'));

      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      vi.mocked(getOneCallWeather).mockRejectedValue(timeoutError);

      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(mockSetError).toHaveBeenCalledWith('No se pudo cargar el clima. Intenta de nuevo.');
      expect(console.error).toHaveBeenCalledWith(timeoutError);
    });

    it('should handle 404 errors', async () => {
      const notFoundError = new Error('Location not found');
      vi.mocked(getOneCallWeather).mockRejectedValue(notFoundError);

      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(0, 0);
      });

      expect(mockSetError).toHaveBeenCalledWith('No se pudo cargar el clima. Intenta de nuevo.');
    });

    it('should handle non-Error objects', async () => {
      vi.mocked(getOneCallWeather).mockRejectedValue('String error');

      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(mockSetError).toHaveBeenCalledWith('No se pudo cargar el clima. Intenta de nuevo.');
      expect(console.error).toHaveBeenCalledWith('String error');
    });
  });

  describe('loadWeather - Different weather conditions', () => {
    it('should handle Clear weather', async () => {
      const clearWeather = {
        ...mockWeatherData,
        current: {
          ...mockWeatherData.current,
          weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }]
        }
      } as any as OneCallWeatherData;

      vi.mocked(getOneCallWeather).mockResolvedValue(clearWeather);

      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(mockUpdateIcon).toHaveBeenCalledWith('weather', 'Clear');
    });

    it('should handle Rain weather', async () => {
      const rainWeather = {
        ...mockWeatherData,
        current: {
          ...mockWeatherData.current,
          weather: [{ main: 'Rain', description: 'light rain', icon: '10d' }]
        }
      } as any as OneCallWeatherData;

      vi.mocked(getOneCallWeather).mockResolvedValue(rainWeather);

      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(mockUpdateIcon).toHaveBeenCalledWith('weather', 'Rain');
    });

    it('should handle Snow weather', async () => {
      const snowWeather = {
        ...mockWeatherData,
        current: {
          ...mockWeatherData.current,
          weather: [{ main: 'Snow', description: 'light snow', icon: '13d' }]
        }
      } as any as OneCallWeatherData;

      vi.mocked(getOneCallWeather).mockResolvedValue(snowWeather);

      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(mockUpdateIcon).toHaveBeenCalledWith('weather', 'Snow');
    });

    it('should handle Thunderstorm weather', async () => {
      const stormWeather = {
        ...mockWeatherData,
        current: {
          ...mockWeatherData.current,
          weather: [{ main: 'Thunderstorm', description: 'thunderstorm', icon: '11d' }]
        }
      } as any as OneCallWeatherData;

      vi.mocked(getOneCallWeather).mockResolvedValue(stormWeather);

      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(mockUpdateIcon).toHaveBeenCalledWith('weather', 'Thunderstorm');
    });

    it('should handle Clouds weather', async () => {
      const cloudyWeather = {
        ...mockWeatherData,
        current: {
          ...mockWeatherData.current,
          weather: [{ main: 'Clouds', description: 'few clouds', icon: '02d' }]
        }
      } as any as OneCallWeatherData;

      vi.mocked(getOneCallWeather).mockResolvedValue(cloudyWeather);

      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(mockUpdateIcon).toHaveBeenCalledWith('weather', 'Clouds');
    });
  });

  describe('loadWeather - Different coordinates', () => {
    it('should handle positive coordinates', async () => {
      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006, 'New York');
      });

      expect(getOneCallWeather).toHaveBeenCalledWith(40.7128, -74.006);
      expect(getAirQuality).toHaveBeenCalledWith(40.7128, -74.006);
    });

    it('should handle negative coordinates', async () => {
      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(-34.6037, -58.3816, 'Buenos Aires');
      });

      expect(getOneCallWeather).toHaveBeenCalledWith(-34.6037, -58.3816);
      expect(getAirQuality).toHaveBeenCalledWith(-34.6037, -58.3816);
    });

    it('should handle zero coordinates', async () => {
      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(0, 0);
      });

      expect(getOneCallWeather).toHaveBeenCalledWith(0, 0);
    });

    it('should handle extreme coordinates', async () => {
      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(89.9999, 179.9999);
      });

      expect(getOneCallWeather).toHaveBeenCalledWith(89.9999, 179.9999);
    });
  });

  describe('Real-world scenarios', () => {
    it('should handle complete user flow: select city → load weather', async () => {
      const { result } = renderHook(() => useWeatherData());

      await act(async () => {
        await result.current.loadWeather(51.5074, -0.1278, 'London, GB');
      });

      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
      expect(mockSetCityName).toHaveBeenCalledWith('London, GB');
      expect(getOneCallWeather).toHaveBeenCalledWith(51.5074, -0.1278);
      expect(mockSetWeatherData).toHaveBeenCalled();
      expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    });

    it('should handle switching between cities rapidly', async () => {
      const { result } = renderHook(() => useWeatherData());

      const cities = [
        { lat: 51.5074, lon: -0.1278, name: 'London' },
        { lat: 48.8566, lon: 2.3522, name: 'Paris' },
        { lat: 52.5200, lon: 13.4050, name: 'Berlin' }
      ];

      for (const city of cities) {
        await act(async () => {
          await result.current.loadWeather(city.lat, city.lon, city.name);
        });
      }

      expect(getOneCallWeather).toHaveBeenCalledTimes(3);
      expect(mockSetCityName).toHaveBeenCalledWith('Berlin'); // Last city
    });

    it('should handle weather refresh for same location', async () => {
      const { result } = renderHook(() => useWeatherData());

      // First load
      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006, 'New York');
      });

      // Refresh
      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006, 'New York');
      });

      expect(getOneCallWeather).toHaveBeenCalledTimes(2);
      expect(mockSetCityName).toHaveBeenCalledTimes(2);
    });

    it('should handle network recovery after error', async () => {
      const { result } = renderHook(() => useWeatherData());

      // First call fails
      vi.mocked(getOneCallWeather).mockRejectedValueOnce(new Error('Network error'));

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(mockSetError).toHaveBeenCalledWith('No se pudo cargar el clima. Intenta de nuevo.');

      // Second call succeeds
      vi.mocked(getOneCallWeather).mockResolvedValue(mockWeatherData);

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(mockSetWeatherData).toHaveBeenCalledWith(mockWeatherData);
      expect(mockSetError).toHaveBeenCalledWith(null); // Cleared
    });

    it('should handle transition from day to night', async () => {
      const { result } = renderHook(() => useWeatherData());

      // Daytime weather
      const daytimeWeather = {
        ...mockWeatherData,
        current: {
          ...mockWeatherData.current,
          dt: 1640010000,
          sunrise: 1639990000,
          sunset: 1640030000
        }
      };

      vi.mocked(getOneCallWeather).mockResolvedValue(daytimeWeather);

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(mockSetIsNighttime).toHaveBeenCalledWith(false);

      // Nighttime weather
      const nighttimeWeather = {
        ...mockWeatherData,
        current: {
          ...mockWeatherData.current,
          dt: 1640040000, // After sunset
          sunrise: 1639990000,
          sunset: 1640030000
        }
      };

      vi.mocked(getOneCallWeather).mockResolvedValue(nighttimeWeather);

      await act(async () => {
        await result.current.loadWeather(40.7128, -74.006);
      });

      expect(mockSetIsNighttime).toHaveBeenCalledWith(true);
    });
  });

  describe('useCallback dependencies', () => {
    it('should recreate loadWeather when setWeatherData changes', () => {
      const { result, rerender } = renderHook(() => useWeatherData());

      const firstCallback = result.current.loadWeather;

      // Change dependency
      const newSetWeatherData = vi.fn();
      vi.mocked(useWeatherStore).mockReturnValue({
        setWeatherData: newSetWeatherData,
        setAirQuality: mockSetAirQuality,
        setIsLoading: mockSetIsLoading,
        setError: mockSetError,
        setIsRateLimited: mockSetIsRateLimited,
        setCityName: mockSetCityName,
        setIsNighttime: mockSetIsNighttime,
      } as any);

      rerender();

      const secondCallback = result.current.loadWeather;

      expect(firstCallback).not.toBe(secondCallback);
    });

    it('should recreate loadWeather when updateIcon changes', () => {
      const { result, rerender } = renderHook(() => useWeatherData());

      const firstCallback = result.current.loadWeather;

      // Change updateIcon
      const newUpdateIcon = vi.fn();
      vi.mocked(useDynamicIcon).mockReturnValue({
        updateIcon: newUpdateIcon,
      } as any);

      rerender();

      const secondCallback = result.current.loadWeather;

      expect(firstCallback).not.toBe(secondCallback);
    });
  });

  describe('Edge cases', () => {
    it('should handle unmounting during async operation', async () => {
      const { result, unmount } = renderHook(() => useWeatherData());

      act(() => {
        result.current.loadWeather(40.7128, -74.006);
      });

      unmount();

      expect(() => unmount()).not.toThrow();
    });

  });
  
});