'use client'

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTypeColor } from "@/lib/pokemonUtils";
import { Loader2, RotateCcw, Sparkles } from "lucide-react";
import { PokemonImage } from "../utils/PokemonImage";
import { Progress } from "@/components/ui/progress";
import { PokemonModalProps } from "../interfaces/PokemonModalProps.interface";
import { usePokemonModal } from "../hooks/usePokemonModal";
import { Fragment } from "react";

export function PokemonModal({ pokemon }: Readonly<PokemonModalProps>) {
  const { 
    imageContainerRef,
    currentPokemon,
    currentEvolutionIndex,
    canEvolve,
    hasEvolved,
    isEvolving,
    evolutionChain,
    handleEvolve,
    handleReset,
  } = usePokemonModal({ pokemon });

  return (
    <div className="max-w-2xl max-h-[60vh] space-y-6 relative" itemID="pokemon-modal" data-testid="pokemon-modal">
      <header className="text-center">
        <h2 className="text-2xl font-bold capitalize flex items-center justify-center gap-2" ref={imageContainerRef}>
          <span data-testid="pokemon-name">{currentPokemon.name}</span>
          <span className="text-sm font-mono text-muted-foreground" data-testid="pokemon-id">
            #{String(currentPokemon.id).padStart(3, "0")}
          </span>
        </h2>
      </header>

      <PokemonImage
        pokemon={currentPokemon}
        isEvolving={isEvolving}
      />

      {/* Types */}
      <div className="flex gap-2 justify-center flex-wrap" data-testid="pokemon-types">
        {currentPokemon?.pokemon_v2_pokemontypes?.map((type) => (
          <Badge
            key={type.pokemon_v2_type.name}
            className="capitalize font-semibold px-4 py-2 border-0"
            style={{
              backgroundColor: getTypeColor(type.pokemon_v2_type.name),
              color: "white",
            }}
            data-testid={`pokemon-type-${type.pokemon_v2_type.name}`}
          >
            {type.pokemon_v2_type.name}
          </Badge>
        ))}
      </div>

      {/* Description */}
       <p className="text-sm text-muted-foreground text-center text-pretty leading-relaxed" data-testid="pokemon-description">
          {currentPokemon?.pokemon_v2_pokemonspecy?.pokemon_v2_pokemonspeciesflavortexts?.map(entry => entry?.flavor_text.replaceAll("\f", " ")) }
        </p>

      {/* Physical Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">Altura</p>
          <p className="text-xl font-bold tabular-nums" data-testid="pokemon-height">
            {(currentPokemon.height / 10).toFixed(1)} m
          </p>
        </div>
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">Peso</p>
          <p className="text-xl font-bold tabular-nums" data-testid="pokemon-weight">
            {(currentPokemon.weight / 10).toFixed(1)} kg
          </p>
        </div>
      </div>

      {/* Stats */}
       <div className="space-y-3">
            <h3 className="font-semibold text-lg" data-testid="pokemon-stats">Stats</h3>
            {currentPokemon?.pokemon_v2_pokemonstats?.map((stat) => (
              <div key={stat.pokemon_v2_stat.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize text-muted-foreground" data-testid={`pokemon-stat-name-${stat.pokemon_v2_stat.name}`}>{stat.pokemon_v2_stat.name.replace("-", " ")}</span>
                  <span className="font-bold" data-testid={`pokemon-stat-value-${stat.pokemon_v2_stat.name}`}>{stat.base_stat}</span>
                </div>
                <Progress value={(stat.base_stat / 255) * 100} className="h-2" data-testid={`pokemon-stat-${stat.pokemon_v2_stat.name}`} />
              </div>
            ))}
          </div>
      {
        currentEvolutionIndex > -1 && evolutionChain.length > 0 && (
          <Fragment>
            {/* Evolution Chain */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Cadena de Evolución</h3>
              <div className="flex items-center justify-center gap-2 flex-wrap">
            {
                pokemon?.pokemon_v2_pokemonspecy?.pokemon_v2_evolutionchain?.pokemon_v2_pokemonspecies.sort((a, b) => a.id - b.id).map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant={index === currentEvolutionIndex ? "default" : "outline"} 
                      className={`capitalize ${index === currentEvolutionIndex && "bg-primary text-amber-50 dark:bg-gray-800 dark:border border-input"}`}
                      data-testid={`evolution-stage-${item.name}`}
                    >
                      {item.name}
                    </Badge>
                    {index < evolutionChain.length - 1 && <span className="text-muted-foreground">→</span>}
                  </div>
                ))  
              }
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col h-[15dvh] gap-3 pt-4 md:flex-row md:h-auto">
              <Button
                onClick={handleEvolve}
                disabled={!canEvolve || isEvolving}
                className="flex-1 bg-primary text-amber-50 dark:bg-gray-800 dark:border border-input"
                size="lg"
                aria-describedby={!canEvolve ? "evolve-disabled-reason" : undefined}
                data-testid="evolve-button"
              >
                {isEvolving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Evolucionando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Evolucionar
                  </>
                )}
              </Button>
              <Button
                onClick={handleReset}
                disabled={!hasEvolved || isEvolving}
                variant="outline"
                size="lg"
                className="flex-1"
                data-testid="reset-button"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reiniciar
              </Button>
            </div>
          </Fragment>
        )
      }

      {/* Hidden accessibility text */}
      {currentEvolutionIndex < 0 && (
        <span id="evolve-disabled-reason" className=" " data-testid="evolve-disabled-reason">
          Este Pokémon no puede evolucionar más o no tiene evoluciones
          disponibles.
        </span>
      )}
    </div>
  );
}
