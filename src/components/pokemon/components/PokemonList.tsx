'use client'

import React from "react";
import { PokemonHeader } from "./Pokemonheader";
import { usePokeApi } from "../hooks/usePokeApi";
import { PokemonSkeleton } from "./PokemonSkeleton";
import { PokemonCard } from "./PokemonCard";
import { CustomPagination } from "@/components/layout/CustomPagination.components";
import Modal from "@/components/ui/Modal";
import { PokemonModal } from "./PokemonModal";

export const PokemonList = () => {
  const ITEMS_PER_PAGE = 8;
  const {
    isLoading,
    error,
    page,
    pokemonData,
    totalPages,
    selectedPokemon,
    handlePageChange,
    setSelectedPokemon,
  } = usePokeApi(ITEMS_PER_PAGE);

  if (error) return <div>Error loading data</div>;

  return (
    <>
      <PokemonHeader />
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <PokemonSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pokemonData.map((pokemon, index) => (
              <PokemonCard
                key={pokemon.id + index}
                pokemon={pokemon}
                onClick={() => setSelectedPokemon(pokemon)}
              />
            ))}
          </div>
          <CustomPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChangeNext={handlePageChange}
          />
        </>
      )}
      {selectedPokemon && (
        <Modal
          open={!!selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
          className="pr-[10px]"
        >
          <PokemonModal pokemon={selectedPokemon} />
        </Modal>
      )}
    </>
  );
};
