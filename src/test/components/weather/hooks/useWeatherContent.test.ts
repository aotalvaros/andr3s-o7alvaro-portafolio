/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useLoadingStore } from '@/store/loadingStore';
import { useThemeStore } from '@/store/themeStore';
import {
  getOneCallWeather,
  getAirQuality,
  getUserLocation,
  searchCities,
} from '@/services/weather';
import { useDebounce } from '@/hooks/useDebounce';
import { useWeatherContent } from '../../../../components/weather/hooks/useWeatherContent';

// Mock all dependencies
vi.mock('@/store/loadingStore');
vi.mock('@/store/themeStore');
vi.mock('@/services/weather');
vi.mock('@/hooks/useDebounce');

describe('useWeatherContent', () => {
  const mockSetLoading = vi.fn();
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
    components: {
      co: 201.94,
      no2: 0.01,
      o3: 68.66,
      pm2_5: 0.5,
    },
  };

  const mockCityResults = [
    {
      name: 'Bogotá',
      country: 'CO',
      state: 'Bogotá D.C.',
      lat: 4.6097,
      lon: -74.0817,
    },
    {
      name: 'Cali',
      country: 'CO',
      lat: 3.4516,
      lon: -76.532,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock Zustand stores
    vi.mocked(useLoadingStore).mockReturnValue(() => ({
      setLoading: mockSetLoading,
    } as any));

    vi.mocked(useThemeStore).mockReturnValue({
      isDarkMode: false,
    } as any);

    // Mock debounce to return value immediately
    vi.mocked(useDebounce).mockImplementation((value) => value);

    // Mock weather services
    vi.mocked(getOneCallWeather).mockResolvedValue(mockWeatherData as any);
    vi.mocked(getAirQuality).mockResolvedValue(mockAirQuality as any);
    vi.mocked(getUserLocation).mockResolvedValue({ lat: 6.251, lon: -75.5636 });
    vi.mocked(searchCities).mockResolvedValue(mockCityResults as any);

    // Mock console methods
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial state', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useWeatherContent());

      expect(result.current.weatherData).toBeNull();
      expect(result.current.airQuality).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.cityName).toBe('Medellin');
      expect(result.current.isLoadingLocation).toBe(false);
      expect(result.current.isRateLimited).toBe(false);
      expect(result.current.results).toEqual([]);
      expect(result.current.isSearching).toBe(false);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isNighttime).toBe(false);
    });

    it('should load Medellin weather on mount', async () => {
      renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(getOneCallWeather).toHaveBeenCalledWith(6.251, -75.5636);
      });
    });
  });

  describe('Weather data loading', () => {
    it('should load weather data successfully', async () => {
      const { result } = renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(result.current.weatherData).toEqual(mockWeatherData);
      });

      expect(result.current.airQuality).toEqual(mockAirQuality);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle weather data loading error', async () => {
      vi.mocked(getOneCallWeather).mockRejectedValueOnce(
        new Error('Network error')
      );

      const { result } = renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(result.current.error).toBe(
          'No se pudo cargar el clima. Intenta de nuevo.'
        );
      });

      expect(result.current.isLoading).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle rate limit error', async () => {
      vi.mocked(getOneCallWeather).mockRejectedValueOnce(
        new Error('RATE_LIMIT_EXCEEDED')
      );

      const { result } = renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(result.current.isRateLimited).toBe(true);
      });

      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it('should continue loading even if air quality fails', async () => {
      vi.mocked(getAirQuality).mockRejectedValueOnce(new Error('API error'));

      const { result } = renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(result.current.weatherData).toEqual(mockWeatherData);
      });

      expect(result.current.airQuality).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });

  describe('Night time detection', () => {
    it('should detect daytime correctly', async () => {
      const daytimeWeather = {
        ...mockWeatherData,
        current: {
          ...mockWeatherData.current,
          dt: 1234580000, // Between sunrise and sunset
          sunrise: 1234560000,
          sunset: 1234600000,
        },
      };

      vi.mocked(getOneCallWeather).mockResolvedValueOnce(daytimeWeather as any);

      const { result } = renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(result.current.isNighttime).toBe(false);
      });
    });

    it('should detect nighttime before sunrise', async () => {
      const nightWeather = {
        ...mockWeatherData,
        current: {
          ...mockWeatherData.current,
          dt: 1234550000, // Before sunrise
          sunrise: 1234560000,
          sunset: 1234600000,
        },
      };

      vi.mocked(getOneCallWeather).mockResolvedValueOnce(nightWeather as any);

      const { result } = renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(result.current.isNighttime).toBe(true);
      });
    });

    it('should detect nighttime after sunset', async () => {
      const nightWeather = {
        ...mockWeatherData,
        current: {
          ...mockWeatherData.current,
          dt: 1234610000, // After sunset
          sunrise: 1234560000,
          sunset: 1234600000,
        },
      };

      vi.mocked(getOneCallWeather).mockResolvedValueOnce(nightWeather as any);

      const { result } = renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(result.current.isNighttime).toBe(true);
      });
    });
  });

  describe('Background gradient', () => {
    it('should return correct gradient for clear day', async () => {
      const { result } = renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(result.current.weatherData).not.toBeNull();
      });

      expect(result.current.backgroundGradient).toBeDefined();
      expect(typeof result.current.backgroundGradient).toBe('string');
    });

    it('should return default gradient when no weather data', () => {
      vi.mocked(getOneCallWeather).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const { result } = renderHook(() => useWeatherContent());

      expect(result.current.backgroundGradient).toBe(
        'from-blue-200 via-cyan-100 to-blue-100'
      );
    });

    it('should use dark mode when enabled', async () => {
      vi.mocked(useThemeStore).mockReturnValue({
        isDarkMode: true,
      } as any);

      const { result } = renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(result.current.weatherData).not.toBeNull();
      });

      expect(result.current.backgroundGradient).toBeDefined();
    });
  });

  describe('City search', () => {
    it('should search cities when query length >= 2', async () => {
      const { result } = renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.handleSearchChange('Bog');
      });

      await waitFor(() => {
        expect(searchCities).toHaveBeenCalledWith('Bog');
      });

      await waitFor(() => {
        expect(result.current.results).toEqual(mockCityResults);
      });
    });

    it('should not search when query length < 2', async () => {
      const { result } = renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.handleSearchChange('B');
      });

      // Wait a bit to ensure no search happens
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(searchCities).not.toHaveBeenCalledWith('B');
      expect(result.current.results).toEqual([]);
    });

    it('should clear results when query becomes too short', async () => {
      const { result } = renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // First search
      act(() => {
        result.current.handleSearchChange('Bog');
      });

      await waitFor(() => {
        expect(result.current.results.length).toBeGreaterThan(0);
      });

      // Clear search
      act(() => {
        result.current.handleSearchChange('B');
      });

      await waitFor(() => {
        expect(result.current.results).toEqual([]);
      });
    });

    it('should set isSearching during search', async () => {
      vi.mocked(searchCities).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockCityResults as any), 100))
      );

      const { result } = renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.handleSearchChange('Bog');
      });

      // Should be searching
      await waitFor(() => {
        expect(result.current.isSearching).toBe(true);
      });

      // Should finish searching
      await waitFor(() => {
        expect(result.current.isSearching).toBe(false);
      });
    });

    it('should handle search errors gracefully', async () => {
      vi.mocked(searchCities).mockRejectedValueOnce(new Error('Search failed'));

      const { result } = renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.handleSearchChange('Bog');
      });

      await waitFor(() => {
        expect(result.current.isSearching).toBe(false);
      });

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('City selection', () => {
    it('should load weather for selected city with state', async () => {
      const { result } = renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.handleCitySelect(mockCityResults[0]);
      });

      await waitFor(() => {
        expect(getOneCallWeather).toHaveBeenCalledWith(4.6097, -74.0817);
      });

      expect(result.current.cityName).toBe('Bogotá, Bogotá D.C., CO');
    });

    it('should load weather for selected city without state', async () => {
      const { result } = renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.handleCitySelect(mockCityResults[1]);
      });

      await waitFor(() => {
        expect(getOneCallWeather).toHaveBeenCalledWith(3.4516, -76.532);
      });

      expect(result.current.cityName).toBe('Cali, CO');
    });

    it('should clear search results after city selection', async () => {
      const { result } = renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // First set some results
      act(() => {
        result.current.handleSearchChange('Bog');
      });

      await waitFor(() => {
        expect(result.current.results.length).toBeGreaterThan(0);
      });

      // Select a city
      act(() => {
        result.current.handleCitySelect(mockCityResults[0]);
      });

      expect(result.current.results).toEqual([]);
    });
  });

  describe('Current location', () => {
    it('should get user location successfully', async () => {
      const { result } = renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(getUserLocation).toHaveBeenCalled();
      expect(getOneCallWeather).toHaveBeenCalledWith(6.251, -75.5636);
      expect(result.current.cityName).toBe('Tu ubicación');
      expect(result.current.isLoadingLocation).toBe(false);
    });

    it('should set loading state during location fetch', async () => {
      vi.mocked(getUserLocation).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ lat: 6.251, lon: -75.5636 }), 100))
      );

      const { result } = renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.handleUseCurrentLocation();
      });

      await waitFor(() => {
        expect(result.current.isLoadingLocation).toBe(true);
      });

      await waitFor(() => {
        expect(result.current.isLoadingLocation).toBe(false);
      });
    });

    it('should handle location access denied', async () => {
      vi.mocked(getUserLocation).mockRejectedValueOnce(
        new Error('User denied geolocation')
      );

      const { result } = renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(result.current.error).toBe(
        'No se pudo obtener tu ubicación. Por favor permite el acceso.'
      );
      expect(result.current.isLoadingLocation).toBe(false);
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('Error handling', () => {
    it('should allow clearing errors', async () => {
      vi.mocked(getOneCallWeather).mockRejectedValueOnce(
        new Error('Network error')
      );

      const { result } = renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      act(() => {
        result.current.setError(null);
      });

      expect(result.current.error).toBeNull();
    });

    it('should reset rate limit when loading new weather', async () => {
      vi.mocked(getOneCallWeather)
        .mockRejectedValueOnce(new Error('RATE_LIMIT_EXCEEDED'))
        .mockResolvedValueOnce(mockWeatherData as any);

      const { result } = renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(result.current.isRateLimited).toBe(true);
      });

      // Try loading again
      act(() => {
        result.current.handleCitySelect(mockCityResults[0]);
      });

      await waitFor(() => {
        expect(result.current.isRateLimited).toBe(false);
      });
    });
  });

  describe('Callback stability', () => {
    it('should maintain handleSearchChange reference', () => {
      const { result, rerender } = renderHook(() => useWeatherContent());

      const firstCallback = result.current.handleSearchChange;
      rerender();
      const secondCallback = result.current.handleSearchChange;

      expect(firstCallback).toBe(secondCallback);
    });

    it('should maintain handleCitySelect reference', () => {
      const { result, rerender } = renderHook(() => useWeatherContent());

      const firstCallback = result.current.handleCitySelect;
      rerender();
      const secondCallback = result.current.handleCitySelect;

      expect(firstCallback).toBe(secondCallback);
    });
  });

  describe('Debounce integration', () => {
    it('should use debounced query value', () => {
      renderHook(() => useWeatherContent());

      expect(useDebounce).toHaveBeenCalledWith('', 300);
    });

    it('should pass new query to debounce', async () => {
      const { result } = renderHook(() => useWeatherContent());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.handleSearchChange('Test');
      });

      expect(useDebounce).toHaveBeenCalledWith('Test', 300);
    });
  });
});