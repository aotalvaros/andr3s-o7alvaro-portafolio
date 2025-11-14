import axios from "axios";
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
  const response = await axios.post<GraphQLResponse<FetchPokemonListResponse>>(
    API_URL,
    { query, variables },
    { headers: { "Content-Type": "application/json" }, showLoading: false }
  );

  if (response.data.errors) {
    throw new Error(response.data.errors[0].message);
  }

  return response.data.data!;
}
