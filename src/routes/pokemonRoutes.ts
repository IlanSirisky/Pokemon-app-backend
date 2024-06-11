import { Router } from "express";
import {
  getPokemons,
  getPokemonById,
  getRandomPokemon,
  searchPokemons,
} from "../controllers/pokemonController";
import {
  validatePokemonId,
  validateSearchPokemons,
} from "../middleware/validationMiddleware";

const router = Router();

/*** GET ***/
router.get("/", getPokemons);
router.get("/random-pokemon", getRandomPokemon);
router.get("/search-pokemons", validateSearchPokemons, searchPokemons);
router.get("/:id", validatePokemonId, getPokemonById);

export default router;
