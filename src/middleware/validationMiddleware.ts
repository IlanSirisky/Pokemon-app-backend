import { check, param, query, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { SortByValues } from "../types/sortBy";

export const validatePokemonId = [
  param("id").isInt({ min: 1 }).withMessage("Invalid Pokemon ID"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateSearchPokemons = [
  query("isOwned")
    .optional()
    .isBoolean()
    .withMessage("isOwned must be a boolean"),
  query("q").optional().isString().withMessage("Search query must be a string"),
  query("sortBy")
    .optional()
    .isIn(Object.values(SortByValues))
    .withMessage(
      `sortBy must be one of ${Object.values(SortByValues).join(", ")}`
    ),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
