import { Router } from "express";
import { confirmSignup, login, register } from "../controllers/authController";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post('/confirm-signup', confirmSignup);

export default router;
