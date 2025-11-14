import {
  PokemonStats,
  type PokemonStatsProps,
} from "@/components/pokemon/components/PokemonStats";
import { IPokemon } from "@/services/pokemon/models/pokemon.interface";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("PokemonStats", () => {
  const mockProps: PokemonStatsProps = {
    totalPages: 10,
    currentPage: 2,
    pokemon: [
      {
        id: 25,
        name: "pikachu",
        height: 4,
        weight: 60,
        pokemon_v2_pokemontypes: [{ pokemon_v2_type: { name: "electric" } }],
        pokemon_v2_pokemonsprites: [
          {
            sprites: {
              other: {
                "official-artwork": {
                  front_default: "https://example.com/pikachu-artwork.png",
                },
              },
              front_default: "https://example.com/pikachu-default.png",
            },
          },
        ],
        pokemon_v2_pokemonstats: [
          {
            base_stat: 35,
            pokemon_v2_stat: {
              name: "hp",
            },
          },
          {
            base_stat: 55,
            pokemon_v2_stat: {
              name: "attack",
            },
          },
          {
            base_stat: 40,
            pokemon_v2_stat: {
              name: "defense",
            },
          },
        ],
        pokemon_v2_pokemonspecy: {
          pokemon_v2_pokemonspeciesflavortexts: [
            {
              flavor_text:
                "Este Pokémon tiene sacos de electricidad en sus mejillas.",
            },
          ],
          pokemon_v2_evolutionchain: {
            pokemon_v2_pokemonspecies: [
              {
                id: 172,
                name: "pichu",
              },
              {
                id: 25,
                name: "pikachu",
              },
              {
                id: 26,
                name: "raichu",
              },
            ],
          },
        },
      } as IPokemon,
    ],
    totalCount: 200,
  };

    beforeEach(() => {
        render(<PokemonStats {...mockProps} />) ;
    })

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("should render the component", () => {
        const statsElement = screen.getByTestId("pokemon-stats");
        expect(statsElement).toBeInTheDocument();
    });

    it("should display the correct total count", () => {
        const totalCountElement = screen.getByTestId("total-count");
        expect(totalCountElement).toHaveTextContent("200");
    });

    it("should display the correct current pokemon length", () => {
        const currentPokemonLengthElement = screen.getByTestId("current-pokemon-length");
        expect(currentPokemonLengthElement).toHaveTextContent("1");
    });

    it("should display the correct page info", () => {
        const pageInfoElement = screen.getByTestId("page-info");
        expect(pageInfoElement).toHaveTextContent("2/10");
    });

});
