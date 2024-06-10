import { Router } from "express";
import {
  getAllPokemons,
  getOwnedPokemons,
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
router.get("/pokemons", getAllPokemons);
router.get("/pokemons/owned", getOwnedPokemons);
router.get("/pokemons/:id", validatePokemonId, getPokemonById);
router.get("/random-pokemon", getRandomPokemon);
router.get("/search-pokemons", validateSearchPokemons, searchPokemons);

export default router;
