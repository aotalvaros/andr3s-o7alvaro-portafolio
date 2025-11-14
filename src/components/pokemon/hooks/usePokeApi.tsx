import { fetchPokemonList } from "@/services/pokemon/pokeApi.service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SEARCH_POKEMONS_PAGINATED } from "../constants/graphQLQueryPokemon";
import { IPokemon } from "@/services/pokemon/models/pokemon.interface";

export function usePokeApi(limit: number) {
  const [page, setPage] = useState(1);
  const [selectedPokemon, setSelectedPokemon] = useState<IPokemon | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

   const offset = (page - 1) * limit;

  const variables = {
    name: `%${searchTerm}%`,
    limit,
    offset,
  };

  const pokeQuery = useQuery({
    queryKey: ["paginatedSearchByName", searchTerm, page],
    queryFn: () => fetchPokemonList(SEARCH_POKEMONS_PAGINATED, variables),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    retry: 3
  });

  const totalCount = pokeQuery.data?.pokemon_v2_pokemon_aggregate?.aggregate?.count || 0
  const totalPages = Math.ceil(totalCount / limit)

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
    setPage(1)
  }

  return {
    ...pokeQuery,
    totalCount,
    page,
    totalPages,
    selectedPokemon,

    handlePageChange,
    setSelectedPokemon,
    handleSearchChange
  };
}
