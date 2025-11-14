/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PokemonModal } from '@/components/pokemon/components/PokemonModal';
import { usePokemonModal } from '@/components/pokemon/hooks/usePokemonModal';
import { IEvolutionchain, IPokemon } from '@/services/pokemon/models/pokemon.interface';
import { RefObject } from 'react';

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
      },
      {
        base_stat: 40,
        pokemon_v2_stat: {
          name: 'defense'
        }
      }
  ],
  pokemon_v2_pokemonspecy:{
    pokemon_v2_pokemonspeciesflavortexts:[
      {
        flavor_text: 'Este Pokémon tiene sacos de electricidad en sus mejillas.'
      }
    ],
    pokemon_v2_evolutionchain: {
      pokemon_v2_pokemonspecies: [
        {
          id: 172,
          name: 'pichu',
        },
        {
          id: 25,
          name: 'pikachu',
        },
        {
          id: 26,
          name: 'raichu',
        }
      ]
    }
  }
} as IPokemon

const mockEvolutionChain: IEvolutionchain[] = [
  {
    id: 1,
    name: 'pikachu',
    pokemon_v2_pokemons: [
      {
        id: 25,
        name: 'pikachu',
        pokemon_v2_pokemonsprites: [
            {
              sprites: {
                other: {
                  'official-artwork': {
                    front_default: 'https://example.com/pikachu-artwork.png'
                  },
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
        ],
        pokemon_v2_pokemonspecy: {
          pokemon_v2_evolutionchain:{
            pokemon_v2_pokemonspecies: [
              {
                id: 172,
                name: 'pichu',
              },
              {
                id: 25,
                name: 'pikachu',
              },
              {
                id: 26,
                name: 'raichu',
              }
            ]
          },
          pokemon_v2_pokemonspeciesflavortexts: [
            {
              flavor_text: 'This is a flavor text'
            }
          ]
        }
      }
    ]
  },
  {
    id: 2,
    name: 'raichu',
  },
  {
    id: 3,
    name: 'raichu',
  }
] as IEvolutionchain[];

const mockhandleEvolve = vi.fn()
const mockhandleReset = vi.fn()

const mockResponseUsePokemonModal = {
  imageContainerRef:  {} as RefObject<HTMLDivElement | null>,
  currentPokemon: mockPokemon,
  currentEvolutionIndex : 0,
  canEvolve: false,
  hasEvolved: false,
  isEvolving: false,
  evolutionChain: mockEvolutionChain,
  handleEvolve: mockhandleEvolve,
  handleReset: mockhandleReset,
}

vi.mock("@/components/pokemon/hooks/usePokemonModal")

vi.mock('@/components/pokemon/utils/PokemonImage', () => ({
  PokemonImage: ({ pokemon, isEvolving }: any) => (
    <div data-testid="pokemon-image" data-evolving={isEvolving}>
      {pokemon.name}
    </div>
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, className, size, ...props }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/progress', () => ({
  Progress: ({ value, className }: any) => (
    <div data-testid="progress" data-value={value} className={className} />
  ),
}));

vi.mock('@/components/ui/alert', () => ({
  Alert: ({ children, variant }: any) => (
    <div data-testid="alert" data-variant={variant}>
      {children}
    </div>
  ),
  AlertDescription: ({ children }: any) => <div data-testid="alert-description">{children}</div>,
}));

vi.mock('@/lib/pokemonUtils', () => ({
  getTypeColor: vi.fn((type: string) => {
    const colors: Record<string, string> = {
      electric: '#F8D030',
      fire: '#F08030',
      water: '#6890F0',
    };
    return colors[type] || '#68A090';
  }),
}));

vi.mock('lucide-react', () => ({
  Loader2: ({ className }: any) => <span data-testid="loader-icon" className={className} />,
  RotateCcw: ({ className }: any) => <span data-testid="rotate-icon" className={className} />,
  Sparkles: ({ className }: any) => <span data-testid="sparkles-icon" className={className} />,
  AlertCircle: ({ className }: any) => <span data-testid="alert-icon" className={className} />,
}));

describe('PokemonModal', () => {

  beforeEach(() => {
    vi.mocked(usePokemonModal).mockReturnValue(mockResponseUsePokemonModal);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  describe('Initial Rendering', () => {
    it('should render the component correctly', () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      expect(screen.getByTestId('pokemon-modal')).toBeInTheDocument();
      expect(screen.getByTestId('pokemon-name')).toHaveTextContent('pikachu');
      expect(screen.getByTestId('pokemon-id')).toHaveTextContent('#025');
      expect(screen.getByTestId('pokemon-image')).toHaveTextContent('pikachu');
    });

    it('should display pokemon name and ID correctly',  () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      expect(screen.getByTestId('pokemon-name')).toBeInTheDocument();
      expect(screen.getByTestId('pokemon-id')).toBeInTheDocument();
    });

    it('should render pokemon image', () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      const image = screen.getByTestId('pokemon-image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveTextContent('pikachu');

    });

    it('should display pokemon types with correct styling',  () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      const typeBadge = screen.getByTestId('pokemon-type-electric');
      expect(typeBadge).toBeInTheDocument();
      expect(typeBadge).toHaveTextContent('electric');
      expect(typeBadge).toHaveStyle({ backgroundColor: '#F8D030' });

    });

    it('should display physical stats (height and weight)',  () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      expect(screen.getByText('0.4 m')).toBeInTheDocument();
      expect(screen.getByText('6.0 kg')).toBeInTheDocument();
    });

    it('should render all pokemon stats',  () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      expect(screen.getByTestId('pokemon-stat-name-hp')).toBeInTheDocument();
      expect(screen.getByTestId('pokemon-stat-name-attack')).toBeInTheDocument();
      expect(screen.getByTestId('pokemon-stat-name-defense')).toBeInTheDocument();
    });
  });

  describe('Pokemon Description', () => {
    it('should display description in Spanish when available',  () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      const description = screen.getByTestId('pokemon-description');
      expect(description).toBeInTheDocument();
      expect(description).toHaveTextContent('Este Pokémon tiene sacos de electricidad en sus mejillas.');

    });

    it('should clean up form feed characters in description', async () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      const description = screen.getByTestId('pokemon-description');
      expect(description.textContent).not.toContain('\f');
      expect(description.textContent).toContain(' ');
    });
  });

  describe('Evolution Chain', () => {
    it('should display evolution chain when available', () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      expect(screen.getByText('Cadena de Evolución')).toBeInTheDocument();
      expect(screen.getByTestId('evolution-stage-pichu')).toBeInTheDocument();
      expect(screen.getByTestId('evolution-stage-pikachu')).toBeInTheDocument();
      expect(screen.getByTestId('evolution-stage-raichu')).toBeInTheDocument();

    });

    it('should highlight current evolution stage',  () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      const pikachuBadge = screen.getByTestId('evolution-stage-pikachu');
      expect(pikachuBadge).toHaveClass('bg-primary');
    });

    it('should show evolution arrows between stages', () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      const arrows = screen.getAllByText('→');
      expect(arrows).toHaveLength(2);
    });

    it('should parse evolution chain correctly',  () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      const evolutionStages = screen.getAllByTestId(/evolution-stage-/);
      expect(evolutionStages).toHaveLength(3);
      expect(evolutionStages[0]).toHaveTextContent('pikachu');
      expect(evolutionStages[1]).toHaveTextContent('raichu');
      expect(evolutionStages[2]).toHaveTextContent('pichu');
    });
  });

  describe('Evolution Functionality', () => {
    it('should enable evolve button when pokemon can evolve',  () => {
       vi.mocked(usePokemonModal).mockReturnValue({
        ...mockResponseUsePokemonModal,
        canEvolve: true,
      });
      render(<PokemonModal pokemon={mockPokemon} />);

      const evolveButton = screen.getByTestId('evolve-button');
      expect(evolveButton).not.toBeDisabled();
    });

    it('should disable evolve button when pokemon is at final evolution',  () => {
      vi.mocked(usePokemonModal).mockReturnValue({
        ...mockResponseUsePokemonModal,
        canEvolve: false,
      });
      render(<PokemonModal pokemon={mockPokemon} />);

      const evolveButton = screen.getByTestId('evolve-button');
      expect(evolveButton).toBeDisabled();
    });

    it('should show evolving state when evolving',  async() => {
      vi.mocked(usePokemonModal).mockReturnValue({
        ...mockResponseUsePokemonModal,

        isEvolving: true
      });
      
      const user = userEvent.setup();
      render(<PokemonModal pokemon={mockPokemon} />);

      const evolveButton = screen.getByTestId('evolve-button');
      await user.click(evolveButton);

      expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
      expect(screen.getByText('Evolucionando...')).toBeInTheDocument();
    });

    it('should evolve to next pokemon when clicking evolve button', async () => {
      vi.mocked(usePokemonModal).mockReturnValue({
        ...mockResponseUsePokemonModal,
        canEvolve: true,
      });
      const user = userEvent.setup();
      render(<PokemonModal pokemon={mockPokemon} />);

      expect(screen.getByTestId('evolve-button')).not.toBeDisabled();

      const evolveButton = screen.getByTestId('evolve-button');
      await user.click(evolveButton);

      expect(mockhandleEvolve).toHaveBeenCalled();
    });

    it('should update pokemon stats after evolution', async () => {
      vi.mocked(usePokemonModal).mockReturnValue({
        ...mockResponseUsePokemonModal,
        canEvolve: true,
      });
      const user = userEvent.setup();
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByTestId('evolve-button')).not.toBeDisabled();
      });

      const evolveButton = screen.getByTestId('evolve-button');
      await user.click(evolveButton);

      await waitFor(() => {
        expect(screen.getByTestId('pokemon-stat-name-hp')).toBeInTheDocument();
        expect(screen.getByTestId('pokemon-stat-name-attack')).toBeInTheDocument();
      }, { timeout: 3000 });
    });


    it('should set isEvolving flag during evolution animation', async () => {
      vi.mocked(usePokemonModal).mockReturnValue({
        ...mockResponseUsePokemonModal,
        canEvolve: true,
      });
      const user = userEvent.setup();
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByTestId('evolve-button')).not.toBeDisabled();
      });

      const evolveButton = screen.getByTestId('evolve-button');
      await user.click(evolveButton);

      expect(mockhandleEvolve).toHaveBeenCalled();
    });

  });

  describe('Reset Functionality', () => {
    it('should disable reset button initially', async () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        const resetButton = screen.getByTestId('reset-button');
        expect(resetButton).toBeDisabled();
      });
    });

    it('should enable reset button after evolution', async () => {
       vi.mocked(usePokemonModal).mockReturnValue({
        ...mockResponseUsePokemonModal,
        canEvolve: true,
        hasEvolved: true
      });
      const user = userEvent.setup();
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByTestId('evolve-button')).not.toBeDisabled();
      });

      const evolveButton = screen.getByTestId('evolve-button');
      await user.click(evolveButton);

      await waitFor(() => {
        const resetButton = screen.getByTestId('reset-button');
        expect(resetButton).not.toBeDisabled();
      }, { timeout: 3000 });
    });

    it('should reset to original pokemon when clicking reset', async () => {
       vi.mocked(usePokemonModal).mockReturnValue({
        ...mockResponseUsePokemonModal,
        canEvolve: true,
        hasEvolved: true
      });
      const user = userEvent.setup();
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByTestId('evolve-button')).not.toBeDisabled();
      });

      // Evolve first
      const evolveButton = screen.getByTestId('evolve-button');
      await user.click(evolveButton);

      await waitFor(() => {
        expect(screen.getByTestId('reset-button')).not.toBeDisabled();
      }, { timeout: 3000 });

      // Then reset
      const resetButton = screen.getByTestId('reset-button');
      await user.click(resetButton);

      await waitFor(() => {
        const image = screen.getByTestId('pokemon-image');
        expect(image).toHaveTextContent('pikachu');
      });
    });

    it('should restore original stats after reset', async () => {
       vi.mocked(usePokemonModal).mockReturnValue({
        ...mockResponseUsePokemonModal,
        canEvolve: true,
        hasEvolved: true
      });
      const user = userEvent.setup();
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByTestId('evolve-button')).not.toBeDisabled();
      });

      // Evolve
      const evolveButton = screen.getByTestId('evolve-button');
      await user.click(evolveButton);

      await waitFor(() => {
        expect(screen.getByTestId('reset-button')).not.toBeDisabled();
      }, { timeout: 3000 });

      // Reset
      const resetButton = screen.getByTestId('reset-button');
      await user.click(resetButton);

      await waitFor(() => {
        expect(screen.getByText('0.4 m')).toBeInTheDocument();
        expect(screen.getByText('6.0 kg')).toBeInTheDocument();
      });
    });

    it('should update evolution chain highlight after reset', async () => {
       vi.mocked(usePokemonModal).mockReturnValue({
        ...mockResponseUsePokemonModal,
        canEvolve: true,
        hasEvolved: true
      });
      const user = userEvent.setup();
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByTestId('evolve-button')).not.toBeDisabled();
      });

      // Evolve
      const evolveButton = screen.getByTestId('evolve-button');
      await user.click(evolveButton);

      await waitFor(() => {
        expect(screen.getByTestId('reset-button')).not.toBeDisabled();
      }, { timeout: 3000 });

      // Reset
      const resetButton = screen.getByTestId('reset-button');
      await user.click(resetButton);

      await waitFor(() => {
        const pikachuBadge = screen.getByTestId('evolution-stage-pikachu');
        expect(pikachuBadge).toHaveClass('bg-primary');
      });
    });
  });


  describe('Edge Cases', () => {
    it('should handle pokemon with multiple types',  () => {

      render(<PokemonModal pokemon={mockPokemon} />);

      expect(screen.getByTestId('pokemon-type-electric')).toBeInTheDocument();
    });

    it('should handle pokemon with ID > 999', () => {
      const futurePokemon = {
        ...mockPokemon,
      };

      render(<PokemonModal pokemon={futurePokemon} />);

      expect(screen.getByTestId('pokemon-id')).toHaveTextContent('#025');
    });

  });


});