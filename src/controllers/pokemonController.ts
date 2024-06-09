import { Prisma, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { SortByValues } from "../types/sortBy";
import { orderByMapping } from "../utils/orderByOptions";
import { IPokemonData } from "../types/pokemonType";

const prisma = new PrismaClient();

const includeRelations = {
  profile: true,
  baseStats: true,
};

// Get all Pokemons
export const getAllPokemons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pokemons: IPokemonData[] = await prisma.pokemon.findMany({
      include: includeRelations,
    });
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
    const pokemons = await prisma.pokemon.findMany({
      where: { isOwned: true },
      include: includeRelations,
    });
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
    const pokemon = await prisma.pokemon.findUnique({
      where: { id: Number(id) },
      include: includeRelations,
    });

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
    const count = await prisma.pokemon.count({
      where: { isOwned: isOwned === "true" },
    });

    if (count === 0) {
      return res.status(404).json({ error: "No Pokémon found" });
    }

    const randomOffset = Math.floor(Math.random() * count);

    const pokemon = await prisma.pokemon.findFirst({
      where: { isOwned: isOwned === "true" },
      skip: randomOffset,
      include: includeRelations,
    });

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
    const pokemon: IPokemonData = await prisma.pokemon.update({
      where: { id: Number(id) },
      data: { isOwned: true },
      include: includeRelations,
    });

    if (!pokemon) {
      return res.status(404).json({ error: "Pokemon not found" });
    }

    res.json(pokemon);
  } catch (err) {
    next(err);
  }
};

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
    const whereClause: Prisma.PokemonWhereInput = {};
    if (isOwned !== undefined) {
      whereClause.isOwned = isOwned === "true";
    }
    if (q) {
      whereClause.name = { contains: q as string, mode: "insensitive" };
    }

    const orderBy =
      orderByMapping[sortBy as SortByValues] || orderByMapping[SortByValues.ID];

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const pokemons: IPokemonData[] = await prisma.pokemon.findMany({
      where: whereClause,
      include: includeRelations,
      orderBy,
      skip,
      take,
    });

    const totalCount = await prisma.pokemon.count({ where: whereClause });

    res.json({ pokemons, totalCount });
  } catch (err) {
    next(err);
  }
};
