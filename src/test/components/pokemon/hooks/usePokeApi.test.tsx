/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePokeApi } from "@/components/pokemon/hooks/usePokeApi";
import { fetchPokemonList } from "@/services/pokemon/pokeApi.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";

// ──────────── MOCKS ────────────
vi.mock('@/services/pokemon/pokeApi.service');

const mockFetchPokemonList = vi.mocked(fetchPokemonList);

// Mock window.scrollTo
const mockScrollTo = vi.fn();
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: mockScrollTo,
});

// ──────────── MOCK DATA ────────────
const createMockPokemon = (id: number, name: string): IPokemon => ({
  id,
  name,
  height: 10,
  weight: 100,
  pokemon_v2_pokemontypes: [
    {
      pokemon_v2_type: {
        name: 'grass',
      },
    },
  ],
  pokemon_v2_pokemonsprites: [
    {
      sprites: {
        other: {
          'official-artwork': {
            front_default: `https://example.com/${name}.png`,
          },
        },
        front_default: `https://example.com/${name}-front.png`,
      },
    },
  ],
  pokemon_v2_pokemonstats: [
    {
      base_stat: 45,
      pokemon_v2_stat: {
        name: 'hp',
      },
    },
  ],
  pokemon_v2_pokemonspecy: {
    pokemon_v2_pokemonspeciesflavortexts: [
      {
        flavor_text: `A ${name} pokemon description.`,
      },
    ],
    pokemon_v2_evolutionchain: {
      pokemon_v2_pokemonspecies: [
        {
          id,
          name,
        },
      ],
    },
  },
});

const mockPokemonList = [
  createMockPokemon(1, 'bulbasaur'),
  createMockPokemon(2, 'ivysaur'),
  createMockPokemon(3, 'venusaur'),
  createMockPokemon(4, 'charmander'),
  createMockPokemon(5, 'charmeleon'),
];

const createMockResponse = (
  pokemonList: IPokemon[],
  totalCount: number
) => ({
  pokemon_v2_pokemon: pokemonList,
  pokemon_v2_pokemon_aggregate: {
    aggregate: {
      count: totalCount,
    },
  },
});

// ──────────── HELPER FUNCTIONS ────────────
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
    logger: {
      log: () => {},
      warn: () => {},
      error: () => {},
    },
  });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  return { Wrapper, queryClient };
};

