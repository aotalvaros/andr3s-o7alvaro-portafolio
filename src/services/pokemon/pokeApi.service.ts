import { httpClient } from '@/core/infrastructure/http/httpClientFactory';
import { IPokemon } from "./models/pokemon.interface";

const API_URL = "https://beta.pokeapi.co/graphql/v1beta";


interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

export interface FetchPokemonListResponse {
  pokemon_v2_pokemon: IPokemon[];
  pokemon_v2_pokemon_aggregate: {
    aggregate: { count: number };
  };
}

export async function fetchPokemonList(
  query: string,
  variables: Record<string, unknown>
): Promise<FetchPokemonListResponse> {
  const response = await httpClient.post<GraphQLResponse<FetchPokemonListResponse>>(
    API_URL,
    { query, variables },
    { headers: { "Content-Type": "application/json" }, showLoading: false }
  );

  if (response.errors) {
    throw new Error(response.errors[0].message);
  }

  if (!response.data) {
    throw new Error('No data returned from GraphQL');
  }

  return response.data;
}
