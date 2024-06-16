export interface IPokemonData {
  id: number;
  name: string;
  isOwned: boolean;
  description: string;
  image: string;
  profile?: Profile | null;
  baseStats?: BaseStats | null;
}

export interface Profile {
  pokemon_id: number;
  height: string;
  weight: string;
  ability: string[];
  types: string[];
}

export interface BaseStats {
  pokemon_id: number;
  hp: number;
  attack: number;
  defense: number;
  sp_attack: number;
  sp_defense: number;
  speed: number;
  power_level: number;
}

export type PokemonType =
  | "Normal"
  | "Fire"
  | "Water"
  | "Electric"
  | "Grass"
  | "Ice"
  | "Fighting"
  | "Poison"
  | "Ground"
  | "Flying"
  | "Psychic"
  | "Bug"
  | "Rock"
  | "Ghost"
  | "Dragon"
  | "Dark"
  | "Steel"
  | "Fairy";
