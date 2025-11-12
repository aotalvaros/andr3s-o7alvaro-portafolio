/* eslint-disable @typescript-eslint/no-explicit-any */
import { PokemonCard } from "@/components/pokemon/components/PokemonCard";
import { render, screen } from "@testing-library/react";
import { ResponsePokemonDetaexport } from "@/services/pokemon/models/responsePokemon.interface";
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from "@testing-library/user-event";

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, className, style }: any) => (
    <span className={className} style={style} data-testid="badge">
      {children}
    </span>
  ),
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, onClick, className, style, itemID, ...props }: any) => (
    <div
      onClick={onClick}
      className={className}
      style={style}
      data-itemid={itemID}
      {...props}
    >
      {children}
    </div>
  ),
}));

vi.mock('@/lib/pokemonUtils', () => ({
  getTypeColor: vi.fn((type: string) => {
    const colors: Record<string, string> = {
      fire: '#F08030',
      water: '#6890F0',
      grass: '#78C850',
      electric: '#F8D030',
      normal: '#A8A878',
    };
    return colors[type] || '#68A090';
  }),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, width, height, className, loading, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={loading}
      {...props}
    />
  ),
}));

describe('PokemonCard', () => {

 const mockPokemon: ResponsePokemonDetaexport = {
    id: 25,
    name: 'pikachu',
    types: [
      { type: { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' } },
    ],
    sprites: {
      front_default: 'https://example.com/pikachu.png',
      other: {
        'official-artwork': {
          front_default: 'https://example.com/pikachu-artwork.png',
        },
      },
    },
    stats: [
      { base_stat: 35, effort: 0, stat: { name: 'hp', url: '' } },
      { base_stat: 55, effort: 0, stat: { name: 'attack', url: '' } },
      { base_stat: 40, effort: 0, stat: { name: 'defense', url: '' } },
      { base_stat: 50, effort: 0, stat: { name: 'special-attack', url: '' } },
      { base_stat: 50, effort: 0, stat: { name: 'special-defense', url: '' } },
      { base_stat: 90, effort: 0, stat: { name: 'speed', url: '' } },
    ],
  } as ResponsePokemonDetaexport;

  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  //Cambia todos los it a ingles

  it('Should render the component correctly', () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    
    expect(screen.getByTestId('pokemon-card')).toBeInTheDocument();
  });

  it('Should display the Pokémon ID with correct format (3 digits)', () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    
    expect(screen.getByText('#025')).toBeInTheDocument();
  });

  it('Should display the ID with correct format for numbers greater than 100', () => {
    const largePokemon = { ...mockPokemon, id: 150 };
    render(<PokemonCard pokemon={largePokemon} />);
    
    expect(screen.getByText('#150')).toBeInTheDocument();
  });

  it('Should display the Pokémon name capitalized', () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    
    expect(screen.getByText('pikachu')).toBeInTheDocument();
  });

  it('Should render the Pokémon image with official artwork', () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    
    const image = screen.getByTestId('pokemon-image');
    expect(image).toHaveAttribute('src', 'https://example.com/pikachu-artwork.png');
    expect(image).toHaveAttribute('alt', 'pikachu');
  });

  it('Should use the default sprite when there are no official illustrations.', () => {
    const pokemonWithoutArtwork = {
      ...mockPokemon,
      sprites: {
        front_default: 'https://example.com/pikachu-default.png',
        other: {},
      },
    } as ResponsePokemonDetaexport;

    render(<PokemonCard pokemon={pokemonWithoutArtwork} />);
    
    const image = screen.getByTestId('pokemon-image');
    expect(image).toHaveAttribute('src', 'https://example.com/pikachu-default.png');
  });

  it('Should render all Pokémon types', () => {
    const dualTypePokemon = {
      ...mockPokemon,
      types: [
        { type: { name: 'fire', url: '' } },
        { type: { name: 'water', url: '' } },
      ],
    } as ResponsePokemonDetaexport;

    render(<PokemonCard pokemon={dualTypePokemon} />);
    
    expect(screen.getByTestId('pokemon-type-fire')).toBeInTheDocument();
    expect(screen.getByTestId('pokemon-type-water')).toBeInTheDocument();
  });

  it('Should render badges for each type', () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    
    const badges = screen.getAllByTestId('badge');
    expect(badges).toHaveLength(1);
    expect(badges[0]).toHaveTextContent('electric');
  });

  it('Should render multiple badges for Pokémon with multiple types', () => {
    const dualTypePokemon = {
      ...mockPokemon,
      types: [
        { type: { name: 'fire', url: '' } },
        { type: { name: 'water', url: '' } },
      ],
    } as ResponsePokemonDetaexport;

    render(<PokemonCard pokemon={dualTypePokemon} />);
    
    const badges = screen.getAllByTestId('badge');
    expect(badges).toHaveLength(2);
  });

  it('Should display HP, ATK, and DEF stats correctly', () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    
    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
    
    expect(screen.getByText('ATK')).toBeInTheDocument();
    expect(screen.getByText('55')).toBeInTheDocument();
    
    expect(screen.getByText('DEF')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
  });

  it('Should call onClick when the card is clicked', async () => {
    const user = userEvent.setup();
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />);
    
    const card = screen.getByTestId('pokemon-card');
    await user.click(card);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('Should not fail if onClick is not defined', async () => {
    const user = userEvent.setup();
    render(<PokemonCard pokemon={mockPokemon} />);
    
    const card = screen.getByTestId('pokemon-card');
    await user.click(card);
    
    // No debería lanzar error
    expect(card).toBeInTheDocument();
  });

  it('Should apply styles with the primary type color', () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    
    const card = screen.getByTestId('pokemon-card');
    expect(card).toHaveStyle({ borderColor: '#F8D03020' });
  });

  it('Should render type indicators with correct colors', async() => {
    const { getTypeColor } = await import('@/lib/pokemonUtils');
    
    render(<PokemonCard pokemon={mockPokemon} />);
    
    const typeIndicator = screen.getByTestId('pokemon-type-electric');
    expect(typeIndicator).toHaveStyle({ backgroundColor: '#F8D030' });
    expect(getTypeColor).toHaveBeenCalledWith('electric');
  });

  it('Should have the correct CSS classes for animations', () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    
    const card = screen.getByTestId('pokemon-card');
    expect(card).toHaveClass('hover:scale-105');
    expect(card).toHaveClass('hover:shadow-2xl');
    expect(card).toHaveClass('cursor-pointer');
  });

  it('Should have the correct itemID in the Card', () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    
    const card = screen.getByTestId('pokemon-card');
    expect(card).toHaveAttribute('data-itemid', 'pokemon-card');
  });

  it('Should handle Pokémon with a single type', () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    
    const typeIndicators = screen.getAllByTestId(/pokemon-type-/);
    expect(typeIndicators).toHaveLength(1);
  });

  it('Should render correctly with different stat values', () => {
    const strongPokemon = {
      ...mockPokemon,
      stats: [
        { base_stat: 100, effort: 0, stat: { name: 'hp', url: '' } },
        { base_stat: 120, effort: 0, stat: { name: 'attack', url: '' } },
        { base_stat: 80, effort: 0, stat: { name: 'defense', url: '' } },
      ],
    } as ResponsePokemonDetaexport;

    render(<PokemonCard pokemon={strongPokemon} />);
    
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('80')).toBeInTheDocument();
  });
})

