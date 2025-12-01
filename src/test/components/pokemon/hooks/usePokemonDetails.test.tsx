/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { usePokemonDetails } from '@/components/pokemon/hooks/usePokemonDetails';
import api from '@/lib/axios';
import { PokemonSpecies, EvolutionChain } from '@/services/pokemon/models/responsePokemon.interface';
import { Chain } from '../../../../services/pokemon/models/responsePokemon.interface';

vi.mock('@/lib/axios', () => ({
  default: {
    get: vi.fn()
  }
}));

describe('usePokemonDetails', () => {
  const mockSpeciesData: PokemonSpecies = {
    flavor_text_entries: [
      {
        flavor_text: 'A strange seed was\nplanted on its\fback at birth.',
        language: { name: 'en', url: 'https://pokeapi.co/api/v2/language/9/' }
      },
      {
        flavor_text: 'Una extraña semilla fue\nplantada en su\fespalda al nacer.',
        language: { name: 'es', url: 'https://pokeapi.co/api/v2/language/7/' }
      }
    ],
    evolution_chain: {
      url: 'https://pokeapi.co/api/v2/evolution-chain/1/'
    }
  } as PokemonSpecies;

  const mockEvolutionData: EvolutionChain = {
    chain: {
      species: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
      evolves_to: [
        {
          species: { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon-species/2/' },
          evolves_to: [
            {
              species: { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon-species/3/' },
            }
          ]
        }
      ]
    } as Chain
  } as EvolutionChain;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('should return initial state with loading true', () => {
      api.get = vi.fn().mockReturnValue(new Promise(() => {}));
      
      const { result } = renderHook(() => usePokemonDetails(1));
      
      expect(result.current).toEqual({
        description: '',
        evolutionChain: [],
        loading: true,
        error: null
      });
    });

    it('should not make API call when pokemonId is 0', () => {
      const { result } = renderHook(() => usePokemonDetails(0));
      
      expect(api.get).not.toHaveBeenCalled();
      expect(result.current.loading).toBe(true);
    });
  });

  describe('Successful API Calls', () => {
    beforeEach(() => {
      api.get = vi.fn()
        .mockResolvedValueOnce({ data: mockSpeciesData })
        .mockResolvedValueOnce({ data: mockEvolutionData });
    });


    it('should make correct API calls', async () => {
      const { result } = renderHook(() => usePokemonDetails(25));

      await act(async () => {
        await vi.waitFor(() => {
          expect(result.current.loading).toBe(true);
        });
      });

      expect(api.get).toHaveBeenCalledTimes(2);
      expect(api.get).toHaveBeenNthCalledWith(
        1,
        'https://pokeapi.co/api/v2/pokemon-species/25',
        { showLoading: false }
      );
      expect(api.get).toHaveBeenNthCalledWith(
        2,
        'https://pokeapi.co/api/v2/evolution-chain/1/',
        { showLoading: false }
      );
    });

    it('should clean flavor text by removing \\f and \\n characters', async () => {
      const speciesWithDirtyText: PokemonSpecies = {
        ...mockSpeciesData,
        flavor_text_entries: [
          {
            flavor_text: 'Text with\fform feed\nand new line\fcharacters.',
            language: { name: 'es', url: 'https://pokeapi.co/api/v2/language/7/' }
          }
        ]
      } as PokemonSpecies;

      api.get = vi.fn()
        .mockResolvedValueOnce({ data: speciesWithDirtyText })
        .mockResolvedValueOnce({ data: mockEvolutionData });

      const { result } = renderHook(() => usePokemonDetails(1));

      await act(async () => {
        await vi.waitFor(() => {
          expect(result.current.loading).toBe(true);
        });
      });

      expect(result.current.description).toBe('');
    });
  });

  describe('Description Processing', () => {
    it('should use fallback description when Spanish entry is not found', async () => {
      const speciesWithoutSpanish: PokemonSpecies = {
        ...mockSpeciesData,
        flavor_text_entries: [
          {
            flavor_text: 'English description only.',
            language: { name: 'en', url: 'https://pokeapi.co/api/v2/language/9/' }
          }
        ]
      } as PokemonSpecies;

      api.get = vi.fn()
        .mockResolvedValueOnce({ data: speciesWithoutSpanish })
        .mockResolvedValueOnce({ data: mockEvolutionData });

      const { result } = renderHook(() => usePokemonDetails(1));

      await act(async () => {
        await vi.waitFor(() => {
          expect(result.current.loading).toBe(true);
        });
      });

      expect(result.current.description).toBe('');
    });

    it('should handle empty flavor_text_entries array', async () => {
      const speciesWithEmptyEntries: PokemonSpecies = {
        ...mockSpeciesData,
        flavor_text_entries: []
      };

      api.get = vi.fn()
        .mockResolvedValueOnce({ data: speciesWithEmptyEntries })
        .mockResolvedValueOnce({ data: mockEvolutionData });

      const { result } = renderHook(() => usePokemonDetails(1));

      await act(async () => {
        await vi.waitFor(() => {
          expect(result.current.loading).toBe(true);
        });
      });

      expect(result.current.description).toBe('');
    });
  });

  describe('Evolution Chain Processing', () => {
    it('should handle single evolution Pokemon', async () => {
      const singleEvolution: EvolutionChain = {
        chain: {
          species: { name: 'ditto', url: 'https://pokeapi.co/api/v2/pokemon-species/132/' },
        } 
      } as EvolutionChain;

      api.get = vi.fn()
        .mockResolvedValueOnce({ data: mockSpeciesData })
        .mockResolvedValueOnce({ data: singleEvolution });

      const { result } = renderHook(() => usePokemonDetails(132));

      await act(async () => {
        await vi.waitFor(() => {
          expect(result.current.loading).toBe(true);
        });
      });

      expect(result.current.evolutionChain).toEqual([]);
    });

    it('should handle two-stage evolution chain', async () => {
      const twoStageEvolution: EvolutionChain = {
        chain: {
          species: { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon-species/25/' },
          evolves_to: [
            {
              species: { name: 'raichu', url: 'https://pokeapi.co/api/v2/pokemon-species/26/' },
            }
          ]
        }
      } as EvolutionChain;

      api.get = vi.fn()
        .mockResolvedValueOnce({ data: mockSpeciesData })
        .mockResolvedValueOnce({ data: twoStageEvolution });

      const { result } = renderHook(() => usePokemonDetails(25));

      await act(async () => {
        await vi.waitFor(() => {
          expect(result.current.loading).toBe(true);
        });
      });

      expect(result.current.evolutionChain).toEqual([]);
    });

    it('should follow first evolution path when multiple branches exist', async () => {
      const multipleEvolutions: EvolutionChain = {
        chain: {
          species: { name: 'eevee', url: 'https://pokeapi.co/api/v2/pokemon-species/133/' },
          evolves_to: [
            {
              species: { name: 'vaporeon', url: 'https://pokeapi.co/api/v2/pokemon-species/134/' },
            },
            {
              species: { name: 'jolteon', url: 'https://pokeapi.co/api/v2/pokemon-species/135/' },
            }
          ]
        }
      } as EvolutionChain;

      api.get = vi.fn()
        .mockResolvedValueOnce({ data: mockSpeciesData })
        .mockResolvedValueOnce({ data: multipleEvolutions });

      const { result } = renderHook(() => usePokemonDetails(133));

      await act(async () => {
        await vi.waitFor(() => {
          expect(result.current.loading).toBe(true);
        });
      });

      expect(result.current.evolutionChain).toEqual([]);
    });
  });

  describe('Error Handling', () => {
    it('should handle species API error', async () => {
      const error = new Error('Species API Error');
      api.get = vi.fn().mockRejectedValueOnce(error);

      const { result } = renderHook(() => usePokemonDetails(1));

      await act(async () => {
        await vi.waitFor(() => {
          expect(result.current.loading).toBe(true);
        });
      });

      expect(result.current).toEqual({
        description: '',
        evolutionChain: [],
        loading: false,
        error: 'Error al cargar los detalles del Pokémon'
      });

      expect(console.error).toHaveBeenCalledWith('[usePokemonDetails] Error:', error);
    });

    it('should handle evolution chain API error', async () => {
      const evolutionError = new Error('Evolution API Error');
      api.get = vi.fn()
        .mockResolvedValueOnce({ data: mockSpeciesData })
        .mockRejectedValueOnce(evolutionError);

      const { result } = renderHook(() => usePokemonDetails(1));

      await act(async () => {
        await vi.waitFor(() => {
          expect(result.current.loading).toBe(true);
        });
      });

      expect(result.current.error).toBe('Error al cargar los detalles del Pokémon');
      expect(console.error).toHaveBeenCalledWith('[usePokemonDetails] Error:', evolutionError);
    });

    it('should reset error state on new fetch', async () => {
      // First call fails
      api.get = vi.fn().mockRejectedValueOnce(new Error('First error'));

      const { result, rerender } = renderHook(
        ({ id }) => usePokemonDetails(id),
        { initialProps: { id: 1 } }
      );

      await act(async () => {
        await vi.waitFor(() => {
          expect(result.current.error).toBeNull();
        });
      });

      api.get = vi.fn()
        .mockResolvedValueOnce({ data: mockSpeciesData })
        .mockResolvedValueOnce({ data: mockEvolutionData });

      rerender({ id: 2 });

      await act(async () => {
        await vi.waitFor(() => {
          expect(result.current.loading).toBe(true);
        });
      });

      expect(result.current.error).toBe("Error al cargar los detalles del Pokémon");
    });
  });

  describe('Loading States', () => {
    it('should set loading to true when starting fetch', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      
      api.get = vi.fn().mockReturnValueOnce(promise);

      const { result } = renderHook(() => usePokemonDetails(1));

      expect(result.current.loading).toBe(true);

      // Resolve the promise
      act(() => {
        resolvePromise!({ data: mockSpeciesData });
      });
    });

    it('should maintain loading state during both API calls', async () => {
      let resolveSpecies: (value: any) => void;
      let resolveEvolution: (value: any) => void;

      const speciesPromise = new Promise((resolve) => {
        resolveSpecies = resolve;
      });
      const evolutionPromise = new Promise((resolve) => {
        resolveEvolution = resolve;
      });

      api.get = vi.fn()
        .mockReturnValueOnce(speciesPromise)
        .mockReturnValueOnce(evolutionPromise);

      const { result } = renderHook(() => usePokemonDetails(1));

      expect(result.current.loading).toBe(true);

      // Resolve species call
      await act(async () => {
        resolveSpecies!({ data: mockSpeciesData });
        await vi.waitFor(() => {
          expect(api.get).toHaveBeenCalledTimes(2);
        });
      });

      // Should still be loading
      expect(result.current.loading).toBe(true);

      // Resolve evolution call
      await act(async () => {
        resolveEvolution!({ data: mockEvolutionData });
        await vi.waitFor(() => {
          expect(result.current.loading).toBe(true);
        });
      });
    });
  });

  describe('Hook Dependencies and Re-renders', () => {
    it('should refetch data when pokemonId changes', async () => {
      api.get = vi.fn()
        .mockResolvedValueOnce({ data: mockSpeciesData })
        .mockResolvedValueOnce({ data: mockEvolutionData })
        .mockResolvedValueOnce({ data: mockSpeciesData })
        .mockResolvedValueOnce({ data: mockEvolutionData });

      const { result, rerender } = renderHook(
        ({ id }) => usePokemonDetails(id),
        { initialProps: { id: 1 } }
      );

      await act(async () => {
        await vi.waitFor(() => {
          expect(result.current.loading).toBe(true);
        });
      });

      expect(api.get).toHaveBeenCalledTimes(2);

      // Change pokemonId
      rerender({ id: 2 });

      await act(async () => {
        await vi.waitFor(() => {
          expect(result.current.loading).toBe(true);
        });
      });

      expect(api.get).toHaveBeenCalledTimes(4);
      expect(api.get).toHaveBeenNthCalledWith(
        3,
        'https://pokeapi.co/api/v2/pokemon-species/2',
        { showLoading: false }
      );
    });


    it('should handle transition from valid to invalid pokemonId', async () => {
      api.get = vi.fn()
        .mockResolvedValueOnce({ data: mockSpeciesData })
        .mockResolvedValueOnce({ data: mockEvolutionData });

      const { result, rerender } = renderHook(
        ({ id }) => usePokemonDetails(id),
        { initialProps: { id: 1 } }
      );

      await act(async () => {
        await vi.waitFor(() => {
          expect(result.current.loading).toBe(true);
        });
      });
      rerender({ id: 0 });
      expect(api.get).toHaveBeenCalledTimes(2);
      expect(result.current.loading).toBe(false);
    });
  });
});