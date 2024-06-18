import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import pokemonRoutes from "./routes/pokemonRoutes";
import battleRoutes from "./routes/battleRoutes";
import errorHandler from "./middleware/errorMiddleware";
import { ENV_VARS } from "./envs";

const app = express();

const checkAllEnvVariables = () => {
  const allEnvs = ENV_VARS;
  const missingEnvs = Object.keys(allEnvs).filter((env) => !allEnvs[env]);

  if (missingEnvs.length > 0) {
    console.log(`Missing environment variables: ${missingEnvs.join(", ")}`);
  } else {
    console.log("All environment variables are set.");
  }
};

checkAllEnvVariables();

const port = ENV_VARS.port || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/pokemons", pokemonRoutes);
app.use("/api/battle", battleRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Hello, world!!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
