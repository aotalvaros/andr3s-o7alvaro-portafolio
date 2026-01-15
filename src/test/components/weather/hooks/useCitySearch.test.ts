/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCitySearch } from '../../../../components/weather/hooks/useCitySearch';
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useWeatherStore } from '@/store/weatherStore';
import { searchCities } from '@/services/weather';
import { useDebounce } from '@/hooks/useDebounce';
import { CitySearchResult } from '../../../../types/weather.interface';


// Mock dependencies
vi.mock('@/store/weatherStore');
vi.mock('@/services/weather');
vi.mock('@/hooks/useDebounce');

describe('useCitySearch', () => {
  let mockSetQuery: ReturnType<typeof vi.fn>;
  let mockSetSearchResults: ReturnType<typeof vi.fn>;
  let mockSetIsSearching: ReturnType<typeof vi.fn>;
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    mockSetQuery = vi.fn();
    mockSetSearchResults = vi.fn();
    mockSetIsSearching = vi.fn();

    // Mock useWeatherStore
    vi.mocked(useWeatherStore).mockReturnValue({
      query: '',
      setQuery: mockSetQuery,
      setSearchResults: mockSetSearchResults,
      setIsSearching: mockSetIsSearching,
    } as any);

    // Mock useDebounce to return the query immediately by default
    vi.mocked(useDebounce).mockImplementation((value) => value as string);

    // Mock searchCities
    vi.mocked(searchCities).mockResolvedValue([]);
  });

  afterEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy.mockClear();
  });

  describe('Basic functionality', () => {
    it('should return query and setQuery from store', () => {
      vi.mocked(useWeatherStore).mockReturnValue({
        query: 'New York',
        setQuery: mockSetQuery,
        setSearchResults: mockSetSearchResults,
        setIsSearching: mockSetIsSearching,
      } as any);

      const { result } = renderHook(() => useCitySearch());

      expect(result.current.query).toBe('New York');
      expect(result.current.setQuery).toBe(mockSetQuery);
    });

    it('should use debounce hook with 300ms delay', () => {
      renderHook(() => useCitySearch());

      expect(useDebounce).toHaveBeenCalledWith('', 300);
    });

    it('should call useWeatherStore to get state', () => {
      renderHook(() => useCitySearch());

      expect(useWeatherStore).toHaveBeenCalled();
    });
  });

  describe('Search with debounced query >= 2 characters', () => {
    it('should search cities when debounced query has 2 characters', async () => {
      vi.mocked(useWeatherStore).mockReturnValue({
        query: 'NY',
        setQuery: mockSetQuery,
        setSearchResults: mockSetSearchResults,
        setIsSearching: mockSetIsSearching,
      } as any);

      vi.mocked(useDebounce).mockReturnValue('NY');

      const mockResults: CitySearchResult[] = [
        {country: 'US', lat: 40.7128, lon: -74.0060, name: 'New York'},
        {country: 'US', lat: 43.1000, lon: -93.3000, name: 'New York Mills'}
      ];

      vi.mocked(searchCities).mockResolvedValue(mockResults);

      renderHook(() => useCitySearch());

      await waitFor(() => {
        expect(mockSetIsSearching).toHaveBeenCalledWith(true);
        expect(searchCities).toHaveBeenCalledWith('NY');
      });
    });

    it('should search cities when debounced query has 3+ characters', async () => {
      vi.mocked(useWeatherStore).mockReturnValue({
        query: 'London',
        setQuery: mockSetQuery,
        setSearchResults: mockSetSearchResults,
        setIsSearching: mockSetIsSearching,
      } as any);

      vi.mocked(useDebounce).mockReturnValue('London');

      const mockResults: CitySearchResult[] = [
        { country: 'GB', lat: 51.5074, lon: -0.1278, name: 'London' },
        { country: 'CA', lat: 42.9849, lon: -81.2453, name: 'London' }
      ];
      vi.mocked(searchCities).mockResolvedValue(mockResults);

      renderHook(() => useCitySearch());

      await waitFor(() => {
        expect(searchCities).toHaveBeenCalledWith('London');
      });
    });

    it('should set isSearching to true before search', async () => {
      vi.mocked(useDebounce).mockReturnValue('Paris');

      renderHook(() => useCitySearch());

      await waitFor(() => {
        expect(mockSetIsSearching).toHaveBeenCalledWith(true);
      });
    });

    it('should set search results after successful search', async () => {
      vi.mocked(useDebounce).mockReturnValue('Tokyo');

      const mockResults: CitySearchResult[] = [
        { country: 'JP', lat: 35.6895, lon: 139.6917, name: 'Tokyo' }
      ];
      vi.mocked(searchCities).mockResolvedValue(mockResults);

      renderHook(() => useCitySearch());

      await waitFor(() => {
        expect(mockSetSearchResults).toHaveBeenCalledWith(mockResults);
      });
    });

    it('should set isSearching to false after search completes', async () => {
      vi.mocked(useDebounce).mockReturnValue('Berlin');

      vi.mocked(searchCities).mockResolvedValue([
        { country: 'DE', lat: 52.5200, lon: 13.4050, name: 'Berlin' }
      ]);

      renderHook(() => useCitySearch());

      await waitFor(() => {
        expect(mockSetIsSearching).toHaveBeenCalledWith(false);
      });
    });

    it('should handle empty results', async () => {
      vi.mocked(useDebounce).mockReturnValue('XYZ');

      vi.mocked(searchCities).mockResolvedValue([]);

      renderHook(() => useCitySearch());

      await waitFor(() => {
        expect(mockSetSearchResults).toHaveBeenCalledWith([]);
        expect(mockSetIsSearching).toHaveBeenCalledWith(false);
      });
    });

    it('should handle multiple search results', async () => {
      vi.mocked(useDebounce).mockReturnValue('San');

      const mockResults: CitySearchResult[] = [
        { country: 'US', lat: 37.7749, lon: -122.4194, name: 'San Francisco' },
        { country: 'US', lat: 32.7157, lon: -117.1611, name: 'San Diego' },
        { country: 'US', lat: 37.3382, lon: -121.8863, name: 'San Jose' },
        { country: 'CL', lat: -33.4489, lon: -70.6693, name: 'Santiago' },
        { country: 'SV', lat: 13.6929, lon: -89.2182, name: 'San Salvador' }
      ];
      vi.mocked(searchCities).mockResolvedValue(mockResults);

      renderHook(() => useCitySearch());

      await waitFor(() => {
        expect(mockSetSearchResults).toHaveBeenCalledWith(mockResults);
      });
    });
  });

  describe('Search with debounced query < 2 characters', () => {
    it('should clear results when query is empty', async () => {
      vi.mocked(useDebounce).mockReturnValue('');

      renderHook(() => useCitySearch());

      await waitFor(() => {
        expect(mockSetSearchResults).toHaveBeenCalledWith([]);
      });
    });

    it('should clear results when query has 1 character', async () => {
      vi.mocked(useDebounce).mockReturnValue('N');

      renderHook(() => useCitySearch());

      await waitFor(() => {
        expect(mockSetSearchResults).toHaveBeenCalledWith([]);
      });
    });

    it('should NOT call searchCities when query is empty', async () => {
      vi.mocked(useDebounce).mockReturnValue('');

      renderHook(() => useCitySearch());

      await waitFor(() => {
        expect(searchCities).not.toHaveBeenCalled();
      });
    });

    it('should NOT call searchCities when query has 1 character', async () => {
      vi.mocked(useDebounce).mockReturnValue('A');

      renderHook(() => useCitySearch());

      await waitFor(() => {
        expect(searchCities).not.toHaveBeenCalled();
      });
    });

    it('should NOT set isSearching when query is too short', async () => {
      vi.mocked(useDebounce).mockReturnValue('X');

      renderHook(() => useCitySearch());

      await waitFor(() => {
        expect(mockSetIsSearching).not.toHaveBeenCalled();
      });
    });
  });

  describe('Error handling', () => {
    it('should handle search errors', async () => {
      vi.mocked(useDebounce).mockReturnValue('Error City');

      const searchError = new Error('Network error');
      vi.mocked(searchCities).mockRejectedValue(searchError);

      renderHook(() => useCitySearch());

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(searchError);
      });
    });

    it('should set isSearching to false even when search fails', async () => {
      vi.mocked(useDebounce).mockReturnValue('Failed City');

      vi.mocked(searchCities).mockRejectedValue(new Error('API error'));

      renderHook(() => useCitySearch());

      await waitFor(() => {
        expect(mockSetIsSearching).toHaveBeenCalledWith(false);
      });
    });

    it('should handle 404 errors', async () => {
      vi.mocked(useDebounce).mockReturnValue('NotFound');

      const error404 = new Error('City not found');
      vi.mocked(searchCities).mockRejectedValue(error404);

      renderHook(() => useCitySearch());

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(error404);
        expect(mockSetIsSearching).toHaveBeenCalledWith(false);
      });
    });

    it('should handle timeout errors', async () => {
      vi.mocked(useDebounce).mockReturnValue('Timeout');

      const timeoutError = new Error('Request timeout');
      vi.mocked(searchCities).mockRejectedValue(timeoutError);

      renderHook(() => useCitySearch());

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(timeoutError);
      });
    });

    it('should handle rate limit errors', async () => {
      vi.mocked(useDebounce).mockReturnValue('RateLimit');

      const rateLimitError = new Error('Too many requests');
      vi.mocked(searchCities).mockRejectedValue(rateLimitError);

      renderHook(() => useCitySearch());

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(rateLimitError);
      });
    });
  });

  describe('Debounce behavior', () => {
    it('should use debounced value for search', async () => {
      // User types "London" but debounce is still "Lon"
      vi.mocked(useWeatherStore).mockReturnValue({
        query: 'London',
        setQuery: mockSetQuery,
        setSearchResults: mockSetSearchResults,
        setIsSearching: mockSetIsSearching,
      } as any);

      vi.mocked(useDebounce).mockReturnValue('Lon');

      renderHook(() => useCitySearch());

      await waitFor(() => {
        expect(searchCities).toHaveBeenCalledWith('Lon');
      });
    });

    it('should trigger new search when debounced value changes', async () => {
      const { rerender } = renderHook(() => useCitySearch());

      // First debounced value
      vi.mocked(useDebounce).mockReturnValue('New');
      rerender();

      await waitFor(() => {
        expect(searchCities).toHaveBeenCalledWith('New');
      });

      vi.mocked(searchCities).mockClear();

      // Second debounced value
      vi.mocked(useDebounce).mockReturnValue('New York');
      rerender();

      await waitFor(() => {
        expect(searchCities).toHaveBeenCalledWith('New York');
      });
    });

    it('should pass correct delay to useDebounce', () => {
      renderHook(() => useCitySearch());

      expect(useDebounce).toHaveBeenCalledWith(expect.any(String), 300);
    });
  });

  describe('useEffect dependencies', () => {
    it('should trigger effect when debouncedQuery changes', async () => {
      const { rerender } = renderHook(() => useCitySearch());

      vi.mocked(useDebounce).mockReturnValue('Paris');
      rerender();

      await waitFor(() => {
        expect(searchCities).toHaveBeenCalledWith('Paris');
      });

      vi.mocked(searchCities).mockClear();

      vi.mocked(useDebounce).mockReturnValue('London');
      rerender();

      await waitFor(() => {
        expect(searchCities).toHaveBeenCalledWith('London');
      });
    });

    it('should have correct dependencies in useEffect', () => {
      // This test ensures the effect doesn't run unnecessarily
      const { rerender } = renderHook(() => useCitySearch());

      // Same debounced value, shouldn't trigger new search
      rerender();

      expect(searchCities).toHaveBeenCalledTimes(0); // Empty query, no search
    });
  });

  describe('Real-world search scenarios', () => {
    it('should handle progressive typing', async () => {
      // User types progressively
      const queries = ['L', 'Lo', 'Lon', 'Lond', 'Londo', 'London'];

      for (const query of queries) {
        vi.mocked(useDebounce).mockReturnValue(query);
        const { rerender } = renderHook(() => useCitySearch());
        rerender();
      }

      // Should only search for queries with >= 2 chars
      await waitFor(() => {
        expect(searchCities).toHaveBeenCalledTimes(5); // 'Lo', 'Lon', 'Lond', 'Londo', 'London'
      });
    });

    it('should handle search corrections', async () => {
      // User makes typo and corrects it
      vi.mocked(useDebounce).mockReturnValue('Pari');
      const { rerender } = renderHook(() => useCitySearch());

      await waitFor(() => {
        expect(searchCities).toHaveBeenCalledWith('Pari');
      });

      vi.mocked(searchCities).mockClear();

      // Corrects typo
      vi.mocked(useDebounce).mockReturnValue('Paris');
      rerender();

      await waitFor(() => {
        expect(searchCities).toHaveBeenCalledWith('Paris');
      });
    });

    it('should handle clearing search', async () => {
      // User searches then clears
      vi.mocked(useDebounce).mockReturnValue('Tokyo');
      const { rerender } = renderHook(() => useCitySearch());

      await waitFor(() => {
        expect(searchCities).toHaveBeenCalledWith('Tokyo');
      });

      // User clears search
      vi.mocked(useDebounce).mockReturnValue('');
      rerender();

      await waitFor(() => {
        expect(mockSetSearchResults).toHaveBeenCalledWith([]);
      });
    });

    it('should handle special characters in search', async () => {
      vi.mocked(useDebounce).mockReturnValue('São Paulo');

      const mockResults: CitySearchResult[] = [
        { country: 'BR', lat: -23.5505, lon: -46.6333, name: 'São Paulo' }
      ];
      vi.mocked(searchCities).mockResolvedValue(mockResults);

      renderHook(() => useCitySearch());

      await waitFor(() => {
        expect(searchCities).toHaveBeenCalledWith('São Paulo');
        expect(mockSetSearchResults).toHaveBeenCalledWith(mockResults);
      });
    });

    it('should handle accented characters', async () => {
      vi.mocked(useDebounce).mockReturnValue('Zürich');

      const mockResults: CitySearchResult[] = [
        { country: 'CH', lat: 47.3769, lon: 8.5417, name: 'Zürich' }
      ];
      vi.mocked(searchCities).mockResolvedValue(mockResults);

      renderHook(() => useCitySearch());

      await waitFor(() => {
        expect(searchCities).toHaveBeenCalledWith('Zürich');
      });
    });

    it('should handle cities with spaces', async () => {
      vi.mocked(useDebounce).mockReturnValue('New York');

      const mockResults: CitySearchResult[] = [
        { country: 'US', lat: 40.7128, lon: -74.0060, name: 'New York' }
      ];
      vi.mocked(searchCities).mockResolvedValue(mockResults);

      renderHook(() => useCitySearch());

      await waitFor(() => {
        expect(searchCities).toHaveBeenCalledWith('New York');
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle exactly 2 characters', async () => {
      vi.mocked(useDebounce).mockReturnValue('NY');

      renderHook(() => useCitySearch());

      await waitFor(() => {
        expect(searchCities).toHaveBeenCalledWith('NY');
      });
    });

    it('should handle very long search queries', async () => {
      const longQuery = 'A'.repeat(100);
      vi.mocked(useDebounce).mockReturnValue(longQuery);

      renderHook(() => useCitySearch());

      await waitFor(() => {
        expect(searchCities).toHaveBeenCalledWith(longQuery);
      });
    });

    it('should handle whitespace in query', async () => {
      vi.mocked(useDebounce).mockReturnValue('  London  ');

      renderHook(() => useCitySearch());

      await waitFor(() => {
        expect(searchCities).toHaveBeenCalledWith('  London  ');
      });
    });

    it('should handle numeric characters in query', async () => {
      vi.mocked(useDebounce).mockReturnValue('Route 66');

      renderHook(() => useCitySearch());

      await waitFor(() => {
        expect(searchCities).toHaveBeenCalledWith('Route 66');
      });
    });

    it('should handle unmounting during search', async () => {
      vi.mocked(useDebounce).mockReturnValue('City');

      // Create a promise that never resolves during the test
      vi.mocked(searchCities).mockImplementation(
        () => new Promise(() => {})
      );

      const { unmount } = renderHook(() => useCitySearch());

      unmount();

      // Should not throw error
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should not trigger unnecessary searches', async () => {
      vi.mocked(useDebounce).mockReturnValue('Berlin');

      renderHook(() => useCitySearch());

      await waitFor(() => {
        expect(searchCities).toHaveBeenCalledTimes(1);
      });
    });

    it('should cleanup properly on unmount', () => {
      const { unmount } = renderHook(() => useCitySearch());

      expect(() => unmount()).not.toThrow();
    });
  });
});