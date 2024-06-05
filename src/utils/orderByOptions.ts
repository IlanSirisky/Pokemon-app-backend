import { SortByValues } from "../types/sortBy";

// Map SortByValues to SQL ORDER BY clauses
export const getOrderByClause = (sortBy: string): string => {
    switch (sortBy) {
      case SortByValues.AZ:
        return 'p.name ASC';
      case SortByValues.ZA:
        return 'p.name DESC';
      case SortByValues.POWER_HIGH_TO_LOW:
        return 'bs.power_level DESC';
      case SortByValues.POWER_LOW_TO_HIGH:
        return 'bs.power_level ASC';
      case SortByValues.HP_HIGH_TO_LOW:
        return 'bs.hp DESC';
      case SortByValues.HP_LOW_TO_HIGH:
        return 'bs.hp ASC';
      default:
        return 'p.id ASC'; // Default sorting by ID
    }
  };