"use client";

import React, { Fragment } from "react";
import { PokemonHeader } from "./Pokemonheader";
import { usePokeApi } from "../hooks/usePokeApi";
import { PokemonSkeleton } from "./PokemonSkeleton";
import { PokemonCard } from "./PokemonCard";
import { CustomPagination } from "@/components/layout/pagination/CustomPagination.components";
import Modal from "@/components/ui/Modal";
import { PokemonModal } from "./PokemonModal";
import { CustomSearch } from "../../ui/CustomSearch";
import { motion } from "framer-motion";
import { PokemonStats } from "./PokemonStats";

export function PokemonList() {
  const ITEMS_PER_PAGE = 12;
  const {
    isLoading,
    error,
    page,
    data,
    totalPages,
    selectedPokemon,
    totalCount,
    handlePageChange,
    setSelectedPokemon,
    handleSearchChange,
  } = usePokeApi(ITEMS_PER_PAGE);

  if (error) return <div>Error loading data</div>;

  const pokemonData = data?.pokemon_v2_pokemon || [];

  return (
    <>
      <PokemonHeader />

      <CustomSearch
        onSearch={handleSearchChange}
        placeholder="Busca tu Pokémon favorito..."
        textExample={["pikachu", "charizard", "bulbasaur"]}
      />

      <PokemonStats
        totalPages={totalPages}
        currentPage={page}
        pokemon={pokemonData}
        totalCount={totalCount}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <PokemonSkeleton key={i} />
          ))}
        </div>
      ) : (
        <Fragment>
          {pokemonData.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2">
                No se encontraron Pokémones
              </h3>
              <p className="text-muted-foreground">
                Intenta con otro nombre o navega por la lista completa
              </p>
            </motion.div>
          ) : (
            <Fragment>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            </Fragment>
          )}
        </Fragment>
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
}
