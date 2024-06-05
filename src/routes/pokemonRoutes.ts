import { Router } from "express";
import {
  catchPokemon,
  getAllPokemons,
  getOwnedPokemons,
  getPokemonById,
  getRandomPokemon,
  searchPokemons,
} from "../controllers/pokemonController";

const router = Router();

/*** GET ***/
router.get("/pokemons", getAllPokemons);
router.get("/pokemons/owned", getOwnedPokemons);
router.get("/pokemons/:id", getPokemonById);
router.get("/random-pokemon", getRandomPokemon);
router.get("/search-pokemons", searchPokemons);

/*** PUT ***/
router.put("/pokemons/:id/catch", catchPokemon);

export default router;
