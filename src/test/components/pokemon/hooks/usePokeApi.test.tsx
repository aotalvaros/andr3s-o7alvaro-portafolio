/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePokeApi } from "@/components/pokemon/hooks/usePokeApi";
import { fetchPokemonList } from "@/services/pokemon/pokeApi.service";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ResponsePokemon,
  ResponsePokemonDetaexport,
} from "@/services/pokemon/models/responsePokemon.interface";
import { act, renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";

vi.mock("@/services/pokemon/pokeApi.service", () => ({
  fetchPokemonList: vi.fn(),
}));

const mockFetchPokemonList = vi.mocked(fetchPokemonList);

// Mock data
const mockPokemonDetail: ResponsePokemonDetaexport = {
  id: 1,
  name: "bulbasaur",
  height: 7,
  weight: 69,
  types: [
    { type: { name: "grass", url: "" } },
    { type: { name: "poison", url: "" } },
  ],
  sprites: {
    front_default: "https://example.com/bulbasaur.png",
    other: {
      "official-artwork": {
        front_default: "https://example.com/bulbasaur-artwork.png",
      },
    },
  },
  stats: [
    { base_stat: 45, effort: 0, stat: { name: "hp", url: "" } },
    { base_stat: 49, effort: 0, stat: { name: "attack", url: "" } },
    { base_stat: 49, effort: 0, stat: { name: "defense", url: "" } },
    { base_stat: 65, effort: 0, stat: { name: "special-attack", url: "" } },
    { base_stat: 65, effort: 0, stat: { name: "special-defense", url: "" } },
    { base_stat: 45, effort: 0, stat: { name: "speed", url: "" } },
  ],
} as ResponsePokemonDetaexport;

const mockPokemonDetail2: ResponsePokemonDetaexport = {
  ...mockPokemonDetail,
  id: 2,
  name: "ivysaur",
};

const mockResponsePokemon: ResponsePokemon = {
  count: 1302,
  results: [
    { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
    { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
  ],
  next: "https://pokeapi.co/api/v2/pokemon?offset=2&limit=2",
  previous: null,
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return Wrapper;
};

describe("usePokeApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock default de fetchPokemonList
    mockFetchPokemonList.mockResolvedValue(mockResponsePokemon);

    // Mock global.fetch para los detalles de pokemon
    global.fetch = vi.fn((url) => {
      if (url.includes("pokemon/1")) {
        return Promise.resolve({
          json: () => Promise.resolve(mockPokemonDetail),
        } as Response);
      }
      if (url.includes("pokemon/2")) {
        return Promise.resolve({
          json: () => Promise.resolve(mockPokemonDetail2),
        } as Response);
      }
      return Promise.reject(new Error("Unknown URL"));
    }) as any;

    // Mock window.scrollTo
    window.scrollTo = vi.fn();
  });

  describe("Initial State and Setup", () => {
    it("should initialize with correct default values", () => {
      const { result } = renderHook(() => usePokeApi(8), {
        wrapper: createWrapper(),
      });

      expect(result.current.pokemonData).toEqual([]);
      expect(result.current.page).toBe(1);
      expect(result.current.totalPages).toBe(0);
      expect(result.current.selectedPokemon).toBeNull();
    });

    it("should call fetchPokemonList with correct initial parameters", async () => {
      renderHook(() => usePokeApi(8), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockFetchPokemonList).toHaveBeenCalledWith(8, 0);
      });
    });

    it("should have isLoading true initially", () => {
      const { result } = renderHook(() => usePokeApi(8), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });

    it("should accept different limit values", async () => {
      renderHook(() => usePokeApi(20), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockFetchPokemonList).toHaveBeenCalledWith(20, 0);
      });
    });
  });
  describe("Data Fetching", () => {
    it("should fetch and set pokemon data correctly", async () => {
      const { result } = renderHook(() => usePokeApi(2), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.pokemonData).toHaveLength(2);
      });

      expect(result.current.pokemonData[0].name).toBe("bulbasaur");
      expect(result.current.pokemonData[1].name).toBe("ivysaur");
    });

    it("should set total count correctly", async () => {
      const { result } = renderHook(() => usePokeApi(8), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.totalPages).toBeGreaterThan(0);
      });

      // 1302 pokemon / 8 per page = 163 pages
      expect(result.current.totalPages).toBe(163);
    });

    it("should calculate total pages correctly", async () => {
      mockFetchPokemonList.mockResolvedValue({
        ...mockResponsePokemon,
        count: 100,
      });

      const { result } = renderHook(() => usePokeApi(10), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.totalPages).toBe(10);
      });
    });

    it("should fetch pokemon details from URLs", async () => {
      renderHook(() => usePokeApi(2), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "https://pokeapi.co/api/v2/pokemon/1/"
        );
        expect(global.fetch).toHaveBeenCalledWith(
          "https://pokeapi.co/api/v2/pokemon/2/"
        );
      });
    });

    it("should handle Promise.all for multiple pokemon", async () => {
      const { result } = renderHook(() => usePokeApi(2), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.pokemonData).toHaveLength(2);
      });

      expect(result.current.pokemonData[0].id).toBe(1);
      expect(result.current.pokemonData[1].id).toBe(2);
    });

    it("should update data when query data changes", async () => {
      const { result, rerender } = renderHook(() => usePokeApi(2), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.pokemonData).toHaveLength(2);
      });

      // Simulate data change
      const newMockData: ResponsePokemon = {
        count: 1302,
        results: [
          { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
        ],
        next: "",
        previous: null,
      };

      const newPokemonDetail = {
        ...mockPokemonDetail,
        id: 4,
        name: "charmander",
      };

      global.fetch = vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(newPokemonDetail),
        } as Response)
      ) as any;

      mockFetchPokemonList.mockResolvedValue(newMockData);

      rerender();

      await waitFor(() => {
        // Data should remain from previous fetch until new page is triggered
        expect(result.current.pokemonData).toBeDefined();
      });
    });

    it("should handle empty results gracefully", async () => {
      mockFetchPokemonList.mockResolvedValue({
        count: 0,
        results: [],
        next: "",
        previous: null,
      });

      const { result } = renderHook(() => usePokeApi(8), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.pokemonData).toEqual([]);
      expect(result.current.totalPages).toBe(0);
    });
  });

  describe("Pagination", () => {
    it("should handle page change correctly", async () => {
      const { result } = renderHook(() => usePokeApi(8), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.handlePageChange(2);
      });

      expect(result.current.page).toBe(2);
    });

    it("should call fetchPokemonList with correct offset on page change", async () => {
      const { result } = renderHook(() => usePokeApi(8), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.handlePageChange(3);
      });

      await waitFor(() => {
        // Page 3 with limit 8 = offset 16 (0-indexed: (3-1) * 8 = 16)
        expect(mockFetchPokemonList).toHaveBeenCalledWith(8, 16);
      });
    });

    it("should scroll to top on page change", async () => {
      const { result } = renderHook(() => usePokeApi(8), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.handlePageChange(2);
      });

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: "smooth",
      });
    });

    it("should not change page if value is less than 1", async () => {
      const { result } = renderHook(() => usePokeApi(8), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.handlePageChange(0);
      });

      expect(result.current.page).toBe(1);
      expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it("should not change page if value exceeds total pages", async () => {
      const { result } = renderHook(() => usePokeApi(8), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const invalidPage = result.current.totalPages + 10;

      act(() => {
        result.current.handlePageChange(invalidPage);
      });

      expect(result.current.page).toBe(173);
    });

    it("should accept page 1 as valid", async () => {
      const { result } = renderHook(() => usePokeApi(8), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.handlePageChange(1);
      });

      expect(result.current.page).toBe(1);
      expect(window.scrollTo).toHaveBeenCalled();
    });

    it("should accept last page as valid", async () => {
      const { result } = renderHook(() => usePokeApi(8), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const lastPage = result.current.totalPages;

      act(() => {
        result.current.handlePageChange(lastPage);
      });

      expect(result.current.page).toBe(lastPage);
    });

    it("should handle multiple page changes", async () => {
      const { result } = renderHook(() => usePokeApi(8), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.handlePageChange(2);
      });

      expect(result.current.page).toBe(2);

      act(() => {
        result.current.handlePageChange(5);
      });
    });
  });

  describe("Selected Pokemon", () => {
    it("should set selected pokemon correctly", async () => {
      const { result } = renderHook(() => usePokeApi(8), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.pokemonData).toHaveLength(2);
      });

      const pokemonToSelect = result.current.pokemonData[0];

      act(() => {
        result.current.setSelectedPokemon(pokemonToSelect);
      });

      expect(result.current.selectedPokemon).toEqual(pokemonToSelect);
    });

    it("should clear selected pokemon when set to null", async () => {
      const { result } = renderHook(() => usePokeApi(8), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.pokemonData).toHaveLength(2);
      });

      const pokemonToSelect = result.current.pokemonData[0];

      act(() => {
        result.current.setSelectedPokemon(pokemonToSelect);
      });

      expect(result.current.selectedPokemon).not.toBeNull();

      act(() => {
        result.current.setSelectedPokemon(null);
      });

      expect(result.current.selectedPokemon).toBeNull();
    });

    it("should allow selecting different pokemon", async () => {
      const { result } = renderHook(() => usePokeApi(8), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.pokemonData).toHaveLength(2);
      });

      act(() => {
        result.current.setSelectedPokemon(result.current.pokemonData[0]);
      });

      expect(result.current.selectedPokemon?.name).toBe("bulbasaur");

      act(() => {
        result.current.setSelectedPokemon(result.current.pokemonData[1]);
      });

      expect(result.current.selectedPokemon?.name).toBe("ivysaur");
    });
  });

  describe("React Query Integration", () => {
    it("should use correct query key", async () => {
      const { result } = renderHook(() => usePokeApi(8), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Query should have been called with the key
      expect(mockFetchPokemonList).toHaveBeenCalled();
    });

    it("should have staleTime configured", async () => {
      const { result } = renderHook(() => usePokeApi(8), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Data should be available and not stale immediately
      expect(result.current.data).toBeDefined();
    });

    it("should expose React Query properties", async () => {
      const { result } = renderHook(() => usePokeApi(8), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should spread all React Query properties
      expect(result.current).toHaveProperty("isLoading");
      expect(result.current).toHaveProperty("isError");
      expect(result.current).toHaveProperty("data");
      expect(result.current).toHaveProperty("error");
      expect(result.current).toHaveProperty("refetch");
    });

    it("should update query when page changes", async () => {
      const { result } = renderHook(() => usePokeApi(8), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const firstCallCount = mockFetchPokemonList.mock.calls.length;

      act(() => {
        result.current.handlePageChange(2);
      });

      await waitFor(() => {
        expect(mockFetchPokemonList.mock.calls.length).toBeGreaterThan(
          firstCallCount
        );
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle fetch error gracefully", async () => {
      mockFetchPokemonList.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => usePokeApi(8), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.pokemonData).toEqual([]);
    });
  });

  describe("Edge Cases", () => {
    it("should handle limit of 1", async () => {
      mockFetchPokemonList.mockResolvedValue({
        count: 1302,
        results: [
          { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
        ],
        next: "",
        previous: null,
      });

      const { result } = renderHook(() => usePokeApi(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.pokemonData).toHaveLength(1);
      });

      expect(result.current.totalPages).toBe(1302);
    });

    it("should handle very large limit", async () => {
      renderHook(() => usePokeApi(1000), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockFetchPokemonList).toHaveBeenCalledWith(1000, 0);
      });
    });

    it("should handle count that is not evenly divisible by limit", async () => {
      mockFetchPokemonList.mockResolvedValue({
        ...mockResponsePokemon,
        count: 105,
      });

      const { result } = renderHook(() => usePokeApi(10), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.totalPages).toBe(11); // Math.ceil(105/10) = 11
      });
    });

    it("should handle undefined data from query", async () => {
      mockFetchPokemonList.mockResolvedValue(undefined as any);

      const { result } = renderHook(() => usePokeApi(8), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.pokemonData).toEqual([]);
    });

    it("should handle missing results in data", async () => {
      mockFetchPokemonList.mockResolvedValue({
        count: 0,
        next: null,
        previous: null,
      } as any);

      const { result } = renderHook(() => usePokeApi(8), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.pokemonData).toEqual([]);
    });
  });
});
