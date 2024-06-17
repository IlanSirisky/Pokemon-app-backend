import { Router } from "express";
import {
  startFight,
  playerAttack,
  opponentAttack,
  catchPokemon,
} from "../controllers/battleController";
import { validateStartFight } from "../middleware/validationMiddleware";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

/*** POST ***/
router.post("/start-fight", verifyToken, validateStartFight, startFight);

/*** GET ***/
router.get("/player-attack", verifyToken, playerAttack);
router.get("/opponent-attack", verifyToken, opponentAttack);
router.get("/catch", verifyToken, catchPokemon);

export default router;
