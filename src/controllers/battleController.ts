import { NextFunction, Request, Response } from "express";
import battleHandler from "../handlers/battleHandler";
import { buildResponse } from "../utils/responseBuilder";
import { AppError } from "../types/responseTypes";

export const startFight = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { playerPokemonId, opponentPokemonId } = req.body;

  try {
    const fightState = await battleHandler.startFight(
      Number(playerPokemonId),
      Number(opponentPokemonId)
    );
    return buildResponse(res, 200, "Fight started successfully", fightState);
  } catch (error) {
    next(error as AppError);
  }
};

export const playerAttack = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fightState = battleHandler.playerAttack();
    return buildResponse(res, 200, "Player attacked successfully", fightState);
  } catch (error) {
    next(error as AppError);
  }
};

export const opponentAttack = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fightState = battleHandler.opponentAttack();
    return buildResponse(
      res,
      200,
      "Opponent attacked successfully",
      fightState
    );
  } catch (error) {
    next(error as AppError);
  }
};

export const catchPokemon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await battleHandler.tryToCatchPokemon();
    return buildResponse(res, 200, "Catch Attempt", result);
  } catch (error) {
    next(error as AppError);
  }
};
