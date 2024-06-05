export interface Pokemon {
  id: number;
  name: string;
  isOwned: boolean;
  description: string;
  image: string;
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

export interface Profile {
  pokemon_id: number;
  height: string;
  weight: string;
  ability: string[];
}

export interface Types {
  id: number;
  name: string;
}

export interface PokemonTypes {
  pokemon_id: number;
  type_id: number;
}
