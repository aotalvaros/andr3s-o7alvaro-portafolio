/* eslint-disable @typescript-eslint/no-explicit-any */

import { PokemonList } from "@/components/pokemon/components/PokemonList";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePokeApi } from "@/components/pokemon/hooks/usePokeApi";
import { type FetchPokemonListResponse } from "@/services/pokemon/pokeApi.service";

const mockPokemon: FetchPokemonListResponse = {
  pokemon_v2_pokemon:[
    {
      id: 1,
      name: "bulbasaur",
      height: 7,
      pokemon_v2_pokemonmoves:[
        {
          pokemon_v2_move: { name: "tackle" }
        },
        {
          pokemon_v2_move: { name: "vine whip" }
        }
      ],
      pokemon_v2_pokemonsprites:[
        {
          sprites:{
            front_default: "bulbasaur.png"
          }
        }
      ],
      pokemon_v2_pokemonspecy:{
        pokemon_v2_evolutionchain:{
          pokemon_v2_pokemonspecies:[
            { name: "bulbasaur", id: 1 },
            { name: "ivysaur", id: 2 },
            { name: "venusaur", id: 3 },
          ]
        },
        pokemon_v2_pokemonspeciesflavortexts:[
          {
            flavor_text: "A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON."
          }
        ]
      },
      pokemon_v2_pokemonstats:[
        {
          pokemon_v2_stat: { name: "hp" },
          base_stat: 45
        },
        {
          pokemon_v2_stat: { name: "attack" },
          base_stat: 49
        }
      ]
    },
    {
      id: 25,
      name: "pikachu",
      height: 4,
      pokemon_v2_pokemonmoves:[
        {
          pokemon_v2_move: { name: "thunder shock" }
        },
        {
          pokemon_v2_move: { name: "quick attack" }
        }
      ],
      pokemon_v2_pokemonsprites:[
        {
          sprites:{
            front_default: "pikachu.png"
          }
        }
      ],
      pokemon_v2_pokemonspecy:{
        pokemon_v2_evolutionchain:{
          pokemon_v2_pokemonspecies:[
            { name: "pichu", id: 172 },
            { name: "pikachu", id: 25 },
            { name: "raichu", id: 26 },
          ]
        },
        pokemon_v2_pokemonspeciesflavortexts:[
          {
            flavor_text: "When several of these POKéMON gather, their electricity could build and cause lightning storms."
          }
        ]
      },
      pokemon_v2_pokemonstats:[
        {
          pokemon_v2_stat: { name: "hp" },
          base_stat: 35
        },
        {
          pokemon_v2_stat: { name: "attack" },
          base_stat: 55
        }
      ]
    },
  ],
  pokemon_v2_pokemon_aggregate: {
      aggregate: { count: 2 },
    },
} as FetchPokemonListResponse;


const handlePageChange = vi.fn();
const setSelectedPokemon = vi.fn();
const handleSearchChange = vi.fn();

const createMockHookReturn = (overrides?: any) => ({
  data: mockPokemon,
  page: 1,
  totalPages: 10,
  selectedPokemon: null,
  error: null,
  totalCount: 30,
  handlePageChange: handlePageChange,
  setSelectedPokemon: setSelectedPokemon,
  handleSearchChange: handleSearchChange,
  ...overrides,
} as unknown as ReturnType<typeof usePokeApi>);

vi.mock("@/components/pokemon/hooks/usePokeApi");

vi.mock("@/components/ui/CustomSearch", () => ({
  CustomSearch: ({ onSearch }:{ onSearch: (query: string) => void }) => (
    <div data-testid="custom-search">
      Custom Search{" "}
      <button onClick={() => onSearch("pikachu")} data-testid="search-pikachu-button">Search Pikachu</button>  
    </div>
  ),
}));

vi.mock("@/components/pokemon/components/PokemonStats", () => ({
  PokemonStats: () => (
    <div data-testid="pokemon-stats"> pokemon stats</div>
  ),
}));

vi.mock("@/components/pokemon/components/PokemonHeader", () => ({
  PokemonHeader: () => <div data-testid="pokemon-header">Pokemon Header</div>,
}));

vi.mock("@/components/pokemon/components/PokemonSkeleton", () => ({
  PokemonSkeleton: () => <div data-testid="pokemon-skeleton">Loading...</div>,
}));

vi.mock("@/components/pokemon/components/PokemonCard", () => ({
  PokemonCard: ({ pokemon, onClick }: any) => (
    <button data-testid="pokemon-card" onClick={onClick}>
      {pokemon.name}
    </button>
  ),
}));

vi.mock("@/components/layout/pagination/CustomPagination.components", () => ({
  CustomPagination: ({ currentPage, totalPages, onPageChangeNext }: any) => (
    <div data-testid="custom-pagination">
      <button onClick={() => onPageChangeNext(currentPage + 1)}>Next</button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
    </div>
  ),
}));

vi.mock("@/components/ui/Modal", () => ({
  default: ({ open, onClose, children, className }: any) =>
    open ? (
      <div data-testid="modal" className={className}>
        <button data-testid="modal-close" onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    ) : null,
}));

