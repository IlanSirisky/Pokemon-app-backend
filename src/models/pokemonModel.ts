import { PrismaClient, Prisma } from "@prisma/client";
import { IPokemonData } from "../types/pokemonType";

const prisma = new PrismaClient();

const includeRelations: Prisma.PokemonInclude = {
  profile: true,
  baseStats: true,
};

const getPokemons = async (owned?: boolean): Promise<IPokemonData[]> => {
  const where: Prisma.PokemonWhereInput =
    owned !== undefined ? { isOwned: owned } : {};
  return await prisma.pokemon.findMany({
    where,
    include: includeRelations,
  });
};

const getPokemonById = async (id: number): Promise<IPokemonData | null> => {
  return await prisma.pokemon.findUnique({
    where: { id },
    include: includeRelations,
  });
};

const getPokemonCount = async (isOwned: boolean): Promise<number> => {
  return await prisma.pokemon.count({
    where: { isOwned },
  });
};

const getRandomPokemon = async (
  isOwned: boolean,
  randomOffset: number
): Promise<IPokemonData | null> => {
  return await prisma.pokemon.findFirst({
    where: { isOwned },
    skip: randomOffset,
    include: includeRelations,
  });
};

const updateOwnerPokemon = async (id: number): Promise<IPokemonData | null> => {
  return await prisma.pokemon.update({
    where: { id },
    data: { isOwned: true },
    include: includeRelations,
  });
};

const searchPokemons = async (
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

export default {
  getPokemons,
  getPokemonById,
  getPokemonCount,
  getRandomPokemon,
  updateOwnerPokemon,
  searchPokemons,
};
