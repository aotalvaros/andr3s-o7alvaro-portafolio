"use client";

import React from "react";
import { motion } from "framer-motion"
import { IPokemon } from "@/services/pokemon/models/pokemon.interface";

export interface PokemonStatsProps {
  totalPages: number;
  currentPage: number;
  pokemon: IPokemon[];
  totalCount: number;
}

export function PokemonStats({ totalPages, currentPage, pokemon, totalCount }: Readonly<PokemonStatsProps>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8"
      data-testid="pokemon-stats"
    >
      <div className="p-6 rounded-xl border border-border bg-card text-center">
        <div className="text-3xl font-bold text-primary" data-testid="total-count">{totalCount}</div>
        <div className="text-sm text-muted-foreground mt-1">Total Pokémon</div>
      </div>
      <div className="p-6 rounded-xl border border-border bg-card text-center">
        <div className="text-3xl font-bold text-secondary" data-testid="current-pokemon-length">
          {pokemon.length}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          Mostrando ahora
        </div>
      </div>
      <div className="p-6 rounded-xl border border-border bg-card text-center">
        <div className="text-3xl font-bold text-accent" data-testid="page-info">
          {currentPage}/{totalPages}
        </div>
        <div className="text-sm text-muted-foreground mt-1">Página actual</div>
      </div>
    </motion.div>
  );
};
