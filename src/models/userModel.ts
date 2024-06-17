import { PrismaClient, Prisma } from "@prisma/client";
import { IUserData, IUserPokemonData } from "../types/userType";

const prisma = new PrismaClient();

const findUserBySub = async (sub: string): Promise<IUserData | null> => {
  return await prisma.user.findFirst({
    where: { sub },
  }) as IUserData | null;
}

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

export default {
  findUserBySub,
  addUser,
  addPokemonToUser,
};
