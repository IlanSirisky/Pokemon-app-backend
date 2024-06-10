import { Request, Response } from "express";
import {
  startFightHandler,
  playerAttackHandler,
  opponentAttackHandler,
  tryToCatchPokemonHandler,
} from "../handlers/battleHandler";

export const startFight = async (req: Request, res: Response) => {
  const { playerPokemonId, opponentPokemonId } = req.body;

  try {
    const fightState = await startFightHandler(
      Number(playerPokemonId),
      Number(opponentPokemonId)
    );
    return res.status(200).json(fightState);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const playerAttack = (req: Request, res: Response) => {
  try {
    const fightState = playerAttackHandler();
    return res.status(200).json(fightState);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const opponentAttack = (req: Request, res: Response) => {
  try {
    const fightState = opponentAttackHandler();
    return res.status(200).json(fightState);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const catchPokemon = async (req: Request, res: Response) => {
  try {
    const result = await tryToCatchPokemonHandler();
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
