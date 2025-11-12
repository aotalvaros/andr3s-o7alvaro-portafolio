import { PokemonSkeleton } from "@/components/pokemon/components/PokemonSkeleton";
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';


describe("PokemonSkeleton", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render the skeleton component", () => {
    render(<PokemonSkeleton />);
    const skeletonElement = screen.getByTestId("pokemon-skeleton-card");
    expect(skeletonElement).toBeInTheDocument();
  });
});