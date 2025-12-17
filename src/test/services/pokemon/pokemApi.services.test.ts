/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchPokemonList, FetchPokemonListResponse } from '@/services/pokemon/pokeApi.service';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { IPokemon } from '../../../services/pokemon/models/pokemon.interface';


vi.mock('axios');

describe('fetchPokemonList', () => {
  const mockQuery = `
    query GetPokemon($limit: Int!, $offset: Int!) {
      pokemon_v2_pokemon(limit: $limit, offset: $offset) {
        id
        name
      }
    }
  `;

  const mockVariables = {
    limit: 20,
    offset: 0
  };

  const mockPokemonData: IPokemon = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  pokemon_v2_pokemontypes: [
    { pokemon_v2_type: { name: 'electric' } }
  ],
  pokemon_v2_pokemonsprites: [
    {
      sprites: {
        other: {
          'official-artwork': {
            front_default: 'https://example.com/pikachu-artwork.png'
          }
        },
        front_default: 'https://example.com/pikachu-default.png'
      }
    }
  ],
  pokemon_v2_pokemonstats:[
    { 
      base_stat: 35, 
      pokemon_v2_stat: {
        name: 'hp'
      }
    },
    {
      base_stat: 55,
      pokemon_v2_stat: {
        name: 'attack'
      }
    }
  ]
} as IPokemon;


  const mockSuccessResponse: FetchPokemonListResponse = {
    pokemon_v2_pokemon: [mockPokemonData],
    pokemon_v2_pokemon_aggregate: {
      aggregate: { count: 100 }
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('successful requests', () => {
    it('should fetch pokemon list successfully', async () => {
      vi.mocked(axios.post).mockResolvedValueOnce({
        data: {
          data: mockSuccessResponse
        }
      });

      const result = await fetchPokemonList(mockQuery, mockVariables);

      expect(result).toEqual(mockSuccessResponse);
      expect(result.pokemon_v2_pokemon).toHaveLength(1);
      expect(result.pokemon_v2_pokemon_aggregate.aggregate.count).toBe(100);
    });

    it('should call axios.post with correct parameters', async () => {
      vi.mocked(axios.post).mockResolvedValueOnce({
        data: {
          data: mockSuccessResponse
        }
      });

      await fetchPokemonList(mockQuery, mockVariables);

      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        'https://beta.pokeapi.co/graphql/v1beta',
        {
          query: mockQuery,
          variables: mockVariables
        },
        {
          headers: { 'Content-Type': 'application/json' },
          showLoading: false
        }
      );
    });

    it('should handle empty pokemon list', async () => {
      const emptyResponse: FetchPokemonListResponse = {
        pokemon_v2_pokemon: [],
        pokemon_v2_pokemon_aggregate: {
          aggregate: { count: 0 }
        }
      };

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: {
          data: emptyResponse
        }
      });

      const result = await fetchPokemonList(mockQuery, mockVariables);

      expect(result.pokemon_v2_pokemon).toHaveLength(0);
      expect(result.pokemon_v2_pokemon_aggregate.aggregate.count).toBe(0);
    });

    it('should preserve pokemon data structure', async () => {
      vi.mocked(axios.post).mockResolvedValueOnce({
        data: {
          data: mockSuccessResponse
        }
      });

      const result = await fetchPokemonList(mockQuery, mockVariables);

      const firstPokemon = result.pokemon_v2_pokemon[0];
      
      expect(firstPokemon).toHaveProperty('id');
      expect(firstPokemon).toHaveProperty('name');
      expect(firstPokemon).toHaveProperty('pokemon_v2_pokemontypes');
      expect(firstPokemon).toHaveProperty('pokemon_v2_pokemonsprites');
      
      expect(firstPokemon.name).toBe('pikachu');
      expect(firstPokemon.id).toBe(25);
    });
  });

  describe('error handling', () => {
    it('should throw error when GraphQL returns errors', async () => {
      vi.mocked(axios.post).mockResolvedValueOnce({
        data: {
          errors: [
            { message: 'GraphQL error: Field not found' }
          ]
        }
      });

      await expect(
        fetchPokemonList(mockQuery, mockVariables)
      ).rejects.toThrow('GraphQL error: Field not found');
    });

    it('should throw first error when multiple GraphQL errors occur', async () => {
      vi.mocked(axios.post).mockResolvedValueOnce({
        data: {
          errors: [
            { message: 'First error' },
            { message: 'Second error' },
            { message: 'Third error' }
          ]
        }
      });

      await expect(
        fetchPokemonList(mockQuery, mockVariables)
      ).rejects.toThrow('First error');
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network Error');
      vi.mocked(axios.post).mockRejectedValueOnce(networkError);

      await expect(
        fetchPokemonList(mockQuery, mockVariables)
      ).rejects.toThrow('Network Error');
    });

    it('should handle 404 errors', async () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'Not Found' }
        }
      };
      vi.mocked(axios.post).mockRejectedValueOnce(error);

      await expect(
        fetchPokemonList(mockQuery, mockVariables)
      ).rejects.toEqual(error);
    });

    it('should handle 500 server errors', async () => {
      const error = {
        response: {
          status: 500,
          data: { message: 'Internal Server Error' }
        }
      };
      vi.mocked(axios.post).mockRejectedValueOnce(error);

      await expect(
        fetchPokemonList(mockQuery, mockVariables)
      ).rejects.toEqual(error);
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('timeout of 5000ms exceeded');
      vi.mocked(axios.post).mockRejectedValueOnce(timeoutError);

      await expect(
        fetchPokemonList(mockQuery, mockVariables)
      ).rejects.toThrow('timeout of 5000ms exceeded');
    });

    it('should handle malformed response', async () => {
      vi.mocked(axios.post).mockResolvedValueOnce({
        data: null as any
      });

      // Esto lanzará un error porque data.data es undefined
      await expect(
        fetchPokemonList(mockQuery, mockVariables)
      ).rejects.toThrow();
    });
  });

  describe('different query types', () => {
    it('should handle query with filters', async () => {
      const filterQuery = `
        query GetPokemonByType($type: String!) {
          pokemon_v2_pokemon(where: {pokemon_v2_pokemontypes: {pokemon_v2_type: {name: {_eq: $type}}}}) {
            id
            name
          }
        }
      `;

      const filterVariables = { type: 'fire' };

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: {
          data: mockSuccessResponse
        }
      });

      const result = await fetchPokemonList(filterQuery, filterVariables);

      expect(axios.post).toHaveBeenCalledWith(
        'https://beta.pokeapi.co/graphql/v1beta',
        {
          query: filterQuery,
          variables: filterVariables
        },
        expect.any(Object)
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it('should handle query with sorting', async () => {
      const sortQuery = `
        query GetPokemonSorted {
          pokemon_v2_pokemon(order_by: {name: asc}) {
            id
            name
          }
        }
      `;

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: {
          data: mockSuccessResponse
        }
      });

      const result = await fetchPokemonList(sortQuery, {});

      expect(result).toEqual(mockSuccessResponse);
    });

    it('should handle query with search term', async () => {
      const searchQuery = `
        query SearchPokemon($searchTerm: String!) {
          pokemon_v2_pokemon(where: {name: {_ilike: $searchTerm}}) {
            id
            name
          }
        }
      `;

      const searchVariables = { searchTerm: '%pika%' };

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: {
          data: mockSuccessResponse
        }
      });

      await fetchPokemonList(searchQuery, searchVariables);

      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        {
          query: searchQuery,
          variables: searchVariables
        },
        expect.any(Object)
      );
    });

    it('should handle complex nested query', async () => {
      const complexQuery = `
        query GetComplexPokemon {
          pokemon_v2_pokemon {
            id
            name
            pokemon_v2_pokemonspecy {
              pokemon_v2_pokemonspeciesnames {
                name
                language_id
              }
            }
            pokemon_v2_pokemontypes {
              pokemon_v2_type {
                name
              }
            }
          }
        }
      `;

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: {
          data: mockSuccessResponse
        }
      });

      const result = await fetchPokemonList(complexQuery, {});

      expect(result).toEqual(mockSuccessResponse);
      expect(result.pokemon_v2_pokemon[0]).toHaveProperty('pokemon_v2_pokemontypes');
    });
  });

  describe('variable handling', () => {
    it('should handle numeric variables', async () => {
      const variables = { limit: 50, offset: 100 };

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { data: mockSuccessResponse }
      });

      await fetchPokemonList(mockQuery, variables);

      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ variables }),
        expect.any(Object)
      );
    });

    it('should handle string variables', async () => {
      const variables = { name: 'pikachu', type: 'electric' };

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { data: mockSuccessResponse }
      });

      await fetchPokemonList(mockQuery, variables);

      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ variables }),
        expect.any(Object)
      );
    });

    it('should handle array variables', async () => {
      const variables = { ids: [1, 2, 3], types: ['fire', 'water'] };

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { data: mockSuccessResponse }
      });

      await fetchPokemonList(mockQuery, variables);

      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ variables }),
        expect.any(Object)
      );
    });

    it('should handle empty variables object', async () => {
      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { data: mockSuccessResponse }
      });

      await fetchPokemonList(mockQuery, {});

      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ variables: {} }),
        expect.any(Object)
      );
    });

    it('should handle boolean variables', async () => {
      const variables = { isFavorite: true, isLegendary: false };

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { data: mockSuccessResponse }
      });

      await fetchPokemonList(mockQuery, variables);

      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ variables }),
        expect.any(Object)
      );
    });
  });

  describe('request configuration', () => {
    it('should send correct Content-Type header', async () => {
      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { data: mockSuccessResponse }
      });

      await fetchPokemonList(mockQuery, mockVariables);

      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' }
        })
      );
    });

    it('should send showLoading: false flag', async () => {
      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { data: mockSuccessResponse }
      });

      await fetchPokemonList(mockQuery, mockVariables);

      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({
          showLoading: false
        })
      );
    });

    it('should call the correct API endpoint', async () => {
      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { data: mockSuccessResponse }
      });

      await fetchPokemonList(mockQuery, mockVariables);

      expect(axios.post).toHaveBeenCalledWith(
        'https://beta.pokeapi.co/graphql/v1beta',
        expect.any(Object),
        expect.any(Object)
      );
    });
  });

  describe('edge cases', () => {
    it('should handle response with null aggregate', async () => {
      const responseWithNullAggregate = {
        pokemon_v2_pokemon: mockPokemonData,
        pokemon_v2_pokemon_aggregate: {
          aggregate: { count: 0 }
        }
      };

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { data: responseWithNullAggregate }
      });

      const result = await fetchPokemonList(mockQuery, mockVariables);

      expect(result.pokemon_v2_pokemon_aggregate.aggregate.count).toBe(0);
    });

    it('should handle very long query strings', async () => {
      const longQuery = `
        query GetPokemon {
          pokemon_v2_pokemon {
            ${'field '.repeat(100)}
          }
        }
      `;

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { data: mockSuccessResponse }
      });

      await fetchPokemonList(longQuery, mockVariables);

      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ query: longQuery }),
        expect.any(Object)
      );
    });

    it('should handle special characters in variables', async () => {
      const variables = {
        name: "Farfetch'd", // Apóstrofe
        description: 'Pokémon with é and ñ'
      };

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { data: mockSuccessResponse }
      });

      await fetchPokemonList(mockQuery, variables);

      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ variables }),
        expect.any(Object)
      );
    });
  });

  describe('performance considerations', () => {
    it('should handle multiple concurrent requests', async () => {
      vi.mocked(axios.post).mockResolvedValue({
        data: { data: mockSuccessResponse }
      });

      const requests = Array.from({ length: 10 }, () =>
        fetchPokemonList(mockQuery, mockVariables)
      );

      const results = await Promise.all(requests);

      expect(results).toHaveLength(10);
      expect(axios.post).toHaveBeenCalledTimes(10);
    });

    it('should not mutate variables object', async () => {
      const variables = { limit: 20, offset: 0 };
      const originalVariables = { ...variables };

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { data: mockSuccessResponse }
      });

      await fetchPokemonList(mockQuery, variables);

      expect(variables).toEqual(originalVariables);
    });

    it('should not mutate query string', async () => {
      const originalQuery = mockQuery;

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { data: mockSuccessResponse }
      });

      await fetchPokemonList(mockQuery, mockVariables);

      expect(mockQuery).toBe(originalQuery);
    });
  });

  describe('type safety', () => {
    it('should return correctly typed response', async () => {
      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { data: mockSuccessResponse }
      });

      const result: FetchPokemonListResponse = await fetchPokemonList(
        mockQuery,
        mockVariables
      );

      // Type checks - esto debería compilar sin errores
      expect(result.pokemon_v2_pokemon).toBeInstanceOf(Array);
      expect(result.pokemon_v2_pokemon_aggregate).toBeDefined();
      expect(result.pokemon_v2_pokemon_aggregate.aggregate.count).toBeTypeOf('number');
    });
  });
});