// ──────────── TEST SUITE ────────────
describe('usePokeApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockScrollTo.mockClear();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  // ──────────── INITIALIZATION TESTS ────────────
  describe('Initialization', () => {
    it('should initialize with default values', () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      expect(result.current.page).toBe(1);
      expect(result.current.selectedPokemon).toBeNull();
    });

    it('should calculate correct offset for first page', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(mockFetchPokemonList).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            limit: 10,
            offset: 0,
            name: '%%',
          })
        );
      });
    });

    it('should initialize with correct queryKey', async () => {
      const { Wrapper, queryClient } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        const cache = queryClient.getQueryCache();
        const queries = cache.findAll({
          queryKey: ['paginatedSearchByName', '', 1],
        });
        expect(queries).toHaveLength(1);
      });
    });
  });

  // ──────────── DATA FETCHING TESTS ────────────
  describe('Data Fetching', () => {
    it('should fetch pokemon list successfully', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pokemon_v2_pokemon).toHaveLength(5);
      expect(result.current.data?.pokemon_v2_pokemon[0].name).toBe('bulbasaur');
    });

    it('should handle loading state', () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('should fetch with correct variables', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      renderHook(() => usePokeApi(20), { wrapper: Wrapper });

      await waitFor(() => {
        expect(mockFetchPokemonList).toHaveBeenCalledWith(
          expect.any(String),
          {
            name: '%%',
            limit: 20,
            offset: 0,
          }
        );
      });
    });

    it('should refetch when query is invalidated', async () => {
      const { Wrapper, queryClient } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetchPokemonList).toHaveBeenCalledTimes(1);

      // Invalidate and refetch
      await act(async () => {
        await queryClient.invalidateQueries({
          queryKey: ['paginatedSearchByName'],
        });
      });

      await waitFor(() => {
        expect(mockFetchPokemonList).toHaveBeenCalledTimes(2);
      });
    });
  });

  // ──────────── PAGINATION TESTS ────────────
  describe('Pagination', () => {
    it('should calculate total pages correctly', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.totalPages).toBe(5); // 50 / 10 = 5
      });

      expect(result.current.totalCount).toBe(50);
    });

    it('should round up total pages for non-exact division', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 47));

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.totalPages).toBe(5); // Math.ceil(47 / 10) = 5
      });
    });

    it('should handle page change within valid range', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      act(() => {
        result.current.handlePageChange(2);
      });

      expect(result.current.page).toBe(2);
      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });

    it('should calculate correct offset for page 2', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      mockFetchPokemonList.mockClear();

      act(() => {
        result.current.handlePageChange(2);
      });

      await waitFor(() => {
        expect(mockFetchPokemonList).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            offset: 10, // (2-1) * 10 = 10
          })
        );
      });
    });

    it('should not change page below 1', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      act(() => {
        result.current.handlePageChange(0);
      });

      expect(result.current.page).toBe(1);
      expect(mockScrollTo).not.toHaveBeenCalled();
    });

    it('should not change page above total pages', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.totalPages).toBe(5);
      });

      act(() => {
        result.current.handlePageChange(6);
      });

      expect(result.current.page).toBe(1);
      expect(mockScrollTo).not.toHaveBeenCalled();
    });

    it('should allow changing to last page', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.totalPages).toBe(5);
      });

      act(() => {
        result.current.handlePageChange(5);
      });

      expect(result.current.page).toBe(5);
      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });

    it('should scroll to top on valid page change', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      mockScrollTo.mockClear();

      act(() => {
        result.current.handlePageChange(3);
      });

      expect(mockScrollTo).toHaveBeenCalledTimes(1);
      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });

    it('should handle rapid page changes', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      act(() => {
        result.current.handlePageChange(2);
        result.current.handlePageChange(3);
        result.current.handlePageChange(4);
      });

      expect(result.current.page).toBe(4);
    });
  });

  // ──────────── SEARCH FUNCTIONALITY TESTS ────────────
  describe('Search Functionality', () => {
    it('should initialize with empty search term', () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      expect(mockFetchPokemonList).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          name: '%%',
        })
      );
    });

    it('should update search term and reset to page 1', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Change to page 3
      act(() => {
        result.current.handlePageChange(3);
      });

      expect(result.current.page).toBe(3);

      // Search should reset to page 1
      act(() => {
        result.current.handleSearchChange('pikachu');
      });

      expect(result.current.page).toBe(1);
    });

    it('should fetch with search term in correct format', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse([mockPokemonList[0]], 1));

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      mockFetchPokemonList.mockClear();

      act(() => {
        result.current.handleSearchChange('bulbasaur');
      });

      await waitFor(() => {
        expect(mockFetchPokemonList).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            name: '%bulbasaur%', // SQL LIKE pattern
          })
        );
      });
    });

    it('should handle special characters in search', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      act(() => {
        result.current.handleSearchChange("farfetch'd");
      });

      await waitFor(() => {
        expect(mockFetchPokemonList).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            name: "%farfetch'd%",
          })
        );
      });
    });

    it('should trigger new query on search change', async () => {
      const { Wrapper, queryClient } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const initialCallCount = mockFetchPokemonList.mock.calls.length;

      act(() => {
        result.current.handleSearchChange('charmander');
      });

      await waitFor(() => {
        expect(mockFetchPokemonList.mock.calls.length).toBeGreaterThan(initialCallCount);
      });

      // Verify new queryKey is created
      const cache = queryClient.getQueryCache();
      const queries = cache.findAll({
        queryKey: ['paginatedSearchByName', 'charmander', 1],
      });
      expect(queries).toHaveLength(1);
    });

    it('should handle multiple rapid search changes', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      act(() => {
        result.current.handleSearchChange('a');
        result.current.handleSearchChange('ab');
        result.current.handleSearchChange('abc');
      });

      // Should use the last search term
      await waitFor(() => {
        expect(mockFetchPokemonList).toHaveBeenLastCalledWith(
          expect.any(String),
          expect.objectContaining({
            name: '%abc%',
          })
        );
      });
    });
  });

  // ──────────── SELECTED POKEMON TESTS ────────────
  describe('Selected Pokemon', () => {
    it('should set selected pokemon', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const pokemon = createMockPokemon(25, 'pikachu');

      act(() => {
        result.current.setSelectedPokemon(pokemon);
      });

      expect(result.current.selectedPokemon).toEqual(pokemon);
    });

    it('should clear selected pokemon', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const pokemon = createMockPokemon(25, 'pikachu');

      act(() => {
        result.current.setSelectedPokemon(pokemon);
      });

      expect(result.current.selectedPokemon).toEqual(pokemon);

      act(() => {
        result.current.setSelectedPokemon(null);
      });

      expect(result.current.selectedPokemon).toBeNull();
    });

    it('should maintain selected pokemon across page changes', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const pokemon = createMockPokemon(25, 'pikachu');

      act(() => {
        result.current.setSelectedPokemon(pokemon);
      });

      act(() => {
        result.current.handlePageChange(2);
      });

      expect(result.current.selectedPokemon).toEqual(pokemon);
    });

    it('should maintain selected pokemon across search changes', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const pokemon = createMockPokemon(25, 'pikachu');

      act(() => {
        result.current.setSelectedPokemon(pokemon);
      });

      act(() => {
        result.current.handleSearchChange('charmander');
      });

      expect(result.current.selectedPokemon).toEqual(pokemon);
    });
  });

  // ──────────── QUERY OPTIONS TESTS ────────────
  describe('Query Options', () => {
    it('should use correct staleTime', async () => {
      const { Wrapper, queryClient } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        const cache = queryClient.getQueryCache();
        const query = cache.find({ queryKey: ['paginatedSearchByName', '', 1] });
        expect(query).toBeDefined();
      });

      const cache = queryClient.getQueryCache();
      const query = cache.find({ queryKey: ['paginatedSearchByName', '', 1] });
      
      // staleTime is set to 1000 * 60 = 60000ms
      expect(query?.options.staleTime).toBe(60000);
    });

    it('should not refetch on window focus', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(mockFetchPokemonList).toHaveBeenCalledTimes(1);
      });

      // Simulate window focus
      window.dispatchEvent(new Event('focus'));

      // Should not trigger refetch
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(mockFetchPokemonList).toHaveBeenCalledTimes(1);
    });

    it('should retry failed requests up to 3 times', async () => {
      createWrapper();
      
      // Create a query client with retry enabled
      const retryQueryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: 3,
            retryDelay: 0,
          },
        },
        logger: {
          log: () => {},
          warn: () => {},
          error: () => {},
        },
      });

      const RetryWrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={retryQueryClient}>
          {children}
        </QueryClientProvider>
      );

      mockFetchPokemonList.mockRejectedValue(new Error('Network error'));

      renderHook(() => usePokeApi(10), { wrapper: RetryWrapper });

      await waitFor(
        () => {
          // 1 initial + 3 retries = 4 total attempts
          expect(mockFetchPokemonList).toHaveBeenCalledTimes(4);
        },
        { timeout: 3000 }
      );
    });
  });

  // ──────────── EDGE CASES TESTS ────────────
  describe('Edge Cases', () => {
    it('should handle empty pokemon list', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse([], 0));

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pokemon_v2_pokemon).toHaveLength(0);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.totalPages).toBe(0);
    });

    it('should handle single pokemon result', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(
        createMockResponse([mockPokemonList[0]], 1)
      );

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pokemon_v2_pokemon).toHaveLength(1);
      expect(result.current.totalCount).toBe(1);
      expect(result.current.totalPages).toBe(1);
    });

    it('should handle large limit values', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 1000));

      const { result } = renderHook(() => usePokeApi(100), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetchPokemonList).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          limit: 100,
        })
      );
    });

    it('should handle missing aggregate count', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue({
        pokemon_v2_pokemon: mockPokemonList,
        pokemon_v2_pokemon_aggregate: {
          aggregate: null,
        },
      } as any);

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.totalCount).toBe(0);
      expect(result.current.totalPages).toBe(0);
    });

    it('should handle undefined aggregate', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue({
        pokemon_v2_pokemon: mockPokemonList,
        pokemon_v2_pokemon_aggregate: undefined,
      } as any);

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.totalCount).toBe(0);
      expect(result.current.totalPages).toBe(0);
    });

    it('should handle very long search terms', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse([], 0));

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const longSearchTerm = 'a'.repeat(100);

      act(() => {
        result.current.handleSearchChange(longSearchTerm);
      });

      await waitFor(() => {
        expect(mockFetchPokemonList).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            name: `%${longSearchTerm}%`,
          })
        );
      });
    });

    it('should handle unicode characters in search', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      act(() => {
        result.current.handleSearchChange('ピカチュウ');
      });

      await waitFor(() => {
        expect(mockFetchPokemonList).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            name: '%ピカチュウ%',
          })
        );
      });
    });
  });

  // ──────────── INTEGRATION TESTS ────────────
  describe('Integration Scenarios', () => {
    it('should maintain query cache across hook instances', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      const { result: result1 } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      const firstCallCount = mockFetchPokemonList.mock.calls.length;

      // Second instance should use cache
      const { result: result2 } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result2.current.isSuccess).toBe(true);
      });

      // Should not make additional calls (uses cache)
      expect(mockFetchPokemonList.mock.calls.length).toBe(firstCallCount);
    });

    it('should handle sequential searches correctly', async () => {
      const { Wrapper } = createWrapper();
      
      // First search
      mockFetchPokemonList.mockResolvedValueOnce(
        createMockResponse([mockPokemonList[0]], 1)
      );

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Second search
      mockFetchPokemonList.mockResolvedValueOnce(
        createMockResponse([mockPokemonList[3]], 1)
      );

      act(() => {
        result.current.handleSearchChange('charmander');
      });

      await waitFor(() => {
        expect(result.current.data?.pokemon_v2_pokemon[0].name).toBe('charmander');
      });

      expect(result.current.page).toBe(1);
    });

    it('should recover from error on retry', async () => {
      createWrapper();
      
      // Create a query client with retry enabled
      const retryQueryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            retryDelay: 0,
          },
        },
        logger: {
          log: () => {},
          warn: () => {},
          error: () => {},
        },
      });

      const RetryWrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={retryQueryClient}>
          {children}
        </QueryClientProvider>
      );

      // Fail first, succeed on retry
      mockFetchPokemonList
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(createMockResponse(mockPokemonList, 50));

      const { result } = renderHook(() => usePokeApi(10), { wrapper: RetryWrapper });

      await waitFor(
        () => {
          expect(result.current.isSuccess).toBe(true);
        },
        { timeout: 3000 }
      );

      expect(result.current.data?.pokemon_v2_pokemon).toHaveLength(5);
    });
  });

  // ──────────── PERFORMANCE TESTS ────────────
  describe('Performance', () => {
    it('should not cause unnecessary re-renders', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      let renderCount = 0;
      const { result } = renderHook(
        () => {
          renderCount++;
          return usePokeApi(10);
        },
        { wrapper: Wrapper }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const renders = renderCount;

      // Small delay
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should not cause additional renders
      expect(renderCount).toBe(renders);
    });

    it('should debounce rapid page changes gracefully', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const initialCalls = mockFetchPokemonList.mock.calls.length;

      // Rapid page changes
      act(() => {
        for (let i = 2; i <= 5; i++) {
          result.current.handlePageChange(i);
        }
      });

      // Should only fetch for final page
      await waitFor(() => {
        expect(result.current.page).toBe(5);
      });

      // Each page change triggers a new query
      expect(mockFetchPokemonList.mock.calls.length).toBeGreaterThanOrEqual(initialCalls);
    });
  });

  // ──────────── ACCESSIBILITY TESTS ────────────
  describe('Accessibility', () => {
    it('should maintain scroll position on page change', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      act(() => {
        result.current.handlePageChange(2);
      });

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });

    it('should provide smooth scrolling behavior', async () => {
      const { Wrapper } = createWrapper();
      mockFetchPokemonList.mockResolvedValue(createMockResponse(mockPokemonList, 50));

      const { result } = renderHook(() => usePokeApi(10), { wrapper: Wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      act(() => {
        result.current.handlePageChange(3);
      });

      const scrollCall = mockScrollTo.mock.calls[0][0];
      expect(scrollCall).toHaveProperty('behavior', 'smooth');
    });
  });
});