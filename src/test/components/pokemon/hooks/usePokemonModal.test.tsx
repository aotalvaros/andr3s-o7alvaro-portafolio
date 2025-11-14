/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePokemonModal } from '@/components/pokemon/hooks/usePokemonModal';
import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { IPokemon, IEvolutionchain } from '@/services/pokemon/models/pokemon.interface';

// Mock data
const mockPokemonSprites = [
  {
    id: 1,
    sprites: JSON.stringify({
      front_default: 'https://example.com/pichu.png',
      other: {
        'official-artwork': {
          front_default: 'https://example.com/pichu-artwork.png',
        },
      },
    }),
  },
];

const mockPokemonStats = [
  { base_stat: 20, pokemon_v2_stat: { name: 'hp' } },
  { base_stat: 40, pokemon_v2_stat: { name: 'attack' } },
  { base_stat: 15, pokemon_v2_stat: { name: 'defense' } },
  { base_stat: 35, pokemon_v2_stat: { name: 'special-attack' } },
  { base_stat: 35, pokemon_v2_stat: { name: 'special-defense' } },
  { base_stat: 60, pokemon_v2_stat: { name: 'speed' } },
];

const mockPichuSpecies: IEvolutionchain = {
  id: 172,
  name: 'pichu',
  pokemon_v2_pokemons: [
    {
      id: 172,
      name: 'pichu',
      height: 3,
      weight: 20,
      pokemon_v2_pokemonsprites: mockPokemonSprites,
      pokemon_v2_pokemonspecy: {
        id: 172,
        name: 'pichu',
        pokemon_v2_pokemonspeciesflavortexts: [
          {
            flavor_text: 'A baby Pokémon that is small and vulnerable.',
            pokemon_v2_language: { name: 'en' },
          },
        ],
      },
      pokemon_v2_pokemonstats: mockPokemonStats,
    },
  ],
};

const mockPikachuSpecies: IEvolutionchain = {
  id: 25,
  name: 'pikachu',
  pokemon_v2_pokemons: [
    {
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      pokemon_v2_pokemonsprites: [
        {
          id: 2,
          sprites: JSON.stringify({
            front_default: 'https://example.com/pikachu.png',
          }),
        },
      ],
      pokemon_v2_pokemonspecy: {
        id: 25,
        name: 'pikachu',
        pokemon_v2_pokemonspeciesflavortexts: [
          {
            flavor_text: 'When several of these Pokémon gather, their electricity could build and cause lightning storms.',
            pokemon_v2_language: { name: 'en' },
          },
        ],
      },
      pokemon_v2_pokemonstats: [
        { base_stat: 35, pokemon_v2_stat: { name: 'hp' } },
        { base_stat: 55, pokemon_v2_stat: { name: 'attack' } },
        { base_stat: 40, pokemon_v2_stat: { name: 'defense' } },
      ],
    },
  ],
};

const mockRaichuSpecies: IEvolutionchain = {
  id: 26,
  name: 'raichu',
  pokemon_v2_pokemons: [
    {
      id: 26,
      name: 'raichu',
      height: 8,
      weight: 300,
      pokemon_v2_pokemonsprites: [
        {
          id: 3,
          sprites: JSON.stringify({
            front_default: 'https://example.com/raichu.png',
          }),
        },
      ],
      pokemon_v2_pokemonspecy: {
        id: 26,
        name: 'raichu',
        pokemon_v2_pokemonspeciesflavortexts: [
          {
            flavor_text: 'Its long tail serves as a ground to protect itself from its own high-voltage power.',
            pokemon_v2_language: { name: 'en' },
          },
        ],
      },
      pokemon_v2_pokemonstats: [
        { base_stat: 60, pokemon_v2_stat: { name: 'hp' } },
        { base_stat: 90, pokemon_v2_stat: { name: 'attack' } },
        { base_stat: 55, pokemon_v2_stat: { name: 'defense' } },
      ],
    },
  ],
};

const mockPokemon: IPokemon = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  pokemon_v2_pokemonsprites: mockPokemonSprites,
  pokemon_v2_pokemonspecy: {
    id: 25,
    name: 'pikachu',
    pokemon_v2_evolutionchain: {
      id: 10,
      pokemon_v2_pokemonspecies: [
        mockPichuSpecies,
        mockPikachuSpecies,
        mockRaichuSpecies,
      ],
    },
    pokemon_v2_pokemonspeciesflavortexts: [
      {
        flavor_text: 'Test description',
        pokemon_v2_language: { name: 'en' },
      },
    ],
  },
  pokemon_v2_pokemonstats: mockPokemonStats,
  pokemon_v2_pokemontypes: [
    {
      pokemon_v2_type: {
        id: 13,
        name: 'electric',
      },
    },
  ],
};

