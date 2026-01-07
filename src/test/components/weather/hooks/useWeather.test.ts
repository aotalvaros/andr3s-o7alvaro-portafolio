import { useWeather } from '../../../../components/weather/hooks/useWeather';
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

import { useLoadingStore } from '@/store/loadingStore';
import { useThemeStore } from '@/store/themeStore';
import { useWeatherStore } from '@/store/weatherStore';
import { getWeatherGradient } from '@/utils/weather/getWeatherGradient';
import { useDynamicIcon } from '@/hooks/useDynamicIcon';
import { useWeatherData } from '@/components/weather/hooks/useWeatherData';
import { useCitySearch } from '@/components/weather/hooks/useCitySearch';
import { useUserLocation } from '@/components/weather/hooks/useUserLocation';

vi.mock('@/store/loadingStore');
vi.mock('@/store/themeStore');
vi.mock('@/store/weatherStore');
vi.mock('@/utils/weather/getWeatherGradient');
vi.mock('@/components/weather/hooks/useWeatherData');
vi.mock('@/components/weather/hooks/useCitySearch');
vi.mock('@/components/weather/hooks/useUserLocation');
vi.mock('@/hooks/useDynamicIcon');

describe('useWeather', () => {
  // Mock functions
  let mockSetLoading: ReturnType<typeof vi.fn>;
  let mockLoadWeather: ReturnType<typeof vi.fn>;
  let mockSetQuery: ReturnType<typeof vi.fn>;
  let mockHandleUseCurrentLocation: ReturnType<typeof vi.fn>;
  let mockResetIcon: ReturnType<typeof vi.fn>;
  let mockSetSearchResults: ReturnType<typeof vi.fn>;
  let mockSetError: ReturnType<typeof vi.fn>;

  // Mock weather data
  const mockWeatherData = {
    current: {
      dt: 1640000000,
      sunrise: 1639990000,
      sunset: 1640030000,
      temp: 20,
      weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }]
    },
    daily: [],
    hourly: []
  };

  const mockAirQuality = {
    list: [{ main: { aqi: 2 }, components: {} }]
  };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Mock functions
    mockSetLoading = vi.fn();
    mockLoadWeather = vi.fn().mockResolvedValue(undefined);
    mockSetQuery = vi.fn();
    mockHandleUseCurrentLocation = vi.fn().mockResolvedValue(undefined);
    mockResetIcon = vi.fn();
    mockSetSearchResults = vi.fn();
    mockSetError = vi.fn();

    // Mock useLoadingStore
    vi.mocked(useLoadingStore).mockReturnValue(mockSetLoading as any);

    // Mock useThemeStore
    vi.mocked(useThemeStore).mockReturnValue(false); // isDarkMode = false

    // Mock useWeatherStore
    vi.mocked(useWeatherStore).mockReturnValue({
      weatherData: null,
      airQuality: null,
      error: null,
      cityName: '',
      isLoadingLocation: false,
      isRateLimited: false,
      searchResults: [],
      isSearching: false,
      isLoading: false,
      isNighttime: false,
      setError: mockSetError,
    } as any);

    // Mock derived properties separately for getState
    (useWeatherStore as any).getState = vi.fn().mockReturnValue({
      setSearchResults: mockSetSearchResults,
    });

    // Mock useWeatherData
    vi.mocked(useWeatherData).mockReturnValue({
      loadWeather: mockLoadWeather,
    } as any);

    // Mock useCitySearch
    vi.mocked(useCitySearch).mockReturnValue({
        query: '',
        setQuery: mockSetQuery,
    }as any);

    // Mock useUserLocation
    vi.mocked(useUserLocation).mockReturnValue({
      handleUseCurrentLocation: mockHandleUseCurrentLocation,
    }as any);

    // Mock useDynamicIcon
    vi.mocked(useDynamicIcon).mockReturnValue({
      resetIcon: mockResetIcon,
    } as any);

    // Mock getWeatherGradient
    vi.mocked(getWeatherGradient).mockReturnValue('from-blue-400 to-blue-600');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initialization and Setup', () => {
    it('should initialize with default values from stores', () => {
      const { result } = renderHook(() => useWeather());

      expect(result.current.weatherData).toBeNull();
      expect(result.current.airQuality).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.cityName).toBe('');
      expect(result.current.isLoadingLocation).toBe(false);
      expect(result.current.isRateLimited).toBe(false);
      expect(result.current.results).toEqual([]);
      expect(result.current.isSearching).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isNighttime).toBe(false);
      expect(result.current.query).toBe('');
    });

    it('should load Medellin weather on mount', async () => {
      renderHook(() => useWeather());

      await waitFor(() => {
        expect(mockLoadWeather).toHaveBeenCalledWith(6.251, -75.5636, 'Medellin');
      });
    });

    it('should set loading to false on mount', async () => {
      renderHook(() => useWeather());

      await waitFor(() => {
        expect(mockSetLoading).toHaveBeenCalledWith(false);
      });
    });

    it('should reset icon on unmount', () => {
      const { unmount } = renderHook(() => useWeather());

      unmount();

      expect(mockResetIcon).toHaveBeenCalled();
    });

    it('should get isDarkMode from theme store', () => {
      vi.mocked(useThemeStore).mockReturnValue(true);

      renderHook(() => useWeather());

      expect(useThemeStore).toHaveBeenCalled();
    });

    it('should call all required hooks on initialization', () => {
      renderHook(() => useWeather());

      expect(useLoadingStore).toHaveBeenCalled();
      expect(useThemeStore).toHaveBeenCalled();
      expect(useWeatherStore).toHaveBeenCalled();
      expect(useWeatherData).toHaveBeenCalled();
      expect(useCitySearch).toHaveBeenCalled();
      expect(useUserLocation).toHaveBeenCalled();
      expect(useDynamicIcon).toHaveBeenCalled();
    });
  });

  describe('backgroundGradient calculation', () => {
    it('should return default gradient when weatherData is null', () => {
      const { result } = renderHook(() => useWeather());

      expect(result.current.backgroundGradient).toBe('from-blue-200 via-cyan-100 to-blue-100');
    });

    it('should calculate gradient when weatherData exists', () => {
      vi.mocked(useWeatherStore).mockReturnValue({
        weatherData: mockWeatherData,
        airQuality: null,
        error: null,
        cityName: 'Medellin',
        isLoadingLocation: false,
        isRateLimited: false,
        searchResults: [],
        isSearching: false,
        isLoading: false,
        isNighttime: false,
        setError: mockSetError,
      } as any);

      const { result } = renderHook(() => useWeather());

      expect(getWeatherGradient).toHaveBeenCalledWith(
        'Clear',
        true, // is daytime (dt > sunrise && dt < sunset)
        false // isDarkMode
      );
      expect(result.current.backgroundGradient).toBe('from-blue-400 to-blue-600');
    });

    it('should calculate daytime correctly', () => {
      const daytimeWeatherData = {
        current: {
          dt: 1640010000, // Between sunrise and sunset
          sunrise: 1639990000,
          sunset: 1640030000,
          temp: 20,
          weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }]
        },
        daily: [],
        hourly: []
      };

      vi.mocked(useWeatherStore).mockReturnValue({
        weatherData: daytimeWeatherData,
        airQuality: null,
        error: null,
        cityName: 'Medellin',
        isLoadingLocation: false,
        isRateLimited: false,
        searchResults: [],
        isSearching: false,
        isLoading: false,
        isNighttime: false,
        setError: mockSetError,
      } as any);

      renderHook(() => useWeather());

      expect(getWeatherGradient).toHaveBeenCalledWith(
        'Clear',
        true, // daytime
        false
      );
    });

    it('should calculate nighttime correctly', () => {
      const nighttimeWeatherData = {
        current: {
          dt: 1640040000, // After sunset
          sunrise: 1639990000,
          sunset: 1640030000,
          temp: 15,
          weather: [{ main: 'Clear', description: 'clear sky', icon: '01n' }]
        },
        daily: [],
        hourly: []
      };

      vi.mocked(useWeatherStore).mockReturnValue({
        weatherData: nighttimeWeatherData,
        airQuality: null,
        error: null,
        cityName: 'Medellin',
        isLoadingLocation: false,
        isRateLimited: false,
        searchResults: [],
        isSearching: false,
        isLoading: false,
        isNighttime: true,
        setError: mockSetError,
      } as any);

      renderHook(() => useWeather());

      expect(getWeatherGradient).toHaveBeenCalledWith(
        'Clear',
        false, // nighttime
        false
      );
    });

    it('should pass isDarkMode to gradient calculation', () => {
      vi.mocked(useThemeStore).mockReturnValue(true); // Dark mode ON
      vi.mocked(useWeatherStore).mockReturnValue({
        weatherData: mockWeatherData,
        airQuality: null,
        error: null,
        cityName: 'Medellin',
        isLoadingLocation: false,
        isRateLimited: false,
        searchResults: [],
        isSearching: false,
        isLoading: false,
        isNighttime: false,
        setError: mockSetError,
      } as any);

      renderHook(() => useWeather());

      expect(getWeatherGradient).toHaveBeenCalledWith(
        'Clear',
        true,
        true // isDarkMode
      );
    });

    it('should handle different weather conditions', () => {
      const weatherConditions = ['Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm'];

      weatherConditions.forEach(condition => {
        const weatherData = {
          ...mockWeatherData,
          current: {
            ...mockWeatherData.current,
            weather: [{ main: condition, description: '', icon: '' }]
          }
        };

        vi.mocked(useWeatherStore).mockReturnValue({
          weatherData,
          airQuality: null,
          error: null,
          cityName: 'Test City',
          isLoadingLocation: false,
          isRateLimited: false,
          searchResults: [],
          isSearching: false,
          isLoading: false,
          isNighttime: false,
          setError: mockSetError,
        } as any);

        renderHook(() => useWeather());

        expect(getWeatherGradient).toHaveBeenCalledWith(
          condition,
          expect.any(Boolean),
          expect.any(Boolean)
        );
      });
    });
  });

  describe('handleCitySelect', () => {
    it('should load weather for selected city with state', async () => {
      const { result } = renderHook(() => useWeather());

      const cityResult = {
        name: 'New York',
        state: 'NY',
        country: 'US',
        lat: 40.7128,
        lon: -74.006
      };

      await act(async () => {
        result.current.handleCitySelect(cityResult);
      });

      expect(mockLoadWeather).toHaveBeenCalledWith(
        40.7128,
        -74.006,
        'New York, NY, US'
      );
    });

    it('should load weather for selected city without state', async () => {
      const { result } = renderHook(() => useWeather());

      const cityResult = {
        name: 'Tokyo',
        country: 'JP',
        lat: 35.6762,
        lon: 139.6503
      };

      await act(async () => {
        result.current.handleCitySelect(cityResult);
      });

      expect(mockLoadWeather).toHaveBeenCalledWith(
        35.6762,
        139.6503,
        'Tokyo, JP'
      );
    });

    it('should clear search results after city selection', async () => {
      const { result } = renderHook(() => useWeather());

      const cityResult = {
        name: 'London',
        country: 'GB',
        lat: 51.5074,
        lon: -0.1278
      };

      await act(async () => {
        result.current.handleCitySelect(cityResult);
      });

      expect(mockSetSearchResults).toHaveBeenCalledWith([]);
    });

    it('should be memoized with useCallback', () => {
      const { result, rerender } = renderHook(() => useWeather());

      const firstCallback = result.current.handleCitySelect;
      rerender();
      const secondCallback = result.current.handleCitySelect;

      expect(firstCallback).toBe(secondCallback);
    });

    it('should handle cities with special characters', async () => {
      const { result } = renderHook(() => useWeather());

      const cityResult = {
        name: 'São Paulo',
        state: 'SP',
        country: 'BR',
        lat: -23.5505,
        lon: -46.6333
      };

      await act(async () => {
        result.current.handleCitySelect(cityResult);
      });

      expect(mockLoadWeather).toHaveBeenCalledWith(
        -23.5505,
        -46.6333,
        'São Paulo, SP, BR'
      );
    });

    it('should handle negative coordinates', async () => {
      const { result } = renderHook(() => useWeather());

      const cityResult = {
        name: 'Buenos Aires',
        country: 'AR',
        lat: -34.6037,
        lon: -58.3816
      };

      await act(async () => {
        result.current.handleCitySelect(cityResult);
      });

      expect(mockLoadWeather).toHaveBeenCalledWith(
        -34.6037,
        -58.3816,
        'Buenos Aires, AR'
      );
    });
  });

  describe('handleSearchChange', () => {
    it('should update query when search changes', () => {
      const { result } = renderHook(() => useWeather());

      act(() => {
        result.current.handleSearchChange('Paris');
      });

      expect(mockSetQuery).toHaveBeenCalledWith('Paris');
    });

    it('should handle empty string', () => {
      const { result } = renderHook(() => useWeather());

      act(() => {
        result.current.handleSearchChange('');
      });

      expect(mockSetQuery).toHaveBeenCalledWith('');
    });

    it('should be memoized with useCallback', () => {
      const { result, rerender } = renderHook(() => useWeather());

      const firstCallback = result.current.handleSearchChange;
      rerender();
      const secondCallback = result.current.handleSearchChange;

      expect(firstCallback).toBe(secondCallback);
    });

    it('should handle special characters in search', () => {
      const { result } = renderHook(() => useWeather());

      act(() => {
        result.current.handleSearchChange('Zürich');
      });

      expect(mockSetQuery).toHaveBeenCalledWith('Zürich');
    });

    it('should handle long search queries', () => {
      const { result } = renderHook(() => useWeather());

      const longQuery = 'A'.repeat(100);

      act(() => {
        result.current.handleSearchChange(longQuery);
      });

      expect(mockSetQuery).toHaveBeenCalledWith(longQuery);
    });
  });

  describe('Returned values and functions', () => {
    it('should expose all necessary weather data', () => {
      vi.mocked(useWeatherStore).mockReturnValue({
        weatherData: mockWeatherData,
        airQuality: mockAirQuality,
        error: null,
        cityName: 'Medellin',
        isLoadingLocation: false,
        isRateLimited: false,
        searchResults: [{ name: 'Test', country: 'TS', lat: 0, lon: 0 }],
        isSearching: true,
        isLoading: false,
        isNighttime: false,
        setError: mockSetError,
      } as any);

      vi.mocked(useCitySearch).mockReturnValue({
        query: 'Test query',
        setQuery: mockSetQuery,
      } as any);

      const { result } = renderHook(() => useWeather());

      expect(result.current.weatherData).toEqual(mockWeatherData);
      expect(result.current.airQuality).toEqual(mockAirQuality);
      expect(result.current.error).toBeNull();
      expect(result.current.cityName).toBe('Medellin');
      expect(result.current.isLoadingLocation).toBe(false);
      expect(result.current.isRateLimited).toBe(false);
      expect(result.current.results).toHaveLength(1);
      expect(result.current.isSearching).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isNighttime).toBe(false);
      expect(result.current.query).toBe('Test query');
    });

    it('should expose all necessary functions', () => {
      const { result } = renderHook(() => useWeather());

      expect(result.current.handleSearchChange).toBeDefined();
      expect(result.current.setError).toBeDefined();
      expect(result.current.handleUseCurrentLocation).toBeDefined();
      expect(result.current.handleCitySelect).toBeDefined();

      expect(typeof result.current.handleSearchChange).toBe('function');
      expect(typeof result.current.setError).toBe('function');
      expect(typeof result.current.handleUseCurrentLocation).toBe('function');
      expect(typeof result.current.handleCitySelect).toBe('function');
    });

    it('should pass through handleUseCurrentLocation from useUserLocation', async () => {
      const { result } = renderHook(() => useWeather());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(mockHandleUseCurrentLocation).toHaveBeenCalled();
    });

    it('should pass through setError from useWeatherStore', () => {
      const { result } = renderHook(() => useWeather());

      act(() => {
        result.current.setError('Test error');
      });

      expect(mockSetError).toHaveBeenCalledWith('Test error');
    });
  });

  describe('Real-world usage scenarios', () => {
    it('should handle complete user flow: search → select → load weather', async () => {
      const { result } = renderHook(() => useWeather());

      // User types in search
      act(() => {
        result.current.handleSearchChange('London');
      });

      expect(mockSetQuery).toHaveBeenCalledWith('London');

      // User selects a city from results
      const cityResult = {
        name: 'London',
        country: 'GB',
        lat: 51.5074,
        lon: -0.1278
      };

      await act(async () => {
        result.current.handleCitySelect(cityResult);
      });

      expect(mockLoadWeather).toHaveBeenCalledWith(51.5074, -0.1278, 'London, GB');
      expect(mockSetSearchResults).toHaveBeenCalledWith([]);
    });

    it('should handle user requesting current location', async () => {
      const { result } = renderHook(() => useWeather());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(mockHandleUseCurrentLocation).toHaveBeenCalled();
    });

    it('should handle error state', () => {
      vi.mocked(useWeatherStore).mockReturnValue({
        weatherData: null,
        airQuality: null,
        error: 'API rate limit exceeded',
        cityName: '',
        isLoadingLocation: false,
        isRateLimited: true,
        searchResults: [],
        isSearching: false,
        isLoading: false,
        isNighttime: false,
        setError: mockSetError,
      } as any);

      const { result } = renderHook(() => useWeather());

      expect(result.current.error).toBe('API rate limit exceeded');
      expect(result.current.isRateLimited).toBe(true);
    });

    it('should handle loading states', () => {
      vi.mocked(useWeatherStore).mockReturnValue({
        weatherData: null,
        airQuality: null,
        error: null,
        cityName: '',
        isLoadingLocation: true,
        isRateLimited: false,
        searchResults: [],
        isSearching: true,
        isLoading: true,
        isNighttime: false,
        setError: mockSetError,
      } as any);

      const { result } = renderHook(() => useWeather());

      expect(result.current.isLoadingLocation).toBe(true);
      expect(result.current.isSearching).toBe(true);
      expect(result.current.isLoading).toBe(true);
    });

    it('should handle dark mode changes', () => {
      vi.mocked(useThemeStore).mockReturnValue(false);
      const { result, rerender } = renderHook(() => useWeather());

      expect(result.current.backgroundGradient).toBe('from-blue-200 via-cyan-100 to-blue-100');

      // Toggle dark mode
      vi.mocked(useThemeStore).mockReturnValue(true);
      vi.mocked(useWeatherStore).mockReturnValue({
        weatherData: mockWeatherData,
        airQuality: null,
        error: null,
        cityName: 'Medellin',
        isLoadingLocation: false,
        isRateLimited: false,
        searchResults: [],
        isSearching: false,
        isLoading: false,
        isNighttime: false,
        setError: mockSetError,
      } as any);

      rerender();

      expect(getWeatherGradient).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Boolean),
        true // isDarkMode now true
      );
    });
  });

  describe('Edge cases and cleanup', () => {
    it('should not crash when unmounting during async operations', async () => {
      const { unmount } = renderHook(() => useWeather());

      // Start async operation
      act(() => {
        // Trigger some async action
      });

      // Unmount immediately
      unmount();

      // Should not throw
      expect(() => unmount()).not.toThrow();
    });

    it('should handle rapid city selections', async () => {
      const { result } = renderHook(() => useWeather());

      const cities = [
        { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
        { name: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522 },
        { name: 'Berlin', country: 'DE', lat: 52.5200, lon: 13.4050 }
      ];

      await act(async () => {
        for (const city of cities) {
          result.current.handleCitySelect(city);
        }
      });

      expect(mockLoadWeather).toHaveBeenCalledTimes(3 + 1); // +1 for initial Medellin
    });

    it('should properly cleanup icon on unmount', () => {
      const { unmount } = renderHook(() => useWeather());

      unmount();

      expect(mockResetIcon).toHaveBeenCalledTimes(1);
    });

    it('should handle missing weatherData gracefully', () => {
      vi.mocked(useWeatherStore).mockReturnValue({
        weatherData: null,
        airQuality: null,
        error: null,
        cityName: '',
        isLoadingLocation: false,
        isRateLimited: false,
        searchResults: [],
        isSearching: false,
        isLoading: false,
        isNighttime: false,
        setError: mockSetError,
      } as any);

      const { result } = renderHook(() => useWeather());

      expect(result.current.backgroundGradient).toBe('from-blue-200 via-cyan-100 to-blue-100');
      expect(() => result.current.backgroundGradient).not.toThrow();
    });
  });

  describe('Performance and memoization', () => {
    it('should memoize handleCitySelect correctly', () => {
      const { result, rerender } = renderHook(() => useWeather());

      const callback1 = result.current.handleCitySelect;
      rerender();
      const callback2 = result.current.handleCitySelect;

      expect(callback1).toBe(callback2);
    });

    it('should memoize handleSearchChange correctly', () => {
      const { result, rerender } = renderHook(() => useWeather());

      const callback1 = result.current.handleSearchChange;
      rerender();
      const callback2 = result.current.handleSearchChange;

      expect(callback1).toBe(callback2);
    });

    it('should only run mount effect once', async () => {
      const { rerender } = renderHook(() => useWeather());

      await waitFor(() => {
        expect(mockLoadWeather).toHaveBeenCalledTimes(1);
      });

      rerender();
      rerender();
      rerender();

      // Should still be called only once
      expect(mockLoadWeather).toHaveBeenCalledTimes(1);
    });
  });
});