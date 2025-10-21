import { ResponsePokemonDetaexport } from "@/services/pokemon/models/responsePokemon.interface";
import { fetchPokemonList } from "@/services/pokemon/pokeApi.service";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function usePokeApi(limit: number) {
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pokemonData, setPokemonData] = useState<ResponsePokemonDetaexport[]>(
    []
  );
  const [selectedPokemon, setSelectedPokemon] = useState<ResponsePokemonDetaexport | null>(null);

  const pokeQuery = useQuery({
    queryKey: ["pokemonList", { limit, page }],
    queryFn: () => fetchPokemonList(limit, (page - 1) * limit),
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (pokeQuery.data?.results) {
        setTotalCount(pokeQuery.data.count);
        const detailedPokemon = await Promise.all(
          pokeQuery.data.results.map(async (p) => {
            const res = await fetch(p.url);
            return res.json();
          })
        );
        setPokemonData(detailedPokemon);
      }
    };

    fetchPokemonDetails();
  }, [pokeQuery.data]);

  const totalPages = Math.ceil(totalCount / limit)

  const handlePageChange = (valuePage: number) => {
    const totalPages = Math.ceil(pokeQuery?.data?.count ?? 0 / limit);

    if (valuePage >= 1 && valuePage <= totalPages) {
      setPage(valuePage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return {
    ...pokeQuery,
    pokemonData,
    page,
    totalPages,
    selectedPokemon,

    handlePageChange,
    setSelectedPokemon
  };
}
