import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { ResponsePokemonDetaexport } from '@/services/pokemon/models/responsePokemon.interface';
import { usePokemonEvolution } from '../../../../components/pokemon/hooks/usePokemonEvolution';

// Mock global fetch
global.fetch = vi.fn();

describe('usePokemonEvolution', () => {
  const mockBulbasaur: ResponsePokemonDetaexport = {
    id: 1,
    name: 'bulbasaur',
    height: 7,
    weight: 69,
    sprites: {
      front_default: 'bulbasaur.png'
    },
    types: [{ type: { name: 'grass' } }],
    stats: [{}],
    abilities: [{}]
  } as ResponsePokemonDetaexport;

  const mockIvysaur: ResponsePokemonDetaexport = {
    id: 2,
    name: 'ivysaur',
    height: 10,
    weight: 130,
    sprites: {
      front_default: 'ivysaur.png'
    },
    types: [{ type: { name: 'grass' } }],
    stats: [{}],
    abilities: [{}]
  } as ResponsePokemonDetaexport;

  const mockVenusaur: ResponsePokemonDetaexport = {
    id: 3,
    name: 'venusaur',
    height: 20,
    weight: 1000,
    sprites: {
      front_default: 'venusaur.png'
    },
    types: [{ type: { name: 'grass' } }],
    stats: [{}],
    abilities: [{}]
  } as ResponsePokemonDetaexport;

  const evolutionChain = ['bulbasaur', 'ivysaur', 'venusaur'];

  beforeEach(() => {
    vi.clearAllMocks()
  });

  describe('Initial state', () => {
    it('should initialize with the original pokemon', () => {
      const { result } = renderHook(() =>
        usePokemonEvolution(mockBulbasaur, evolutionChain)
      );

      expect(result.current.currentPokemon).toEqual(mockBulbasaur);
      expect(result.current.currentEvolutionIndex).toBe(0);
      expect(result.current.isEvolving).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should calculate correct original index for pokemon in the middle of chain', () => {
      const { result } = renderHook(() =>
        usePokemonEvolution(mockIvysaur, evolutionChain)
      );

      expect(result.current.originalIndex).toBe(1);
      expect(result.current.currentEvolutionIndex).toBe(1);
    });

    it('should calculate correct original index for last pokemon in chain', () => {
      const { result } = renderHook(() =>
        usePokemonEvolution(mockVenusaur, evolutionChain)
      );

      expect(result.current.originalIndex).toBe(2);
      expect(result.current.currentEvolutionIndex).toBe(2);
    });

    it('should handle pokemon not in evolution chain', () => {
      const mockPikachu = { ...mockBulbasaur, id: 25, name: 'pikachu' };
      
      const { result } = renderHook(() =>
        usePokemonEvolution(mockPikachu, evolutionChain)
      );

      expect(result.current.originalIndex).toBe(0);
      expect(result.current.currentEvolutionIndex).toBe(0);
    });
  });

  describe('Derived data calculations', () => {
    it('should indicate when pokemon can evolve', () => {
      const { result } = renderHook(() =>
        usePokemonEvolution(mockBulbasaur, evolutionChain)
      );

      expect(result.current.canEvolve).toBe(true);
    });

    it('should indicate when pokemon cannot evolve (final evolution)', () => {
      const { result } = renderHook(() =>
        usePokemonEvolution(mockVenusaur, evolutionChain)
      );

      expect(result.current.canEvolve).toBe(false);
    });

    it('should indicate when pokemon cannot evolve (single evolution chain)', () => {
      const singleChain = ['bulbasaur'];
      
      const { result } = renderHook(() =>
        usePokemonEvolution(mockBulbasaur, singleChain)
      );

      expect(result.current.canEvolve).toBe(false);
    });

    it('should indicate when pokemon has evolved', async() => {
      const { result } = renderHook(() =>
        usePokemonEvolution(mockBulbasaur, evolutionChain)
      );

      expect(result.current.hasEvolved).toBe(false);

      // After evolution
      await act(async () => {
        result.current.currentPokemon = mockIvysaur;
      });

      expect(result.current.hasEvolved).toBe(false);
    });
  });

  describe('Evolution process', () => {
    it('should successfully evolve pokemon', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockIvysaur,
      } as Response);

      const { result } = renderHook(() =>
        usePokemonEvolution(mockBulbasaur, evolutionChain)
      );

      expect(result.current.canEvolve).toBe(true);

      await act(async () => {
        await result.current.evolve();
      });

      await waitFor(() => {
        expect(result.current.isEvolving).toBe(false);
      });

      expect(result.current.currentPokemon).toEqual(mockIvysaur);
      expect(result.current.error).toBeNull();
      expect(fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/ivysaur'
      );
    });

    it('should evolve through multiple stages', async () => {
      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockIvysaur,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockVenusaur,
        } as Response);

      const { result } = renderHook(() =>
        usePokemonEvolution(mockBulbasaur, evolutionChain)
      );

      // First evolution
      await act(async () => {
        await result.current.evolve();
      });

      await waitFor(() => {
        expect(result.current.currentPokemon).toEqual(mockIvysaur);
      });

      // Second evolution
      await act(async () => {
        await result.current.evolve();
      });

      await waitFor(() => {
        expect(result.current.currentPokemon).toEqual(mockVenusaur);
      });

      expect(result.current.currentEvolutionIndex).toBe(0);
      expect(result.current.canEvolve).toBe(true);
    });

    it('should not evolve when already at final stage', async () => {
      const { result } = renderHook(() =>
        usePokemonEvolution(mockVenusaur, evolutionChain)
      );

      const initialPokemon = result.current.currentPokemon;

      await act(async () => {
        await result.current.evolve();
      });

      expect(result.current.currentPokemon).toEqual(initialPokemon);
      expect(fetch).not.toHaveBeenCalled();
    });

  });

  describe('Error handling', () => {

    it('should handle network errors', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() =>
        usePokemonEvolution(mockBulbasaur, evolutionChain)
      );

      await act(async () => {
        await result.current.evolve();
      });

      await waitFor(() => {
        expect(result.current.isEvolving).toBe(false);
      });

      expect(result.current.error).toBe('Error al evolucionar el Pokémon');
      expect(result.current.currentPokemon).toEqual(mockBulbasaur);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should clear error on successful evolution after previous error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // First attempt fails
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() =>
        usePokemonEvolution(mockBulbasaur, evolutionChain)
      );

      await act(async () => {
        await result.current.evolve();
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Error al evolucionar el Pokémon');
      });

      // Second attempt succeeds
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockIvysaur,
      } as Response);

      await act(async () => {
        await result.current.evolve();
      });

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });

      expect(result.current.currentPokemon).toEqual(mockIvysaur);

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Reset functionality', () => {
    it('should reset to original pokemon', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockIvysaur,
      } as Response);

      const { result } = renderHook(() =>
        usePokemonEvolution(mockBulbasaur, evolutionChain)
      );

      // Evolve
      await act(async () => {
        await result.current.evolve();
      });

      await waitFor(() => {
        expect(result.current.currentPokemon).toEqual(mockIvysaur);
      });

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.currentPokemon).toEqual(mockBulbasaur);
      expect(result.current.currentEvolutionIndex).toBe(0);
      expect(result.current.isEvolving).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should reset error state', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Test error'));

      const { result } = renderHook(() =>
        usePokemonEvolution(mockBulbasaur, evolutionChain)
      );

      // Trigger error
      await act(async () => {
        await result.current.evolve();
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Error al evolucionar el Pokémon');
      });

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.error).toBeNull();

      consoleErrorSpy.mockRestore();
    });

    it('should reset to correct index for mid-chain pokemon', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockVenusaur,
      } as Response);

      const { result } = renderHook(() =>
        usePokemonEvolution(mockIvysaur, evolutionChain)
      );

      expect(result.current.currentEvolutionIndex).toBe(1);

      // Evolve
      await act(async () => {
        await result.current.evolve();
      });

      await waitFor(() => {
        expect(result.current.currentPokemon).toEqual(mockVenusaur);
      });

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.currentPokemon).toEqual(mockIvysaur);
      expect(result.current.currentEvolutionIndex).toBe(1);
    });
  });

  describe('Evolution chain updates', () => {
    it('should update index when evolution chain changes', () => {
      const { result, rerender } = renderHook(
        ({ pokemon, chain }) => usePokemonEvolution(pokemon, chain),
        {
          initialProps: {
            pokemon: mockBulbasaur,
            chain: evolutionChain
          }
        }
      );

      expect(result.current.currentEvolutionIndex).toBe(0);

      // Change to a different chain
      const newChain = ['charmander', 'charmeleon', 'charizard'];
      rerender({
        pokemon: mockBulbasaur,
        chain: newChain
      });

      expect(result.current.currentEvolutionIndex).toBe(0);
    });

    it('should handle empty evolution chain', () => {
      const { result } = renderHook(() =>
        usePokemonEvolution(mockBulbasaur, [])
      );

      expect(result.current.originalIndex).toBe(0);
      expect(result.current.canEvolve).toBe(false);
    });
  });

  describe('Memoization', () => {
    it('should memoize derived data correctly', () => {
      const { result, rerender } = renderHook(
        ({ pokemon, chain }) => usePokemonEvolution(pokemon, chain),
        {
          initialProps: {
            pokemon: mockBulbasaur,
            chain: evolutionChain
          }
        }
      );

      const firstDerivedData = {
        originalIndex: result.current.originalIndex,
        canEvolve: result.current.canEvolve,
        hasEvolved: result.current.hasEvolved
      };

      // Rerender without changing props
      rerender({
        pokemon: mockBulbasaur,
        chain: evolutionChain
      });

      expect(result.current.originalIndex).toBe(firstDerivedData.originalIndex);
      expect(result.current.canEvolve).toBe(firstDerivedData.canEvolve);
      expect(result.current.hasEvolved).toBe(firstDerivedData.hasEvolved);
    });

    it('should recalculate when evolution chain changes', () => {
      const { result, rerender } = renderHook(
        ({ pokemon, chain }) => usePokemonEvolution(pokemon, chain),
        {
          initialProps: {
            pokemon: mockBulbasaur,
            chain: evolutionChain
          }
        }
      );

      const firstCanEvolve = result.current.canEvolve;
      expect(firstCanEvolve).toBe(true);

      // Change to single-stage evolution
      rerender({
        pokemon: mockBulbasaur,
        chain: ['bulbasaur']
      });

      expect(result.current.canEvolve).toBe(false);
      expect(result.current.canEvolve).not.toBe(firstCanEvolve);
    });
  });

});