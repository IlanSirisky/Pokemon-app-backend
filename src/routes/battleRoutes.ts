import { Router } from "express";
import {
  startFight,
  playerAttack,
  opponentAttack,
  catchPokemon,
} from "../controllers/battleController";

const router = Router();

/*** POST ***/
router.post("/start-fight", startFight);
router.get("/player-attack", playerAttack);
router.get("/opponent-attack", opponentAttack);
router.get("/catch", catchPokemon);

export default router;
