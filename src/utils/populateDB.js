const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

dotenv.config();

const prisma = new PrismaClient();

const jsonFilePath = path.join(__dirname, "../data/pokedex.json");
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

  const batchSize = 100;
  const pokemonChunks = [];

  for (let i = 0; i < data.length; i += batchSize) {
    pokemonChunks.push(data.slice(i, i + batchSize));
  }

  try {
    for (const chunk of pokemonChunks) {
      await prisma.$transaction(
        chunk.map((pokemon) => {
          const hp = pokemon.base.HP;
          const attack = pokemon.base.Attack;
          const defense = pokemon.base.Defense;
          const spAttack = pokemon.base["Sp. Attack"];
          const spDefense = pokemon.base["Sp. Defense"];
          const speed = pokemon.base.Speed;
          const totalScore = hp + attack + defense + spAttack + spDefense + speed;
          const powerLevel = calculatePowerLevel(totalScore, thresholds);

          return prisma.pokemon.upsert({
            where: { id: pokemon.id },
            update: {},
            create: {
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
                  types: pokemon.type,
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
        })
      );
    }

    console.log("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    await prisma.$disconnect();
  }
};

insertData();
