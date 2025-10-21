"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getTypeColor } from "@/lib/pokemonUtils";
import { ResponsePokemonDetaexport } from "@/services/pokemon/models/responsePokemon.interface";
import Image from "next/image";

interface PokemonCardProps {
  pokemon: ResponsePokemonDetaexport;
  onClick?: () => void;
}

export function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  const primaryType = pokemon.types[0].type.name;

  return (
    <Card
      onClick={onClick}
      className="group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 cursor-pointer"
      style={{
        borderColor: `${getTypeColor(primaryType)}20`,
      }}
      itemID='pokemon-card'
      data-testid="pokemon-card"
    >
      <div
        className="absolute inset-0 opacity-10 transition-opacity duration-300 group-hover:opacity-20"
        style={{
          background: `radial-gradient(circle at top right, ${getTypeColor(
            primaryType
          )}, transparent 90%)`,
        }}
      />

      <div className="relative p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-mono font-semibold text-muted-foreground">
            #{String(pokemon.id).padStart(3, "0")}
          </span>
          <div className="flex gap-1">
            {pokemon.types.map((type) => (
              <div
                key={type.type.name}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getTypeColor(type.type.name) }}
                data-testid={`pokemon-type-${type.type.name}`}
              />
            ))}
          </div>
        </div>

        <div className="relative aspect-square bg-muted/30 rounded-xl flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-muted/20 dark:to-muted/80 " />
          <Image
            src={
              pokemon?.sprites?.other?.["official-artwork"]?.front_default ||
              pokemon.sprites.front_default
            }
            alt={pokemon.name}
            width={200}
            height={200}
            className="relative z-10 w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            data-testid="pokemon-image"
          />
        </div>

        <h3 className="text-xl font-bold capitalize text-center text-balance">
          {pokemon.name}
        </h3>

        <div className="flex gap-2 justify-center flex-wrap">
          {pokemon.types.map((type) => (
            <Badge
              key={type.type.name}
              className="capitalize font-semibold text-xs px-3 py-1 border-0"
              style={{
                backgroundColor: getTypeColor(type.type.name),
                color: "white",
              }}
            >
              {type.type.name}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">HP</p>
            <p className="text-sm font-bold">{pokemon.stats[0].base_stat}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">ATK</p>
            <p className="text-sm font-bold">{pokemon.stats[1].base_stat}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">DEF</p>
            <p className="text-sm font-bold">{pokemon.stats[2].base_stat}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
