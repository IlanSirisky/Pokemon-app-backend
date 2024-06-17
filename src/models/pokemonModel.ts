import { PrismaClient, Prisma } from "@prisma/client";
import { IPokemonData } from "../types/pokemonType";
import { IUserPokemonData } from "../types/userType";

const prisma = new PrismaClient();

const includeRelations: Prisma.PokemonInclude = {
  profile: true,
  baseStats: true,
};

const getPokemonById = async (id: number): Promise<IPokemonData | null> => {
  return await prisma.pokemon.findUnique({
    where: { id },
    include: includeRelations,
  });
};

const getPokemonCount = async (
  isOwned: boolean,
  userId?: number
): Promise<number> => {
  if (isOwned && userId) {
    return await prisma.usersPokemons.count({
      where: { user_id: userId },
    });
  } else {
    return await prisma.pokemon.count({ where: { isOwned } });
  }
};

const getRandomUserPokemon = async (
  userId: number,
  randomOffset: number
): Promise<IUserPokemonData | null> => {
  return (await prisma.usersPokemons.findFirst({
    where: { user_id: userId },
    skip: randomOffset,
    include: {
      Pokemon: {
        include: includeRelations,
      },
    },
  })) as IUserPokemonData | null;
};

const getRandomPokemon = async (
  isOwned: boolean,
  randomOffset: number,
  userId?: number
): Promise<IPokemonData | null> => {
  if (isOwned && userId) {
    const userPokemon = await getRandomUserPokemon(userId, randomOffset);
    return userPokemon ? userPokemon.Pokemon : null;
  } else {
    return await prisma.pokemon.findFirst({
      skip: randomOffset,
      include: includeRelations,
    });
  }
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

const getPokemonTypes = async (userSub: string) => {
  return await prisma.usersPokemons.findMany({
    where: {
      User: {
        sub: userSub,
      },
    },
    include: {
      Pokemon: {
        include: {
          profile: true,
        },
      },
    },
  });
};

export default {
  getPokemonById,
  getPokemonCount,
  getRandomPokemon,
  updateOwnerPokemon,
  searchPokemons,
  getPokemonTypes,
};
