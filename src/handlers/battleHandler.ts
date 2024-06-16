import { calculateDamage, calculateCatchRate } from "../utils/fightFunctions";
import { CatchResponse, IFightState } from "../types/responseTypes";
import pokemonModel from "../models/pokemonModel";

// Current fight state
let currentFight: IFightState = {
  playerPokemon: null,
  opponentPokemon: null,
  playerCurrentHp: 0,
  opponentCurrentHp: 0,
};

export const startFight = async (
  playerPokemonId: number,
  opponentPokemonId: number
): Promise<IFightState> => {
  const playerPokemon = await pokemonModel.getPokemonById(playerPokemonId);
  const opponentPokemon = await pokemonModel.getPokemonById(opponentPokemonId);

  if (!playerPokemon || !opponentPokemon) {
    throw new Error("Pokémon not found");
  }

  currentFight.playerPokemon = playerPokemon;
  currentFight.opponentPokemon = opponentPokemon;
  currentFight.playerCurrentHp = playerPokemon.baseStats?.hp || 30;
  currentFight.opponentCurrentHp = opponentPokemon.baseStats?.hp || 30;

  return currentFight;
};

export const playerAttack = (): IFightState => {
  if (!currentFight.playerPokemon || !currentFight.opponentPokemon) {
    throw new Error("No active fight");
  }

  const damage = calculateDamage(
    currentFight.playerPokemon,
    currentFight.opponentPokemon
  );
  currentFight.opponentCurrentHp = Math.max(
    0,
    currentFight.opponentCurrentHp - damage
  );

  return currentFight;
};

export const opponentAttack = (): IFightState => {
  if (!currentFight.playerPokemon || !currentFight.opponentPokemon) {
    throw new Error("No active fight");
  }

  const damage = calculateDamage(
    currentFight.opponentPokemon,
    currentFight.playerPokemon
  );
  currentFight.playerCurrentHp = Math.max(
    0,
    currentFight.playerCurrentHp - damage
  );

  return currentFight;
};

// Catch the opponent Pokémon
const tryToCatchPokemon = async (): Promise<CatchResponse> => {
  if (!currentFight.opponentPokemon) {
    throw new Error("No opponent Pokémon to catch");
  }

  const catchRate = calculateCatchRate(
    currentFight.opponentCurrentHp,
    currentFight.opponentPokemon.baseStats?.hp || 30
  );
  const catchSuccess = Math.random() < catchRate;

  if (catchSuccess) {
    const updatedPokemon = await pokemonModel.updateOwnerPokemon(
      currentFight.opponentPokemon.id
    );
    return {
      message: "Caught the Pokémon!",
      caught: true,
      pokemon: updatedPokemon,
    } as CatchResponse;
  } else {
    return {
      message: "Failed to catch the Pokémon.",
      caught: false,
    } as CatchResponse;
  }
};

export default {
  startFight,
  playerAttack,
  opponentAttack,
  tryToCatchPokemon,
};
