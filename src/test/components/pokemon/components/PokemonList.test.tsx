/* eslint-disable @typescript-eslint/no-explicit-any */
import { PokemonList } from "@/components/pokemon/components/PokemonList";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ResponsePokemonDetaexport,
} from "@/services/pokemon/models/responsePokemon.interface";
import { usePokeApi } from "@/components/pokemon/hooks/usePokeApi";

const mockPokemon: ResponsePokemonDetaexport = {
  id: 25,
  name: "pikachu",
  types: [
    { type: { name: "electric", url: "https://pokeapi.co/api/v2/type/13/" } },
  ],
  sprites: {
    front_default: "https://example.com/pikachu.png",
    other: {
      "official-artwork": {
        front_default: "https://example.com/pikachu-artwork.png",
      },
    },
  },
  stats: [
    { base_stat: 35, effort: 0, stat: { name: "hp", url: "" } },
    { base_stat: 55, effort: 0, stat: { name: "attack", url: "" } },
    { base_stat: 40, effort: 0, stat: { name: "defense", url: "" } },
    { base_stat: 50, effort: 0, stat: { name: "special-attack", url: "" } },
    { base_stat: 50, effort: 0, stat: { name: "special-defense", url: "" } },
    { base_stat: 90, effort: 0, stat: { name: "speed", url: "" } },
  ],
} as ResponsePokemonDetaexport;

const mockPokemonData = [
  { ...mockPokemon, id: 1, name: "bulbasaur" },
  { ...mockPokemon, id: 25, name: "pikachu" },
  { ...mockPokemon, id: 4, name: "charmander" },
] as ResponsePokemonDetaexport[];

const handlePageChange = vi.fn();
const setSelectedPokemon = vi.fn();

const createMockHookReturn = (overrides = {}) => ({
    pokemonData: mockPokemonData,
    page: 1,
    totalPages: 10,
    selectedPokemon: null,
    isLoading: false,
    isError: false,
    error: null,
    handlePageChange: handlePageChange,
    setSelectedPokemon: setSelectedPokemon,
    ...overrides,
  });

vi.mock("@/components/pokemon/hooks/usePokeApi");

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

vi.mock("./PokemonModal", () => ({
  PokemonModal: ({ pokemon }: any) => (
    <div data-testid="pokemon-modal">{pokemon.name} Modal</div>
  ),
}));

describe("PokemonList", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn());
  });

  describe("Rendering and Structure", () => {
    it("should render the component correctly", () => {
      render(<PokemonList />);

      expect(screen.getByTestId("pokemon-header")).toBeInTheDocument();
    });

    it("should call usePokeApi hook with correct ITEMS_PER_PAGE", () => {
      render(<PokemonList />);

        expect(usePokeApi).toHaveBeenCalledWith(8);
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
        expect(skeletons.length).toBe(8);
    });

    it("should render correct number of skeleton loaders based on ITEMS_PER_PAGE", () => {
        vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ isLoading: true }));

        render(<PokemonList />);

        const skeletons = screen.getAllByTestId("pokemon-skeleton");
        expect(skeletons).toHaveLength(8);
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
      expect(cards).toHaveLength(3);
    });

    it("should render correct pokemon names in cards", () => {
      render(<PokemonList />);

      expect(screen.getByText("bulbasaur")).toBeInTheDocument();
      expect(screen.getByText("pikachu")).toBeInTheDocument();
      expect(screen.getByText("charmander")).toBeInTheDocument();
    });

    it("should apply correct grid classes to pokemon cards container", () => {
      const { container } = render(<PokemonList />);

      const gridContainer = container.querySelector(
        ".mt-3.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3.xl\\:grid-cols-4"
      );
      expect(gridContainer).toBeInTheDocument();
    });

    it("should render each pokemon card with unique key", () => {
      render(<PokemonList />);

      const cards = screen.getAllByTestId("pokemon-card");
      expect(cards).toHaveLength(mockPokemonData.length);
    });

    it("should handle empty pokemon data array", () => {
      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ pokemonData: [] }));

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

      expect(mockSetSelectedPokemon).toHaveBeenCalledWith(mockPokemonData[0]);
    });

    it("should render modal when a pokemon is selected", () => {
      const selectedPokemon = mockPokemonData[0];

      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ selectedPokemon }));

      render(<PokemonList />);

      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    it("should pass open prop as true to Modal when pokemon is selected", () => {
      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ selectedPokemon: mockPokemonData[0] }));

      render(<PokemonList />);

      const modal = screen.getByTestId("modal");
      expect(modal).toBeInTheDocument();
    });

    it("should call setSelectedPokemon with null when modal is closed", async () => {
      const user = userEvent.setup();
      const mockSetSelectedPokemon = vi.fn();

      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ selectedPokemon: mockPokemonData[0], setSelectedPokemon: mockSetSelectedPokemon }));
      render(<PokemonList />);

      const closeButton = screen.getByTestId("modal-close");
      await user.click(closeButton);

      expect(mockSetSelectedPokemon).toHaveBeenCalledWith(null);
    });

    it("should apply correct className to Modal", () => {
      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ selectedPokemon: mockPokemonData[0] })); 

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

      expect(mockSetSelectedPokemon).toHaveBeenCalledWith(mockPokemonData[0]);

      // Simulate pokemon selection
      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ selectedPokemon: mockPokemonData[0], setSelectedPokemon: mockSetSelectedPokemon }));
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
      expect(screen.getAllByTestId("pokemon-card")).toHaveLength(3);
      expect(screen.getByTestId("custom-pagination")).toBeInTheDocument();
    });

    it("should handle multiple pokemon selections", async () => {
      const user = userEvent.setup();
      const mockSetSelectedPokemon = vi.fn();

      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ setSelectedPokemon: mockSetSelectedPokemon }));

      render(<PokemonList />);

      const cards = screen.getAllByTestId("pokemon-card");

      await user.click(cards[0]);
      expect(mockSetSelectedPokemon).toHaveBeenCalledWith(mockPokemonData[0]);

      await user.click(cards[1]);
      expect(mockSetSelectedPokemon).toHaveBeenCalledWith(mockPokemonData[1]);

      await user.click(cards[2]);
      expect(mockSetSelectedPokemon).toHaveBeenCalledWith(mockPokemonData[2]);

      expect(mockSetSelectedPokemon).toHaveBeenCalledTimes(3);
    });
  });

  describe("Edge Cases", () => {
    it("should handle single pokemon in data array", () => {
      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ pokemonData: [mockPokemonData[0]] }));

      render(<PokemonList />);

      const cards = screen.getAllByTestId("pokemon-card");
      expect(cards).toHaveLength(1);
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
      expect(cards).toHaveLength(50);
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

      expect(screen.getAllByTestId("pokemon-skeleton")).toHaveLength(8);

      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ isLoading: false }));            

      rerender(<PokemonList />);

      expect(screen.queryByTestId("pokemon-skeleton")).not.toBeInTheDocument();
      expect(screen.getAllByTestId("pokemon-card")).toHaveLength(3);
    });

    it("should transition from success to error state", () => {
      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ isLoading: false, error: null }));


      const { rerender } = render(<PokemonList />);

      expect(screen.getAllByTestId("pokemon-card")).toHaveLength(3);

      vi.mocked(usePokeApi).mockReturnValue(createMockHookReturn({ isLoading: false, error: new Error("Network error") }));

      rerender(<PokemonList />);

      expect(screen.getByText("Error loading data")).toBeInTheDocument();
      expect(screen.queryByTestId("pokemon-card")).not.toBeInTheDocument();
    });
  });
});
