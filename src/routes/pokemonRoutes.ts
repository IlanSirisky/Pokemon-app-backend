import { Router } from "express";
import {
  getPokemonById,
  getPokemonTypesCount,
  getRandomPokemon,
  searchPokemons,
} from "../controllers/pokemonController";
import {
  validatePokemonId,
  validateSearchPokemons,
} from "../middleware/validationMiddleware";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

/*** GET ***/
router.get("/random-pokemon", verifyToken, getRandomPokemon);
router.get(
  "/search-pokemons",
  verifyToken,
  validateSearchPokemons,
  searchPokemons
);
router.get("/pokemon-types-count", verifyToken, getPokemonTypesCount);

router.get("/:id", verifyToken, validatePokemonId, getPokemonById);

export default router;
