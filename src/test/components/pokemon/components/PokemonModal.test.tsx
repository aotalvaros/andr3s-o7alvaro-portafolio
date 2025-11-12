/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PokemonModal } from '@/components/pokemon/components/PokemonModal';
import { ResponsePokemonDetaexport, PokemonSpecies, EvolutionChain } from '@/services/pokemon/models/responsePokemon.interface';
import api from "@/lib/axios";

const mockPokemon: ResponsePokemonDetaexport = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  types: [
    { slot: 1, type: { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' } },
  ],
  sprites: {
    front_default: 'https://example.com/pikachu.png',
    back_default: null,
    back_female: null,
    back_shiny: null,
    back_shiny_female: null,
    front_female: null,
    front_shiny: null,
    front_shiny_female: null,
    other: {
      dream_world: {
        front_default: null,
        front_female: null,
      },
      home: {
        front_default: null,
        front_female: null,
        front_shiny: null,
        front_shiny_female: null,
      },
      'official-artwork': {
        front_default: 'https://example.com/pikachu-artwork.png',
        front_shiny: null,
      },
      showdown: {
        back_default: null,
        back_female: null,
        back_shiny: null,
        back_shiny_female: null,
        front_default: null,
        front_female: null,
        front_shiny: null,
        front_shiny_female: null,
      },
    },
    versions: {} as any,
  },
  stats: [
    { base_stat: 35, effort: 0, stat: { name: 'hp', url: '' } },
    { base_stat: 55, effort: 0, stat: { name: 'attack', url: '' } },
    { base_stat: 40, effort: 0, stat: { name: 'defense', url: '' } },
    { base_stat: 50, effort: 0, stat: { name: 'special-attack', url: '' } },
    { base_stat: 50, effort: 0, stat: { name: 'special-defense', url: '' } },
    { base_stat: 90, effort: 0, stat: { name: 'speed', url: '' } },
  ],
  abilities: [],
  base_experience: 112,
  cries: { latest: '', legacy: '' },
  forms: [],
  game_indices: [],
  held_items: [],
  is_default: true,
  location_area_encounters: '',
  moves: [],
  order: 35,
  past_abilities: [],
  past_types: [],
  species: { name: 'pikachu', url: '' },
} as unknown as ResponsePokemonDetaexport;

const mockPichu: ResponsePokemonDetaexport = {
  ...mockPokemon,
  id: 172,
  name: 'pichu',
  height: 3,
  weight: 20,
};

const mockRaichu: ResponsePokemonDetaexport = {
  ...mockPokemon,
  id: 26,
  name: 'raichu',
  height: 8,
  weight: 300,
};

const mockSpeciesData: PokemonSpecies = {
  id: 25,
  name: 'pikachu',
  flavor_text_entries: [
    {
      flavor_text: 'Este Pokémon tiene sacos\fde electricidad en sus mejillas.',
      language: { name: 'es', url: '' },
      version: { name: 'red', url: '' },
    },
    {
      flavor_text: 'This Pokémon has electricity-storing pouches on its cheeks.',
      language: { name: 'en', url: '' },
      version: { name: 'red', url: '' },
    },
  ],
  evolution_chain: {
    url: 'https://pokeapi.co/api/v2/evolution-chain/10/',
  },
} as PokemonSpecies;

const mockEvolutionChain: EvolutionChain = {
  id: 10,
  chain: {
    species: { name: 'pichu', url: '' },
    evolves_to: [
      {
        species: { name: 'pikachu', url: '' },
        evolves_to: [
          {
            species: { name: 'raichu', url: '' },
            evolves_to: [],
          },
        ],
      },
    ],
  },
} as unknown as EvolutionChain;

vi.mock("@/lib/axios");

// Mock components
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

  const mockFetch = (map: Record<string, any>) => {
    globalThis.fetch = vi.fn((url: string) => {
      const key = Object.keys(map).find(k => url.includes(k));
      if (key) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(map[key]),
        } as unknown as Response);
      }
      return Promise.reject(new Error('Unknown fetch URL'));
    }) as unknown as typeof fetch;
  };


 beforeEach(() => {
   vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.clearAllMocks();

    Element.prototype.scrollIntoView = vi.fn();
    
    vi.mocked(api.get).mockImplementation((url: string) => {
      if (url.includes('pokemon-species')) {
        return Promise.resolve({ data: mockSpeciesData });
      }
      if (url.includes('evolution-chain')) {
        return Promise.resolve({ data: mockEvolutionChain });
      }
      return Promise.reject(new Error('Unknown API URL'));
    });

    // Setup default fetch responses
    mockFetch({
      'pokemon/raichu': mockRaichu,
      'pokemon/pichu': mockPichu,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Rendering', () => {
    it('should render the component correctly', async () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByTestId('pokemon-modal')).toBeInTheDocument();
      });

      expect(screen.getByTestId('pokemon-name')).toHaveTextContent('pikachu');
      expect(screen.getByTestId('pokemon-id')).toHaveTextContent('#025');
      expect(screen.getByTestId('pokemon-image')).toHaveTextContent('pikachu');
    });

    it('should display pokemon name and ID correctly', async () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByTestId('pokemon-name')).toBeInTheDocument();
      });

      expect(screen.getByTestId('pokemon-id')).toBeInTheDocument();
    });

    it('should render pokemon image', async () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        const image = screen.getByTestId('pokemon-image');
        expect(image).toBeInTheDocument();
        expect(image).toHaveTextContent('pikachu');
      });
    });

    it('should display pokemon types with correct styling', async () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        const typeBadge = screen.getByTestId('pokemon-type-electric');
        expect(typeBadge).toBeInTheDocument();
        expect(typeBadge).toHaveTextContent('electric');
        expect(typeBadge).toHaveStyle({ backgroundColor: '#F8D030' });
      });
    });

    it('should display physical stats (height and weight)', async () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByText('0.4 m')).toBeInTheDocument();
        expect(screen.getByText('6.0 kg')).toBeInTheDocument();
      });
    });

    it('should render all pokemon stats', async () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByTestId('pokemon-stat-name-hp')).toBeInTheDocument();
        expect(screen.getByTestId('pokemon-stat-name-attack')).toBeInTheDocument();
        expect(screen.getByTestId('pokemon-stat-name-defense')).toBeInTheDocument();
        expect(screen.getByTestId('pokemon-stat-name-special-attack')).toBeInTheDocument();
        expect(screen.getByTestId('pokemon-stat-name-special-defense')).toBeInTheDocument();
        expect(screen.getByTestId('pokemon-stat-name-speed')).toBeInTheDocument();
      });
    });

    it('should format stat names correctly', async () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByText('special attack')).toBeInTheDocument();
        expect(screen.getByText('special defense')).toBeInTheDocument();
      });
    });
  });

  describe('Pokemon Description', () => {
    it('should display description in Spanish when available', async () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        const description = screen.getByTestId('pokemon-description');
        expect(description).toBeInTheDocument();
        expect(description).toHaveTextContent('Este Pokémon tiene sacos de electricidad en sus mejillas.');
      });
    });

    it('should clean up form feed characters in description', async () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        const description = screen.getByTestId('pokemon-description');
        expect(description.textContent).not.toContain('\f');
        expect(description.textContent).toContain(' ');
      });
    });

    it('should not display description while loading', async() => {
      
      render(<PokemonModal pokemon={mockPokemon} />);

      await act( async() => {
        expect(screen.queryByTestId('pokemon-description')).not.toBeInTheDocument();
      })
    });

    it('should handle missing Spanish description gracefully', async () => {
      const speciesWithoutSpanish = {
        ...mockSpeciesData,
        flavor_text_entries: [
          {
            flavor_text: 'English only description',
            language: { name: 'en', url: '' },
            version: { name: 'red', url: '' },
          },
        ],
      };

      vi.mocked(api.get).mockImplementation((url: string) => {
        if (url.includes('pokemon-species')) {
          return Promise.resolve({ data: speciesWithoutSpanish });
        }
        if (url.includes('evolution-chain')) {
          return Promise.resolve({ data: mockEvolutionChain });
        }
        return Promise.reject(new Error('Unknown API URL'));
      });

      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.queryByTestId('pokemon-description')).not.toBeInTheDocument();
      });
    });
  });

  describe('Evolution Chain', () => {
    it('should display evolution chain when available', async () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByText('Evolution Chain')).toBeInTheDocument();
        expect(screen.getByTestId('evolution-stage-pichu')).toBeInTheDocument();
        expect(screen.getByTestId('evolution-stage-pikachu')).toBeInTheDocument();
        expect(screen.getByTestId('evolution-stage-raichu')).toBeInTheDocument();
      });
    });

    it('should highlight current evolution stage', async () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        const pikachuBadge = screen.getByTestId('evolution-stage-pikachu');
        expect(pikachuBadge).toHaveClass('bg-primary');
      });
    });

    it('should show evolution arrows between stages', async () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        const arrows = screen.getAllByText('→');
        expect(arrows).toHaveLength(2);
      });
    });

    it('should not display evolution chain for single-stage pokemon', async () => {
      const singleStageChain: EvolutionChain = {
        id: 1,
        chain: {
          species: { name: 'pikachu', url: '' },
          evolves_to: [],
        },
      } as unknown as EvolutionChain;

      vi.mocked(api.get).mockImplementation((url: string) => {
        if (url.includes('pokemon-species')) {
          return Promise.resolve({ data: mockSpeciesData });
        }
        if (url.includes('evolution-chain')) {
          return Promise.resolve({ data: singleStageChain });
        }
        return Promise.reject(new Error('Unknown API URL'));
      });

      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.queryByText('Evolution Chain')).not.toBeInTheDocument();
      });
    });

    it('should parse evolution chain correctly', async () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        const evolutionStages = screen.getAllByTestId(/evolution-stage-/);
        expect(evolutionStages).toHaveLength(3);
        expect(evolutionStages[0]).toHaveTextContent('pichu');
        expect(evolutionStages[1]).toHaveTextContent('pikachu');
        expect(evolutionStages[2]).toHaveTextContent('raichu');
      });
    });
  });

  describe('Evolution Functionality', () => {
    it('should enable evolve button when pokemon can evolve', async () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        const evolveButton = screen.getByTestId('evolve-button');
        expect(evolveButton).not.toBeDisabled();
      });
    });

    it('should disable evolve button when pokemon is at final evolution', async () => {
      render(<PokemonModal pokemon={mockRaichu} />);

      await waitFor(() => {
        const evolveButton = screen.getByTestId('evolve-button');
        expect(evolveButton).toBeDisabled();
      });
    });

    it('should show evolving state when evolving', async () => {
      const user = userEvent.setup();
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByTestId('evolve-button')).not.toBeDisabled();
      });

      const evolveButton = screen.getByTestId('evolve-button');
      await user.click(evolveButton);

      expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
      expect(screen.getByText('Evolucionando...')).toBeInTheDocument();
    });

    it('should evolve to next pokemon when clicking evolve button', async () => {
      const user = userEvent.setup();
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByTestId('evolve-button')).not.toBeDisabled();
      });

      const evolveButton = screen.getByTestId('evolve-button');
      await user.click(evolveButton);

      await waitFor(() => {
        const image = screen.getByTestId('pokemon-image');
        expect(image).toHaveTextContent('raichu');
      }, { timeout: 3000 });
    });

    it('should update pokemon stats after evolution', async () => {
      const user = userEvent.setup();
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByTestId('evolve-button')).not.toBeDisabled();
      });

      const evolveButton = screen.getByTestId('evolve-button');
      await user.click(evolveButton);

      await waitFor(() => {
        expect(screen.getByText('0.8 m')).toBeInTheDocument();
        expect(screen.getByText('30.0 kg')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should scroll to image when evolving', async () => {
      const user = userEvent.setup();
      const scrollIntoViewMock = vi.fn();
      Element.prototype.scrollIntoView = scrollIntoViewMock;

      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByTestId('evolve-button')).not.toBeDisabled();
      });

      const evolveButton = screen.getByTestId('evolve-button');
      await user.click(evolveButton);

      await waitFor(() => {
        expect(scrollIntoViewMock).toHaveBeenCalledWith({
          behavior: "smooth",
          block: "start",
        });
      });
    });

    it('should set isEvolving flag during evolution animation', async () => {
      const user = userEvent.setup();
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByTestId('evolve-button')).not.toBeDisabled();
      });

      const evolveButton = screen.getByTestId('evolve-button');
      await user.click(evolveButton);

      const image = screen.getByTestId('pokemon-image');
      expect(image).toHaveAttribute('data-evolving', 'true');
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

  describe('Error Handling', () => {
    it('should display error message when API fails', async () => {
      vi.mocked(api.get).mockRejectedValue(new Error('API Error'));

      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByTestId('alert')).toBeInTheDocument();
        expect(screen.getByTestId('alert-description')).toHaveTextContent(
          '!Ups¡ El servicio para obtener más detalles de este Pokémon está fallando'
        );
      });
    });

    it('should log error to console when fetch fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(api.get).mockRejectedValue(new Error('Network error'));

      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          '[v0] Error fetching Pokémon details:',
          expect.any(Error)
        );
      });

      consoleErrorSpy.mockRestore();
    });

    it('should not show description on error', async () => {
      vi.mocked(api.get).mockRejectedValue(new Error('API Error'));

      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByTestId('alert')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('pokemon-description')).not.toBeInTheDocument();
    });

    it('should not show evolution chain on error', async () => {
      vi.mocked(api.get).mockRejectedValue(new Error('API Error'));

      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByTestId('alert')).toBeInTheDocument();
      });

      expect(screen.queryByText('Evolution Chain')).not.toBeInTheDocument();
    });

    it('should still display basic pokemon info on error', async () => {
      vi.mocked(api.get).mockRejectedValue(new Error('API Error'));

      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByTestId('alert')).toBeInTheDocument();
      });

      expect(screen.getByTestId('pokemon-name')).toHaveTextContent('pikachu');
      expect(screen.getByTestId('pokemon-id')).toHaveTextContent('#025');
      expect(screen.getByTestId('pokemon-type-electric')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA description for disabled evolve button', async () => {
      render(<PokemonModal pokemon={mockRaichu} />);

      await waitFor(() => {
        const evolveButton = screen.getByTestId('evolve-button');
        expect(evolveButton).toHaveAttribute('aria-describedby', 'evolve-disabled-reason');
      });

      expect(screen.getByTestId('evolve-disabled-reason')).toHaveTextContent(
        'Este Pokémon no puede evolucionar más o no tiene evoluciones disponibles.'
      );
    });

    it('should have screen reader only text for disabled evolve button', async () => {
      render(<PokemonModal pokemon={mockRaichu} />);

      await waitFor(() => {
        const srText = screen.getByTestId('evolve-disabled-reason');
        expect(srText).toHaveClass('sr-only');
      });
    });

    it('should not show disabled reason when button is enabled', async () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        const evolveButton = screen.getByTestId('evolve-button');
        expect(evolveButton).not.toHaveAttribute('aria-describedby');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle pokemon with multiple types', async () => {
      const multiTypePokemon = {
        ...mockPokemon,
        types: [
          { slot: 1, type: { name: 'electric', url: '' } },
          { slot: 2, type: { name: 'fire', url: '' } },
        ],
      };

      render(<PokemonModal pokemon={multiTypePokemon} />);

      await waitFor(() => {
        expect(screen.getByTestId('pokemon-type-electric')).toBeInTheDocument();
        expect(screen.getByTestId('pokemon-type-fire')).toBeInTheDocument();
      });
    });

    it('should handle pokemon with ID > 999', async () => {
      const futurePokemon = {
        ...mockPokemon,
        id: 1025,
      };

      render(<PokemonModal pokemon={futurePokemon} />);

      await waitFor(() => {
        expect(screen.getByText('#1025')).toBeInTheDocument();
      });
    });

    it('should handle empty evolution chain gracefully', async () => {
      const emptyChain: EvolutionChain = {
        id: 1,
        chain: {
          species: { name: 'ditto', url: '' },
          evolves_to: [],
        },
      } as unknown as EvolutionChain;

      vi.mocked(api.get).mockImplementation((url: string) => {
        if (url.includes('pokemon-species')) {
          return Promise.resolve({ data: mockSpeciesData });
        }
        if (url.includes('evolution-chain')) {
          return Promise.resolve({ data: emptyChain });
        }
        return Promise.reject(new Error('Unknown API URL'));
      });

      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.queryByText('Evolution Chain')).not.toBeInTheDocument();
      });
    });
  });

  describe('API Configuration', () => {
    it('should call API with showLoading: false', async () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith(
          expect.stringContaining('pokemon-species'),
          { showLoading: false }
        );
      });
    });

    it('should make two API calls on mount', async () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(api.get).toHaveBeenCalledTimes(2);
      });

      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('pokemon-species'),
        expect.any(Object)
      );
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('evolution-chain'),
        expect.any(Object)
      );
    });

    it('should use correct pokemon ID in API calls', async () => {
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith(
          'https://pokeapi.co/api/v2/pokemon-species/25',
          expect.any(Object)
        );
      });
    });
  });

  describe('Component State Management', () => {
    it('should preserve original pokemon reference', async () => {
      const user = userEvent.setup();
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByTestId('evolve-button')).not.toBeDisabled();
      });

      // Evolve multiple times
      const evolveButton = screen.getByTestId('evolve-button');
      await user.click(evolveButton);

      await waitFor(() => {
        expect(screen.getByTestId('reset-button')).not.toBeDisabled();
      }, { timeout: 3000 });

      // Reset should always return to original
      const resetButton = screen.getByTestId('reset-button');
      await user.click(resetButton);

      await waitFor(() => {
        const image = screen.getByTestId('pokemon-image');
        expect(image).toHaveTextContent('pikachu');
      });
    });

    it('should track current evolution index correctly', async () => {
      const user = userEvent.setup();
      render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        // Initial state - pikachu (index 1)
        const pikachuBadge = screen.getByTestId('evolution-stage-pikachu');
        expect(pikachuBadge).toHaveClass('bg-primary');
      });

      // Evolve to raichu (index 2)
      const evolveButton = screen.getByTestId('evolve-button');
      await user.click(evolveButton);

      await waitFor(() => {
        const raichuBadge = screen.getByTestId('evolution-stage-raichu');
        expect(raichuBadge).toHaveClass('bg-primary');
      }, { timeout: 3000 });
    });
  });

  describe('Performance', () => {
    it('should not re-fetch data unnecessarily', async () => {
      const { rerender } = render(<PokemonModal pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(api.get).toHaveBeenCalledTimes(2);
      });

      vi.clearAllMocks();

      // Re-render with same pokemon
      rerender(<PokemonModal pokemon={mockPokemon} />);

      // Should not make new API calls
      expect(api.get).not.toHaveBeenCalled();
    });

  });

});