export const SEARCH_POKEMONS_PAGINATED = `
  query SearchPokemonsPaginated($name: String!, $limit: Int!, $offset: Int!) {
    pokemon_v2_pokemon(
      where: { name: { _ilike: $name } }
      limit: $limit
      offset: $offset
    ) {
      id
      name
      height
      weight
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
        }
      }
      pokemon_v2_pokemonsprites {
        sprites
      }
      pokemon_v2_pokemonstats {
        base_stat
        pokemon_v2_stat {
          name
        }
      }
      pokemon_v2_pokemonmoves(limit: 2) {
        pokemon_v2_move {
          name
        }
      }
      pokemon_v2_pokemonspecy {
        pokemon_v2_pokemonspeciesflavortexts(
          where: { language_id: { _eq: 7 } }
          limit: 4
        ) {
          flavor_text
        }
        pokemon_v2_evolutionchain {
          pokemon_v2_pokemonspecies {
            name
            id
            pokemon_v2_pokemons{
              id
              name
              pokemon_v2_pokemonsprites {
                sprites
              }
              pokemon_v2_pokemonspecy {
                pokemon_v2_pokemonspeciesflavortexts(
                  where: { language_id: { _eq: 7 } }
                  limit: 4
                ) {
                  flavor_text
                }
              }
              pokemon_v2_pokemonstats {
                base_stat
                pokemon_v2_stat {
                  name
                }
              }
            }
          }
        }
      }
    }
    pokemon_v2_pokemon_aggregate(where: { name: { _ilike: $name } }) {
      aggregate {
        count
      }
    }
  }
`;