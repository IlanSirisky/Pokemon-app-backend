import { Request, Response } from "express";
import pool from "../models/db";
import { SortByValues } from "../types/sortBy";
import { getOrderByClause } from "../utils/orderByOptions";

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
    const query = `
      SELECT p.id, p.name, p.description, p.image, 
            pr.height, pr.weight, 
            ARRAY_AGG(DISTINCT t.name) AS types,
            pr.ability AS abilities
      FROM pokemon p
      JOIN profile pr ON p.id = pr.pokemon_id
      LEFT JOIN pokemon_types pt ON p.id = pt.pokemon_id
      LEFT JOIN types t ON pt.type_id = t.id
      WHERE p.id = $1
      GROUP BY p.id, pr.height, pr.weight, pr.ability;
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pokemon not found" });
    }

    const pokemon = result.rows[0];

    res.json(pokemon);
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a random Pokemon
export const getRandomPokemon = async (req: Request, res: Response) => {
  const { isOwned } = req.query;

  // Ensure isOwned is either "true" or "false"
  if (isOwned !== "true" && isOwned !== "false") {
    return res.status(400).json({
      error: "Invalid isOwned value. It should be either 'true' or 'false'.",
    });
  }
  try {
    const result = await pool.query(
      "SELECT * FROM pokemon WHERE isOwned = $1 ORDER BY RANDOM() LIMIT 1",
      [isOwned === "true"]
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

// Search and filter Pokemons
export const searchPokemons = async (req: Request, res: Response) => {
  const { isOwned, q, sortBy = SortByValues.ID } = req.query;

  try {
    let query = `
        SELECT p.id, p.name, p.isOwned, p.description, p.image, 
               bs.hp, bs.attack, bs.power_level
        FROM pokemon p
        JOIN base_stats bs ON p.id = bs.pokemon_id`;
    const values: any[] = [];

    // Constructing WHERE clause
    const whereConditions: string[] = [];

    if (isOwned !== undefined) {
      whereConditions.push(`p.isOwned = $${values.length + 1}`);
      values.push(isOwned === "true");
    }

    if (q) {
      whereConditions.push(`p.name ILIKE $${values.length + 1}`);
      values.push(`%${q}%`);
    }

    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(" AND ")}`;
    }

    // Adding ORDER BY clause
    query += ` ORDER BY ${getOrderByClause(sortBy as string)}`;

    // Execute the query
    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