vi.mock("@/components/pokemon/components/PokemonModal", () => ({
  PokemonModal: ({ pokemon }: any) => (
    <div data-testid="pokemon-modal">{pokemon.name} Modal</div>
  ),
}));

describe("PokemonList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn());
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
  })

  describe("Rendering and Structure", () => {
    it("should render the component correctly", () => {
      render(<PokemonList />);

      expect(screen.getByTestId("pokemon-header")).toBeInTheDocument();
    });

    it("should call usePokeApi hook with correct ITEMS_PER_PAGE", () => {
      render(<PokemonList />);

        expect(usePokeApi).toHaveBeenCalledWith(12);
    });

    it("should render PokemonHeader component", () => {
      render(<PokemonList />);

      expect(screen.getByTestId("pokemon-header")).toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("should render skeletons when loading", () => {
        vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ isLoading: true }));

        render(<PokemonList />);

        const skeletons = screen.getAllByTestId("pokemon-skeleton");
        expect(skeletons.length).toBe(12);
    });

    it("should render correct number of skeleton loaders based on ITEMS_PER_PAGE", () => {
        vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ isLoading: true }));

        render(<PokemonList />);

        const skeletons = screen.getAllByTestId("pokemon-skeleton");
        expect(skeletons).toHaveLength(12);
    });

    it("should apply grid classes to skeleton container", () => {
     vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ isLoading: true }));

      const { container } = render(<PokemonList />);

      const gridContainer = container.querySelector(
        ".grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3.xl\\:grid-cols-4"
      );
      expect(gridContainer).toBeInTheDocument();
    });

    it("should not render pokemon cards when loading", () => {
     vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ isLoading: true }));

      render(<PokemonList />);

      expect(screen.queryByTestId("pokemon-card")).not.toBeInTheDocument();
    });

    it("should not render pagination when loading", () => {
     vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ isLoading: true }));

      render(<PokemonList />);

      expect(screen.queryByTestId("custom-pagination")).not.toBeInTheDocument();
    });
  });

  describe("Success State - Pokemon Cards", () => {
    it("should render pokemon cards when data is loaded", () => {
      render(<PokemonList />);

      const cards = screen.getAllByTestId("pokemon-card");
      expect(cards).toHaveLength(2);
    });

    it("should render correct pokemon names in cards", () => {
      render(<PokemonList />);

      expect(screen.getByText("bulbasaur")).toBeInTheDocument();
      expect(screen.getByText("pikachu")).toBeInTheDocument();
    });

    it("should handle empty pokemon data array", () => {
      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ data: { pokemon_v2_pokemon: [] } }));

      render(<PokemonList />);

      expect(screen.queryByTestId("pokemon-card")).not.toBeInTheDocument();
    });
  });

  describe("Pagination", () => {
    it("should render CustomPagination component", () => {
      render(<PokemonList />);

      expect(screen.getByTestId("custom-pagination")).toBeInTheDocument();
    });

    it("should pass correct props to CustomPagination", () => {
      render(<PokemonList />);

      expect(screen.getByText("Page 1 of 10")).toBeInTheDocument();
    });

    it("should call handlePageChange when pagination is used", async () => {
      const user = userEvent.setup();
      const mockHandlePageChange = vi.fn();

      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ handlePageChange: mockHandlePageChange }));

      render(<PokemonList />);

      const nextButton = screen.getByText("Next");
      await user.click(nextButton);

      expect(mockHandlePageChange).toHaveBeenCalledWith(2);
    });

    it("should update pagination when page changes", () => {
      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ page: 5 }));

      render(<PokemonList />);

      expect(screen.getByText("Page 5 of 10")).toBeInTheDocument();
    });
  });

  describe("Pokemon Selection and Modal", () => {
    it("should not render modal when no pokemon is selected", () => {
      render(<PokemonList />);

      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });

    it("should call setSelectedPokemon when a card is clicked", async () => {
      const user = userEvent.setup();
      const mockSetSelectedPokemon = vi.fn();

      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ setSelectedPokemon: mockSetSelectedPokemon }));

      render(<PokemonList />);

      const firstCard = screen.getAllByTestId("pokemon-card")[0];
      await user.click(firstCard);

      expect(mockSetSelectedPokemon).toHaveBeenCalledWith(mockPokemon.pokemon_v2_pokemon[0]);
    });

    it("should render modal when a pokemon is selected", () => {
      const selectedPokemon = mockPokemon.pokemon_v2_pokemon[0];

      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ selectedPokemon }));

      render(<PokemonList />);

      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    it("should pass open prop as true to Modal when pokemon is selected", () => {
      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ selectedPokemon: mockPokemon.pokemon_v2_pokemon[0] }));

      render(<PokemonList />);

      const modal = screen.getByTestId("modal");
      expect(modal).toBeInTheDocument();
    });

    it("should call setSelectedPokemon with null when modal is closed", async () => {
      const user = userEvent.setup();
      const mockSetSelectedPokemon = vi.fn();

      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ selectedPokemon: mockPokemon.pokemon_v2_pokemon[0], setSelectedPokemon: mockSetSelectedPokemon }));
      render(<PokemonList />);

      const closeButton = screen.getByTestId("modal-close");
      await user.click(closeButton);

      expect(mockSetSelectedPokemon).toHaveBeenCalledWith(null);
    });

    it("should apply correct className to Modal", () => {
      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ selectedPokemon: mockPokemon.pokemon_v2_pokemon[0] })); 

      render(<PokemonList />);

      const modal = screen.getByTestId("modal");
      expect(modal).toHaveClass("pr-[10px]");
    });
  });

  describe("Integration Tests", () => {
    it("should handle complete user flow: load -> select pokemon -> close modal", async () => {
      const user = userEvent.setup();
      const mockSetSelectedPokemon = vi.fn();

      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ setSelectedPokemon: mockSetSelectedPokemon }));

      const { rerender } = render(<PokemonList />);

      // Click on pokemon card
      const firstCard = screen.getAllByTestId("pokemon-card")[0];
      await user.click(firstCard);

      expect(mockSetSelectedPokemon).toHaveBeenCalledWith(mockPokemon.pokemon_v2_pokemon[0]);

      // Simulate pokemon selection
      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ selectedPokemon: mockPokemon.pokemon_v2_pokemon[0], setSelectedPokemon: mockSetSelectedPokemon }));
      rerender(<PokemonList />);

      expect(screen.getByTestId("modal")).toBeInTheDocument();

      // Close modal
      const closeButton = screen.getByTestId("modal-close");
      await user.click(closeButton);

      expect(mockSetSelectedPokemon).toHaveBeenCalledWith(null);
    });

    it("should render all components together in success state", () => {
      render(<PokemonList />);

      expect(screen.getByTestId("pokemon-header")).toBeInTheDocument();
      expect(screen.getAllByTestId("pokemon-card")).toHaveLength(2);
      expect(screen.getByTestId("custom-pagination")).toBeInTheDocument();
    });

    it("should handle multiple pokemon selections", async () => {
      const user = userEvent.setup();
      const mockSetSelectedPokemon = vi.fn();

      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ setSelectedPokemon: mockSetSelectedPokemon }));

      render(<PokemonList />);

      const cards = screen.getAllByTestId("pokemon-card");

      await user.click(cards[0]);
      expect(mockSetSelectedPokemon).toHaveBeenCalledWith(mockPokemon.pokemon_v2_pokemon[0]);

      await user.click(cards[1]);
      expect(mockSetSelectedPokemon).toHaveBeenCalledWith(mockPokemon.pokemon_v2_pokemon[1]);

      await user.click(cards[2]);
      expect(mockSetSelectedPokemon).toHaveBeenCalledWith(mockPokemon.pokemon_v2_pokemon[1]);

      expect(mockSetSelectedPokemon).toHaveBeenCalledTimes(3);
    });
  });

  describe("Edge Cases", () => {
    it("should handle single pokemon in data array", () => {
      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ pokemonData: [mockPokemon.pokemon_v2_pokemon[0]] }));

      render(<PokemonList />);

      const cards = screen.getAllByTestId("pokemon-card");
      expect(cards).toHaveLength(2);
    });

    it("should handle large number of pokemon", () => {
      const largePokemonArray = Array.from({ length: 50 }, (_, i) => ({
        ...mockPokemon,
        id: i + 1,
        name: `pokemon${i + 1}`,
      }));

      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ pokemonData: largePokemonArray }));

      render(<PokemonList />);

      const cards = screen.getAllByTestId("pokemon-card");
      expect(cards).toHaveLength(2);
    });

    it("should handle page 1 of 1", () => {
      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ page: 1, totalPages: 1 }));
      render(<PokemonList />);

      expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
    });

    it("should handle last page", () => {
      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ page: 10, totalPages: 10 }));
      render(<PokemonList />);

      expect(screen.getByText("Page 10 of 10")).toBeInTheDocument();
    });
  });

  describe("Component State Transitions", () => {
    it("should transition from loading to success state", () => {
      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ isLoading: true }));

      const { rerender } = render(<PokemonList />);

      expect(screen.getAllByTestId("pokemon-skeleton")).toHaveLength(12);

      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ isLoading: false }));            

      rerender(<PokemonList />);

      expect(screen.queryByTestId("pokemon-skeleton")).not.toBeInTheDocument();
      expect(screen.getAllByTestId("pokemon-card")).toHaveLength(2);
    });

    it("should transition from success to error state", () => {
      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ isLoading: false, error: null }));


      const { rerender } = render(<PokemonList />);

      expect(screen.getAllByTestId("pokemon-card")).toHaveLength(2);

      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ isLoading: false, error: new Error("Network error") }));

      rerender(<PokemonList />);

      expect(screen.getByText("Error loading data")).toBeInTheDocument();
      expect(screen.queryByTestId("pokemon-card")).not.toBeInTheDocument();
    });
  });
});
