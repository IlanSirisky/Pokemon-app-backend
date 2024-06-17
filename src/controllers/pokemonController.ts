import { Request, Response, NextFunction } from "express";
import { buildResponse } from "../utils/responseBuilder";
import pokemonHandler from "../handlers/pokemonHandler";
import { AppError } from "../types/responseTypes";
import { UserRequest } from "../types/requestTypes";

export const getPokemonById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const pokemon = await pokemonHandler.fetchPokemonById(Number(id));
    if (!pokemon) {
      return buildResponse(res, 404, "Pokemon not found");
    }
    buildResponse(res, 200, "Pokemon retrieved successfully", pokemon);
  } catch (error) {
    next(error as AppError);
  }
};

export const getRandomPokemon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { isOwned } = req.query;

  try {
    const pokemon = await pokemonHandler.fetchRandomPokemon(isOwned as string);

    if (!pokemon) {
      return buildResponse(res, 404, "No Pokémon found");
    }
    buildResponse(res, 200, "Random Pokemon retrieved successfully", pokemon);
  } catch (error) {
    next(error as AppError);
  }
};

export const searchPokemons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { isOwned, searchValue, sortBy, page, limit } = req.query;

  try {
    const result = await pokemonHandler.findPokemons({
      isOwned: isOwned as string,
      searchValue: searchValue as string,
      sortBy: sortBy as string,
      page: Number(page),
      limit: Number(limit),
    });

    buildResponse(res, 200, "Pokemons retrieved successfully", result);
  } catch (error) {
    next(error as AppError);
  }
};

export const getPokemonTypesCount = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const typesCount = await pokemonHandler.getPokemonTypesCount(req.user!.sub);
    buildResponse(
      res,
      200,
      "Pokemon types count retrieved successfully",
      typesCount
    );
  } catch (error) {
    next(error as AppError);
  }
};
