import { IPokemonData } from "../types/pokemonType";
import { calculateDamage, calculateCatchRate } from "../utils/fightFunctions";
import {
  catchPokemonHandler,
  getPokemonByIdHandler,
} from "../handlers/pokemonHandler";

// Current fight state
let currentFight = {
  playerPokemon: null as IPokemonData | null,
  opponentPokemon: null as IPokemonData | null,
  playerCurrentHp: 0,
  opponentCurrentHp: 0,
};

// Start a fight
export const startFightHandler = async (
  playerPokemonId: number,
  opponentPokemonId: number
) => {
  const playerPokemon = await getPokemonByIdHandler(playerPokemonId);
  const opponentPokemon = await getPokemonByIdHandler(opponentPokemonId);

  if (!playerPokemon || !opponentPokemon) {
    throw new Error("Pokémon not found");
  }

  currentFight.playerPokemon = playerPokemon;
  currentFight.opponentPokemon = opponentPokemon;
  currentFight.playerCurrentHp = playerPokemon.baseStats?.hp || 30;
  currentFight.opponentCurrentHp = opponentPokemon.baseStats?.hp || 30;

  return currentFight;
};

// Handle player attack
export const playerAttackHandler = () => {
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

// Handle opponent attack
export const opponentAttackHandler = () => {
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
export const tryToCatchPokemonHandler = async () => {
  if (!currentFight.opponentPokemon) {
    throw new Error("No opponent Pokémon to catch");
  }

  const catchRate = calculateCatchRate(
    currentFight.opponentCurrentHp,
    currentFight.opponentPokemon.baseStats?.hp || 30
  );
  const catchSuccess = Math.random() < catchRate;

  if (catchSuccess) {
    const updatedPokemon = await catchPokemonHandler(
      currentFight.opponentPokemon.id
    );
    return {
      message: "Caught the Pokémon!",
      caught: true,
      pokemon: updatedPokemon,
    };
  } else {
    return {
      message: "Failed to catch the Pokémon.",
      caught: false,
    };
  }
};
