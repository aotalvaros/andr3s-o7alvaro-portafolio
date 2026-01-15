/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchPokemonList } from '@/services/pokemon/pokeApi.service';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { httpClient } from '@/core/infrastructure/http/httpClientFactory';

// Mock httpClient factory
vi.mock('@/core/infrastructure/http/httpClientFactory', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}));

describe('Pokemon List Service', () => {
  const mockHttpClient = vi.mocked(httpClient);
  const API_URL = 'https://beta.pokeapi.co/graphql/v1beta';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchPokemonList - Success cases', () => {
    it('should fetch pokemon list successfully', async () => {
      const mockQuery = `
        query GetPokemon($limit: Int!, $offset: Int!) {
          pokemon_v2_pokemon(limit: $limit, offset: $offset) {
            id
            name
          }
        }
      `;
      const mockVariables = { limit: 20, offset: 0 };
      
      const mockResponse = {
        data: {
          pokemon_v2_pokemon: [
            { id: 1, name: 'bulbasaur' },
            { id: 2, name: 'ivysaur' }
          ],
          pokemon_v2_pokemon_aggregate: {
            aggregate: { count: 1000 }
          }
        }
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await fetchPokemonList(mockQuery, mockVariables);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        API_URL,
        { query: mockQuery, variables: mockVariables },
        {
          headers: { 'Content-Type': 'application/json' },
          showLoading: false
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should call the correct GraphQL endpoint', async () => {
      const mockResponse = {
        data: {
          pokemon_v2_pokemon: [],
          pokemon_v2_pokemon_aggregate: { aggregate: { count: 0 } }
        }
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await fetchPokemonList('query {}', {});

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'https://beta.pokeapi.co/graphql/v1beta',
        expect.any(Object),
        expect.any(Object)
      );
    });

    it('should use POST method for GraphQL', async () => {
      const mockResponse = {
        data: {
          pokemon_v2_pokemon: [],
          pokemon_v2_pokemon_aggregate: { aggregate: { count: 0 } }
        }
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await fetchPokemonList('query {}', {});

      expect(mockHttpClient.post).toHaveBeenCalled();
      expect(mockHttpClient.get).not.toHaveBeenCalled();
    });

    it('should send query and variables in request body', async () => {
      const query = 'query GetPokemon { pokemon_v2_pokemon { id name } }';
      const variables = { limit: 10, offset: 5 };

      const mockResponse = {
        data: {
          pokemon_v2_pokemon: [],
          pokemon_v2_pokemon_aggregate: { aggregate: { count: 0 } }
        }
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await fetchPokemonList(query, variables);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        API_URL,
        { query, variables },
        expect.any(Object)
      );
    });

    it('should set Content-Type to application/json', async () => {
      const mockResponse = {
        data: {
          pokemon_v2_pokemon: [],
          pokemon_v2_pokemon_aggregate: { aggregate: { count: 0 } }
        }
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await fetchPokemonList('query {}', {});

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' }
        })
      );
    });

    it('should disable loading indicator with showLoading: false', async () => {
      const mockResponse = {
        data: {
          pokemon_v2_pokemon: [],
          pokemon_v2_pokemon_aggregate: { aggregate: { count: 0 } }
        }
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await fetchPokemonList('query {}', {});

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({
          showLoading: false
        })
      );
    });

    it('should return pokemon list with aggregate count', async () => {
      const mockResponse = {
        data: {
          pokemon_v2_pokemon: [
            { id: 1, name: 'bulbasaur', height: 7, weight: 69 },
            { id: 4, name: 'charmander', height: 6, weight: 85 },
            { id: 7, name: 'squirtle', height: 5, weight: 90 }
          ],
          pokemon_v2_pokemon_aggregate: {
            aggregate: { count: 1010 }
          }
        }
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await fetchPokemonList('query {}', {});

      expect(result.pokemon_v2_pokemon).toHaveLength(3);
      expect(result.pokemon_v2_pokemon_aggregate.aggregate.count).toBe(1010);
    });

    it('should handle empty pokemon list', async () => {
      const mockResponse = {
        data: {
          pokemon_v2_pokemon: [],
          pokemon_v2_pokemon_aggregate: {
            aggregate: { count: 0 }
          }
        }
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await fetchPokemonList('query {}', {});

      expect(result.pokemon_v2_pokemon).toEqual([]);
      expect(result.pokemon_v2_pokemon_aggregate.aggregate.count).toBe(0);
    });

    it('should handle complex variables', async () => {
      const variables = {
        limit: 20,
        offset: 100,
        where: { name: { _ilike: 'pika%' } },
        order_by: { id: 'asc' }
      };

      const mockResponse = {
        data: {
          pokemon_v2_pokemon: [{ id: 25, name: 'pikachu' }],
          pokemon_v2_pokemon_aggregate: { aggregate: { count: 1 } }
        }
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await fetchPokemonList('query {}', variables);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        API_URL,
        expect.objectContaining({
          variables
        }),
        expect.any(Object)
      );
    });

    it('should handle multi-line GraphQL queries', async () => {
      const multiLineQuery = `
        query GetPokemonWithDetails($limit: Int!) {
          pokemon_v2_pokemon(limit: $limit) {
            id
            name
            height
            weight
            pokemon_v2_pokemontypes {
              pokemon_v2_type {
                name
              }
            }
          }
        }
      `;

      const mockResponse = {
        data: {
          pokemon_v2_pokemon: [],
          pokemon_v2_pokemon_aggregate: { aggregate: { count: 0 } }
        }
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await fetchPokemonList(multiLineQuery, { limit: 10 });

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        API_URL,
        expect.objectContaining({
          query: multiLineQuery
        }),
        expect.any(Object)
      );
    });
  });

  describe('fetchPokemonList - GraphQL Errors', () => {
    it('should throw error when GraphQL returns errors', async () => {
      const mockResponse = {
        errors: [
          { message: 'Field "invalid_field" does not exist' }
        ]
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await expect(fetchPokemonList('query {}', {}))
        .rejects
        .toThrow('Field "invalid_field" does not exist');
    });

    it('should throw the first error message when multiple errors exist', async () => {
      const mockResponse = {
        errors: [
          { message: 'First error message' },
          { message: 'Second error message' },
          { message: 'Third error message' }
        ]
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await expect(fetchPokemonList('query {}', {}))
        .rejects
        .toThrow('First error message');
    });

    it('should throw error for syntax errors in query', async () => {
      const mockResponse = {
        errors: [
          { message: 'Syntax Error: Expected Name, found }' }
        ]
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await expect(fetchPokemonList('query { }', {}))
        .rejects
        .toThrow('Syntax Error: Expected Name, found }');
    });

    it('should throw error for invalid variables', async () => {
      const mockResponse = {
        errors: [
          { message: 'Variable "$limit" of required type "Int!" was not provided' }
        ]
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await expect(fetchPokemonList('query {}', {}))
        .rejects
        .toThrow('Variable "$limit" of required type "Int!" was not provided');
    });

    it('should throw error when data is missing but no errors array', async () => {
      const mockResponse = {};

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await expect(fetchPokemonList('query {}', {}))
        .rejects
        .toThrow('No data returned from GraphQL');
    });

    it('should throw error when data is null', async () => {
      const mockResponse = {
        data: null
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await expect(fetchPokemonList('query {}', {}))
        .rejects
        .toThrow('No data returned from GraphQL');
    });

    it('should throw error when data is undefined', async () => {
      const mockResponse = {
        data: undefined
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await expect(fetchPokemonList('query {}', {}))
        .rejects
        .toThrow('No data returned from GraphQL');
    });

    it('should prioritize errors over data', async () => {
      const mockResponse = {
        data: {
          pokemon_v2_pokemon: [],
          pokemon_v2_pokemon_aggregate: { aggregate: { count: 0 } }
        },
        errors: [
          { message: 'Partial error occurred' }
        ]
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await expect(fetchPokemonList('query {}', {}))
        .rejects
        .toThrow('Partial error occurred');
    });
  });

  describe('fetchPokemonList - Network Errors', () => {
    it('should propagate network errors', async () => {
      mockHttpClient.post.mockRejectedValue(new Error('Network error'));

      await expect(fetchPokemonList('query {}', {}))
        .rejects
        .toThrow('Network error');
    });

    it('should propagate timeout errors', async () => {
      mockHttpClient.post.mockRejectedValue(new Error('Request timeout'));

      await expect(fetchPokemonList('query {}', {}))
        .rejects
        .toThrow('Request timeout');
    });

    it('should propagate 500 server errors', async () => {
      mockHttpClient.post.mockRejectedValue(new Error('Internal server error'));

      await expect(fetchPokemonList('query {}', {}))
        .rejects
        .toThrow('Internal server error');
    });

    it('should propagate 429 rate limit errors', async () => {
      mockHttpClient.post.mockRejectedValue(new Error('Rate limit exceeded'));

      await expect(fetchPokemonList('query {}', {}))
        .rejects
        .toThrow('Rate limit exceeded');
    });
  });

  describe('fetchPokemonList - Variables handling', () => {
    it('should handle empty variables object', async () => {
      const mockResponse = {
        data: {
          pokemon_v2_pokemon: [],
          pokemon_v2_pokemon_aggregate: { aggregate: { count: 0 } }
        }
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await fetchPokemonList('query {}', {});

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        API_URL,
        expect.objectContaining({
          variables: {}
        }),
        expect.any(Object)
      );
    });

    it('should handle numeric variables', async () => {
      const variables = { limit: 50, offset: 100 };

      const mockResponse = {
        data: {
          pokemon_v2_pokemon: [],
          pokemon_v2_pokemon_aggregate: { aggregate: { count: 0 } }
        }
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await fetchPokemonList('query {}', variables);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        API_URL,
        expect.objectContaining({
          variables: { limit: 50, offset: 100 }
        }),
        expect.any(Object)
      );
    });

    it('should handle string variables', async () => {
      const variables = { name: 'pikachu', type: 'electric' };

      const mockResponse = {
        data: {
          pokemon_v2_pokemon: [],
          pokemon_v2_pokemon_aggregate: { aggregate: { count: 0 } }
        }
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await fetchPokemonList('query {}', variables);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        API_URL,
        expect.objectContaining({
          variables
        }),
        expect.any(Object)
      );
    });

    it('should handle boolean variables', async () => {
      const variables = { includeHidden: true, onlyLegendary: false };

      const mockResponse = {
        data: {
          pokemon_v2_pokemon: [],
          pokemon_v2_pokemon_aggregate: { aggregate: { count: 0 } }
        }
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await fetchPokemonList('query {}', variables);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        API_URL,
        expect.objectContaining({
          variables
        }),
        expect.any(Object)
      );
    });

    it('should handle array variables', async () => {
      const variables = { ids: [1, 4, 7, 25, 150] };

      const mockResponse = {
        data: {
          pokemon_v2_pokemon: [],
          pokemon_v2_pokemon_aggregate: { aggregate: { count: 0 } }
        }
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await fetchPokemonList('query {}', variables);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        API_URL,
        expect.objectContaining({
          variables: { ids: [1, 4, 7, 25, 150] }
        }),
        expect.any(Object)
      );
    });

    it('should handle nested object variables', async () => {
      const variables = {
        where: {
          name: { _ilike: '%char%' },
          pokemon_v2_pokemontypes: {
            pokemon_v2_type: { name: { _eq: 'fire' } }
          }
        }
      };

      const mockResponse = {
        data: {
          pokemon_v2_pokemon: [],
          pokemon_v2_pokemon_aggregate: { aggregate: { count: 0 } }
        }
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await fetchPokemonList('query {}', variables);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        API_URL,
        expect.objectContaining({
          variables
        }),
        expect.any(Object)
      );
    });
  });

  describe('fetchPokemonList - Real-world scenarios', () => {
    it('should fetch first page of pokemon', async () => {
      const query = `
        query GetPokemonPage($limit: Int!, $offset: Int!) {
          pokemon_v2_pokemon(limit: $limit, offset: $offset, order_by: {id: asc}) {
            id
            name
          }
          pokemon_v2_pokemon_aggregate {
            aggregate {
              count
            }
          }
        }
      `;

      const mockResponse = {
        data: {
          pokemon_v2_pokemon: [
            { id: 1, name: 'bulbasaur' },
            { id: 2, name: 'ivysaur' },
            { id: 3, name: 'venusaur' }
          ],
          pokemon_v2_pokemon_aggregate: {
            aggregate: { count: 1010 }
          }
        }
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await fetchPokemonList(query, { limit: 20, offset: 0 });

      expect(result.pokemon_v2_pokemon).toHaveLength(3);
      expect(result.pokemon_v2_pokemon[0].name).toBe('bulbasaur');
    });

    it('should search pokemon by name', async () => {
      const query = `
        query SearchPokemon($name: String!) {
          pokemon_v2_pokemon(where: {name: {_ilike: $name}}) {
            id
            name
          }
          pokemon_v2_pokemon_aggregate(where: {name: {_ilike: $name}}) {
            aggregate {
              count
            }
          }
        }
      `;

      const mockResponse = {
        data: {
          pokemon_v2_pokemon: [
            { id: 25, name: 'pikachu' }
          ],
          pokemon_v2_pokemon_aggregate: {
            aggregate: { count: 1 }
          }
        }
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await fetchPokemonList(query, { name: '%pika%' });

      expect(result.pokemon_v2_pokemon).toHaveLength(1);
      expect(result.pokemon_v2_pokemon[0].name).toBe('pikachu');
    });

    it('should filter pokemon by type', async () => {
      const query = `
        query GetPokemonByType($type: String!) {
          pokemon_v2_pokemon(where: {
            pokemon_v2_pokemontypes: {
              pokemon_v2_type: {name: {_eq: $type}}
            }
          }) {
            id
            name
          }
          pokemon_v2_pokemon_aggregate {
            aggregate {
              count
            }
          }
        }
      `;

      const mockResponse = {
        data: {
          pokemon_v2_pokemon: [
            { id: 4, name: 'charmander' },
            { id: 37, name: 'vulpix' }
          ],
          pokemon_v2_pokemon_aggregate: {
            aggregate: { count: 2 }
          }
        }
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await fetchPokemonList(query, { type: 'fire' });

      expect(result.pokemon_v2_pokemon).toHaveLength(2);
    });

    it('should handle pagination', async () => {
      const query = 'query GetPokemon($limit: Int!, $offset: Int!) { ... }';

      const mockResponse = {
        data: {
          pokemon_v2_pokemon: [],
          pokemon_v2_pokemon_aggregate: {
            aggregate: { count: 1010 }
          }
        }
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      // Page 1
      await fetchPokemonList(query, { limit: 20, offset: 0 });
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        API_URL,
        expect.objectContaining({
          variables: { limit: 20, offset: 0 }
        }),
        expect.any(Object)
      );

      // Page 2
      await fetchPokemonList(query, { limit: 20, offset: 20 });
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        API_URL,
        expect.objectContaining({
          variables: { limit: 20, offset: 20 }
        }),
        expect.any(Object)
      );
    });
  });

  describe('fetchPokemonList - Edge cases', () => {
    it('should handle very long queries', async () => {
      const longQuery = 'query { '.repeat(100) + ' pokemon_v2_pokemon { id } ' + ' }'.repeat(100);

      const mockResponse = {
        data: {
          pokemon_v2_pokemon: [],
          pokemon_v2_pokemon_aggregate: { aggregate: { count: 0 } }
        }
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await fetchPokemonList(longQuery, {});

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        API_URL,
        expect.objectContaining({
          query: longQuery
        }),
        expect.any(Object)
      );
    });

    it('should handle special characters in variables', async () => {
      const variables = { name: "farfetch'd", type: 'flying/normal' };

      const mockResponse = {
        data: {
          pokemon_v2_pokemon: [],
          pokemon_v2_pokemon_aggregate: { aggregate: { count: 0 } }
        }
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await fetchPokemonList('query {}', variables);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        API_URL,
        expect.objectContaining({
          variables
        }),
        expect.any(Object)
      );
    });

    it('should handle large result sets', async () => {
      const largePokemonList = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `pokemon-${i + 1}`
      }));

      const mockResponse = {
        data: {
          pokemon_v2_pokemon: largePokemonList,
          pokemon_v2_pokemon_aggregate: {
            aggregate: { count: 1000 }
          }
        }
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await fetchPokemonList('query {}', {});

      expect(result.pokemon_v2_pokemon).toHaveLength(1000);
    });
  });
});