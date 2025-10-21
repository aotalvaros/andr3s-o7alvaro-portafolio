import api from "@/lib/axios";
import { ResponsePokemon } from "./models/responsePokemon.interface";
import { sleep } from "@/helpers/sleep";

//https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0
export async function fetchPokemonList(limit: number = 10, page: number = 0): Promise<ResponsePokemon> {
    await sleep(1000); 
    const { data } = await api.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${page}`, {
        showLoading: false,
    });
    return data;
}