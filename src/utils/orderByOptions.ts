import { Prisma } from "@prisma/client";
import { SortByValues } from "../types/sortBy";

export const orderByMapping: { [key in SortByValues]: Prisma.PokemonOrderByWithRelationInput } = {
  [SortByValues.ID]: { id: 'asc' },
  [SortByValues.AZ]: { name: 'asc' },
  [SortByValues.ZA]: { name: 'desc' },
  [SortByValues.POWER_HIGH_TO_LOW]: { baseStats: { power_level: 'desc' } },
  [SortByValues.POWER_LOW_TO_HIGH]: { baseStats: { power_level: 'asc' } },
  [SortByValues.HP_HIGH_TO_LOW]: { baseStats: { hp: 'desc' } },
  [SortByValues.HP_LOW_TO_HIGH]: { baseStats: { hp: 'asc' } },
};

