import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';
import { 
  PokemonSpecies, 
  EvolutionChain 
} from '@/services/pokemon/models/responsePokemon.interface';

interface PokemonDetailsState {
  description: string;
  evolutionChain: string[];
  loading: boolean;
  error: string | null;
}

export function usePokemonDetails(pokemonId: number) {
  const [state, setState] = useState<PokemonDetailsState>({
    description: '',
    evolutionChain: [],
    loading: true,
    error: null
  });

  const fetchDetails = useCallback(async () => {
    if (!pokemonId) return;
    
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Obtener datos de la especie
      const { data: speciesData } = await api.get<PokemonSpecies>(
        `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`,
        { showLoading: false }
      );

      // Descripción en español
      const spanishEntry = speciesData.flavor_text_entries.find(
        (entry) => entry.language.name === 'es'
      );
      
      const description = spanishEntry 
        ? spanishEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ')
        : 'Descripción no disponible';

      // Cadena de evolución
      const { data: evolutionData } = await api.get<EvolutionChain>(
        speciesData.evolution_chain.url,
        { showLoading: false }
      );

      const chain: string[] = [];
      let current = evolutionData.chain;
      chain.push(current.species.name);

      while (current.evolves_to.length > 0) {
        current = current.evolves_to[0];
        chain.push(current.species.name);
      }

      setState({
        description,
        evolutionChain: chain,
        loading: false,
        error: null
      });
    } catch (err) {
      console.error('[usePokemonDetails] Error:', err);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Error al cargar los detalles del Pokémon'
      }));
    }
  }, [pokemonId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return state;
}