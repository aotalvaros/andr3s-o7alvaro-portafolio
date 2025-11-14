export interface IPokemon {
  id:                        number;
  name:                      string;
  height:                    number;
  weight:                    number;
  pokemon_v2_pokemontypes:   PokemonV2Pokemontype[];
  pokemon_v2_pokemonsprites: PokemonV2Pokemonsprite[];
  pokemon_v2_pokemonmoves:   IPokemonMoves[];
  pokemon_v2_pokemonspecy?:  IPokemonV2Pokemonspecy;
  pokemon_v2_pokemonstats?:  IPokemonV2Pokemonstat[];
}

export interface PokemonType {
  name: string;
  color: string;
}
export interface IPokemonV2Pokemonspecy {
  pokemon_v2_pokemonspeciesflavortexts: PokemonV2Pokemonspeciesflavortext[];
  pokemon_v2_evolutionchain:{
    pokemon_v2_pokemonspecies: IEvolutionchain[];
  }
}

export interface IEvolutionchain {
  name: string;
  id: number;
  pokemon_v2_pokemons: {
    id: number;
    name: string;
    pokemon_v2_pokemonsprites: PokemonV2Pokemonsprite[];
    pokemon_v2_pokemonspecy: IPokemonV2Pokemonspecy;
    pokemon_v2_pokemonstats: IPokemonV2Pokemonstat[];
  }[]
}

export interface PokemonV2Pokemonspeciesflavortext {
  flavor_text: string;
}


export interface PokemonStat {
  name: string;
  value: number;
  maxValue: number;
}

export interface PokemonDetailProps {
  id: number;
  name: string;
  image: string;
  types: PokemonType[];
  weight: number;
  height: number;
  moves: string[];
  description: string;
  stats: PokemonStat[];
  themeColor: string;
  onBack: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

export interface PokemonV2Pokemonsprite {
  sprites: Sprites;
}

export interface GenerationV {
  "black-white": Sprites;
}

export interface GenerationIv {
  platinum:               Sprites;
  "diamond-pearl":        Sprites;
  "heartgold-soulsilver": Sprites;
}

export interface Versions {
  "generation-i":    GenerationI;
  "generation-v":    GenerationV;
  "generation-ii":   GenerationIi;
  "generation-iv":   GenerationIv;
  "generation-vi":   { [key: string]: Home };
  "generation-iii":  GenerationIii;
  "generation-vii":  GenerationVii;
  "generation-viii": GenerationViii;
}

export interface Other {
  home:               Home;
  showdown:           Sprites;
  dream_world:        DreamWorld;
  "official-artwork": OfficialArtwork;
}

export interface Sprites {
  other?:             Other;
  versions?:          Versions;
  back_shiny:         string;
  back_female:        null;
  front_shiny:        string;
  back_default:       string;
  front_female:       null;
  front_default:      string;
  back_shiny_female:  null;
  front_shiny_female: null;
  animated?:          Sprites;
}

export interface GenerationI {
  yellow:     RedBlue;
  "red-blue": RedBlue;
}

export interface RedBlue {
  back_gray:         string;
  front_gray:        string;
  back_default:      string;
  front_default:     string;
  back_transparent:  string;
  front_transparent: string;
}

export interface GenerationIi {
  gold:    Gold;
  silver:  Gold;
  crystal: Crystal;
}

export interface Crystal {
  back_shiny:              string;
  front_shiny:             string;
  back_default:            string;
  front_default:           string;
  back_transparent:        string;
  front_transparent:       string;
  back_shiny_transparent:  string;
  front_shiny_transparent: string;
}

export interface Gold {
  back_shiny:         string;
  front_shiny:        string;
  back_default:       string;
  front_default:      string;
  front_transparent?: string;
}

export interface GenerationIii {
  emerald:             OfficialArtwork;
  "ruby-sapphire":     Gold;
  "firered-leafgreen": Gold;
}

export interface OfficialArtwork {
  front_shiny:   string;
  front_default: string;
}

export interface Home {
  front_shiny:        string;
  front_female:       null;
  front_default:      string;
  front_shiny_female: null;
}

export interface GenerationVii {
  icons:                  DreamWorld;
  "ultra-sun-ultra-moon": Home;
}

export interface DreamWorld {
  front_female:  null;
  front_default: string;
}

export interface GenerationViii {
  icons: DreamWorld;
}

export interface PokemonV2Pokemontype {
  pokemon_v2_type: PokemonV2Type;
}

export interface PokemonV2Type {
  name: string;
}
export interface IPokemonMoves {
  pokemon_v2_move: PokemonV2Move;
}

export interface PokemonV2Move {
  name: string;
}

export interface IPokemonV2Pokemonstat {
  base_stat:       number;
  pokemon_v2_stat: PokemonV2Stat;
}

export interface PokemonV2Stat {
  name: string;
}

