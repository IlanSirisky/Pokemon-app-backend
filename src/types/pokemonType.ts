export type IPokemonData = {
  id: number;
  name: string;
  isOwned: boolean;
  description: string;
  image: string;
  height: string | undefined;
  weight: string | undefined;
  abilities: string[] | undefined;
  hp: number | undefined;
  attack: number | undefined;
  defense: number | undefined;
  sp_attack: number | undefined;
  sp_defense: number | undefined;
  speed: number | undefined;
  power_level: number | undefined;
  types: string[] | undefined;
};
