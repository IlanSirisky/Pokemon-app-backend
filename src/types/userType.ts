import { IPokemonData } from "./pokemonType";

export interface IUserData {
  id: number;
  sub: string;
  username: string;
  email: string;
  Pokemons: IUserPokemonData[];
}

export interface IUserPokemonData {
  user_id: number;
  pokemon_id: number;
  Pokemon: IPokemonData;
}
