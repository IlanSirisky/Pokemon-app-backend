import { Router } from 'express';
import { startFight, playerAttack, opponentAttack, catchPokemon } from '../controllers/battleController';

const router = Router();

/*** POST ***/
router.post('/start-fight', startFight);
router.post('/player-attack', playerAttack);
router.post('/opponent-attack', opponentAttack);
router.post('/catch', catchPokemon);

export default router;
