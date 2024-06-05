import { SortByValues } from "../types/sortBy";

export const sortFunctions: { [key in SortByValues]: (a: any, b: any) => number } = {
  [SortByValues.ID]: (a, b) => a.id - b.id,
  [SortByValues.AZ]: (a, b) => a.name.localeCompare(b.name),
  [SortByValues.ZA]: (a, b) => b.name.localeCompare(a.name),
  [SortByValues.POWER_HIGH_TO_LOW]: (a, b) => b.baseStats[0]?.power_level - a.baseStats[0]?.power_level,
  [SortByValues.POWER_LOW_TO_HIGH]: (a, b) => a.baseStats[0]?.power_level - b.baseStats[0]?.power_level,
  [SortByValues.HP_HIGH_TO_LOW]: (a, b) => b.baseStats[0]?.hp - a.baseStats[0]?.hp,
  [SortByValues.HP_LOW_TO_HIGH]: (a, b) => a.baseStats[0]?.hp - b.baseStats[0]?.hp
};