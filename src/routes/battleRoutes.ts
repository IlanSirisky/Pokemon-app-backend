import { Router } from "express";
import {
  startFight,
  playerAttack,
  opponentAttack,
  catchPokemon,
} from "../controllers/battleController";
import { validateStartFight } from "../middleware/validationMiddleware";

const router = Router();

/*** POST ***/
router.post("/start-fight", validateStartFight, startFight);
router.get("/player-attack", playerAttack);
router.get("/opponent-attack", opponentAttack);
router.get("/catch", catchPokemon);

export default router;
