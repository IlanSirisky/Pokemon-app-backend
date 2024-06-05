const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

dotenv.config();

const prisma = new PrismaClient();

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
    scores[len - 1],
  ];
};

const insertData = async () => {
  try {
    const totalScores = data.map((pokemon) => {
      return (
        pokemon.base.HP +
        pokemon.base.Attack +
        pokemon.base.Defense +
        pokemon.base["Sp. Attack"] +
        pokemon.base["Sp. Defense"] +
        pokemon.base.Speed
      );
    });

    const thresholds = calculateThresholds(totalScores);

    for (const pokemon of data) {
      // Check if the Pokemon already exists
      const existingPokemon = await prisma.pokemon.findUnique({
        where: { id: pokemon.id },
      });

      if (existingPokemon) {
        console.log(
          `Pokemon with id ${pokemon.id} already exists. Skipping...`
        );
        continue;
      }

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

      // Insert into Pokemon table
      const createdPokemon = await prisma.pokemon.create({
        data: {
          id: pokemon.id,
          name: pokemon.name.english,
          isOwned: false,
          description: pokemon.description,
          image: pokemon.image.hires,
          profile: {
            create: {
              height: pokemon.profile.height,
              weight: pokemon.profile.weight,
              ability: pokemon.profile.ability.map((ability) => ability[0]),
            },
          },
          baseStats: {
            create: {
              hp: hp,
              attack: attack,
              defense: defense,
              sp_attack: spAttack,
              sp_defense: spDefense,
              speed: speed,
              power_level: powerLevel,
            },
          },
        },
      });

      // Insert types into types table and pokemon_types table
      for (const typeName of pokemon.type) {
        let type = await prisma.types.findFirst({
          where: { name: typeName },
        });

        if (!type) {
          type = await prisma.types.create({
            data: { name: typeName },
          });
        }

        await prisma.pokemonTypes.create({
          data: {
            pokemon_id: createdPokemon.id,
            type_id: type.id,
          },
        });
      }
    }

    console.log("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    await prisma.$disconnect();
  }
};

insertData();
