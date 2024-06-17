import { Prisma } from "@prisma/client";
import pokemonModel from "../models/pokemonModel";
import { SortByValues } from "../types/sortBy";
import { orderByMapping } from "../utils/orderByOptions";
import userModel from "../models/userModel";

const fetchPokemonById = async (id: number) => {
  return await pokemonModel.getPokemonById(id);
};

const fetchRandomPokemon = async (userSub: string, isOwned: string) => {
  const isOwnedBoolean = isOwned === "true";

  const user = await userModel.findUserBySub(userSub);
  if (!user) {
    throw new Error("User not found");
  }

  const count = await pokemonModel.getPokemonCount(isOwnedBoolean, user.id);

  if (count === 0) {
    return null;
  }

  const randomOffset = Math.floor(Math.random() * count);
  return await pokemonModel.getRandomPokemon(isOwnedBoolean, randomOffset, user.id);
};

const modifyOwnerPokemon = async (id: number) => {
  return await pokemonModel.updateOwnerPokemon(id);
};

const findPokemons = async (query: {
  userSub: string;
  isOwned: string;
  searchValue?: string;
  sortBy?: string;
  page: number;
  limit: number;
}) => {
  const { userSub, isOwned, searchValue, sortBy, page, limit } = query;

  const user = await userModel.findUserBySub(userSub);
  if (!user) {
    throw new Error("User not found");
  }

  const whereClause: Prisma.PokemonWhereInput = {};
  if (isOwned !== undefined) {
    whereClause.Users = { some: { user_id: user.id } };
  }
  if (searchValue) {
    whereClause.name = { contains: searchValue as string, mode: "insensitive" };
  }

  // Get orderBy
  const orderBy = sortBy
    ? orderByMapping[sortBy as SortByValues]
    : orderByMapping[SortByValues.ID];

  // Calculate skip and take for pagination
  const skip = (page - 1) * limit;
  const take = limit;

  return await pokemonModel.searchPokemons(whereClause, orderBy, skip, take);
};

const getPokemonTypesCount = async (userSub: string) => {
  const result = await pokemonModel.getPokemonTypes(userSub);

  const typesCount: { [key: string]: number } = {};

  result.forEach((userPokemon) => {
    userPokemon.Pokemon.profile?.types.forEach((type) => {
      if (typesCount[type]) {
        typesCount[type]++;
      } else {
        typesCount[type] = 1;
      }
    });
  });

  return typesCount;
};

export default {
  fetchPokemonById,
  fetchRandomPokemon,
  modifyOwnerPokemon,
  findPokemons,
  getPokemonTypesCount,
};
