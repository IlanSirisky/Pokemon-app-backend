import { IPokemonData } from "./pokemonType";

export interface AppError extends Error {
  statusCode?: number;
}

// Fight state
export interface IFightState {
  playerPokemon: IPokemonData | null;
  opponentPokemon: IPokemonData | null;
  playerCurrentHp: number;
  opponentCurrentHp: number;
}

// Catch response
export interface CatchResponse {
  message: string;
  caught: boolean;
  pokemon?: IPokemonData;
}