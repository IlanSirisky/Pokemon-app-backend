import { PrismaClient, Prisma } from "@prisma/client";
import { IUserData, IUserPokemonData } from "../types/userType";

const prisma = new PrismaClient();

const addUser = async (username: string, email: string, sub: string): Promise<IUserData> => {
  return await prisma.user.create({
    data: {
      username,
      email,
      sub,
    },
  }) as IUserData;
};

const addPokemonToUser = async (
  userId: number,
  pokemonId: number
): Promise<IUserPokemonData> => {
  return await prisma.usersPokemons.create({
    data: {
      user_id: userId,
      pokemon_id: pokemonId,
    },
  }) as IUserPokemonData;
};

const getRandomUserPokemon = async (
  userId: number,
  randomOffset: number
): Promise<IUserPokemonData | null> => {
  return await prisma.usersPokemons.findFirst({
    where: { user_id: userId },
    skip: randomOffset,
    include: {
      Pokemon: true,
    },
  }) as IUserPokemonData | null;
};

export default {
  addUser,
  addPokemonToUser,
  getRandomUserPokemon,
};
