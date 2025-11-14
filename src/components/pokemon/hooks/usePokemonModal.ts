import { useEffect, useRef, useState } from "react";
import { PokemonModalProps } from "../interfaces/PokemonModalProps.interface";
import { IEvolutionchain, IPokemon } from "@/services/pokemon/models/pokemon.interface";

export const usePokemonModal = ({ pokemon }: PokemonModalProps) => {

    const imageContainerRef = useRef<HTMLDivElement>(null);
    const [evolutionChain, setEvolutionChain] = useState<IEvolutionchain[]>([]);
    const [currentPokemon, setCurrentPokemon] = useState<IPokemon>(pokemon)

    const [originalPokemon] = useState<IPokemon>(pokemon)
    const [currentEvolutionIndex, setCurrentEvolutionIndex] = useState(0)
    const [isEvolving, setIsEvolving] = useState(false)

    useEffect(() => {
        const chain: IEvolutionchain[] = [];
        //Primero organizalo de mayor a menor por el id y luego extrae las especies
        pokemon.pokemon_v2_pokemonspecy?.pokemon_v2_evolutionchain?.pokemon_v2_pokemonspecies
            .sort((a, b) => a.id - b.id)
            .forEach((species) => {
                chain.push(species);
            });
        setEvolutionChain(chain);
        setCurrentEvolutionIndex(chain.findIndex((name) => name.name === pokemon.name))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleEvolve = async () => {
        if (currentEvolutionIndex >= evolutionChain.length - 1) return

        setIsEvolving(true)

        setTimeout(() => {
            imageContainerRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            })
        }, 100)

        // Wait for animation
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const nextEvolution = evolutionChain[currentEvolutionIndex + 1];
        setCurrentPokemon({
            ...currentPokemon,
            id: nextEvolution.id,
            name: nextEvolution.name,
            pokemon_v2_pokemonsprites: nextEvolution.pokemon_v2_pokemons[0].pokemon_v2_pokemonsprites,
            pokemon_v2_pokemonspecy: nextEvolution.pokemon_v2_pokemons[0].pokemon_v2_pokemonspecy,
            pokemon_v2_pokemonstats: nextEvolution.pokemon_v2_pokemons[0].pokemon_v2_pokemonstats,
        });
        setCurrentEvolutionIndex(currentEvolutionIndex + 1);
        setIsEvolving(false);
    }

    const handleReset = () => {
        setCurrentPokemon(originalPokemon)
        setCurrentEvolutionIndex(evolutionChain.findIndex((name) => name.name === originalPokemon.name))
    }

    const canEvolve = currentEvolutionIndex < evolutionChain.length - 1
    const hasEvolved = currentPokemon.id !== originalPokemon.id

    return {
        imageContainerRef,
        currentPokemon,
        currentEvolutionIndex,
        canEvolve,
        hasEvolved,
        isEvolving,
        evolutionChain,

        handleEvolve,
        handleReset,
    }
}
