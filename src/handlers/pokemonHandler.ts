import { PrismaClient, Prisma } from "@prisma/client";
import { IPokemonData } from "../types/pokemonType";

const prisma = new PrismaClient();

const includeRelations: Prisma.PokemonInclude = {
  profile: true,
  baseStats: true,
};

export const getAllPokemonsHandler = async (): Promise<IPokemonData[]> => {
  return await prisma.pokemon.findMany({
    include: includeRelations,
  });
};

export const getOwnedPokemonsHandler = async (): Promise<IPokemonData[]> => {
  return await prisma.pokemon.findMany({
    where: { isOwned: true },
    include: includeRelations,
  });
};

export const getPokemonByIdHandler = async (
  id: number
): Promise<IPokemonData | null> => {
  return await prisma.pokemon.findUnique({
    where: { id },
    include: includeRelations,
  });
};

export const getPokemonCountHandler = async (
  isOwned: boolean
): Promise<number> => {
  return await prisma.pokemon.count({
    where: { isOwned },
  });
};

export const getRandomPokemonHandler = async (
  isOwned: boolean,
  randomOffset: number
): Promise<IPokemonData | null> => {
  return await prisma.pokemon.findFirst({
    where: { isOwned },
    skip: randomOffset,
    include: includeRelations,
  });
};

export const catchPokemonHandler = async (
  id: number
): Promise<IPokemonData | null> => {
  return await prisma.pokemon.update({
    where: { id },
    data: { isOwned: true },
    include: includeRelations,
  });
};

export const searchPokemonsHandler = async (
  where: Prisma.PokemonWhereInput,
  orderBy: Prisma.PokemonOrderByWithRelationInput,
  skip: number,
  take: number
): Promise<{ pokemons: IPokemonData[]; totalCount: number }> => {
  const pokemons = await prisma.pokemon.findMany({
    where,
    orderBy,
    skip,
    take,
    include: includeRelations,
  });

  const totalCount = await prisma.pokemon.count({ where });

  return { pokemons, totalCount };
};