describe('usePokemonModal', () => {

  beforeEach(() => {
    vi.useFakeTimers();
    
    // Mock scrollIntoView
    HTMLDivElement.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

   const evolveAndWait = async (result: any) => {
    await act(async () => {
      result.current.handleEvolve();
      vi.advanceTimersByTime(1100);
      await Promise.resolve();
    });
  };

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => usePokemonModal({ pokemon: mockPokemon }));

      expect(result.current.currentPokemon).toEqual(mockPokemon);
      expect(result.current.isEvolving).toBe(false);
    });

    it('should create imageContainerRef', () => {
      const { result } = renderHook(() => usePokemonModal({ pokemon: mockPokemon }));

      expect(result.current.imageContainerRef).toBeDefined();
      expect(result.current.imageContainerRef.current).toBeNull(); // Not attached to DOM
    });

    it('should initialize with pokemon at first position in chain', () => {
      const pichuPokemon: IPokemon = {
        ...mockPokemon,
        id: 172,
        name: 'pichu',
      };

      const { result } = renderHook(() => usePokemonModal({ pokemon: pichuPokemon }));

      expect(result.current.currentEvolutionIndex).toBe(2);
    });

    it('should initialize with pokemon at last position in chain', () => {
      const raichuPokemon: IPokemon = {
        ...mockPokemon,
        id: 26,
        name: 'raichu',
      };

      const { result } = renderHook(() => usePokemonModal({ pokemon: raichuPokemon }));

      expect(result.current.currentEvolutionIndex).toBe(1);
    });
  });

  describe('Evolution Chain Processing', () => {
    it('should build evolution chain from pokemon data', () => {
      const { result } = renderHook(() => usePokemonModal({ pokemon: mockPokemon }));

      expect(result.current.evolutionChain).toHaveLength(3);
      expect(result.current.evolutionChain[0].name).toBe('pikachu');
      expect(result.current.evolutionChain[1].name).toBe('raichu');
      expect(result.current.evolutionChain[2].name).toBe('pichu');
    });

    it('should sort evolution chain by ID (ascending)', () => {
      const unsortedPokemon: IPokemon = {
        ...mockPokemon,
        pokemon_v2_pokemonspecy: {
          ...mockPokemon.pokemon_v2_pokemonspecy!,
          pokemon_v2_evolutionchain: {
            id: 10,
            pokemon_v2_pokemonspecies: [
              mockRaichuSpecies, // ID 26
              mockPichuSpecies,  // ID 172
              mockPikachuSpecies, // ID 25
            ],
          },
        },
      };

      const { result } = renderHook(() => usePokemonModal({ pokemon: unsortedPokemon }));

      expect(result.current.evolutionChain[0].id).toBe(25); // Pikachu
      expect(result.current.evolutionChain[1].id).toBe(26); // Raichu
      expect(result.current.evolutionChain[2].id).toBe(172); // Pichu
    });

    it('should handle single evolution chain', () => {
      const singleEvolutionPokemon: IPokemon = {
        ...mockPokemon,
        pokemon_v2_pokemonspecy: {
          ...mockPokemon.pokemon_v2_pokemonspecy!,
          pokemon_v2_evolutionchain: {
            id: 1,
            pokemon_v2_pokemonspecies: [mockPikachuSpecies],
          },
        },
      };

      const { result } = renderHook(() => usePokemonModal({ pokemon: singleEvolutionPokemon }));

      expect(result.current.evolutionChain).toHaveLength(1);
      expect(result.current.canEvolve).toBe(false);
    });

    it('should handle empty evolution chain', () => {
      const noEvolutionPokemon: IPokemon = {
        ...mockPokemon,
        pokemon_v2_pokemonspecy: {
          ...mockPokemon.pokemon_v2_pokemonspecy!,
          pokemon_v2_evolutionchain: {
            id: 1,
            pokemon_v2_pokemonspecies: [],
          },
        },
      };

      const { result } = renderHook(() => usePokemonModal({ pokemon: noEvolutionPokemon }));

      expect(result.current.evolutionChain).toHaveLength(0);
      expect(result.current.currentEvolutionIndex).toBe(-1);
    });

    it('should find correct current evolution index', () => {
      const { result } = renderHook(() => usePokemonModal({ pokemon: mockPokemon }));

      // Pikachu is at index 1 in the chain [pichu, pikachu, raichu]
      expect(result.current.currentEvolutionIndex).toBe(0);
    });
  });

  describe('Evolution Flags', () => {
    it('should set canEvolve to true when not at final evolution', () => {
      const { result } = renderHook(() => usePokemonModal({ pokemon: mockPokemon }));

      expect(result.current.canEvolve).toBe(true);
    });

    it('should set hasEvolved to false initially', () => {
      const { result } = renderHook(() => usePokemonModal({ pokemon: mockPokemon }));

      expect(result.current.hasEvolved).toBe(false);
    });

    it('should set hasEvolved to true after evolution', async () => {
      const { result } = renderHook(() => usePokemonModal({ pokemon: mockPokemon }));

      await evolveAndWait(result);

      expect(result.current.hasEvolved).toBe(true);
    });

    it('should set hasEvolved back to false after reset', async () => {
      const { result } = renderHook(() => usePokemonModal({ pokemon: mockPokemon }));

      // Evolve
      await evolveAndWait(result);

      expect(result.current.hasEvolved).toBe(true);

      // Reset
      act(() => {
        result.current.handleReset();
      });

      expect(result.current.hasEvolved).toBe(false);
    });
  });
  

});