import { Request, Response } from "express";
import pool from "../models/db";

// Get all Pokemons
export const getAllPokemons = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM pokemon");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get my Pokemons
export const getOwnedPokemons = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM pokemon WHERE isOwned = true"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a specific Pokemon by ID
export const getPokemonById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM pokemon WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pokemon not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a random Pokemon where isOwned is false
export const getRandomPokemon = async (req: Request, res: Response) => {
  const { isOwned } = req.params;
  
  // Ensure isOwned is either "true" or "false"
  if (isOwned !== "true" && isOwned !== "false") {
    return res
      .status(400)
      .json({
        error: "Invalid isOwned value. It should be either 'true' or 'false'.",
      });
  }
  try {
    const result = await pool.query(
      "SELECT * FROM pokemon WHERE isOwned = $1 ORDER BY RANDOM() LIMIT 1",
      [isOwned]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No Pokémon found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PUT catch a pokemon - update isOwned to true
export const catchPokemon = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE pokemon SET isOwned = true WHERE id = $1",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Pokemon not found" });
    }
    res.json({ message: "Pokemon caught!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
