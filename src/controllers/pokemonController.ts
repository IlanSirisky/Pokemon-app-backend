import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { SortByValues } from "../types/sortBy";
import { flattenAndTransform, flattenPokemon } from "../utils/flattenPokemon";
import { sortFunctions } from "../utils/orderByOptions";

const prisma = new PrismaClient();

// Get all Pokemons
export const getAllPokemons = async (req: Request, res: Response) => {
  try {
    const pokemons = await prisma.pokemon.findMany({
      include: {
        profile: true,
        baseStats: true,
        pokemonTypes: {
          include: {
            Types: true,
          },
        },
      },
    });
    res.json(flattenAndTransform(pokemons));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get my Pokemons
export const getOwnedPokemons = async (req: Request, res: Response) => {
  try {
    const pokemons = await prisma.pokemon.findMany({
      where: { isOwned: true },
      include: {
        profile: true,
        baseStats: true,
        pokemonTypes: {
          include: {
            Types: true,
          },
        },
      },
    });
    res.json(flattenAndTransform(pokemons));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a specific Pokemon by ID
export const getPokemonById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const pokemon = await prisma.pokemon.findUnique({
      where: { id: Number(id) },
      include: {
        profile: true,
        baseStats: true,
        pokemonTypes: {
          include: {
            Types: true,
          },
        },
      },
    });

    if (!pokemon) {
      return res.status(404).json({ error: "Pokemon not found" });
    }

    res.json(flattenPokemon(pokemon));
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a random Pokemon
export const getRandomPokemon = async (req: Request, res: Response) => {
  const { isOwned } = req.query;

  try {
    const pokemons = await prisma.pokemon.findMany({
      where: { isOwned: isOwned === "true" },
      orderBy: { id: "asc" },
      take: 1,
      include: {
        profile: true,
        baseStats: true,
        pokemonTypes: {
          include: {
            Types: true,
          },
        },
      },
    });

    if (pokemons.length === 0) {
      return res.status(404).json({ error: "No Pokémon found" });
    }

    res.json(flattenPokemon(pokemons[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PUT catch a pokemon - update isOwned to true
export const catchPokemon = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const pokemon = await prisma.pokemon.update({
      where: { id: Number(id) },
      data: { isOwned: true },
      include: {
        profile: true,
        baseStats: true,
        pokemonTypes: {
          include: {
            Types: true,
          },
        },
      },
    });

    if (!pokemon) {
      return res.status(404).json({ error: "Pokemon not found" });
    }

    res.json(flattenPokemon(pokemon));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchPokemons = async (req: Request, res: Response) => {
  const { isOwned, q, sortBy = SortByValues.ID } = req.query;

  try {
    const whereClause: Prisma.PokemonWhereInput = {};
    if (isOwned !== undefined) {
      whereClause.isOwned = isOwned === 'true';
    }
    if (q) {
      whereClause.name = { contains: q as string, mode: 'insensitive' };
    }

    const pokemons = await prisma.pokemon.findMany({
      where: whereClause,
      include: {
        profile: true,
        baseStats: true,
        pokemonTypes: {
          include: {
            Types: true,
          },
        },
      },
    });

    const sortedPokemons = pokemons.sort(sortFunctions[sortBy as SortByValues]);
    res.json(sortedPokemons.map(flattenPokemon));
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};