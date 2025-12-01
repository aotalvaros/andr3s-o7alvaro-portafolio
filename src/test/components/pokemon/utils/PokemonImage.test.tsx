/* eslint-disable @typescript-eslint/no-explicit-any */
import { PokemonImage } from '@/components/pokemon/utils/PokemonImage';
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from 'vitest'
import { IPokemon } from '../../../../services/pokemon/models/pokemon.interface';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ''} />;
  },
}));

const mockPokemon: IPokemon = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  pokemon_v2_pokemontypes: [
    { pokemon_v2_type: { name: 'electric' } }
  ],
  pokemon_v2_pokemonsprites: [
    {
      sprites: {
        other: {
          'official-artwork': {
            front_default: 'https://example.com/pikachu-artwork.png'
          }
        },
        front_default: 'https://example.com/pikachu-default.png'
      }
    }
  ],
  pokemon_v2_pokemonstats:[
    { 
      base_stat: 35, 
      pokemon_v2_stat: {
        name: 'hp'
      }
    },
    {
      base_stat: 55,
      pokemon_v2_stat: {
        name: 'attack'
      }
    }
  ]
} as IPokemon;

describe('PokemonImage Component', () => {

    it('should render the Pokemon image correctly', () => {
        render(<PokemonImage pokemon={mockPokemon} />);
        const imgElement = screen.getByRole('img');
        expect(imgElement).toBeInTheDocument();
        expect(imgElement).toHaveAttribute('src', 'https://example.com/pikachu-artwork.png');
        expect(imgElement).toHaveAttribute('alt', 'pikachu - Pokémon #25');
    });

    it('should display evolving spinner when isEvolving is true', () => {
        render(<PokemonImage pokemon={mockPokemon} isEvolving={true} />);
        const spinnerElement = screen.getByTestId('evolving-spinner');
        expect(spinnerElement).toBeInTheDocument();
    });

    it('should not display evolving spinner when isEvolving is false', () => {
        render(<PokemonImage pokemon={mockPokemon} isEvolving={false} />);
        const spinnerElement = screen.queryByTestId('evolving-spinner');
        expect(spinnerElement).not.toBeInTheDocument();
    });
})