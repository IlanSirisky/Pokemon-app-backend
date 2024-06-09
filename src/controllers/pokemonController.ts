import { Prisma, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { SortByValues } from "../types/sortBy";
import { orderByMapping } from "../utils/orderByOptions";
import {
  catchPokemonHandler,
  getAllPokemonsHandler,
  getOwnedPokemonsHandler,
  getPokemonByIdHandler,
  getPokemonCountHandler,
  getRandomPokemonHandler,
  searchPokemonsHandler,
} from "../handlers/pokemonHandler";

// Get all Pokemons
export const getAllPokemons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pokemons = await getAllPokemonsHandler();
    res.json(pokemons);
  } catch (err) {
    next(err);
  }
};

// Get my Pokemons
export const getOwnedPokemons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pokemons = await getOwnedPokemonsHandler();
    res.json(pokemons);
  } catch (err) {
    next(err);
  }
};

// Get a specific Pokemon by ID
export const getPokemonById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const pokemon = await getPokemonByIdHandler(Number(id));
    if (!pokemon) {
      return res.status(404).json({ error: "Pokemon not found" });
    }
    res.json(pokemon);
  } catch (err) {
    next(err);
  }
};

// Get a random Pokemon
export const getRandomPokemon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { isOwned } = req.query;

  try {
    const isOwnedBoolean = isOwned === "true";
    // Get the count of owned or unowned Pokemons
    const count = await getPokemonCountHandler(isOwnedBoolean);

    if (count === 0) {
      return res.status(404).json({ error: "No Pokémon found" });
    }
    // Generate a random offset
    const randomOffset = Math.floor(Math.random() * count);

    // Get a random Pokemon
    const pokemon = await getRandomPokemonHandler(isOwnedBoolean, randomOffset);
    if (!pokemon) {
      return res.status(404).json({ error: "No Pokémon found" });
    }
    res.json(pokemon);
  } catch (err) {
    next(err);
  }
};

// PUT catch a Pokemon - update isOwned to true
export const catchPokemon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const pokemon = await catchPokemonHandler(Number(id));
    if (!pokemon) {
      return res.status(404).json({ error: "Pokemon not found" });
    }
    res.json(pokemon);
  } catch (err) {
    next(err);
  }
};

// Get Pokemons with query parameters
export const searchPokemons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    isOwned,
    q,
    sortBy = SortByValues.ID,
    page = 1,
    limit = 10,
  } = req.query;

  try {
    // Build where clause
    const whereClause: Prisma.PokemonWhereInput = {};
    if (isOwned !== undefined) {
      whereClause.isOwned = isOwned === "true";
    }
    if (q) {
      whereClause.name = { contains: q as string, mode: "insensitive" };
    }

    // Get orderBy
    const orderBy =
      orderByMapping[sortBy as SortByValues] || orderByMapping[SortByValues.ID];

    // Calculate skip and take for pagination
    const skip =
      (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);
    const take = parseInt(limit as string, 10);

    const result = await searchPokemonsHandler(
      whereClause,
      orderBy,
      skip,
      take
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};
