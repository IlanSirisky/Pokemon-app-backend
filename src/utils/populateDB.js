const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const jsonFilePath = path.join(__dirname, "../data/pokedex.json");
const data = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));

const insertData = async () => {
  try {
    for (const pokemon of data) {
      const client = await pool.connect();

      // Insert into pokemon table
      await client.query(
        "INSERT INTO pokemon (id, name, isOwned, description) VALUES ($1, $2, $3, $4)",
        [pokemon.id, pokemon.name.english, false, pokemon.description]
      );

      // Insert into base_stats table
      await client.query(
        `INSERT INTO base_stats (pokemon_id, hp, attack, defense, sp_attack, sp_defense, speed) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          pokemon.id,
          pokemon.base.HP,
          pokemon.base.Attack,
          pokemon.base.Defense,
          pokemon.base["Sp. Attack"],
          pokemon.base["Sp. Defense"],
          pokemon.base.Speed,
        ]
      );

      // Insert types into types table and pokemon_types table
      for (const typeName of pokemon.type) {
        let typeId;
        const typeRes = await client.query(
          "SELECT id FROM types WHERE name = $1",
          [typeName]
        );
        if (typeRes.rows.length > 0) {
          typeId = typeRes.rows[0].id;
        } else {
          const newTypeRes = await client.query(
            "INSERT INTO types (name) VALUES ($1) RETURNING id",
            [typeName]
          );
          typeId = newTypeRes.rows[0].id;
        }
        await client.query(
          "INSERT INTO pokemon_types (pokemon_id, type_id) VALUES ($1, $2)",
          [pokemon.id, typeId]
        );
      }

      // Insert into profile table
      await client.query(
        `INSERT INTO profile (pokemon_id, height, weight, ability) 
         VALUES ($1, $2, $3, $4)`,
        [
          pokemon.id,
          pokemon.profile.height,
          pokemon.profile.weight,
          pokemon.profile.ability,
        ]
      );

      // Insert into images table
      await client.query(
        `INSERT INTO images (pokemon_id, sprite, thumbnail, hires) 
         VALUES ($1, $2, $3, $4)`,
        [
          pokemon.id,
          pokemon.image.sprite,
          pokemon.image.thumbnail,
          pokemon.image.hires,
        ]
      );

      client.release();
    }
    console.log("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    pool.end();
  }
};

insertData();