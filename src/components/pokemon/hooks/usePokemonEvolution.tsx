import { useState, useCallback, useMemo, useEffect } from 'react';
import { ResponsePokemonDetaexport } from '@/services/pokemon/models/responsePokemon.interface';

interface EvolutionState {
  currentPokemon: ResponsePokemonDetaexport;
  currentEvolutionIndex: number;
  isEvolving: boolean;
  error: string | null;
}

export function usePokemonEvolution(
  originalPokemon: ResponsePokemonDetaexport,
  evolutionChain: string[]
) {
  const [state, setState] = useState<EvolutionState>({
    currentPokemon: originalPokemon,
    currentEvolutionIndex: 0,
    isEvolving: false,
    error: null
  });

  // Memoizar valores calculados
  const derivedData = useMemo(() => {
    const originalIndex = evolutionChain.findIndex(
      (name) => name === originalPokemon.name
    );
    const currentIndex = Math.max(0, originalIndex);
    const canEvolve = currentIndex < evolutionChain.length - 1 && evolutionChain.length > 1;
    const hasEvolved = state.currentPokemon.id !== originalPokemon.id;

    return { originalIndex: currentIndex, canEvolve, hasEvolved };
  }, [evolutionChain, originalPokemon.name, originalPokemon.id, state.currentPokemon.id]);

  // Actualizar índice cuando cambie la cadena de evolución
  useEffect(() => {
    if (evolutionChain.length > 0 && derivedData.originalIndex !== state.currentEvolutionIndex) {
      setState(prev => ({
        ...prev,
        currentEvolutionIndex: derivedData.originalIndex
      }));
    }
  }, [evolutionChain.length, derivedData.originalIndex, state.currentEvolutionIndex]);

  const evolve = useCallback(async () => {
    if (!derivedData.canEvolve || state.isEvolving) return;

    setState(prev => ({ ...prev, isEvolving: true, error: null }));

    try {
      // Animación de evolución
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const nextEvolutionName = evolutionChain[state.currentEvolutionIndex + 1];
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${nextEvolutionName}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const evolvedPokemon: ResponsePokemonDetaexport = await response.json();

      setState(prev => ({
        ...prev,
        currentPokemon: evolvedPokemon,
        currentEvolutionIndex: prev.currentEvolutionIndex + 1,
        isEvolving: false
      }));
    } catch (err) {
      console.error('[usePokemonEvolution] Error:', err);
      setState(prev => ({
        ...prev,
        isEvolving: false,
        error: 'Error al evolucionar el Pokémon'
      }));
    }
  }, [derivedData.canEvolve, state.isEvolving, evolutionChain, state.currentEvolutionIndex]);

  const reset = useCallback(() => {
    setState({
      currentPokemon: originalPokemon,
      currentEvolutionIndex: derivedData.originalIndex,
      isEvolving: false,
      error: null
    });
  }, [originalPokemon, derivedData.originalIndex]);

  return {
    ...state,
    ...derivedData,
    evolve,
    reset
  };
}