import {
  Pokemon,
  Profile,
  BaseStats,
  PokemonTypes,
  Types,
} from "@prisma/client";
import { IPokemonData } from "../types/pokemonType";

export const flattenPokemon = (
  pokemon: Pokemon & {
    profile: Profile | null;
    baseStats: BaseStats[];
    pokemonTypes: (PokemonTypes & { Types: Types })[];
  }
): IPokemonData => {
  return {
    id: pokemon.id,
    name: pokemon.name,
    isOwned: pokemon.isOwned,
    description: pokemon.description,
    image: pokemon.image,
    height: pokemon.profile?.height,
    weight: pokemon.profile?.weight,
    abilities: pokemon.profile?.ability,
    hp: pokemon.baseStats[0]?.hp,
    attack: pokemon.baseStats[0]?.attack,
    defense: pokemon.baseStats[0]?.defense,
    sp_attack: pokemon.baseStats[0]?.sp_attack,
    sp_defense: pokemon.baseStats[0]?.sp_defense,
    speed: pokemon.baseStats[0]?.speed,
    power_level: pokemon.baseStats[0]?.power_level,
    types: pokemon.pokemonTypes.map((pt) => pt.Types.name),
  };
};

// Helper function to flatten and transform Prisma results
export const flattenAndTransform = (pokemons: any[]): IPokemonData[] => {
  return pokemons.map(flattenPokemon);
};
