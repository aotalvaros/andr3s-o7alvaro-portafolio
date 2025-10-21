import React from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { getTypeColor } from '@/lib/pokemonUtils';
import { ResponsePokemonDetaexport } from '@/services/pokemon/models/responsePokemon.interface';

interface PokemonImageProps {
  pokemon: ResponsePokemonDetaexport;
  isEvolving: boolean;
  className?: string;
}

export const PokemonImage = ({ pokemon, isEvolving, className = '' }: PokemonImageProps) => {
  const primaryType = pokemon.types[0].type.name;

  return (
    <div 
      className={`relative aspect-square max-w-sm mx-auto bg-muted/30 rounded-2xl flex items-center justify-center overflow-hidden ${className}`}
      aria-label={`Imagen de ${pokemon.name}`}
      itemID="pokemon-image-container"
      data-testid="pokemon-image-container"
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at center, ${getTypeColor(primaryType)}, transparent 70%)`,
        }}
      />
      <div
        className={`relative z-10 w-full h-full transition-all duration-1000 ${
          isEvolving 
            ? 'scale-150 opacity-0' 
            : 'scale-100 opacity-100'
        }`}
      >
        <Image
          src={
            pokemon?.sprites?.other?.['official-artwork'].front_default ||
            pokemon.sprites.front_default ||
            '/placeholder.svg'
          }
          alt={`${pokemon.name} - Pokémon #${pokemon.id}`}
          width={400}
          height={400}
          className="w-full h-full object-contain p-8"
          priority
          data-testid="pokemon-image"
        />
      </div>
      {isEvolving && (
        <div 
          className="absolute inset-0 flex items-center justify-center z-20"
          role="status"
          aria-label="Evolucionando"
          data-testid="evolving-spinner"
        >
          <Sparkles className="w-16 h-16 text-yellow-400 animate-spin" />
        </div>
      )}
    </div>
  );
}