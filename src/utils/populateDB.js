const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const jsonFilePath = path.join(__dirname, "./pokedex.json");
const data = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));

const calculatePowerLevel = (totalScore, thresholds) => {
  if (totalScore >= thresholds[4]) return 5;
  if (totalScore >= thresholds[3]) return 4;
  if (totalScore >= thresholds[2]) return 3;
  if (totalScore >= thresholds[1]) return 2;
  return 1;
};

const calculateThresholds = (scores) => {
  scores.sort((a, b) => a - b);
  const len = scores.length;
  return [
    scores[Math.floor(len * 0.2)],
    scores[Math.floor(len * 0.4)],
    scores[Math.floor(len * 0.6)],
    scores[Math.floor(len * 0.8)],
    scores[len - 1]
  ];
};

const insertData = async () => {
  try {
    const totalScores = data.map(pokemon => {
      return pokemon.base.HP + pokemon.base.Attack + pokemon.base.Defense + pokemon.base["Sp. Attack"] + pokemon.base["Sp. Defense"] + pokemon.base.Speed;
    });

    const thresholds = calculateThresholds(totalScores);

    for (const pokemon of data) {
      const client = await pool.connect();

      // Calculate the total score
      const hp = pokemon.base.HP;
      const attack = pokemon.base.Attack;
      const defense = pokemon.base.Defense;
      const spAttack = pokemon.base["Sp. Attack"];
      const spDefense = pokemon.base["Sp. Defense"];
      const speed = pokemon.base.Speed;
      const totalScore = hp + attack + defense + spAttack + spDefense + speed;

      // Determine the power level
      const powerLevel = calculatePowerLevel(totalScore, thresholds);

      // Insert into pokemon table
      await client.query(
        "INSERT INTO pokemon (id, name, isOwned, description, image) VALUES ($1, $2, $3, $4, $5)",
        [pokemon.id, pokemon.name.english, false, pokemon.description, pokemon.image.hires]
      );

      // Insert into base_stats table
      await client.query(
        `INSERT INTO base_stats (pokemon_id, hp, attack, defense, sp_attack, sp_defense, speed, power_level) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [pokemon.id, hp, attack, defense, spAttack, spDefense, speed, powerLevel]
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