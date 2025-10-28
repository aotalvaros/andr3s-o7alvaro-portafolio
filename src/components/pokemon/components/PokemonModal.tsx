'use client'

import React, { useRef, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTypeColor } from "@/lib/pokemonUtils";
import { EvolutionChain, PokemonSpecies, ResponsePokemonDetaexport } from "@/services/pokemon/models/responsePokemon.interface";
import { Loader2, RotateCcw, Sparkles, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Componentes
import { PokemonImage } from "../utils/PokemonImage";
import { Progress } from "@/components/ui/progress";
import api from "@/lib/axios";

interface PokemonModalProps {
  pokemon: ResponsePokemonDetaexport;
}

export function PokemonModal({ pokemon: initialPokemon }: Readonly<PokemonModalProps>) {

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [description, setDescription] = useState<string>('');
  const [evolutionChain, setEvolutionChain] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPokemon, setCurrentPokemon] = useState<ResponsePokemonDetaexport>(initialPokemon)
  const [originalPokemon] = useState<ResponsePokemonDetaexport>(initialPokemon)
  const [currentEvolutionIndex, setCurrentEvolutionIndex] = useState(0)
  const [isEvolving, setIsEvolving] = useState(false)

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (!initialPokemon?.id) return;
      
      setLoading(true);
      setError(null);

      try {
        // Usar nuestro axios configurado sin loading global
        const { data: speciesData } = await api.get<PokemonSpecies>(
          `https://pokeapi.co/api/v2/pokemon-species/${initialPokemon.id}`,
          { showLoading: false }
        );

        // Obtener descripción en español
        const spanishEntry = speciesData.flavor_text_entries.find(
          (entry) => entry.language.name === 'es'
        );
        
        if (spanishEntry) {
          setDescription(spanishEntry.flavor_text.replace(/\f/g, ' '));
        }

        // Obtener cadena de evolución
        const { data: evolutionData } = await api.get<EvolutionChain>(
          speciesData.evolution_chain.url,
          { showLoading: false }
        );

        // Parsear cadena de evolución
        const chain: string[] = [];
        let current = evolutionData.chain;
        chain.push(current.species.name);

        while (current.evolves_to.length > 0) {
          current = current.evolves_to[0];
          chain.push(current.species.name);
        }

        setEvolutionChain(chain);
        setCurrentEvolutionIndex(chain.findIndex((name) => name === currentPokemon.name))
      } catch (err) {
        setError('!Ups¡ El servicio para obtener más detalles de este Pokémon está fallando. Por favor, intenta nuevamente más tarde.');
        console.error('[v0] Error fetching Pokémon details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [initialPokemon.id]);


  const handleEvolve = async () => {
    if (currentEvolutionIndex >= evolutionChain.length - 1) return

    setIsEvolving(true)

    setTimeout(() => {
      imageContainerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 100)

    // Wait for animation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      const nextEvolutionName = evolutionChain[currentEvolutionIndex + 1]
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nextEvolutionName}`)
      const evolvedPokemon: ResponsePokemonDetaexport = await response.json()

      setCurrentPokemon(evolvedPokemon)
      setCurrentEvolutionIndex(currentEvolutionIndex + 1)

      
    } catch (error) {
      console.error("[v0] Error evolving Pokemon:", error)
    } finally {
      setIsEvolving(false)
    }
  }

  const handleReset = () => {
    setCurrentPokemon(originalPokemon)
    setCurrentEvolutionIndex(evolutionChain.findIndex((name) => name === originalPokemon.name))
  }

  const canEvolve = currentEvolutionIndex < evolutionChain.length - 1
  const hasEvolved = currentPokemon.id !== originalPokemon.id

  return (
    <div className="max-w-2xl max-h-[60vh] space-y-6 relative" itemID="pokemon-modal" data-testid="pokemon-modal">
      {/* Header */}
      <header className="text-center">
        <h2 className="text-2xl font-bold capitalize flex items-center justify-center gap-2" ref={imageContainerRef}>
          <span>{currentPokemon.name}</span>
          <span className="text-sm font-mono text-muted-foreground">
            #{String(currentPokemon.id).padStart(3, "0")}
          </span>
        </h2>
      </header>

      {/* Error Display */}
      {error  && (
        <Alert variant="destructive" data-testid="pokemon-error">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Pokemon Image */}
      <PokemonImage
        pokemon={currentPokemon}
        isEvolving={isEvolving}
      />

      {/* Types */}
      <div className="flex gap-2 justify-center flex-wrap">
        {currentPokemon.types.map((type) => (
          <Badge
            key={type.type.name}
            className="capitalize font-semibold px-4 py-2 border-0"
            style={{
              backgroundColor: getTypeColor(type.type.name),
              color: "white",
            }}
            data-testid={`pokemon-type-${type.type.name}`}
          >
            {type.type.name}
          </Badge>
        ))}
      </div>

      {/* Description */}
      {!loading && description && (
        <p className="text-sm text-muted-foreground text-center text-pretty leading-relaxed" data-testid="pokemon-description">
          {description}
        </p>
      )}

      {/* Physical Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">Altura</p>
          <p className="text-xl font-bold tabular-nums">
            {(currentPokemon.height / 10).toFixed(1)} m
          </p>
        </div>
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">Peso</p>
          <p className="text-xl font-bold tabular-nums">
            {(currentPokemon.weight / 10).toFixed(1)} kg
          </p>
        </div>
      </div>

      {/* Stats */}
       <div className="space-y-3">
            <h3 className="font-semibold text-lg">Stats</h3>
            {currentPokemon.stats.map((stat) => (
              <div key={stat.stat.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize text-muted-foreground">{stat.stat.name.replace("-", " ")}</span>
                  <span className="font-bold">{stat.base_stat}</span>
                </div>
                <Progress value={(stat.base_stat / 255) * 100} className="h-2" data-testid={`pokemon-stat-${stat.stat.name}`} />
              </div>
            ))}
          </div>

      {/* Evolution Chain */}
        {!loading && evolutionChain.length > 1 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Evolution Chain</h3>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {evolutionChain.map((name, index) => (
                  <div key={name} className="flex items-center gap-2">
                    <Badge variant={index === currentEvolutionIndex ? "default" : "outline"} 
                      className={`capitalize ${index === currentEvolutionIndex && "bg-primary-foreground text-amber-50 dark:bg-gray-800 dark:border border-input"}`}
                      data-testid={`evolution-stage-${name}`}
                    >
                      {name}
                    </Badge>
                    {index < evolutionChain.length - 1 && <span className="text-muted-foreground">→</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

      {/* Action Buttons */}
      <div className="flex flex-col h-[15dvh] gap-3 pt-4 md:flex-row md:h-auto">
        <Button
          onClick={handleEvolve}
          disabled={!canEvolve || isEvolving || loading}
          className="flex-1 bg-primary-foreground text-amber-50 dark:bg-gray-800 dark:border border-input"
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

      {/* Hidden accessibility text */}
      {!canEvolve && (
        <span id="evolve-disabled-reason" className="sr-only" data-testid="evolve-disabled-reason">
          Este Pokémon no puede evolucionar más o no tiene evoluciones
          disponibles.
        </span>
      )}
    </div>
  );
}
