import { useUserLocation } from '../../../../components/weather/hooks/useUserLocation';
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useWeatherStore } from '@/store/weatherStore';
import { getUserLocation } from '@/services/weather';
import { useWeatherData } from '@/components/weather/hooks/useWeatherData';

// Mock dependencies
vi.mock('@/store/weatherStore');
vi.mock('@/services/weather');
vi.mock('@/components/weather/hooks/useWeatherData');

describe('useUserLocation', () => {
  let mockSetIsLoadingLocation: ReturnType<typeof vi.fn>;
  let mockSetError: ReturnType<typeof vi.fn>;
  let mockLoadWeather: ReturnType<typeof vi.fn>;
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    mockSetIsLoadingLocation = vi.fn();
    mockSetError = vi.fn();
    mockLoadWeather = vi.fn().mockResolvedValue(undefined);

    // Mock useWeatherStore
    vi.mocked(useWeatherStore).mockReturnValue({
      setIsLoadingLocation: mockSetIsLoadingLocation,
      setError: mockSetError,
    } as any);

    // Mock useWeatherData
    vi.mocked(useWeatherData).mockReturnValue({
      loadWeather: mockLoadWeather,
    } as any);

    // Mock getUserLocation
    vi.mocked(getUserLocation).mockResolvedValue({
      lat: 40.7128,
      lon: -74.0060
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy.mockClear();
  });

  describe('Basic functionality', () => {
    it('should return handleUseCurrentLocation function', () => {
      const { result } = renderHook(() => useUserLocation());

      expect(result.current.handleUseCurrentLocation).toBeDefined();
      expect(typeof result.current.handleUseCurrentLocation).toBe('function');
    });

    it('should get dependencies from stores and hooks', () => {
      renderHook(() => useUserLocation());

      expect(useWeatherStore).toHaveBeenCalled();
      expect(useWeatherData).toHaveBeenCalled();
    });

    it('should memoize handleUseCurrentLocation with useCallback', () => {
      const { result, rerender } = renderHook(() => useUserLocation());

      const firstFunction = result.current.handleUseCurrentLocation;
      rerender();
      const secondFunction = result.current.handleUseCurrentLocation;

      // Should be the same function reference
      expect(firstFunction).toBe(secondFunction);
    });
  });

  describe('handleUseCurrentLocation - Success flow', () => {
    it('should set loading to true at start', async () => {
      const { result } = renderHook(() => useUserLocation());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(mockSetIsLoadingLocation).toHaveBeenCalledWith(true);
    });

    it('should call getUserLocation to get coordinates', async () => {
      const { result } = renderHook(() => useUserLocation());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(getUserLocation).toHaveBeenCalled();
    });

    it('should call loadWeather with coordinates and label', async () => {
      vi.mocked(getUserLocation).mockResolvedValue({
        lat: 40.7128,
        lon: -74.0060
      });

      const { result } = renderHook(() => useUserLocation());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(mockLoadWeather).toHaveBeenCalledWith(
        40.7128,
        -74.0060,
        'Tu ubicación'
      );
    });

    it('should set loading to false after success', async () => {
      const { result } = renderHook(() => useUserLocation());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(mockSetIsLoadingLocation).toHaveBeenCalledWith(false);
    });

    it('should NOT set error on success', async () => {
      const { result } = renderHook(() => useUserLocation());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(mockSetError).not.toHaveBeenCalled();
    });

    it('should handle different coordinates', async () => {
      // Tokyo coordinates
      vi.mocked(getUserLocation).mockResolvedValue({
        lat: 35.6762,
        lon: 139.6503
      });

      const { result } = renderHook(() => useUserLocation());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(mockLoadWeather).toHaveBeenCalledWith(
        35.6762,
        139.6503,
        'Tu ubicación'
      );
    });

    it('should handle negative coordinates', async () => {
      // Buenos Aires coordinates
      vi.mocked(getUserLocation).mockResolvedValue({
        lat: -34.6037,
        lon: -58.3816
      });

      const { result } = renderHook(() => useUserLocation());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(mockLoadWeather).toHaveBeenCalledWith(
        -34.6037,
        -58.3816,
        'Tu ubicación'
      );
    });

    it('should execute in correct order: loading → getUserLocation → loadWeather → done', async () => {
      const callOrder: string[] = [];

      mockSetIsLoadingLocation.mockImplementation((value) => {
        callOrder.push(value ? 'loading-start' : 'loading-end');
      });

      vi.mocked(getUserLocation).mockImplementation(async () => {
        callOrder.push('getUserLocation');
        return { lat: 40.7128, lon: -74.0060 };
      });

      mockLoadWeather.mockImplementation(async () => {
        callOrder.push('loadWeather');
      });

      const { result } = renderHook(() => useUserLocation());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(callOrder).toEqual([
        'loading-start',
        'getUserLocation',
        'loadWeather',
        'loading-end'
      ]);
    });
  });

  describe('handleUseCurrentLocation - Error handling', () => {
    it('should handle getUserLocation error', async () => {
      const locationError = new Error('User denied geolocation');
      vi.mocked(getUserLocation).mockRejectedValue(locationError);

      const { result } = renderHook(() => useUserLocation());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(console.error).toHaveBeenCalledWith('Error getting location:', locationError);
    });

    it('should set error message when getUserLocation fails', async () => {
      vi.mocked(getUserLocation).mockRejectedValue(new Error('Permission denied'));

      const { result } = renderHook(() => useUserLocation());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(mockSetError).toHaveBeenCalledWith(
        'No se pudo obtener tu ubicación. Por favor permite el acceso.'
      );
    });

    it('should set loading to false even when getUserLocation fails', async () => {
      vi.mocked(getUserLocation).mockRejectedValue(new Error('Error'));

      const { result } = renderHook(() => useUserLocation());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(mockSetIsLoadingLocation).toHaveBeenCalledWith(false);
    });

    it('should NOT call loadWeather when getUserLocation fails', async () => {
      vi.mocked(getUserLocation).mockRejectedValue(new Error('Error'));

      const { result } = renderHook(() => useUserLocation());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(mockLoadWeather).not.toHaveBeenCalled();
    });

    it('should handle loadWeather error', async () => {
      vi.mocked(getUserLocation).mockResolvedValue({ lat: 40.7128, lon: -74.0060 });
      const weatherError = new Error('Failed to load weather');
      mockLoadWeather.mockRejectedValue(weatherError);

      const { result } = renderHook(() => useUserLocation());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(console.error).toHaveBeenCalledWith('Error getting location:', weatherError);
      expect(mockSetError).toHaveBeenCalled();
    });

    it('should set loading to false even when loadWeather fails', async () => {
      mockLoadWeather.mockRejectedValue(new Error('Weather API error'));

      const { result } = renderHook(() => useUserLocation());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(mockSetIsLoadingLocation).toHaveBeenCalledWith(false);
    });

    it('should handle permission denied error', async () => {
      const permissionError = new Error('User denied Geolocation');
      vi.mocked(getUserLocation).mockRejectedValue(permissionError);

      const { result } = renderHook(() => useUserLocation());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(mockSetError).toHaveBeenCalledWith(
        'No se pudo obtener tu ubicación. Por favor permite el acceso.'
      );
    });

    it('should handle timeout error', async () => {
      const timeoutError = new Error('Geolocation timeout');
      vi.mocked(getUserLocation).mockRejectedValue(timeoutError);

      const { result } = renderHook(() => useUserLocation());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(console.error).toHaveBeenCalledWith('Error getting location:', timeoutError);
    });

    it('should handle position unavailable error', async () => {
      const unavailableError = new Error('Position unavailable');
      vi.mocked(getUserLocation).mockRejectedValue(unavailableError);

      const { result } = renderHook(() => useUserLocation());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(mockSetError).toHaveBeenCalled();
    });
  });

  describe('useCallback dependencies', () => {
    it('should recreate callback when loadWeather changes', () => {
      const { result, rerender } = renderHook(() => useUserLocation());

      const firstCallback = result.current.handleUseCurrentLocation;

      // Change loadWeather
      const newLoadWeather = vi.fn().mockResolvedValue(undefined);
      vi.mocked(useWeatherData).mockReturnValue({
        loadWeather: newLoadWeather,
      } as any);

      rerender();

      const secondCallback = result.current.handleUseCurrentLocation;

      // Should be different function reference
      expect(firstCallback).not.toBe(secondCallback);
    });

    it('should recreate callback when setIsLoadingLocation changes', () => {
      const { result, rerender } = renderHook(() => useUserLocation());

      const firstCallback = result.current.handleUseCurrentLocation;

      // Change setIsLoadingLocation
      const newSetIsLoadingLocation = vi.fn();
      vi.mocked(useWeatherStore).mockReturnValue({
        setIsLoadingLocation: newSetIsLoadingLocation,
        setError: mockSetError,
      } as any);

      rerender();

      const secondCallback = result.current.handleUseCurrentLocation;

      // Should be different function reference
      expect(firstCallback).not.toBe(secondCallback);
    });

    it('should recreate callback when setError changes', () => {
      const { result, rerender } = renderHook(() => useUserLocation());

      const firstCallback = result.current.handleUseCurrentLocation;

      // Change setError
      const newSetError = vi.fn();
      vi.mocked(useWeatherStore).mockReturnValue({
        setIsLoadingLocation: mockSetIsLoadingLocation,
        setError: newSetError,
      } as any);

      rerender();

      const secondCallback = result.current.handleUseCurrentLocation;

      // Should be different function reference
      expect(firstCallback).not.toBe(secondCallback);
    });
  });

  describe('Real-world usage scenarios', () => {
    it('should handle user clicking "Use my location" button', async () => {
      vi.mocked(getUserLocation).mockResolvedValue({
        lat: 6.2442,
        lon: -75.5812 // Medellín, Colombia
      });

      const { result } = renderHook(() => useUserLocation());

      // User clicks button
      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(mockSetIsLoadingLocation).toHaveBeenCalledWith(true);
      expect(mockLoadWeather).toHaveBeenCalledWith(6.2442, -75.5812, 'Tu ubicación');
      expect(mockSetIsLoadingLocation).toHaveBeenCalledWith(false);
    });

    it('should handle user denying location permission', async () => {
      vi.mocked(getUserLocation).mockRejectedValue(
        new Error('User denied geolocation prompt')
      );

      const { result } = renderHook(() => useUserLocation());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(mockSetError).toHaveBeenCalledWith(
        'No se pudo obtener tu ubicación. Por favor permite el acceso.'
      );
      expect(mockLoadWeather).not.toHaveBeenCalled();
    });

    it('should handle browser without geolocation support', async () => {
      vi.mocked(getUserLocation).mockRejectedValue(
        new Error('Geolocation is not supported')
      );

      const { result } = renderHook(() => useUserLocation());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(mockSetError).toHaveBeenCalled();
    });

    it('should handle multiple rapid clicks', async () => {
      const { result } = renderHook(() => useUserLocation());

      // User clicks multiple times rapidly
      await act(async () => {
        await Promise.all([
          result.current.handleUseCurrentLocation(),
          result.current.handleUseCurrentLocation(),
          result.current.handleUseCurrentLocation()
        ]);
      });

      // All three should complete
      expect(getUserLocation).toHaveBeenCalledTimes(3);
      expect(mockLoadWeather).toHaveBeenCalledTimes(3);
    });

    it('should work on mobile device', async () => {
      // Mobile GPS coordinates (more precise)
      vi.mocked(getUserLocation).mockResolvedValue({
        lat: 40.712776,
        lon: -74.005974
      });

      const { result } = renderHook(() => useUserLocation());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(mockLoadWeather).toHaveBeenCalledWith(
        40.712776,
        -74.005974,
        'Tu ubicación'
      );
    });

    it('should work on desktop device', async () => {
      // Desktop location (less precise, via WiFi)
      vi.mocked(getUserLocation).mockResolvedValue({
        lat: 40.71,
        lon: -74.01
      });

      const { result } = renderHook(() => useUserLocation());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(mockLoadWeather).toHaveBeenCalledWith(
        40.71,
        -74.01,
        'Tu ubicación'
      );
    });
  });

  describe('Edge cases', () => {
    it('should handle coordinates at equator and prime meridian', async () => {
      vi.mocked(getUserLocation).mockResolvedValue({
        lat: 0,
        lon: 0
      });

      const { result } = renderHook(() => useUserLocation());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(mockLoadWeather).toHaveBeenCalledWith(0, 0, 'Tu ubicación');
    });

    it('should handle extreme north coordinates', async () => {
      // North Pole area
      vi.mocked(getUserLocation).mockResolvedValue({
        lat: 89.9999,
        lon: 0
      });

      const { result } = renderHook(() => useUserLocation());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(mockLoadWeather).toHaveBeenCalledWith(89.9999, 0, 'Tu ubicación');
    });

    it('should handle extreme south coordinates', async () => {
      // South Pole area
      vi.mocked(getUserLocation).mockResolvedValue({
        lat: -89.9999,
        lon: 0
      });

      const { result } = renderHook(() => useUserLocation());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(mockLoadWeather).toHaveBeenCalledWith(-89.9999, 0, 'Tu ubicación');
    });

    it('should handle international date line coordinates', async () => {
      // Near date line
      vi.mocked(getUserLocation).mockResolvedValue({
        lat: 0,
        lon: 179.9999
      });

      const { result } = renderHook(() => useUserLocation());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(mockLoadWeather).toHaveBeenCalledWith(0, 179.9999, 'Tu ubicación');
    });

    it('should handle very precise coordinates', async () => {
      // GPS with high precision
      vi.mocked(getUserLocation).mockResolvedValue({
        lat: 40.71277576,
        lon: -74.00597402
      });

      const { result } = renderHook(() => useUserLocation());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      expect(mockLoadWeather).toHaveBeenCalledWith(
        40.71277576,
        -74.00597402,
        'Tu ubicación'
      );
    });

    it('should handle unmounting during location fetch', async () => {
      let resolveGetLocation: (value: any) => void;
      vi.mocked(getUserLocation).mockImplementation(
        () => new Promise((resolve) => {
          resolveGetLocation = resolve;
        })
      );

      const { result, unmount } = renderHook(() => useUserLocation());

      act(() => {
        result.current.handleUseCurrentLocation();
      });

      // Unmount before location is obtained
      unmount();

      // Should not throw error
      expect(() => unmount()).not.toThrow();
    });

    it('should always use "Tu ubicación" as label', async () => {
      const { result } = renderHook(() => useUserLocation());

      await act(async () => {
        await result.current.handleUseCurrentLocation();
      });

      // Third argument should always be this specific string
      expect(mockLoadWeather).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        'Tu ubicación'
      );
    });
  });

  describe('Performance', () => {
    it('should not create new callback on every render', () => {
      const { result, rerender } = renderHook(() => useUserLocation());

      const callback1 = result.current.handleUseCurrentLocation;
      rerender();
      const callback2 = result.current.handleUseCurrentLocation;
      rerender();
      const callback3 = result.current.handleUseCurrentLocation;

      // All should be the same reference
      expect(callback1).toBe(callback2);
      expect(callback2).toBe(callback3);
    });

    it('should cleanup properly on unmount', () => {
      const { unmount } = renderHook(() => useUserLocation());

      expect(() => unmount()).not.toThrow();
    });

    it('should handle concurrent calls efficiently', async () => {
      const { result } = renderHook(() => useUserLocation());

      const calls = Array.from({ length: 5 }, () =>
        act(async () => {
          await result.current.handleUseCurrentLocation();
        })
      );

      await Promise.all(calls);

      expect(getUserLocation).toHaveBeenCalledTimes(5);
    });
  });
});